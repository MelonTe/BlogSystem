package response

import "time"

type MessageWithTime struct {
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"createdtime"`
}
type MessagesWithCount struct {
	Msgs  []MessageWithTime
	Count int
}
