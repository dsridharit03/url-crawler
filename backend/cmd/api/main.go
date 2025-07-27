package main

import (
	"log"
	"os"
	"strings"
	"time"
	"url-crawler/internal/db"
	"url-crawler/internal/handlers"
	"url-crawler/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found")
	}

	database, err := db.InitDB()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer database.Close()

	r := gin.Default()
	r.SetTrustedProxies([]string{"127.0.0.1"})

	allowedOrigins := strings.Split(os.Getenv("ALLOWED_ORIGINS"), ",")
	log.Printf("Loaded ALLOWED_ORIGINS: %v", allowedOrigins)
	if len(allowedOrigins) == 0 || allowedOrigins[0] == "" {
		allowedOrigins = []string{"http://localhost:5173"}
		log.Println("Using default origin: http://localhost:5173")
	}
	validOrigins := []string{}
	for _, origin := range allowedOrigins {
		origin = strings.TrimSpace(origin)
		if origin == "*" || strings.HasPrefix(origin, "http://") || strings.HasPrefix(origin, "https://") {
			validOrigins = append(validOrigins, origin)
		} else {
			log.Printf("Skipping invalid origin: %s", origin)
		}
	}
	if len(validOrigins) == 0 {
		validOrigins = []string{"http://localhost:5173"}
		log.Println("No valid origins found, using default")
	}
	r.Use(cors.New(cors.Config{
		AllowOrigins:     validOrigins,
		AllowMethods:     []string{"GET", "POST", "OPTIONS", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.Static("/assets", "./static/assets")
	r.StaticFile("/", "./static/index.html")
	r.StaticFile("/index.html", "./static/index.html")

	r.Use(middleware.Auth())
	handlers.RegisterRoutes(r, database)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}
	r.Run(":" + port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
