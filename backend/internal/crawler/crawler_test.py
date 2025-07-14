package crawler

import (
    "context"
    "testing"
    "url-crawler/internal/models"
)

func TestCrawl(t *testing.T) {
    result, err := Crawl(context.Background(), "https://example.com")
    if err != nil {
        t.Fatalf("Crawl failed: %v", err)
    }
    if result.Title == "" {
        t.Error("Expected non-empty title")
    }
    if result.HTMLVersion == "" {
        t.Error("Expected HTML version")
    }
}