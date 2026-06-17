package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
	Name      string
	Email     string `gorm:"unique"`
	Password  string
	CreatedAt time.Time
}

func (user *User) BeforeCreate(tx *gorm.DB) error {
	user.ID = uuid.New()
	return nil
}