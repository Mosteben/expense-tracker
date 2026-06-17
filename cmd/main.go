package main


import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/mostafa/expense-tracker/internal/database"
	"github.com/mostafa/expense-tracker/internal/handler"
	"github.com/mostafa/expense-tracker/internal/middleware"
	"github.com/mostafa/expense-tracker/internal/models"
	"github.com/mostafa/expense-tracker/internal/repository"
	"github.com/mostafa/expense-tracker/internal/service"
	"os"
)

func main() {

	database.Connect()

	database.DB.AutoMigrate(
		&models.User{},
		&models.Expense{},
		&models.Income{},
	)

	r := gin.Default()

	r.Use(cors.Default())

	userRepo    := repository.NewUserRepository()
	userService := service.NewUserService(userRepo)
	authHandler := handler.NewAuthHandler(userService)

	expenseRepo     := repository.NewExpenseRepository()
	expenseService  := service.NewExpenseService(expenseRepo)
	expenseHandler  := handler.NewExpenseHandler(expenseService)

	incomeRepo    := repository.NewIncomeRepository()
	incomeService := service.NewIncomeService(incomeRepo)
	incomeHandler := handler.NewIncomeHandler(incomeService)

	dashboardRepo     := repository.NewDashboardRepository()
	dashboardService  := service.NewDashboardService(dashboardRepo)
	dashboardHandler  := handler.NewDashboardHandler(dashboardService)

	// ── Public routes ──
	r.POST("/auth/register", authHandler.Register)
	r.POST("/auth/login",    authHandler.Login)

	// ── Protected routes ──
	authorized := r.Group("/")
	authorized.Use(middleware.AuthMiddleware())

	// Auth / account
	authorized.PUT("/auth/profile",          authHandler.UpdateProfile)
	authorized.PUT("/auth/change-password",  authHandler.ChangePassword)
	authorized.DELETE("/auth/delete-account", authHandler.DeleteAccount)

	// Expenses
	authorized.GET("/expenses",        expenseHandler.GetExpenses)
	authorized.POST("/expenses",       expenseHandler.AddExpense)
	authorized.PUT("/expenses/:id",    expenseHandler.UpdateExpense)
	authorized.DELETE("/expenses/:id", expenseHandler.DeleteExpense)

	// Income
	authorized.GET("/income",        incomeHandler.GetIncomes)
	authorized.POST("/income",       incomeHandler.AddIncome)
	authorized.PUT("/income/:id",    incomeHandler.UpdateIncome)
	authorized.DELETE("/income/:id", incomeHandler.DeleteIncome)

	// Dashboard
	authorized.GET("/dashboard", dashboardHandler.GetDashboard)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}