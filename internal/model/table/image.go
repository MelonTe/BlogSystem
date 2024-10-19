package table

import "time"

type Image struct {
	ID         uint
	BlogTittle string
	CreatedAt  time.Time
	Url        string
	Name       string
}
