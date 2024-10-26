package table

import "time"

type Blog struct {
	ID        uint
	Title     string
	CreatedAt time.Time
	UpdatedAt time.Time
	Content   string
}
