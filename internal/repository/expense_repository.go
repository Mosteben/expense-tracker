package repository

import (
	"github.com/mostafa/expense-tracker/internal/database"
	"github.com/mostafa/expense-tracker/internal/models"
)

type ExpenseRepository struct{}

func NewExpenseRepository() *ExpenseRepository {
	return &ExpenseRepository{}
}

func (r *ExpenseRepository) Create(expense *models.Expense) error {
	return database.DB.Create(expense).Error
}
func (r *ExpenseRepository) GetByUserID(userID string) ([]models.Expense, error) {
	var expenses []models.Expense

	err := database.DB.
		Where("user_id = ?", userID).
		Find(&expenses).Error

	return expenses, err
}
func (r *ExpenseRepository) GetByID(id string) (*models.Expense, error) {
	var expense models.Expense

	err := database.DB.
		Where("id = ?", id).
		First(&expense).Error

	if err != nil {
		return nil, err
	}

	return &expense, nil
}


func (r *ExpenseRepository) Update(expense *models.Expense) error {
	return database.DB.Save(expense).Error
}

func (r *ExpenseRepository) Delete(expense *models.Expense) error {
	return database.DB.Delete(expense).Error
}
