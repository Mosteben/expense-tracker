package service

import "github.com/mostafa/expense-tracker/internal/repository"

type DashboardService struct {
	repo *repository.DashboardRepository
}

func NewDashboardService(repo *repository.DashboardRepository) *DashboardService {
	return &DashboardService{
		repo: repo,
	}
}

type DashboardResponse struct {
	TotalIncome   float64 `json:"total_income"`
	TotalExpenses float64 `json:"total_expenses"`
	Balance       float64 `json:"balance"`
}

func (s *DashboardService) GetDashboard(userID string) (*DashboardResponse, error) {

	totalIncome, err := s.repo.GetTotalIncome(userID)
	if err != nil {
		return nil, err
	}

	totalExpenses, err := s.repo.GetTotalExpenses(userID)
	if err != nil {
		return nil, err
	}

	return &DashboardResponse{
		TotalIncome:   totalIncome,
		TotalExpenses: totalExpenses,
		Balance:       totalIncome - totalExpenses,
	}, nil
}