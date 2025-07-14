package crawler

import (
	"context"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"url-crawler/internal/models"

	"github.com/gocolly/colly/v2"
)

func Crawl(ctx context.Context, rawURL string) (*models.UrlResult, error) {
	result := &models.UrlResult{
		URL:           rawURL,
		Status:        "running",
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
	c := colly.NewCollector()

	parsedURL, err := url.Parse(rawURL)
	if err != nil {
		fmt.Println("URL Parse Error:", err)
		result.Status = "error"
		return result, err
	}
	baseHost := parsedURL.Host
	fmt.Println("Parsed Base Host:", baseHost)

	c.OnHTML("html", func(e *colly.HTMLElement) {
		doctype := e.DOM.ParentsUntil("~").First().Text()
		fmt.Println("Doctype:", doctype)
		if strings.Contains(strings.ToLower(doctype), "html") {
			result.HTMLVersion = "HTML5"
		}
	})

	c.OnHTML("title", func(e *colly.HTMLElement) {
		title := strings.TrimSpace(e.Text)
		fmt.Println("Title:", title)
		if title != "" {
			result.Title = title
		}
	})

	c.OnHTML("h1,h2,h3,h4,h5,h6", func(e *colly.HTMLElement) {
		fmt.Println("Heading:", e.Name)
		switch e.Name {
		case "h1":
			result.H1Count++
		case "h2":
			result.H2Count++
		case "h3":
			result.H3Count++
		case "h4":
			result.H4Count++
		case "h5":
			result.H5Count++
		case "h6":
			result.H6Count++
		}
	})

	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		link := e.Attr("href")
		fmt.Println("Link:", link)
		if strings.HasPrefix(link, "http") {
			if strings.Contains(link, baseHost) {
				result.InternalLinks++
			} else {
				result.ExternalLinks++
			}
			resp, err := http.Head(link)
			statusCode := 0
			if resp != nil {
				statusCode = resp.StatusCode
			}
			if err != nil {
				fmt.Println("Link Check Error:", link, err)
			}
			fmt.Println("Link Check:", link, "Status:", statusCode)
			if err != nil || (resp != nil && resp.StatusCode >= 400) {
				result.BrokenLinks = append(result.BrokenLinks, models.BrokenLink{URL: link, StatusCode: statusCode})
			}
		}
	})

	c.OnHTML("form", func(e *colly.HTMLElement) {
		formText := strings.ToLower(e.Text)
		hasPasswordInput := e.DOM.Find("input[type='password']").Length() > 0
		fmt.Println("Form found:", formText, "Has Password Input:", hasPasswordInput)
		if strings.Contains(formText, "login") || hasPasswordInput {
			result.HasLoginForm = true
		}
	})

	c.OnError(func(r *colly.Response, err error) {
		fmt.Println("Crawl Error:", err, "Status Code:", r.StatusCode)
		result.Status = "error"
	})

	fmt.Println("Visiting URL:", rawURL)
	err = c.Visit(rawURL)
	if err != nil {
		fmt.Println("Visit Error:", err)
		result.Status = "error"
		return result, err
	}

	c.Wait()
	if result.Status != "error" {
		result.Status = "done"
	}
	fmt.Println("Crawl Result:", result)
	return result, nil
}
