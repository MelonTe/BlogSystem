package controller

import (
	"BlogSystem/internal/model/request"
	"BlogSystem/internal/model/response"
	"BlogSystem/internal/service"
	"net/http"
	"sort"

	"github.com/gin-gonic/gin"

	_ "BlogSystem/internal/model/request"

	_ "BlogSystem/internal/model/response"
)

// UploadMessageHandler godoc
// @Summary 用于上传留言的接口
// @Description 该接口用于用户上传字符串类型的留言
// @Tags Message
// @Accept json
// @Produce json
// @Param message body request.Message true "留言详情"
// @Success 200 {object} response.Response{data=nil} "请求成功"
// @Router /message [POST]
func UploadMessageHandler(c *gin.Context) {
	var req request.Message
	if err := c.ShouldBindJSON(&req); err != nil {
		// 错误处理 返回错误信息
		c.JSON(http.StatusBadRequest, response.Response{
			Code:    400,
			Message: "参数错误",
		})
		return
	}
	// 调用service层逻辑，对留言进行处理
	if err := service.UploadMessage(req.Message); err != nil {

		// 对错误进行处理
		c.JSON(http.StatusInternalServerError, response.Response{
			Code:    http.StatusInternalServerError,
			Message: "留言失败",
		})
		return
	}
	// 留言成功 返回结果
	response.ResponseSuccess(c, nil)
}

// DeleteMessageHandler godoc
// @Summary 用于删除留言的接口
// @Description 该接口用于删除留言，需要携带留言具体的创建时间，避免删除所有内容一样的留言
// @Tags Message
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param messagewithtime body request.MessageWithTime true "留言详情"
// @Success 200 {object} response.Response{data=nil} "请求成功"
// @Router /api/deletemessage [POST]
func DeleteMessageHandler(c *gin.Context) {
	var req request.MessageWithTime
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(409, response.Response{
			Code:    409,
			Message: "参数错误",
		})
		return
	}
	// 调用service层 删除留言
	if err := service.DeleteMessage(req.CreatedAt, req.Message); err != nil {
		c.JSON(http.StatusBadRequest, response.Response{
			Code:    400,
			Message: "无法匹配留言",
		})
		return
	}
	response.ResponseSuccess(c, nil)
}

// GetMessageHandler godoc
// @Summary 用于获取留言的接口
// @Description 该接口用于获取所有的留言
// @Tags Message
// @Accept json
// @Produce json
// @Param messagewithrange body request.MessageWithRange true "留言范围"
// @Success 200 {object} response.Response{data=response.MessagesWithCount} "请求成功"
// @Router /messagerange [POST]
func GetMessageHandler(c *gin.Context) {
	messages, err := service.GetMessage()
	if err != nil {
		c.JSON(http.StatusBadRequest, response.Response{
			Code:    400,
			Message: "获取留言失败",
		})
		return
	}
	var MRange request.MessageWithRange
	if err := c.ShouldBindJSON(&MRange); err != nil {
		c.JSON(http.StatusBadRequest, response.Response{
			Code:    400,
			Message: "范围绑定失败",
		})
		return
	}
	if MRange.Start < 0 || MRange.End < MRange.Start {
		response.ResponseFail(c, "范围界限异常", 400)
		return
	}
	//倒置
	sort.Slice(messages, func(i, j int) bool {
		return i > j
	})
	count := len(messages)
	if MRange.End > count {
		MRange.End = count
	}
	messages = messages[MRange.Start:MRange.End]
	msgs := response.MessagesWithCount{
		Msgs:  messages,
		Count: count,
	}
	// 返回留言数据
	c.JSON(http.StatusOK, response.Response{
		Code:    200,
		Data:    msgs,
		Message: "获取全部留言成功",
		Success: true,
	})
}
