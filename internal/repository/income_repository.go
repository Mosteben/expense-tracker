package repository

import (
	"github.com/mostafa/expense-tracker/internal/database"
	"github.com/mostafa/expense-tracker/internal/models"
)

type IncomeRepository struct{}

func NewIncomeRepository() *IncomeRepository {
	return &IncomeRepository{}
}

func (r *IncomeRepository) Create(income *models.Income) error {
	return database.DB.Create(income).Error
}

func (r *IncomeRepository) GetByUserID(userID string) ([]models.Income, error) {
	var incomes []models.Income

	err := database.DB.
		Where("user_id = ?", userID).
		Find(&incomes).Error

	return incomes, err
}

func (r *IncomeRepository) GetByID(id string) (*models.Income, error) {
	var income models.Income

	err := database.DB.
		Where("id = ?", id).
		First(&income).Error

	if err != nil {
		return nil, err
	}

	return &income, nil
}

func (r *IncomeRepository) Update(income *models.Income) error {
	return database.DB.Save(income).Error
}

func (r *IncomeRepository) Delete(income *models.Income) error {
	return database.DB.Delete(income).Error
}