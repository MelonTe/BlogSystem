package service

import (
	"BlogSystem/internal/model/request"
	"BlogSystem/internal/model/response"
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

// 该方法用于获取存储的博客和标签数量
func BlogAndTagNums() response.BlogAndTagNums {
	db := db.GetDB()
	var tags []table.Tag
	var blog []table.Blog
	var NumsCount response.BlogAndTagNums
	result := db.Find(&tags)
	NumsCount.TagCount = uint(result.RowsAffected)
	result = db.Find(&blog)
	NumsCount.BlogCount = uint(result.RowsAffected)
	return NumsCount
}

func GetBlogList(criteria request.BlogCriteria) ([]response.BlogWithTag, error) {
	var blogs []table.Blog
	var result []response.BlogWithTag

	// 构建查询条件
	query := db.DB.Model(&table.Blog{})

	// 根据博客名关键字进行筛选
	if criteria.BlogName != "" {
		query = query.Where("title LIKE ?", "%"+criteria.BlogName+"%")
	}

	// 根据标签进行筛选
	if len(criteria.Tag) > 0 {
		query = query.Joins("JOIN blog_tags ON blog_tags.blog_title = blogs.title").
			Where("blog_tags.tag_name IN ?", criteria.Tag).
			Group("blogs.id")
	}

	// 根据时间排序
	query = query.Order("created_at DESC")

	// 获取博客数量范围
	if criteria.Start < 0 || criteria.End < criteria.Start {
		return nil, errors.New("invalid start or end range")
	}

	// 查询博客
	if err := query.Offset(criteria.Start - 1).Limit(criteria.End - criteria.Start + 1).Find(&blogs).Error; err != nil {
		return nil, err
	}

	// 查询博客对应的标签
	for _, blog := range blogs {
		var tags []string
		if err := db.DB.Model(&table.BlogTag{}).Where("blog_title = ?", blog.Title).Pluck("tag_name", &tags).Error; err != nil {
			return nil, err
		}
		result = append(result, response.BlogWithTag{
			Blog: blog,
			Tag:  tags,
		})
	}

	return result, nil
}

func DeleteBlog(blogName string) error {
	// 删除博客
	if err := db.DB.Where("title = ?", blogName).Delete(&table.Blog{}).Error; err != nil {
		return err
	}

	// 删除相关的标签
	//首先获取博客下的所有标签
	var blogtags []table.BlogTag
	if err := db.DB.Where("blog_title = ?", blogName).Find(&blogtags).Error; err != nil {
		return err
	}
	//将tag表中对应的tag数量-1
	for _, v := range blogtags {
		if err := db.DB.Model(&table.Tag{}).Where("name = ?", v.TagName).Update("count", gorm.Expr("count - ?", 1)).Error; err != nil {
			return err
		}
	}
	//将tag表中，count为0的tag删除
	if err := db.DB.Where("count = 0").Delete(&table.Tag{}).Error; err != nil {
		return err
	}
	//删除blogtags表中，该blog存在的标签
	if err := db.DB.Delete(&blogtags).Error; err != nil {
		return err
	}
	// todo 删除oss图片
	//先获取该博客所有的图片的昵称
	var blogimgs []table.Image
	if err := db.DB.Where("blog_title = ?", blogName).Find(&blogimgs).Error; err != nil {
		return err
	}
	imgs := make([]string, 0)
	for _, v := range blogimgs {
		imgs = append(imgs, v.Name)
	}
	//调用oss删除图片的接口
	if err := oss.DeleteBlogImgs(blogName, imgs); err != nil {
		return err
	}
	//最后，删除images表信息
	if err := db.DB.Delete(&blogimgs).Error; err != nil {
		return err
	}
	return nil
}

func UpdateBlog(update request.BlogUpdate) error {
	var blog table.Blog

	// 查询博客是否存在
	if err := db.DB.Where("title = ?", update.BlogName).First(&blog).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("blog not found")
		}
		return err
	}

	// 更新博客内容
	blog.Content = update.Content
	blog.Title = update.BlogName // 假设你允许更新标题
	// 其他字段的更新可以在这里添加

	if err := db.DB.Save(&blog).Error; err != nil {
		return err
	}

	// 更新标签
	if len(update.Tag) > 0 {
		// 先获取原博客的所有标签
		var oldTags []table.BlogTag
		if err := db.DB.Where("blog_title = ?", blog.Title).Find(&oldTags).Error; err != nil {
			return err
		}

		// 先删除旧标签
		if err := db.DB.Where("blog_title = ?", blog.Title).Delete(&table.BlogTag{}).Error; err != nil {
			return err
		}

		// 添加新标签
		for _, tag := range update.Tag {
			var existingTag table.Tag
			result := db.DB.Where("name = ?", tag).First(&existingTag)
			if errors.Is(result.Error, gorm.ErrRecordNotFound) {
				// 如果标签不存在，则创建新标签
				newTag := table.Tag{
					Name:  tag,
					Count: 1,
				}
				if err := db.DB.Create(&newTag).Error; err != nil {
					return err
				}
			} else {
				// 如果标签存在，则更新计数
				existingTag.Count++
				if err := db.DB.Save(&existingTag).Error; err != nil {
					return err
				}
			}

			// 创建blog和tag的关联条目
			newBlogTag := table.BlogTag{
				BlogTitle: blog.Title,
				TagName:   tag,
			}
			if err := db.DB.Create(&newBlogTag).Error; err != nil {
				return err
			}
		}

		// 检查并删除不再与任何博客关联的旧标签
		for _, oldTag := range oldTags {
			var count int64
			if err := db.DB.Model(&table.BlogTag{}).Where("tag_name = ?", oldTag.TagName).Count(&count).Error; err != nil {
				return err
			}
			if count == 0 {
				// 如果该标签不再与任何博客关联，则删除该标签
				if err := db.DB.Where("name = ?", oldTag.TagName).Delete(&table.Tag{}).Error; err != nil {
					return err
				}
			}
		}
	}

	return nil
}

func GetBlogItem(blogName string) (response.BlogWithTag, error) {
	var blog table.Blog
	var tags []string
	var result response.BlogWithTag

	// 查询单个博客
	if err := db.DB.Where("title = ?", blogName).First(&blog).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return result, errors.New("blog not found")
		}
		return result, err
	}

	// 查询博客对应的标签
	if err := db.DB.Model(&table.BlogTag{}).Where("blog_title = ?", blog.Title).Pluck("tag_name", &tags).Error; err != nil {
		return result, err
	}

	// 构建返回结果
	result = response.BlogWithTag{
		Blog: blog,
		Tag:  tags,
	}

	return result, nil
}
