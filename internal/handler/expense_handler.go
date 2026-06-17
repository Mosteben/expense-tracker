package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/mostafa/expense-tracker/internal/service"
)

type ExpenseHandler struct {
	service *service.ExpenseService
}

func NewExpenseHandler(service *service.ExpenseService) *ExpenseHandler {
	return &ExpenseHandler{service: service}
}


func parseDate(s string) (time.Time, error) {
	if s == "" {
		return time.Time{}, nil
	}
	if t, err := time.Parse(time.RFC3339, s); err == nil {
		return t, nil
	}
	return time.Parse("2006-01-02", s)
}

type AddExpenseRequest struct {
	Title       string  `json:"title"`
	Amount      float64 `json:"amount"`
	Category    string  `json:"category"`
	Description string  `json:"description"`
	Date        string  `json:"date"`
	Currency    string  `json:"currency"`
}

func (h *ExpenseHandler) AddExpense(c *gin.Context) {

	userID := c.GetString("user_id")

	var req AddExpenseRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	date, err := parseDate(req.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid date format",
		})
		return
	}

	err = h.service.AddExpense(
		userID,
		req.Title,
		req.Amount,
		req.Category,
		req.Description,
		date,
		req.Currency,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "expense added successfully",
	})
}

func (h *ExpenseHandler) GetExpenses(c *gin.Context) {

	userID, _ := c.Get("user_id")

	expenses, err := h.service.GetExpenses(userID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": expenses,
	})
}

type UpdateExpenseRequest struct {
	Title       string  `json:"title"`
	Amount      float64 `json:"amount"`
	Category    string  `json:"category"`
	Description string  `json:"description"`
	Date        string  `json:"date"`
	Currency    string  `json:"currency"`
}

func (h *ExpenseHandler) UpdateExpense(c *gin.Context) {

	expenseID := c.Param("id")

	userID, _ := c.Get("user_id")

	var req UpdateExpenseRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	date, err := parseDate(req.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid date format",
		})
		return
	}

	err = h.service.UpdateExpense(
		expenseID,
		userID.(string),
		req.Title,
		req.Amount,
		req.Category,
		req.Description,
		date,
		req.Currency,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "expense updated successfully",
	})
}

func (h *ExpenseHandler) DeleteExpense(c *gin.Context) {

	expenseID := c.Param("id")

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "unauthorized",
		})
		return
	}

	err := h.service.DeleteExpense(expenseID, userID.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "expense deleted successfully",
	})
}