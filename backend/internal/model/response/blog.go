package response

import "BlogSystem/internal/model/table"

// 响应的Blog结构体，需要携带tag
type BlogWithTag struct {
	table.Blog
	Tag []string `json:"tag"` //Blog对应的标签
}

type BlogAndTagNums struct {
	BlogCount uint `json:"blogcount"`
	TagCount  uint `json:"tagcount"`
}

type BlogList struct {
	Blogs []BlogWithTag `json:"blogs"`
	Count int64         `json:"count"`
}
