package oss

import (
	"BlogSystem/config"
	"context"
	"fmt"
	"github.com/aliyun/alibabacloud-oss-go-sdk-v2/oss"
	"github.com/aliyun/alibabacloud-oss-go-sdk-v2/oss/credentials"
	"log"
	"os"
)

//使用阿里云OSS GO SDK V2

var OSSClient *oss.Client

// 使用环境变量注入AK
func init() {
	provider := credentials.NewEnvironmentVariableCredentialsProvider()
	cfg := oss.LoadDefaultConfig().
		WithCredentialsProvider(provider). //获取AK
		WithRegion(config.OSSRegion).      //设置region
		WithEndpoint("melonte.xyz").       //绑定自定义域名访问
		WithUseCName(true).
		WithInsecureSkipVerify(true)
	client := oss.NewClient(cfg)
	// 检查连接性，通过查看bucket来测试
	_, err := client.GetBucketInfo(context.Background(), &oss.GetBucketInfoRequest{
		Bucket: oss.Ptr("softeng-blog"),
	})
	if err != nil {
		log.Println("无法连接到OSS服务器:", err)
		os.Exit(1)
	} else {
		log.Println("成功连接到OSS服务器")
	}

	OSSClient = client
}

// 上传一张图片，返回其URL
// OSSdir为OSSbucket中的路径昵称，首目录应该为blog的昵称，例如"exampleBlog/exampleImg.png"
// Imgdir为Img处在的本地路径
func UploadImg(OSSdir string, Imgdir string) (string, error) {
	//将图片上传至OSS
	_, err := OSSClient.PutObjectFromFile(context.TODO(), &oss.PutObjectRequest{
		Bucket: oss.Ptr(config.OSSBucketName),
		Key:    oss.Ptr(OSSdir),
	}, Imgdir)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("http://melonte.xyz/%s", OSSdir), nil
}

// 删除该博客下的所有图片,BlogName例子如“测试”,ImgsName为该博客下所有图片昵称的切片
func DeleteBlogImgs(BlogName string, ImgsName []string) error {
	BlogName += "/"
	var DeleteObjects []oss.DeleteObject
	for _, name := range ImgsName {
		DeleteObjects = append(DeleteObjects, oss.DeleteObject{Key: oss.Ptr(BlogName + name)})
	}
	request := &oss.DeleteMultipleObjectsRequest{
		Bucket:  oss.Ptr(config.OSSBucketName),
		Objects: DeleteObjects,
	}
	result, err := OSSClient.DeleteMultipleObjects(context.TODO(), request)
	if err != nil {
		log.Fatalf("failed to delete multiple objects %v", err)
		return err
	}
	log.Printf("delete multiple objects result:%#v\n", result)
	return nil
}
