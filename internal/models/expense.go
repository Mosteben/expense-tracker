package models

import (
	"time"

	"github.com/google/uuid"
)

type Expense struct {
	ID     uuid.UUID `gorm:"type:uuid;primaryKey"`

	UserID uuid.UUID `gorm:"type:uuid;index"`

	Title       string  `gorm:"not null"`
	Amount      float64 `gorm:"not null"`

	Category    string
	Description string

	Date   time.Time `gorm:"not null"`
	Type   string
	Status string

	Currency string `gorm:"default:EGP"`

	CreatedAt time.Time
	UpdatedAt time.Time
}