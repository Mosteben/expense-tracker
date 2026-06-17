package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/mostafa/expense-tracker/internal/utils"
)

func AuthMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "authorization header required",
			})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		claims, err := utils.ParseToken(tokenString)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "invalid token",
			})
			c.Abort()
			return
		}

		userID := claims["user_id"]

		c.Set("user_id", userID)

		c.Next()
	}
}