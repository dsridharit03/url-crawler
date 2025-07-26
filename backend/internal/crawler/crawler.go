package crawler

import (
	"context"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"
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

	c := colly.NewCollector(
		colly.UserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"),
		colly.MaxDepth(1),
		colly.Async(true),
	)
	c.SetRequestTimeout(60 * time.Second)

	parsedURL, err := url.Parse(rawURL)
	if err != nil {
		fmt.Println("URL Parse Error:", err)
		result.Status = "error"
		return result, err
	}
	baseHost := parsedURL.Host
	fmt.Println("Parsed Base Host:", baseHost)

	c.OnHTML("html", func(e *colly.HTMLElement) {
		doctype := e.Request.Ctx.Get("doctype")
		if doctype == "" {
			doctype = e.DOM.ParentsUntil("~").First().Text()
		}
		fmt.Println("Doctype:", doctype)
		doctypeLower := strings.ToLower(strings.TrimSpace(doctype))
		if strings.Contains(doctypeLower, "<!doctype html") || strings.Contains(doctypeLower, "html 5") {
			result.HTMLVersion = "HTML5"
		} else if strings.Contains(doctypeLower, "html 4") {
			result.HTMLVersion = "HTML4"
		} else if strings.Contains(doctypeLower, "xhtml") {
			result.HTMLVersion = "XHTML"
		} else {
			result.HTMLVersion = "Other"
		}
	})

	c.OnResponse(func(r *colly.Response) {
		body := string(r.Body)
		if strings.HasPrefix(strings.ToLower(body), "<!doctype") {
			end := strings.Index(body, ">")
			if end > 0 {
				r.Ctx.Put("doctype", body[:end+1])
			}
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
		absoluteLink := resolveURL(link, rawURL)
		if strings.HasPrefix(absoluteLink, "http") {
			if strings.Contains(absoluteLink, baseHost) {
				result.InternalLinks++
			} else {
				result.ExternalLinks++
			}
			statusCode, err := checkLink(absoluteLink)
			if err != nil || statusCode >= 400 {
				fmt.Println("Broken Link:", absoluteLink, "Status:", statusCode, "Error:", err)
				result.BrokenLinks = append(result.BrokenLinks, models.BrokenLink{URL: absoluteLink, StatusCode: statusCode})
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

	c.OnRequest(func(r *colly.Request) {
		r.Headers.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
		r.Headers.Set("Accept-Language", "en-US,en;q=0.5")
	})

	fmt.Println("Visiting URL:", rawURL)
	for i := 0; i < 3; i++ {
		err = c.Visit(rawURL)
		if err == nil {
			break
		}
		fmt.Println("Retry Attempt:", i+1, "Error:", err)
		time.Sleep(2 * time.Second)
	}
	if err != nil {
		fmt.Println("Visit Error after retries:", err)
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

func resolveURL(link, baseURL string) string {
	if strings.HasPrefix(link, "http") {
		return link
	}
	base, err := url.Parse(baseURL)
	if err != nil {
		return link
	}
	rel, err := url.Parse(link)
	if err != nil {
		return link
	}
	return base.ResolveReference(rel).String()
}

func checkLink(link string) (int, error) {
	client := &http.Client{
		Timeout: 10 * time.Second,
	}
	req, err := http.NewRequest("HEAD", link, nil)
	if err != nil {
		return 0, err
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
	for i := 0; i < 3; i++ {
		resp, err := client.Do(req)
		if err == nil && resp != nil {
			defer resp.Body.Close()
			return resp.StatusCode, nil
		}
		time.Sleep(2 * time.Second)
	}
	return 0, err
}
