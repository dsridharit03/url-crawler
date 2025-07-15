package main

import (
	"log"
	"url-crawler/internal/db"
	"url-crawler/internal/handlers"
	"url-crawler/internal/middleware"

	"github.com/gin-gonic/gin"
)

func main() {
	database, err := db.InitDB()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	router := gin.Default()
	router.Use(middleware.CORSMiddleware())

	// ✅ Add root route
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "🚀 URL Crawler API is running!",
			"status":  "OK",
		})
	})

	// API routes
	api := router.Group("/api")
	{
		api.POST("/submit", func(c *gin.Context) {
			handlers.SubmitURLHandler(c, database)
		})
		api.GET("/results", func(c *gin.Context) {
			handlers.GetResultsHandler(c, database)
		})
		api.DELETE("/results/:id", func(c *gin.Context) {
			handlers.DeleteResultHandler(c, database)
		})
		api.POST("/rerun/:id", func(c *gin.Context) {
			handlers.RerunCrawlHandler(c, database)
		})
	}

	// Run server on port 8082
	err = router.Run(":8082")
	if err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
