package controller

import "github.com/gin-gonic/gin"
import _ "BlogSystem/internal/model/request"
import _ "BlogSystem/internal/model/response"

//UploadMessageHandler godoc
// @Summary 用于上传留言的接口
// @Description 该接口用于用户上传字符串类型的留言
// @Tags Message
// @Accept json
// @Produce json
// @Param message body request.Message true "留言详情"
// @Success 200 {object} response.Response{data=nil} "请求成功"
// @Router /message [POST]
func UploadMessageHandler(c *gin.Context) {}

//DeleteMessageHandler godoc
// @Summary 用于删除留言的接口
// @Description 该接口用于删除留言，需要携带留言具体的创建时间，避免删除所有内容一样的留言
// @Tags Message
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param messagewithtime body request.MessageWithTime true "留言详情"
// @Success 200 {object} response.Response{data=nil} "请求成功"
// @Router /api/message [DELETE]
func DeleteMessageHandler(c *gin.Context) {}

//GetMessageHandler godoc
// @Summary 用于获取留言的接口
// @Description 该接口用于获取所有的留言
// @Tags Message
// @Accept json
// @Produce json
// @Success 200 {object} response.Response{data=[]response.MessageWithTime} "请求成功"
// @Router /message [GET]
func GetMessageHandler(c *gin.Context) {}
