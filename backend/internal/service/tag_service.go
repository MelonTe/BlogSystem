package service

import (
	"BlogSystem/internal/model/response"
	"BlogSystem/internal/model/table"
	"BlogSystem/internal/pkg/db"
)

func GetTag() (res []response.Tag, err error) {
	// 获取数据库实例
	dbcur := db.GetDB()

	// 存储数据库中的所有tag记录
	var tags []table.Tag

	// 使用 GORM 的 Find 方法查询所有
	// 如果查询失败，返回错误信息
	if err := dbcur.Find(&tags).Error; err != nil {
		return nil, err
	}

	// 将查询到的tag记录转换为响应格式
	for _, m := range tags {
		res = append(res, response.Tag{
			TagName:m.Name,
			Count:m.Count,
		})
	}

	// 返回转换后的tag列表
	return res, nil
}
