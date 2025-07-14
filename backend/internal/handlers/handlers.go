package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"url-crawler/internal/crawler"
	dbpkg "url-crawler/internal/db" // ✅ Import your db package with alias
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
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Run crawl
		result, err := crawler.Crawl(c, req.URL)
		if err != nil {
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

		// ✅ Save result using db package
		if err := dbpkg.SaveResult(db, result); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Crawl completed", "url": req.URL})
	}
}

func ResultsHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		results, err := dbpkg.GetResults(db) // ✅ Use db package
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
		results, err := dbpkg.GetResults(db) // ✅ Use db package
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
		_, err := db.Exec("DELETE FROM results WHERE id = ?", id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Result deleted"})
	}
}
