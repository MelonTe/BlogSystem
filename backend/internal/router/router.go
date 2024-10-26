// 该包用于配置请求路由的分组，调用controller层对应的处理函数
package router

import (
	_ "BlogSystem/docs"
	"BlogSystem/internal/controller"
	"BlogSystem/internal/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"time"
)

func InitRouter() *gin.Engine {
	r := gin.Default()

	// 配置 CORS 中间件
	r.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"POST", "GET", "PUT", "DELETE", "OPTIONS"}, // 允许的请求方法
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type"}, // 允许的请求头
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour, // 预检请求的缓存时间
	}))
	//使用中间件
	r.Use(gin.Logger())

	//不受保护的接口
	r.POST("/blog", controller.GetBlogListHandler)

	//受保护的api接口，需要中间件认证
	protected := r.Group("/api")
	protected.Use(auth.JWTAuthMiddleWare())
	{
		protected.POST("/uploadblog", controller.UploadBlogHandler)
	}
	//接口文档浏览
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	return r
}

// 测试sssssssssssssss
