package request

//该文件定义了与请求博客相关的一系列结构体

// 向服务器请求博客信息的标准结构体
type BlogCriteria struct {
	BlogName string   `json:"blogname"` //需要的博客名关键字
	Tag      []string `json:"tag"`      //需要的博客对应标签
	Start    int      `json:"start"`
	End      int      `json:"end"`
}

type BlogWithName struct {
	BlogName string `json:"blogname"`
}

type BlogUpdate struct {
	BlogName string   `json:"blogname"`
	Tag      []string `json:"tag"`
	Content  string   `json:"content"`
}
