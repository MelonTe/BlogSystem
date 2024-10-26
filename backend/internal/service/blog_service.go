package service

import (
	"BlogSystem/internal/model/table"
	"BlogSystem/internal/pkg/db"
	"BlogSystem/internal/pkg/oss"
	"errors"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"gorm.io/gorm"
)

// 删除目录下的所有文件
func DeleteAllFilesInDirectory(dirPath string) error {
	if _, err := os.Stat(dirPath); os.IsNotExist(err) {
		return fmt.Errorf("目录 %s 不存在", dirPath)
	}
	// 使用 filepath.Walk 来遍历目录下的所有文件和子文件
	err := filepath.Walk(dirPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		//跳过目录，删除文件
		if !info.IsDir() {
			fmt.Println("删除文件：", path)
			err := os.Remove(path)
			if err != nil {
				return fmt.Errorf("无法删除文件 %s: %w", path, err)
			}
		}

		return nil
	})

	if err != nil {
		return fmt.Errorf("遍历目录 %s 时出现错误：%w", dirPath, err)
	}
	return nil
}

// 进行对博客的修改任务以及上传至服务器
func UploadBlog(tags []string) error {
	//获取指定的markdown以及imgs
	markdown, imgs, err := GetMdAndImgInDir("./internal/template")
	if err != nil {
		return err
	}
	blog, err := FileToBlog(fmt.Sprintf("./internal/template/%s", markdown.Name()))
	if err != nil {
		return err
	}
	//若没有图片，则直接上传文本即可
	if imgs == nil {
		err = uploadBlogWithTag(db.GetDB(), blog, tags)
		if err != nil {
			return err
		}
	} else {
		//将imgs封装成 [昵称]文件 的map形式，昵称包含其后缀
		imgsMap := make(map[string]fs.DirEntry)
		for _, value := range imgs {
			imgsMap[value.Name()] = value
		}

		//完成博文的修改以及图片的上传
		err := UploadIMG(blog, imgsMap)
		if err != nil {
			log.Printf("Upload img failed: %v", err)
			return err
		}

		//完成博文的存储
		err = uploadBlogWithTag(db.GetDB(), blog, tags)
		if err != nil {
			log.Printf("Upload blog failed: %v", err)
			return err
		}
	}
	return nil
}

// 处理图片的上传操作，以及更改blog中的content的渲染URL
func UploadIMG(blog *table.Blog, imgsMap map[string]fs.DirEntry) error {
	regex, _ := regexp.Compile(`\!\[.*\]\((.*)\)`)
	//提取content中的图片路径，进行一次必要的匹配
	//返回的匹配数组，第一项为markdown格式渲染的完整的图片路径，第二项为单独的图片路径
	allMatch := regex.FindAllStringSubmatch(blog.Content, -1)
	//记录需要存储至MySql的图片
	var newImgs []*table.Image
	//找出需要上传至OSS的图片，并进行上传记录
	//记录原markdown渲染的格式和修改后的markdown渲染
	var needReplace [][]string
	for _, v := range allMatch {
		imgName := filepath.Base(v[1])
		if imgsMap[imgName] != nil {
			//该图片存在于博客中，需要上传
			url, err := oss.UploadImg(fmt.Sprintf("%s/%s", blog.Title, imgName), fmt.Sprintf("./internal/template/%s", imgName))
			if err != nil {
				return err
			}
			replaceStr := fmt.Sprintf("![](%s)", url)
			needReplace = append(needReplace, []string{v[0], replaceStr})

			newImgs = append(newImgs, &table.Image{
				Name:      imgName,
				Url:       url,
				BlogTitle: blog.Title,
			})
		}
	}

	//接下来完成对原blog的更改，若需要修改的图片路径数量为n，则对原Blog修改所需要的时间复杂度为O(N)
	//对于大型博客，将会非常消耗性能
	for _, v := range needReplace {
		blog.Content = strings.Replace(blog.Content, v[0], v[1], 1)
	}

	//最后完成对图片的MySql数据库存储
	db := db.GetDB()
	//理应不会出现错误
	db.Create(newImgs)

	return nil
}

// 参数为文件的路径，返回一个封装好的Blog对象，title不包含后缀
func FileToBlog(dir string) (*table.Blog, error) {
	title := strings.Split(filepath.Base(dir), ".")[0]
	content, err := os.ReadFile(dir)
	if err != nil {
		return nil, err
	}
	contentStr := string(content)
	return &table.Blog{
		Title:   title,
		Content: contentStr,
	}, nil
}

// 获取指定目录的md文件以及所有的图片
func GetMdAndImgInDir(dir string) (md fs.DirEntry, img []fs.DirEntry, err error) {
	err = filepath.WalkDir(dir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !d.IsDir() {
			if filepath.Ext(d.Name()) == ".md" {
				md = d
			} else {
				img = append(img, d)
			}

		}
		return nil
	})
	return
}

// 上传博客至mysql
func uploadBlogWithTag(db *gorm.DB, blog *table.Blog, tags []string) error {
	//创建博客
	result := db.Create(blog)
	if result.Error != nil {
		// 处理创建错误
		log.Printf("创建博客 %s 时出错: %v", blog.Title, result.Error)
		return result.Error
	}
	//创建tag，以及创建BlogTag
	for _, v := range tags {
		//对于每一个tag，应先检查是否已经存在；存在则更新其count，不存在则创建新的tag
		var tag table.Tag
		result := db.Where("name = ?", v).First(&tag)
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			//记录不存在，创建新记录
			newTag := table.Tag{
				Name:  v,
				Count: 1,
			}
			if err := db.Create(&newTag).Error; err != nil {
				// 处理创建错误
				log.Printf("创建tag %s 时出错: %v", v, err)
				return err
			}
		} else {
			//记录存在，更新记录
			tag.Count++
			if err := db.Save(&tag).Error; err != nil {
				// 处理更新错误
				log.Printf("更新tag %s 时出错: %v", v, err)
				return err
			}
		}

		//创建blog和tag的关联条目
		newBlogTag := table.BlogTag{
			BlogTitle: blog.Title,
			TagName:   v,
		}
		if err := db.Create(&newBlogTag).Error; err != nil {
			// 处理创建错误
			log.Printf("创建blog %s 和tag %s 的关联时出错: %v", blog.Title, v, err)
			return err
		}
	}
	return nil
}
