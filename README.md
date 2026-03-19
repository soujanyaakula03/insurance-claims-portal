<div align="center">

# 🛡️ Insurance Claims Management Portal

**A production-style internal enterprise web application for managing and tracking insurance claims — built as a full-stack portfolio project demonstrating real-world microservices patterns.**

[![CI](https://github.com/yourusername/insurance-claims-portal/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/insurance-claims-portal/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)
![Redis](https://img.shields.io/badge/Redis-7-DC382D)
![Docker](https://img.shields.io/badge/Docker-compose-2496ED)

</div>

---

## 📋 Project Overview

A lightweight, enterprise-style monorepo showcasing a realistic **Insurance Claims Management Portal** used by internal adjusters and administrators. The system supports:

- JWT-based authentication with role-based access control (admin / adjuster / viewer)
- Full CRUD lifecycle for insurance claims (draft → submitted → review → approved/rejected → closed)
- Real-time dashboard with aggregated metrics via GraphQL
- Redis-cached claims data for fast repeated reads
- Dockerized local development environment

> Built to be **interview-ready** — every architectural decision can be clearly explained.

---

## 🏗 Architecture

```
Browser (React SPA)
        ↓ REST + GraphQL
  API Gateway (Port 3000)       ← JWT validation, request routing
    ↙                ↘
claims-service      users-service
(Port 3001)         (Port 3002)
    ↓                    ↓
PostgreSQL + Redis    PostgreSQL
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a detailed breakdown of the auth flow, caching strategy, and database schema.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| State / Data | React Query (TanStack Query v5), Context API |
| Forms | React Hook Form + Zod |
| API Gateway | Node.js, Express.js, TypeScript, Apollo Server v4 |
| Microservices | Node.js, Express.js, TypeScript |
| Auth | JWT (jsonwebtoken), bcrypt |
| Database | PostgreSQL 16 (pg pool) |
| Cache | Redis 7 (node-redis) |
| Validation | Zod |
| Logging | Pino + pino-http |
| Testing | Jest, Supertest, Vitest, React Testing Library |
| DevOps | Docker, docker-compose, Kubernetes (manifests) |
| CI/CD | GitHub Actions |

---

## 🚀 Local Setup

### Prerequisites
- Node.js 20+
- Docker + Docker Compose

### Option 1 – Docker Compose (recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/insurance-claims-portal.git
cd insurance-claims-portal

# Copy environment variables
cp .env.example .env

# Start all services (first run builds images)
docker-compose up --build

# The app is now running at:
# Frontend:      http://localhost:80
# API Gateway:   http://localhost:3000
# GraphQL:       http://localhost:3000/graphql
```

### Option 2 – Run services individually (development)

```bash
# 1. Install all workspace dependencies
npm install

# 2. Start PostgreSQL + Redis via Docker
docker-compose up postgres redis -d

# 3. Run database migrations + seed
docker exec -i claims_postgres psql -U postgres claims_db < database/init.sql
docker exec -i claims_postgres psql -U postgres claims_db < database/seed.sql

# 4. Copy and fill in environment variables for each service
cp .env.example apps/users-service/.env
cp .env.example apps/claims-service/.env
cp .env.example apps/api-gateway/.env

# 5. Start all services in separate terminals
npm run dev:users     # Users Service  → :3002
npm run dev:claims    # Claims Service → :3001
npm run dev:gateway   # API Gateway    → :3000
npm run dev:frontend  # Frontend       → :5173
```

---

## 👤 Demo Users

| Role | Email | Password |
|---|---|---|
| Admin | `admin@claims.io` | `password123` |
| Adjuster | `adjuster@claims.io` | `password123` |
| Viewer | `viewer@claims.io` | `password123` |

**Role capabilities:**
- **Admin** – full access including claim deletion and all status transitions
- **Adjuster** – create claims, view all claims, update status (cannot delete)
- **Viewer** – read-only access to all claims and dashboard

---

## 📡 Sample API Endpoints

All requests to protected endpoints require `Authorization: Bearer <token>`.

### Auth
```http
POST /api/auth/login
Content-Type: application/json

{ "email": "admin@claims.io", "password": "password123" }
```

### Claims

```http
GET    /api/claims?status=under_review&page=1&limit=20
GET    /api/claims/:id
POST   /api/claims
PATCH  /api/claims/:id
DELETE /api/claims/:id          # admin only
GET    /api/claims/summary      # cached dashboard data
```

### GraphQL Dashboard

```graphql
query {
  dashboardSummary {
    totalClaims
    totalAmountClaimed
    totalAmountApproved
    byStatus { status count }
    byType   { type   count }
  }
}
```

### Health Checks

```http
GET /health                     # API Gateway
GET http://localhost:3001/health  # Claims Service
GET http://localhost:3002/health  # Users Service
```

---

## 🧪 Running Tests

```bash
# Backend unit + API tests (claims-service)
cd apps/claims-service && npm test

# Frontend component tests (Vitest + RTL)
cd apps/frontend && npm test

# All workspace tests
npm test
```

---

## ☸️ Kubernetes Deployment

Kubernetes manifests are included in the `k8s/` folder for demo/local cluster deployment (e.g., minikube or kind).

```bash
# Apply all manifests
kubectl apply -f k8s/deployments.yaml

# Check pod status
kubectl get pods
```

> Update `claims-secrets` values in `k8s/deployments.yaml` before deploying to any environment.

---

## 📸 Screenshots

> _Screenshots coming soon — run locally with `docker-compose up` to see the full UI._

| Page | Description |
|---|---|
| Login | JWT login with demo credential hints |
| Dashboard | KPI cards + animated status/type bar charts |
| Claims List | Filterable table with pagination |
| Claim Detail | Full claim info + status workflow transitions |
| Create Claim | Multi-section form with Zod validation |

---

## 📁 Project Structure

```
insurance-claims-portal/
├── apps/
│   ├── frontend/               # React 18 + Vite + Tailwind
│   │   ├── src/
│   │   │   ├── api/            # Axios client + API functions
│   │   │   ├── components/     # UI + Layout components
│   │   │   ├── hooks/          # Auth context + React Query hooks
│   │   │   └── pages/          # Login, Dashboard, Claims, etc.
│   │   └── Dockerfile
│   ├── api-gateway/            # Express BFF + Apollo GraphQL
│   │   ├── src/
│   │   │   ├── graphql/        # typeDefs + resolvers
│   │   │   ├── middleware/     # JWT auth + error handler
│   │   │   └── routes/         # Proxy routes to services
│   │   └── Dockerfile
│   ├── claims-service/         # Claims REST CRUD service
│   │   ├── src/
│   │   │   ├── repositories/   # PostgreSQL queries
│   │   │   ├── services/       # Business logic + Redis cache
│   │   │   ├── controllers/    # Request/response handlers
│   │   │   ├── routes/         # Express router + role guards
│   │   │   └── __tests__/      # Jest unit + supertest API tests
│   │   └── Dockerfile
│   └── users-service/          # Auth + user profile service
│       ├── src/
│       │   ├── repositories/   # PostgreSQL queries
│       │   ├── services/       # bcrypt + JWT logic
│       │   ├── controllers/    # Request/response handlers
│       │   └── routes/         # Auth + user routes
│       └── Dockerfile
├── database/
│   ├── init.sql                # PostgreSQL schema + enums
│   └── seed.sql                # Demo users + 12 sample claims
├── shared/
│   └── types/index.ts          # Shared TypeScript types
├── k8s/
│   └── deployments.yaml        # K8s Deployments + Services + Secrets
├── .github/workflows/
│   └── ci.yml                  # GitHub Actions CI pipeline
├── docker-compose.yml
├── ARCHITECTURE.md
└── README.md
```

---

## 🔮 Future Improvements

- [ ] Document upload support for claim attachments (S3/MinIO)
- [ ] Email notifications on claim status changes (SendGrid/SES)
- [ ] Audit log table for claim history timeline
- [ ] OAuth2 / SSO integration (e.g., Okta, Azure AD)
- [ ] Admin user management console
- [ ] Rate limiting and request throttling (nginx or API gateway level)
- [ ] OpenAPI/Swagger documentation auto-generated from Zod schemas
- [ ] End-to-end tests with Playwright

---

## 📄 License

MIT © Jay
