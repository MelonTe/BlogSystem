package table

// 对博客管理员模型的定义
type Administrator struct {
	ID       uint
	Name     string `form:"admin" json:"admin" binding:"required"`
	Password string `form:"password" json:"password" binding:"required"`
}
