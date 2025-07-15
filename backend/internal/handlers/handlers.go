package handlers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"url-crawler/internal/crawler"
	dbpkg "url-crawler/internal/db"
	"url-crawler/internal/models"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, dbConn *sql.DB) {
	api := r.Group("/api")
	{
		api.POST("/urls", UrlHandler(dbConn))
		api.GET("/results", ResultsHandler(dbConn))
		api.GET("/results/:id", ResultDetailHandler(dbConn))
		api.DELETE("/results/:id", DeleteResultHandler(dbConn))
		api.POST("/rerun/:id", RerunCrawlHandler(dbConn))
	}
}

func UrlHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			URL string `json:"url"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			log.Printf("❌ Error binding JSON: %v", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		log.Printf("🌐 Received URL for crawling: %s", req.URL)

		// Run crawl
		result, err := crawler.Crawl(c, req.URL)
		if err != nil {
			log.Printf("❌ Crawl failed for URL %s: %v", req.URL, err)
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
		} else {
			log.Printf("✅ Crawl successful for URL %s", req.URL)
		}

		// Save result
		if err := dbpkg.SaveResult(db, result); err != nil {
			log.Printf("❌ Error saving to DB for %s: %v", req.URL, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		log.Printf("💾 Result saved for %s", req.URL)
		c.JSON(http.StatusOK, gin.H{"message": "Crawl completed", "url": req.URL})
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
		_, err := db.Exec("DELETE FROM results WHERE id = ?", id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Result deleted"})
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
