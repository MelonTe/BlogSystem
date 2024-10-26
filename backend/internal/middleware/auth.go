// 该包用于对保护的接口进行身份验证，采用轻量级JWT认证方式
package auth

import (
	"BlogSystem/internal/model/response"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

// 定义签名密钥，用于加密和解密
var jwtKey []byte = []byte("BlogSystem")

// 定义claims
type MyClaims struct {
	Username             string `json:"username"`
	jwt.RegisteredClaims        //标准claims
}

// 该方法用于生成一个JWT令牌，令牌内包含了用户的昵称，过期时间为1Day
func GenerateJWT(username string) (string, error) {
	//定义过期时间
	expiredTime := time.Now().Add(24 * time.Hour)

	//创建包含用户信息的Claims
	claim := &MyClaims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiredTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claim)

	//使用密钥签名
	return token.SignedString(jwtKey)
}

// 该方法用于验证JWT令牌的有效性，返回一个记载乐了用户名的Claims对象
func ValidateJWT(tokenString string) (*MyClaims, error) {
	claims := &MyClaims{}

	//获取解密后的token
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	//判断token是否有效
	if err != nil || !token.Valid {
		return nil, err
	}

	return claims, nil
}

// 用于验证JWT的中间件
func JWTAuthMiddleWare() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")

		//验证token
		claims, err := ValidateJWT(tokenString)
		//失败响应错误并且返回
		if err != nil {
			response.ResponseFail(c, err.Error(), 401)
			c.Abort()
			return
		}

		//记录username
		c.Set("username", claims.Username)
		c.Next()
	}
}
