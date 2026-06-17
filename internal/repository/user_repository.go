package repository

import (
	"github.com/mostafa/expense-tracker/internal/database"
	"github.com/mostafa/expense-tracker/internal/models"
)

type UserRepository struct{}

func NewUserRepository() *UserRepository {
	return &UserRepository{}
}

func (r *UserRepository) Create(user *models.User) error {
	return database.DB.Create(user).Error
}

func (r *UserRepository) GetByEmail(email string) (*models.User, error) {
	var user models.User
	err := database.DB.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) GetByID(id string) (*models.User, error) {
	var user models.User
	err := database.DB.Where("id = ?", id).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) Update(user *models.User) error {
	return database.DB.Save(user).Error
}

func (r *UserRepository) Delete(user *models.User) error {
	return database.DB.Delete(user).Error
}