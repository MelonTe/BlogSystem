package controller

import (
	_ "BlogSystem/internal/model/request"
	_ "BlogSystem/internal/model/response"
	"github.com/gin-gonic/gin"
)

// LoginHandler godoc
// @Summary 该接口用于登录
// @Description 请求中携带管理员昵称和密码，返回JWT令牌
// @Tags Auth
// @Accept json
// @Produce json
// @Param logindata body request.LoginData true "登录数据"
// @Success 200 {object} response.Response{data=response.TokenData} "请求成功"
// @Router /login [POST]
func LoginHandler(c *gin.Context) {}
