package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"url-crawler/internal/crawler"
	dbpkg "url-crawler/internal/db"
	"url-crawler/internal/models"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, dbConn *sql.DB) {
	r.POST("/urls", UrlHandler(dbConn))
	r.GET("/results", ResultsHandler(dbConn))
	r.GET("/results/:id", ResultDetailHandler(dbConn))
	r.DELETE("/results/:id", DeleteResultHandler(dbConn))
}

func UrlHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			URL string `json:"url"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			fmt.Printf("Error binding JSON: %v\n", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body: " + err.Error()})
			return
		}
		fmt.Printf("Received URL to crawl: %s\n", req.URL)
		result, err := crawler.Crawl(c, req.URL)
		if err != nil {
			fmt.Printf("Crawl error for URL %s: %v\n", req.URL, err)
			result = &models.UrlResult{
				URL:           req.URL,
				Status:        "error",
				Title:         "No Title",
				HTMLVersion:   "Unknown",
				BrokenLinks:   []models.BrokenLink{},
				HasLoginForm:  false,
				H1Count:       0,
				H2Count:       0,
				H3Count:       0,
				H4Count:       0,
				H5Count:       0,
				H6Count:       0,
				InternalLinks: 0,
				ExternalLinks: 0,
			}
		}
		if err := dbpkg.SaveResult(db, result); err != nil {
			fmt.Printf("Error saving result for URL %s: %v\n", req.URL, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save result: " + err.Error()})
			return
		}
		fmt.Printf("Crawl completed for URL %s, status: %s\n", req.URL, result.Status)
		c.JSON(http.StatusOK, gin.H{
			"message": "Crawl completed",
			"url":     req.URL,
			"result":  result,
		})
	}
}

func ResultsHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		results, err := dbpkg.GetResults(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, results)
	}
}

func ResultDetailHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		results, err := dbpkg.GetResults(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		for _, result := range results {
			if fmt.Sprintf("%d", result.ID) == id {
				c.JSON(http.StatusOK, result)
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Result not found"})
	}
}

func DeleteResultHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		fmt.Printf("Attempting to delete ID: %s\n", id)
		var exists bool
		err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM results WHERE id = ?)", id).Scan(&exists)
		if err != nil {
			fmt.Printf("Error checking existence for ID %s: %v\n", id, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
			return
		}
		if !exists {
			fmt.Printf("No record found with ID: %s\n", id)
			c.JSON(http.StatusNotFound, gin.H{"error": "No record found with ID " + id})
			return
		}
		result, err := db.Exec("DELETE FROM results WHERE id = ?", id)
		if err != nil {
			fmt.Printf("Database error deleting ID %s: %v\n", id, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
			return
		}
		rowsAffected, err := result.RowsAffected()
		if err != nil {
			fmt.Printf("Error getting rows affected for ID %s: %v\n", id, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
			return
		}
		if rowsAffected == 0 {
			fmt.Printf("No record deleted with ID: %s\n", id)
			c.JSON(http.StatusNotFound, gin.H{"error": "No record found with ID " + id})
			return
		}
		fmt.Printf("Successfully deleted ID: %s\n", id)
		c.JSON(http.StatusOK, gin.H{"message": "Successfully deleted URL with ID " + id})
	}
}

func RerunCrawlHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		results, err := dbpkg.GetResults(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		var targetURL string
		for _, r := range results {
			if fmt.Sprintf("%d", r.ID) == id {
				targetURL = r.URL
				break
			}
		}
		if targetURL == "" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Result not found"})
			return
		}
		result, err := crawler.Crawl(c, targetURL)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Re-crawling failed"})
			return
		}
		if err := dbpkg.SaveResult(db, result); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update crawl result"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Re-crawled successfully", "url": targetURL})
	}
}
