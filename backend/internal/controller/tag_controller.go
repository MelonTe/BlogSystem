package controller

import (
	"BlogSystem/internal/model/response"
	_ "BlogSystem/internal/model/response"
	"BlogSystem/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetMessageHandler godoc
// @Summary 用于获取标签的接口
// @Description 该接口用于获取所有的标签
// @Tags Tag
// @Accept json
// @Produce json
// @Success 200 {object} response.Response{data=[]response.Tag} "请求成功"
// @Router /tag [GET]
func GetTagHandler(c *gin.Context) {
	tags, err := service.GetTag()
	if err != nil {
		c.JSON(http.StatusBadRequest, response.Response{
			Code:    400,
			Message: "获取标签失败",
		})
		return
	}
	// 返回标签数据
	c.JSON(http.StatusOK, response.Response{
		Code:    200,
		Data:    tags,
		Message: "获取全部标签成功",
		Success: true,
	})
}
