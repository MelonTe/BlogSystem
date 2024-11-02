package oss

import (
	"BlogSystem/config"
	"github.com/aliyun/aliyun-oss-go-sdk/oss"
	"log"
)

var OSSClient *oss.Client
var OSSBucket *oss.Bucket

func init1() {
	//从环境变量获取访问凭证
	provider, err := oss.NewEnvironmentVariableCredentialsProvider()
	if err != nil {
		log.Fatalf("Can't get OSS credentials: %w", err)
	}
	//创建OSSClient实例，注入AK，规定使用v4签名，使用V4签名需要指定发起请求的地域标识
	client, err := oss.New(config.OSSEndPoint, "", "", oss.SetCredentialsProvider(&provider), oss.AuthVersion(oss.AuthV4), oss.Region(config.OSSRegion))
	if err != nil {
		log.Fatalf("Can't init OSSClient: %w", err)
	}
	OSSClient = client
	bucket, err := client.Bucket(config.OSSBucketName)
	if err != nil {
		log.Fatalf("Can't init OSSBucket: %v", err)
	}
	OSSBucket = bucket
}

// 上传一张图片，返回其URL
// OSSdir为OSSbucket中的路径昵称，首目录应该为blog的昵称，例如"/exampleBlog/exampleImg.png"
// Imgdir为Img处在的本地路径
func UploadImg(OSSdir string, Imgdir string) (string, error) {
	err := OSSBucket.PutObjectFromFile(OSSdir, Imgdir)
	if err != nil {
		log.Printf("Upload img to OSSBucket failed: %v", err)
		return "", err
	}
	signedURL, err := OSSBucket.SignURL(OSSdir, oss.HTTPGet, 10000*60*60*24)
	if err != nil {
		log.Printf("Get URL failed: %v", err)
		return "", err
	}
	return signedURL, nil
}
