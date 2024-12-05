package controller

import (
	"BlogSystem/internal/model/request"
	_ "BlogSystem/internal/model/request"
	"BlogSystem/internal/model/response"
	_ "BlogSystem/internal/model/response"
	"BlogSystem/internal/service"
	"github.com/gin-gonic/gin"
	"net/http"
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
func LoginHandler(c *gin.Context) {
	p := new(request.LoginData)
	if err := c.ShouldBindJSON(p); err != nil {
		c.JSON(http.StatusBadRequest, response.Response{
			Code:    400,
			Message: "参数错误",
		})
		return
	}
	token, err := service.Login(p)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.Response{
			Code:    400,
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response.Response{
		Code:    200,
		Data:    token,
		Message: "登录成功",
		Success: true,
	})
}
