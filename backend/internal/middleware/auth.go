package middleware

import (
	"github.com/gin-gonic/gin"
)

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.URL.Path == "/urls" {
			c.Next() // Skip auth for /urls endpoint
			return
		}
		c.Next() // Temporarily skip auth for all endpoints for testing
	}
}
