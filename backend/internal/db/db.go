package db

import (
	"database/sql"
	"encoding/json"
	"os"
	"url-crawler/internal/models"

	_ "github.com/mattn/go-sqlite3"
)

// InitDB initializes the SQLite database and creates the results table if it doesn't exist.
func InitDB() (*sql.DB, error) {
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "./db/crawler.db"
	}
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, err
	}

	// Create the results table
	_, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            title TEXT,
            html_version TEXT,
            h1_count INTEGER,
            h2_count INTEGER,
            h3_count INTEGER,
            h4_count INTEGER,
            h5_count INTEGER,
            h6_count INTEGER,
            internal_links INTEGER,
            external_links INTEGER,
            broken_links TEXT,
            has_login_form INTEGER,
            status TEXT,
            UNIQUE(url)
        )
    `)
	if err != nil {
		return nil, err
	}

	return db, nil
}

// SaveResult saves or updates a crawl result in the SQLite database.
func SaveResult(db *sql.DB, result *models.UrlResult) error {
	brokenLinksJSON, err := json.Marshal(result.BrokenLinks)
	if err != nil {
		return err
	}

	_, err = db.Exec(`
        INSERT INTO results (
            url, title, html_version, h1_count, h2_count, h3_count, h4_count, h5_count, h6_count,
            internal_links, external_links, broken_links, has_login_form, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(url) DO UPDATE SET
            title=excluded.title,
            html_version=excluded.html_version,
            h1_count=excluded.h1_count,
            h2_count=excluded.h2_count,
            h3_count=excluded.h3_count,
            h4_count=excluded.h4_count,
            h5_count=excluded.h5_count,
            h6_count=excluded.h6_count,
            internal_links=excluded.internal_links,
            external_links=excluded.external_links,
            broken_links=excluded.broken_links,
            has_login_form=excluded.has_login_form,
            status=excluded.status
    `, result.URL, result.Title, result.HTMLVersion, result.H1Count, result.H2Count, result.H3Count,
		result.H4Count, result.H5Count, result.H6Count, result.InternalLinks, result.ExternalLinks,
		string(brokenLinksJSON), result.HasLoginForm, result.Status)
	return err
}

// GetResults retrieves all crawl results from the SQLite database.
func GetResults(db *sql.DB) ([]models.UrlResult, error) {
	rows, err := db.Query(`
        SELECT id, url, title, html_version, h1_count, h2_count, h3_count, h4_count, h5_count, h6_count,
            internal_links, external_links, broken_links, has_login_form, status
        FROM results
    `)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []models.UrlResult
	for rows.Next() {
		var result models.UrlResult
		var brokenLinksJSON sql.NullString

		if err := rows.Scan(&result.ID, &result.URL, &result.Title, &result.HTMLVersion,
			&result.H1Count, &result.H2Count, &result.H3Count, &result.H4Count, &result.H5Count, &result.H6Count,
			&result.InternalLinks, &result.ExternalLinks, &brokenLinksJSON, &result.HasLoginForm, &result.Status); err != nil {
			return nil, err
		}

		if brokenLinksJSON.Valid && brokenLinksJSON.String != "" {
			if err := json.Unmarshal([]byte(brokenLinksJSON.String), &result.BrokenLinks); err != nil {
				return nil, err
			}
		} else {
			result.BrokenLinks = []models.BrokenLink{}
		}

		if result.Title == "" {
			result.Title = "No Title"
		}
		if result.HTMLVersion == "" {
			result.HTMLVersion = "Unknown"
		}
		if result.Status == "" {
			result.Status = "unknown"
		}

		results = append(results, result)
	}

	return results, nil
}
