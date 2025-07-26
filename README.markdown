# URL Crawler

A full-stack web application for crawling URLs, built for the Sykell Full-Stack Challenge. The front-end uses React/TypeScript and is hosted on GitHub Pages, while the back-end uses Go/MySQL with Gin and JWT authentication.

## Live Demo
- **Front-end**: [https://dsridharit03.github.io/url-crawler](https://dsridharit03.github.io/url-crawler)
- **Back-end**: [Hosted on Render at https://url-crawler.onrender.com or run locally]

## Features
- **Front-end**:
  - Responsive UI with Tailwind CSS.
  - Paginated, sortable table for crawl results.
  - Global search and column filters.
  - Details view with bar chart for links and broken links list.
  - Bulk actions (re-run/delete).
  - Real-time status updates.
  - Automated tests.
- **Back-end**:
  - Crawls URLs for HTML version, title, headings, links, broken links, and login forms.
  - Uses Gin, JWT authentication, and MySQL.
- **General**:
  - Consistent error handling.
  - Reproducible builds.
  - Incremental commits.

## Prerequisites
- Node.js (v16+)
- Go (v1.18+)
- MySQL (v8.0+)
- Git
- Docker (optional)

## Setup and Running Locally
### Back-end
1. Clone:
   ```bash
   git clone https://github.com/dsridharit03/url-crawler.git
   cd url-crawler/backend
   ```
2. Install dependencies:
   ```bash
   go mod tidy
   ```
3. Set up MySQL:
   ```sql
   CREATE DATABASE url_crawler;
   ```
   Apply migrations:
   ```bash
   mysql -u root -p url_crawler < internal/db/migrations/001_init.sql
   ```
   Set environment:
   ```bash
   export DATABASE_URL=root:sri123@tcp(localhost:3306)/url_crawler?parseTime=true
   ```
4. Start:
   ```bash
   go run cmd/api/main.go
   ```
   Runs on `http://localhost:8082`.

### Front-end
1. Navigate:
   ```bash
   cd ../frontend
   ```
2. Install:
   ```bash
   npm install
   ```
3. Set API URL in `src/utils/api.ts`:
   ```typescript
   export const API_URL = 'http://localhost:8082';
   ```
4. Start:
   ```bash
   npm start
   ```
   Runs on `http://localhost:3000`.

### Docker Compose
```bash
docker-compose up --build
```

## Deploying
### GitHub Pages (Front-end)
```bash
cd frontend
npm run build
npm run deploy
```
Access: [https://dsridharit03.github.io/url-crawler](https://dsridharit03.github.io/url-crawler).

### Render (Back-end)
- Deploy `backend` on Render with `DATABASE_URL`.
- Update `frontend/src/utils/api.ts` with Render URL.
- Redeploy front-end.

## Troubleshooting
- **Wikipedia Crawling**: Uses User-Agent and 60s timeout in `crawler.go`.
- **CORS**: Allows `http://localhost:3000` and `https://dsridharit03.github.io`.
- **Auth**: `/urls` endpoint bypasses JWT for testing.

## License
MIT License.