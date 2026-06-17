package repository

import (
	"github.com/mostafa/expense-tracker/internal/database"
)

type DashboardRepository struct{}

func NewDashboardRepository() *DashboardRepository {
	return &DashboardRepository{}
}

func (r *DashboardRepository) GetTotalIncome(userID string) (float64, error) {

	var total float64

	err := database.DB.
		Table("incomes").
		Select("COALESCE(SUM(amount),0)").
		Where("user_id = ?", userID).
		Scan(&total).Error

	return total, err
}

func (r *DashboardRepository) GetTotalExpenses(userID string) (float64, error) {

	var total float64

	err := database.DB.
		Table("expenses").
		Select("COALESCE(SUM(amount),0)").
		Where("user_id = ?", userID).
		Scan(&total).Error

	return total, err
}