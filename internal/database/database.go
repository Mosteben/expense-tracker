package database

import (
	"log"

	"github.com/mostafa/expense-tracker/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	dsn := "host=localhost user=postgres password=12345678 dbname=expense_tracker port=5432 sslmode=disable"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect database:", err)
	}

	err = db.AutoMigrate(
		&models.User{},
	)

	if err != nil {
		log.Fatal("Migration failed:", err)
	}

	DB = db

	log.Println("Connected to PostgreSQL")
}