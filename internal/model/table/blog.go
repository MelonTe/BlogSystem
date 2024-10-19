package table

import "time"

type Blog struct {
	ID        uint
	Tittle    string
	CreatedAt time.Time
	UpdatedAt time.Time
	Content   string
}
