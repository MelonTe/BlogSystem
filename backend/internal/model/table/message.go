package table

import "time"

type Message struct {
	ID        uint
	CreatedAt time.Time
	Content   string `json:"content" form:"content"`
}
