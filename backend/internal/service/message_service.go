package service

import (
	"BlogSystem/internal/model/response"
	"BlogSystem/internal/model/table"
	"BlogSystem/internal/pkg/db"
	"errors"
	"time"
)

// UploadMessage 接收的留言进行处理
// 该函数用于将用户上传的留言保存到数据库中
// 参数：message string - 用户输入的留言内容
// 返回值：error - 如果操作失败，则返回错误信息
func UploadMessage(message string) (err error) {
	// 获取数据库实例
	dbcur := db.GetDB()

	// 将传入的留言内容封装到 Message 结构体中
	msg := table.Message{
		Content:   message,    // 留言内容
		CreatedAt: time.Now(), // 留言创建时间为当前时间
	}

	// 使用 GORM 的 Create 方法将留言保存到数据库中
	// 如果插入失败，返回错误
	if err := dbcur.Create(&msg).Error; err != nil {
		return err // 如果数据库操作出错，返回错误
	}

	// 如果没有发生错误，则返回 nil 表示操作成功
	return
}

// DeleteMessage 删除留言
// 该函数用于根据留言的创建时间和内容删除指定的留言
// 参数：
//   - createTime time.Time - 留言的创建时间，用来唯一标识留言
//   - msg string - 留言的内容，用来匹配要删除的留言
//
// 返回值：
//   - error - 如果删除失败，返回错误信息
func DeleteMessage(createTime time.Time, msg string) (err error) {
	// 获取数据库实例
	dbcur := db.GetDB()

	// 使用 GORM 的 Where 方法找到匹配的留言，并执行删除操作
	// Where 方法接收两个条件：created_at 和 content
	result := dbcur.Where("created_at = ? and content = ?", createTime, msg).Delete(&table.Message{})

	// 如果删除操作过程中发生错误，返回错误信息
	if result.Error != nil {
		return result.Error
	}

	// 如果没有找到任何匹配的记录，返回一个自定义的错误
	if result.RowsAffected == 0 {
		return errors.New("无法匹配留言，删除失败")
	}

	// 如果删除成功，返回 nil 表示操作成功
	return
}

// GetMessage 获取全部留言
// 该函数用于获取所有留言，并将其转换为响应格式返回
// 返回值：
//   - res []response.MessageWithTime - 格式化后的留言列表
//   - error - 如果查询失败，返回错误信息
func GetMessage() (res []response.MessageWithTime, err error) {
	// 获取数据库实例
	dbcur := db.GetDB()

	// 存储数据库中的所有留言记录
	var messages []table.Message

	// 使用 GORM 的 Find 方法查询所有留言
	// 如果查询失败，返回错误信息
	if err := dbcur.Find(&messages).Error; err != nil {
		return nil, err
	}

	// 将查询到的留言记录转换为响应格式
	for _, m := range messages {
		res = append(res, response.MessageWithTime{
			CreatedAt: m.CreatedAt, // 留言创建时间
			Message:   m.Content,   // 留言内容
		})
	}

	// 返回转换后的留言列表
	return res, nil
}
