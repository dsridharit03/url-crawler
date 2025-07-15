package main

import (
	"log"
	"url-crawler/internal/db"
	"url-crawler/internal/handlers"
	"url-crawler/internal/middleware"

	"github.com/gin-gonic/gin"
)

func main() {
	// Connect to DB
	database, err := db.InitDB()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Create router
	router := gin.Default()
	router.Use(middleware.CORSMiddleware())

	// ✅ Add root route for Render test
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "🚀 URL Crawler API is running!",
			"status":  "OK",
		})
	})

	// ✅ Register your handlers with DB
	handlers.RegisterRoutes(router, database)

	// Run server
	if err := router.Run(":8082"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
