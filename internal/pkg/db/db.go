// 该包负责数据库的初始化和提供实例连接
package db

import (
	"BlogSystem/config"
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
)

var DB *gorm.DB

// InitDB初始化mysql连接并返回Gorm实例
func InitDB() *gorm.DB {
	//构建mysql连接字符串
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		config.DBUser,
		config.DBPassword,
		config.DBHost,
		config.DBPort,
		config.DBName)

	//连接mysql数据库
	db, err := gorm.Open(mysql.New(mysql.Config{DSN: dsn}), &gorm.Config{})
	if err != nil {
		log.Fatalf("Can't connect to DB: %s", err)
	}

	log.Println("Connect to DB success")
	DB = db
	return db
}

// 获取一个gorm实例
func GetDB() *gorm.DB {
	if DB == nil {
		return InitDB()
	}
	return DB
}
