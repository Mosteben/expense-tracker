package models

import (
	"time"

	"github.com/google/uuid"
)

type Income struct {
	ID     uuid.UUID `gorm:"type:uuid;primaryKey"`
	UserID uuid.UUID `gorm:"type:uuid;index"`

	Title       string  `gorm:"not null"`
	Amount      float64 `gorm:"not null"`
	Description string

	Date time.Time

	CreatedAt time.Time
	UpdatedAt time.Time
}