package request

import "time"

type Message struct {
	Message string `json:"message" binding:"required"`
}

type MessageWithTime struct {
	Message   string    `json:"message" binding:"required"`
	CreatedAt time.Time `json:"createdtime" binding:"required"`
}
type MessageWithRange struct {
	Start int `json:"start"`
	End   int `json:"end"`
}
