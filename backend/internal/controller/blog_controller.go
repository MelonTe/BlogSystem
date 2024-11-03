package controller

import (
	_ "BlogSystem/internal/model/request"
	"BlogSystem/internal/model/response"
	_ "BlogSystem/internal/model/table"
	"BlogSystem/internal/service"
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
)

// GetBlogHandler godoc
// @Summary 该接口用于获取所有博文简略，每个博文的内容前100字
// @Description 可以按照请求中的参数，根据时间排序、标签筛选、标题关键词搜索的方式获取博客，如果参数为空表示获取所有的博客简略，关键词和标签必须一个为空
// @Description 请求中可以标明返回的博客数量范围，例如1-10表示按时间排序的第一篇到第十篇博客
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
// @Param images formData []file false "图片文件（支持多个）"
// @Param tags formData []string false "Tags标签数组" collectionFormat(multi)
// @Success 200 {object} response.Response{data=nil} "请求成功"
// @Failure 500 {object} response.Response{data=nil} "错误提示"
// @Router /api/uploadblog [POST]
func UploadBlogHandler(c *gin.Context) {
	//在进行一次单位操作前，先清空template文件夹
	err := service.DeleteAllFilesInDirectory("./internal/template")
	if err != nil {
		log.Println("删除文件出现错误：", err)
		response.ResponseFail(c, err.Error(), 500)
		return
	}
	//获取md文件
	markdownFile, err := c.FormFile("markdown")
	if err != nil {
		log.Println("无法获取 Markdown 文件:", err)
		response.ResponseFail(c, "无法获取markdown文件", 500)
		return
	}
	//保存md文件
	err = c.SaveUploadedFile(markdownFile, fmt.Sprintf("./internal/template/%s", markdownFile.Filename))
	if err != nil {
		log.Println("无法保存 Markdown 文件:", err)
		response.ResponseFail(c, "无法保存Markdown文件", 500)
		return
	}

	//获取多个图片
	form, err := c.MultipartForm()
	if err != nil {
		log.Println("无法解析 Multipart Form:", err)
		response.ResponseFail(c, "无法解析Multipart Form", 500)
		return
	}

	//images对应上传图片的字段名
	imageFiles := form.File["images"]
	//保存每一个图片
	for _, file := range imageFiles {
		err := c.SaveUploadedFile(file, fmt.Sprintf("./internal/template/%s", file.Filename))
		if err != nil {
			log.Println("无法保存图片:", err)
			response.ResponseFail(c, "无法保存图片", 500)
			return
		}
	}

	//获取所有的tags
	tags := c.PostFormArray("tags")

	//调用service层的上传博客服务
	err = service.UploadBlog(tags)
	if err != nil {
		response.ResponseFail(c, err.Error(), 500)
		return
	}

	response.ResponseSuccess(c, nil)
}

// DeleteBlogHandler godoc
// @Summary 该接口用于接受博文昵称进行删除
// @Description 根据博文昵称删除对应的博文,URL请求例如/api/blog?blogname=example-blog
// @Tags Blog
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param blogname query string true "Blog昵称"
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

// GetBlogAndTagNumsHandler godoc
// @Summary 该接口用于获取博客数量和标签数量
// @Description 该接口用于获取博客数量和标签数量，不需要传递参数
// @Tags Blog
// @Accept json
// @Produce json
// @Success 200 {object} response.Response{data=response.BlogAndTagNums} "请求成功"
// @Router /blogandtagnums [GET]
func GetBlogAndTagNumsHandler(c *gin.Context) {
	res := service.BlogAndTagNums()
	response.ResponseSuccess(c, res)
}
