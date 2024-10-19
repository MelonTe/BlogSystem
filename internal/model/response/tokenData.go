package response

//tokendata 表示登入成功后返回的token数据结构
type TokenData struct {
	Token string `json:"token"` //token字段
}
