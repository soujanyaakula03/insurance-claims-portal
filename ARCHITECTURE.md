# Architecture – Insurance Claims Management Portal

## Service Overview

```
                    ┌──────────────┐
                    │   Browser    │
                    │  (React SPA) │
                    └──────┬───────┘
                           │ HTTP/GraphQL
                    ┌──────▼───────┐
                    │  API Gateway │  ← JWT validation
                    │  Port 3000   │  ← REST proxy + Apollo GraphQL
                    └──────┬───────┘
               ┌───────────┴───────────┐
      ┌────────▼────────┐   ┌──────────▼────────┐
      │  claims-service │   │  users-service     │
      │   Port 3001     │   │   Port 3002        │
      │  REST CRUD      │   │  Auth + Profile    │
      └────────┬────────┘   └──────────┬─────────┘
               │                       │
        ┌──────▼──────┐         ┌──────▼──────┐
        │  PostgreSQL  │         │  PostgreSQL  │
        │  (claims)    │         │  (users)     │
        └─────────────┘         └─────────────┘
               │
        ┌──────▼──────┐
        │    Redis     │
        │  (cache 5m)  │
        └─────────────┘
```

---

## Auth Flow

1. **Login**: `POST /api/auth/login` → Gateway proxies to users-service → bcrypt verify → JWT signed (HS256, 8h TTL)
2. **Protected Request**: Client sends `Authorization: Bearer <token>` header
3. **Gateway Validation**: `authenticate` middleware verifies token against `JWT_SECRET`
4. **Header Forwarding**: Gateway sets trusted internal headers: `x-user-id`, `x-user-email`, `x-user-role`
5. **Downstream Authorization**: claims-service reads `x-user-role` header to enforce role-based access (`requireRole` middleware)

> **Security note**: Internal services trust `x-user-*` headers only from the gateway. In production, network policies (K8s NetworkPolicy or service mesh) would restrict who can call the internal services directly.

---

## Caching Strategy

Redis is used in **claims-service** for two purposes:

| Cache Key Pattern | TTL | Invalidated On |
|---|---|---|
| `claims:list:{queryParams}` | 5 min | POST, PATCH, DELETE any claim |
| `claims:detail:{id}` | 5 min | PATCH, DELETE that claim |
| `claims:summary:dashboard` | 5 min | POST, PATCH, DELETE any claim |

Cache reads use a **stale-on-miss** pattern: if Redis has no entry, fetch from PostgreSQL and populate the cache. All write operations invalidate related keys using Redis `KEYS` + `DEL`.

---

## Database Schema

Two main tables in PostgreSQL:

```
users
├── id (UUID PK)
├── email (unique)
├── password_hash
├── first_name, last_name
├── role (ENUM: admin | adjuster | viewer)
└── created_at, updated_at

claims
├── id (UUID PK)
├── claim_number (unique, e.g. CLM-2024-0001)
├── title, description
├── type (ENUM: auto | home | health | life | liability)
├── status (ENUM: draft → submitted → under_review → approved/rejected → closed)
├── amount_claimed, amount_approved
├── policy_number
├── claimant_name, claimant_email, claimant_phone
├── incident_date
├── submitted_by → users.id
├── assigned_to → users.id
└── reviewed_at, created_at, updated_at
```

---

## Role-Based Access Control

| Action | admin | adjuster | viewer |
|---|---|---|---|
| View claims | ✅ | ✅ | ✅ |
| Create claim | ✅ | ✅ | ❌ |
| Update claim status | ✅ | ✅ | ❌ |
| Delete claim | ✅ | ❌ | ❌ |
| Dashboard | ✅ | ✅ | ✅ |

---

## GraphQL vs REST

| Endpoint | Protocol | Purpose |
|---|---|---|
| `/api/claims/*` | REST | CRUD operations — clear semantics, easy caching |
| `/api/auth/*` | REST | Auth flows — standard HTTP status codes matter |
| `/graphql` | GraphQL | Dashboard — aggregates data from multiple sources in one round trip |
