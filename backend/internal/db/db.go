package db

import (
	"database/sql"
	"encoding/json"
	"os"
	"url-crawler/internal/models"

	_ "github.com/lib/pq"
)

func InitDB() (*sql.DB, error) {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		connStr = "postgres://postgres:password@localhost:5432/crawler_db?sslmode=disable"
	}
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		return nil, err
	}
	_, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS results (
            id SERIAL PRIMARY KEY,
            url TEXT NOT NULL UNIQUE,
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
            has_login_form BOOLEAN,
            status TEXT
        )
    `)
	if err != nil {
		return nil, err
	}
	return db, nil
}

func SaveResult(db *sql.DB, result *models.UrlResult) error {
	brokenLinksJSON, err := json.Marshal(result.BrokenLinks)
	if err != nil {
		return err
	}
	_, err = db.Exec(`
        INSERT INTO results (
            url, title, html_version, h1_count, h2_count, h3_count, h4_count, h5_count, h6_count,
            internal_links, external_links, broken_links, has_login_form, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (url) DO UPDATE SET
            title = EXCLUDED.title,
            html_version = EXCLUDED.html_version,
            h1_count = EXCLUDED.h1_count,
            h2_count = EXCLUDED.h2_count,
            h3_count = EXCLUDED.h3_count,
            h4_count = EXCLUDED.h4_count,
            h5_count = EXCLUDED.h5_count,
            h6_count = EXCLUDED.h6_count,
            internal_links = EXCLUDED.internal_links,
            external_links = EXCLUDED.external_links,
            broken_links = EXCLUDED.broken_links,
            has_login_form = EXCLUDED.has_login_form,
            status = EXCLUDED.status
    `, result.URL, result.Title, result.HTMLVersion, result.H1Count, result.H2Count, result.H3Count,
		result.H4Count, result.H5Count, result.H6Count, result.InternalLinks, result.ExternalLinks,
		string(brokenLinksJSON), result.HasLoginForm, result.Status)
	return err
}

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
