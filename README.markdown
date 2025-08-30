# 🌐 URL Crawler

![URL Crawler Banner](https://via.placeholder.com/1200x200.png?text=URL+Crawler+-+Analyze+Websites+Instantly)

**A sleek and powerful web application to crawl and analyze websites with ease.** Built with a **Go** backend and a **React + TypeScript** frontend, URL Crawler extracts critical metadata like HTML version, headings, links, and login form presence, presenting it in an intuitive UI. Perfect for developers, SEO professionals, and web enthusiasts looking to dive deep into website structures.

[![Go Version](https://img.shields.io/badge/Go-1.20+-00ADD8?style=flat-square&logo=go)](https://golang.org)
[![React Version](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=flat-square&logo=docker)](https://www.docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](https://opensource.org/licenses/MIT)

![Demo GIF](https://via.placeholder.com/800x400.png?text=URL+Crawler+Demo) <!-- Replace with actual demo GIF or screenshot -->

---

## 🚀 Features

- **Comprehensive URL Analysis**:
  - 📝 Page title and HTML version (HTML5, HTML4, XHTML, etc.)
  - 🏷️ Heading counts (H1–H6)
  - 🔗 Internal and external link counts with broken link detection
  - 🔒 Login form detection
- **Modern Frontend**:
  - 🖼️ Responsive React UI with TypeScript for type safety
  - 📊 Interactive charts for link distribution using Chart.js
  - ✅ Real-time status indicators and bulk actions (e.g., delete multiple results)
- **Robust Backend**:
  - ⚡ Go-powered RESTful API with Gin framework
  - 🗄️ PostgreSQL for persistent storage
  - 🔐 JWT-based authentication for secure endpoints
- **Containerized Deployment**:
  - 🐳 Docker and Docker Compose for easy setup and scaling
- **Testing**:
  - 🧪 Unit tests for backend (Go) and frontend (React) components

---

## 📂 Project Structure

```plaintext
url-crawler/
├── backend/                    # Go backend
│   ├── cmd/api/                # Server entry point
│   │   └── main.go
│   ├── internal/
│   │   ├── crawler/            # Web crawling logic
│   │   ├── handlers/           # API handlers
│   │   ├── models/             # Data models
│   │   ├── db/                 # Database setup and migrations
│   │   └── middleware/         # Authentication middleware
│   ├── go.mod                  # Go dependencies
│   ├── Dockerfile
├── frontend/                   # React + TypeScript frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom hooks
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # API utilities
│   │   ├── assets/             # CSS and assets
│   │   ├── tests/              # Frontend tests
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js      # Tailwind CSS config
│   ├── Dockerfile
├── scripts/                    # Database seed scripts
├── doc/                        # Documentation
├── docker-compose.yml          # Docker Compose setup
├── README.md                   # You're here!
└── .gitignore
```

---

## 🧠 Theoretical Background

### Web Crawling
URL Crawler uses the **Colly** library to scrape web pages, extracting:
- **Metadata**: DOCTYPE, title, headings, and forms.
- **Links**: Differentiates internal vs. external links and validates links with HTTP HEAD requests.
- **Purpose**: Provides insights into website structure for SEO, debugging, or analysis.

### RESTful API
The backend follows REST principles with endpoints for submitting URLs, fetching results, and deleting entries. It uses **Gin** for high-performance routing and **PostgreSQL** for data persistence.

### Frontend Design
The React frontend, styled with **Tailwind CSS**, offers a responsive and interactive experience. **Chart.js** visualizes data, and TypeScript ensures type-safe development.

---

## 🛠️ Technical Implementation

### Backend (Go)
- **Framework**: Gin for routing and middleware.
- **Crawling**: Colly with a max depth of 1, retry logic (3 attempts), and timeout handling.
- **Database**: PostgreSQL with migrations for schema setup.
- **Security**: JWT middleware for protected routes.
- **Key Files**:
  - `main.go`: Server initialization and CORS setup.
  - `crawler/crawler.go`: Core crawling logic.
  - `handlers/handlers.go`: API endpoint definitions.
  - `models/models.go`: Data structures for results.
  - `middleware/auth.go`: JWT authentication.

### Frontend (React + TypeScript)
- **Components**: Modular UI with `UrlInput`, `ResultsTable`, `DetailsView`, etc.
- **State Management**: Custom `useApi` hook for API interactions.
- **Styling**: Tailwind CSS for responsive, modern design.
- **Testing**: Jest and React Testing Library for unit tests.
- **Key Files**:
  - `UrlInput.tsx`: URL submission form.
  - `ResultsTable.tsx`: Displays results with bulk actions.
  - `DetailsView.tsx`: Detailed result view with charts.

### Database
The `results` table stores crawl data, defined in `db/migrations/001_init.sql`. Seed scripts (`scripts/seed.sql`) provide initial data for testing.

### Docker
Separate Dockerfiles for backend and frontend, orchestrated by `docker-compose.yml` for local development.

---

## 📋 Prerequisites

- **Go**: v1.20+
- **Node.js**: v16+
- **Docker** & **Docker Compose**
- **PostgreSQL**: v13+ (if not using Docker)
- **Git**

---

## ⚙️ Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/dsridharit03/url-crawler.git
   cd url-crawler
   ```

2. **Set Up Environment Variables**:
   - Backend (`backend/.env`):
     ```env
     DATABASE_URL=postgres://user:password@localhost:5432/url_crawler?sslmode=disable
     JWT_SECRET=your_jwt_secret_key
     ALLOWED_ORIGINS=http://localhost:5173
     PORT=8082
     ```
   - Frontend (`frontend/.env`):
     ```env
     VITE_API_URL=http://localhost:8082
     ```

3. **Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

4. **Manual Setup**:
   - **Backend**:
     ```bash
     cd backend
     go mod tidy
     go run cmd/api/main.go
     ```
   - **Frontend**:
     ```bash
     cd frontend
     npm install
     npm run dev
     ```

5. **Access the App**:
   - Visit `http://localhost:8082` in your browser.

---

## 🎮 Usage

1. **Analyze a URL**:
   - Enter a URL (e.g., `https://example.com`) and click "Analyze".
   - Results are stored and displayed in a table.

2. **Explore Results**:
   - View metadata like title, HTML version, and link counts.
   - Select rows for bulk deletion.

3. **Detailed Insights**:
   - Click a result to see detailed metadata and a link distribution chart.

4. **Manage Data**:
   - Delete individual or multiple results using the UI.

---

## 🌐 API Endpoints

| Method | Endpoint           | Description                        | Authentication |
|--------|--------------------|------------------------------------|----------------|
| POST   | `/urls`           | Submit a URL for crawling          | Optional       |
| GET    | `/results`        | Retrieve all crawl results         | Optional       |
| GET    | `/results/:id`    | Fetch details for a specific ID    | Optional       |
| DELETE | `/results/:id`    | Delete a specific result           | Optional       |

---

## 🧪 Testing

### Backend
```bash
cd backend
go test ./...
```

### Frontend
```bash
cd frontend
npm test
```

Tests cover key components (`UrlInput`, `ResultsTable`, `DetailsView`) and backend logic (`crawler`, `handlers`).

---

## 🚀 Deployment

1. **Docker**:
   ```bash
   docker-compose up -d
   ```

2. **Cloud**:
   - Backend is hosted on Render (`https://url-crawler-backend.onrender.com`).
   - Update `frontend/.env` with the production API URL.
   - Deploy frontend to Vercel, Netlify, or similar.

---

## 🔮 Future Enhancements

- 🌐 Multi-page crawling with configurable depth.
- 🔐 Full user authentication with roles.
- 📡 WebSocket support for real-time updates.
- 📥 Export results as CSV/JSON.
- ⚡ Performance optimizations for large-scale crawling.

---

## 🤝 Contributing

1. Fork the repo.
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m "Add YourFeature"`
4. Push: `git push origin feature/YourFeature`
5. Open a pull request.

---

## 📜 License

MIT License. See [LICENSE](LICENSE) for details.