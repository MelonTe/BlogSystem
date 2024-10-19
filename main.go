package main

import (
	_ "BlogSystem/docs"
	"BlogSystem/internal/router"
)

// @title 博客系统
// @version 1.0
// @description	后台用于接受一系列的前端请求，调用数据库数据进行响应。对于含有/api的路由，需要进行JWT认证，需要在请求头中携带token。
// @termsOfService http://swagger.io/terms/
// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization

// @host 127.0.0.1
// @BasePath/
func main() {
	r := router.InitRouter()

	r.Run()
}
