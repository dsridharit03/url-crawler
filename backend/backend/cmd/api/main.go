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
    defer database.Close()

    r := gin.Default()
    r.Use(middleware.Auth())

    handlers.RegisterRoutes(r, database)

    if err := r.Run(":8082"); err != nil {
        log.Fatal("Failed to start server:", err)
    }
}
