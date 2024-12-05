package service

import (
	auth "BlogSystem/internal/middleware"
	"BlogSystem/internal/model/request"
	"errors"
)

func Login(p *request.LoginData) (token string, err error) {
	//是否有token，有验证
	//没有验证账号密码，正确返回token，错误err

	if p.Username != "123456" || p.Password != "123456" {
		token, err = "", errors.New("账号或者密码错误")
		return
	}

	token, err = auth.GenerateJWT(p.Username)
	return token, err
}
