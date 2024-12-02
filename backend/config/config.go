package config

// 该包用于存放数据库相关的配置，方便起见，直接配置连接数据库相关的全局静态变量
var (
	DBHost     string = "127.0.0.1"
	DBPort     string = "3306"
	DBUser     string = "root"
	DBPassword string = "delishaq1"
	DBName     string = "blogsystem"
)

// 阿里云OSS配置
var (
	OSSEndPoint   = "oss-cn-shenzhen.aliyuncs.com"
	OSSRegion     = "cn-shenzhen"
	OSSBucketName = "softeng-blog"
)
