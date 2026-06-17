package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mostafa/expense-tracker/internal/service"
)

type IncomeHandler struct {
	service *service.IncomeService
}

func NewIncomeHandler(service *service.IncomeService) *IncomeHandler {
	return &IncomeHandler{
		service: service,
	}
}

type AddIncomeRequest struct {
	Title       string  `json:"title"`
	Amount      float64 `json:"amount"`
	Description string  `json:"description"`
	Date        string  `json:"date"`
}

type UpdateIncomeRequest struct {
	Title       string  `json:"title"`
	Amount      float64 `json:"amount"`
	Description string  `json:"description"`
	Date        string  `json:"date"`
}

func (h *IncomeHandler) AddIncome(c *gin.Context) {

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req AddIncomeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	date, err := parseDate(req.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date format"})
		return
	}

	err = h.service.AddIncome(
		userID.(string),
		req.Title,
		req.Amount,
		req.Description,
		date,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "income added successfully"})
}

func (h *IncomeHandler) GetIncomes(c *gin.Context) {

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	incomes, err := h.service.GetIncomes(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": incomes})
}

func (h *IncomeHandler) UpdateIncome(c *gin.Context) {

	incomeID := c.Param("id")

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req UpdateIncomeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	date, err := parseDate(req.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date format"})
		return
	}

	err = h.service.UpdateIncome(
		incomeID,
		userID.(string),
		req.Title,
		req.Amount,
		req.Description,
		date,
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "income updated successfully"})
}

func (h *IncomeHandler) DeleteIncome(c *gin.Context) {

	incomeID := c.Param("id")

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	err := h.service.DeleteIncome(incomeID, userID.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "income deleted successfully"})
}