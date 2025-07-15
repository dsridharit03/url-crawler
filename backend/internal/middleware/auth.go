package middleware

import (
	"github.com/gin-gonic/gin"
)

// Optional Auth middleware (currently pass-through)
func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.URL.Path == "/urls" {
			c.Next() // Skip auth for /urls endpoint
			return
		}
		c.Next() // Temporarily skip auth for all endpoints for testing
	}
}

// ✅ CORS middleware for frontend/backend interaction
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
