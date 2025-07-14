package db

import (
	"database/sql"
	"encoding/json"
	"url-crawler/internal/models"

	_ "github.com/go-sql-driver/mysql"
)

func InitDB() (*sql.DB, error) {
	db, err := sql.Open("mysql", "root:sri123@tcp(localhost:3306)/url_crawler?parseTime=true")
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

	_, err = db.Exec(
		`INSERT INTO results (
            url, title, html_version, h1_count, h2_count, h3_count, h4_count, h5_count, h6_count,
            internal_links, external_links, broken_links, has_login_form, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            html_version = VALUES(html_version),
            h1_count = VALUES(h1_count),
            h2_count = VALUES(h2_count),
            h3_count = VALUES(h3_count),
            h4_count = VALUES(h4_count),
            h5_count = VALUES(h5_count),
            h6_count = VALUES(h6_count),
            internal_links = VALUES(internal_links),
            external_links = VALUES(external_links),
            broken_links = VALUES(broken_links),
            has_login_form = VALUES(has_login_form),
            status = VALUES(status)`,
		result.URL, result.Title, result.HTMLVersion, result.H1Count, result.H2Count, result.H3Count,
		result.H4Count, result.H5Count, result.H6Count, result.InternalLinks, result.ExternalLinks,
		string(brokenLinksJSON), result.HasLoginForm, result.Status)

	return err
}

func GetResults(db *sql.DB) ([]models.UrlResult, error) {
	rows, err := db.Query(
		`SELECT id, url, title, html_version, h1_count, h2_count, h3_count, h4_count, h5_count, h6_count,
            internal_links, external_links, broken_links, has_login_form, status
        FROM results`)

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
