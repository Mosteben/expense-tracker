package service

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/mostafa/expense-tracker/internal/models"
	"github.com/mostafa/expense-tracker/internal/repository"
)

type IncomeService struct {
	repo *repository.IncomeRepository
}

func NewIncomeService(repo *repository.IncomeRepository) *IncomeService {
	return &IncomeService{repo: repo}
}

func (s *IncomeService) AddIncome(
	userID string,
	title string,
	amount float64,
	description string,
	date time.Time,
) error {

	if date.IsZero() {
		date = time.Now()
	}

	income := &models.Income{
		ID:          uuid.New(),
		UserID:      uuid.MustParse(userID),
		Title:       title,
		Amount:      amount,
		Description: description,
		Date:        date,
	}

	return s.repo.Create(income)
}

func (s *IncomeService) GetIncomes(userID string) ([]models.Income, error) {
	return s.repo.GetByUserID(userID)
}

func (s *IncomeService) UpdateIncome(
	incomeID string,
	userID string,
	title string,
	amount float64,
	description string,
	date time.Time,
) error {

	income, err := s.repo.GetByID(incomeID)
	if err != nil {
		return err
	}

	if income.UserID.String() != userID {
		return errors.New("unauthorized")
	}

	income.Title = title
	income.Amount = amount
	income.Description = description
	if !date.IsZero() {
		income.Date = date
	}

	return s.repo.Update(income)
}

func (s *IncomeService) DeleteIncome(incomeID string, userID string) error {

	income, err := s.repo.GetByID(incomeID)
	if err != nil {
		return err
	}

	if income.UserID.String() != userID {
		return errors.New("unauthorized")
	}

	return s.repo.Delete(income)
}