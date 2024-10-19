package controller

import (
	_ "BlogSystem/internal/model/request"
	_ "BlogSystem/internal/model/response"
	_ "BlogSystem/internal/model/table"
	"github.com/gin-gonic/gin"
)

// GetBlogHandler godoc
// @Summary 该接口用于获取所有博文简略，每个博文的内容前100字
// @Description 可以按照请求中的参数，根据时间排序、标签筛选、标题关键词搜索的方式获取博客，如果参数为空表示获取所有的博客简略，关键词和标签必须一个为空
// @Tags Blog
// @Accept json
// @Produce json
// @Param criteria body request.BlogCriteria true "字段为空表示获取所有博客"
// @Success 200 {object} response.Response{data=[]response.BlogWithTag} "请求成功"
// @Router /bloglist [POST]
func GetBlogListHandler(c *gin.Context) {}

// UploadBlogHandler godoc
// @Summary 该接口用于接受博文进行上传
// @Description 需要以form-data的形式上传一篇笔记以及其对应的图片，一次只能以一篇笔记为单位上传，上传后需要等待返回处理结果响应
// @Tags Blog
// @Accept multipart/form-data
// @Produce json
// @Security ApiKeyAuth
// @Param markdown formData file true "Markdown文件"
// @Param images formData file false "图片文件（支持多个）"
// @Param tags formData string false "博客标签，多个标签用逗号分隔"
// @Param Authorization header string true "Bearer <token>"
// @Success 200 {object} response.Response{data=nil} "请求成功"
// @Failure 400 {object} response.Response{data=nil} "错误提示"
// @Router /api/uploadblog [POST]
func UploadBlogHandler(c *gin.Context) {}

// DeleteBlogHandler godoc
// @Summary 该接口用于接受博文昵称进行删除
// @Description 根据博文昵称删除对应的博文,URL请求例如/api/blog?blogname=example-blog
// @Tags Blog
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param blogname query string true "Blog昵称"
// @Param Authorization header string true "Bearer <token>"
// @Success 200 {object} response.Response{data=nil} "请求成功"
// @Failure 400 {object} response.Response{data=nil} "错误提示"
// @Router /api/blog [DELETE]
func DeleteBlogHandler(c *gin.Context) {}

// UpdateBlogHandler godoc
// @Summary 该接口用于进行博文修改
// @Description 根据请求中的博文内容进行后台博文更新
// @Tags Blog
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param blogupdate body request.BlogUpdate true "更改blog结构体"
// @Param Authorization header string true "Bearer <token>"
// @Success 200 {object} response.Response{data=nil} "请求成功"
// @Failure 400 {object} response.Response{data=nil} "错误提示"
// @Router /api/blog [PUT]
func UpdateBlogHandler(c *gin.Context) {}

// GetBlogHandler godoc
// @Summary 该接口用于获取单篇博客详情内容
// @Description 依据博客标题获取单篇博客详情
// @Tags Blog
// @Accept json
// @Produce json
// @Param criteria body request.BlogWithName true "博客标题"
// @Success 200 {object} response.Response{data=response.BlogWithTag} "请求成功"
// @Router /blogitem [POST]
func GetBlogItemHandler(c *gin.Context) {}
