// 该包负责数据库的初始化和提供实例连接
package db

import (
	"BlogSystem/config"
	"BlogSystem/internal/model/table"
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

// Init初始化mysql
func init() {
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
	//自动创建数据库需要的表结构
	db.AutoMigrate(&table.Administrator{}, &table.Blog{}, &table.BlogTag{}, &table.Image{}, &table.Message{}, &table.Tag{})
	DB = db
}

// 获取一个gorm实例
func GetDB() *gorm.DB {
	return DB
}
