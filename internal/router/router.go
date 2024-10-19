// 该包用于配置请求路由的分组，调用controller层对应的处理函数
package router

import (
	_ "BlogSystem/docs"
	"BlogSystem/internal/controller"
	"github.com/gin-gonic/gin"
	"github.com/swaggo/files"       // swagger embed files
	"github.com/swaggo/gin-swagger" // gin-swagger middleware
)

func InitRouter() *gin.Engine {
	r := gin.Default()
	//不受保护的接口
	r.POST("/blog", controller.GetBlogListHandler)
	//使用中间件
	r.Use(gin.Logger())
	//受保护的api接口，需要中间件认证
	protected := r.Group("api")
	{
		protected.POST("", controller.GetBlogListHandler)
	}
	//接口文档浏览
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	return r
}
