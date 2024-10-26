// 该包定义了统一响应的数据结构
package response

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type Response struct {
	Code    int         `json:"code"`    //响应码
	Success bool        `json:"success"` //成功提示
	Message string      `json:"message"` //信息提示
	Data    interface{} `json:"data"`    //响应数据
}

// 成功响应
func ResponseSuccess(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Code:    http.StatusOK,
		Success: true,
		Message: "success",
		Data:    data,
	})
}

// 失败响应
func ResponseFail(c *gin.Context, msg string, code int) {
	c.JSON(code, Response{
		Code:    code,
		Success: false,
		Message: msg,
		Data:    nil,
	})
}
