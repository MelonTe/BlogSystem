package response

import "BlogSystem/internal/model/table"

//响应的Blog结构体，需要携带tag
type BlogWithTag struct {
	table.Blog
	Tag []string `json:"tag"` //Blog对应的标签
}
