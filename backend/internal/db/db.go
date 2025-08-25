package db

import (
    "fmt"
    "os"
    "database/sql"
    _ "github.com/lib/pq"
)

func Connect() (*sql.DB, error) {
    connStr := os.Getenv("DATABASE_URL")
    if connStr == "" {
        connStr = "postgresql://user:password@localhost:5432/url_crawler?sslmode=disable"
    }
    
    db, err := sql.Open("postgres", connStr)
    if err != nil {
        return nil, fmt.Errorf("failed to connect to database: %v", err)
    }
    
    return db, nil
}