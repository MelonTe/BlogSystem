package controller

import "github.com/gin-gonic/gin"
import _ "BlogSystem/internal/model/response"

//GetMessageHandler godoc
// @Summary 用于获取标签的接口
// @Description 该接口用于获取所有的标签
// @Tags Tag
// @Accept json
// @Produce json
// @Success 200 {object} response.Response{data=[]response.Tag} "请求成功"
// @Router /tag [GET]
func GetTagHandler(c *gin.Context) {}
