package table

import "time"

type Image struct {
	ID        uint
	BlogTitle string
	CreatedAt time.Time
	Url       string
	Name      string
}
