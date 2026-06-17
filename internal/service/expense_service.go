package service

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/mostafa/expense-tracker/internal/models"
	"github.com/mostafa/expense-tracker/internal/repository"
)

type ExpenseService struct {
	repo *repository.ExpenseRepository
}

func NewExpenseService(repo *repository.ExpenseRepository) *ExpenseService {
	return &ExpenseService{repo: repo}
}

func (s *ExpenseService) AddExpense(
	userID string,
	title string,
	amount float64,
	category string,
	description string,
	date time.Time,
	currency string,
) error {

	expense := &models.Expense{
		ID:          uuid.New(),
		UserID:      uuid.MustParse(userID),
		Title:       title,
		Amount:      amount,
		Category:    category,
		Description: description,
		Date:        date,
		Currency:    currency,
	}

	return s.repo.Create(expense)
}

func (s *ExpenseService) GetExpenses(userID string) ([]models.Expense, error) {
	return s.repo.GetByUserID(userID)
}

func (s *ExpenseService) UpdateExpense(
	expenseID string,
	userID string,
	title string,
	amount float64,
	category string,
	description string,
	date time.Time,
	currency string,
) error {

	expense, err := s.repo.GetByID(expenseID)
	if err != nil {
		return err
	}

	if expense.UserID.String() != userID {
		return errors.New("unauthorized")
	}

	expense.Title = title
	expense.Amount = amount
	expense.Category = category
	expense.Description = description
	expense.Date = date
	if currency != "" {
		expense.Currency = currency
	}

	return s.repo.Update(expense)
}

func (s *ExpenseService) DeleteExpense(expenseID string, userID string) error {

	expense, err := s.repo.GetByID(expenseID)
	if err != nil {
		return err
	}

	if expense.UserID.String() != userID {
		return errors.New("unauthorized")
	}

	return s.repo.Delete(expense)
}