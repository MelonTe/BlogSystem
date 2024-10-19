package table

import "time"

type Tag struct {
	ID        uint
	CreatedAt time.Time
	Name      string `gorm:"primaryKey"`
	Count     uint
}
