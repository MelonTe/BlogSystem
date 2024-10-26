package request

import "time"

type Message struct {
	Message string `json:"message" binding:"required"`
}

type MessageWithTime struct {
	Message
	CreatedAt time.Time `json:"createdtime" binding:"required"`
}
