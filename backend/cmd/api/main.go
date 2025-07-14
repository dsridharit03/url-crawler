package main

import (
	"log"
	"url-crawler/internal/db"
	"url-crawler/internal/handlers"
	"url-crawler/internal/middleware"

	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	database, err := db.InitDB()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer database.Close()

	r := gin.Default()

	// ✅ Configure CORS to allow Authorization header
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.Use(middleware.Auth())

	handlers.RegisterRoutes(r, database)

	if err := r.Run(":8082"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
