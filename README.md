# Multi-Tenant Blog API

A brief, learning-focused backend for a **multi-tenant blogging platform** built with **Express + TypeScript + Drizzle ORM + PostgreSQL**.

Each signup creates 3 linked records: a `user`, a `tenant` (blog/workspace), and a `membership` (user → tenant as `owner`). Posts belong to a tenant and an author.

## Tech Stack

- **Runtime:** Node.js + TypeScript (`tsx` for dev)
- **Framework:** Express 5 (`express.json`)
- **DB:** PostgreSQL 16 (via Docker Compose)
- **ORM:** Drizzle ORM + Drizzle Kit (migrations in `src/db/migrations`)
- **Auth (planned/wired):** `bcrypt` for password hashing, `jsonwebtoken` for JWT
- **Validation:** `zod` (request schemas + `src/config/env.ts`)
- **Config:** `dotenv`

## Current Features

- `POST /api/auth/register` — register user + auto-create tenant + owner membership
- `POST /api/tenants` — create a standalone tenant
- Posts module scaffolded (`src/modules/posts/`) — routes/service/controller not yet implemented
- Auth middlewares scaffolded (`src/middleware/auth.ts`, `tenant.ts`) — currently empty

## Project Structure

```
src/
  app.ts                 # Express app, JSON middleware, route mounting
  server.ts              # Server bootstrap (PORT from env)
  config/env.ts          # Zod-validated env (DATABASE_URL, PORT, JWT_SECRET)
  db/
    index.ts             # Drizzle + pg Pool connection
    schema/              # tenants, users, posts, memberships
    migrations/          # Drizzle-generated SQL migrations
  modules/
    auth/                # register: schema, service, controller, routes
    tenants/             # create tenant: schema, service, controller, routes
    posts/               # scaffold only
  middleware/            # auth.ts, tenant.ts (empty stubs)
docker-compose.yml       # postgres:16-alpine, db: tenant_blog
drizzle.config.ts        # schema: ./src/db/schema/index.ts
```

## Data Model (brief)

- **tenants** (`id, name, slug unique, created_at`) — a blog/workspace
- **users** (`id, name, email unique, password_hash, created_at`)
- **memberships** (`id, user_id → users, tenant_id → tenants, role, created_at`) — e.g. `owner`
- **posts** (`id, tenant_id → tenants, author_id → users, title, slug, content, published, created_at, updated_at`)

## Prerequisites

- Node.js 20+ and npm / bun
- Docker + Docker Compose (for Postgres)

## Setup

1. Start Postgres:
   ```bash
   docker compose up -d
   ```

2. Install deps:
   ```bash
   npm install
   ```

3. Create `.env`:
   ```env
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/tenant_blog
   PORT=3000
   JWT_SECRET=replace-with-min-32-char-secret
   ```

4. Run migrations (Drizzle Kit):
   ```bash
   npx drizzle-kit migrate
   # generate after schema changes:
   npx drizzle-kit generate
   ```

5. Start dev server:
   ```bash
   npx tsx src/server.ts
   ```
   Server: `http://localhost:3000`

> Note: `package.json` currently has no `scripts`. Add e.g. `"dev": "tsx src/server.ts"` to simplify startup.

## API Routes + Test Request / Response

Base URL: `http://localhost:3000`

### 1. Register — `POST /api/auth/register`

Creates a `user` + `tenant` + `membership(role: "owner")` in one call.

**Test request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Navin",
    "email": "navin@example.com",
    "password": "password123",
    "tenantName": "Navins Blog",
    "tenantSlug": "navins-blog"
  }'
```

**Success `201`:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "a1b2c3d4-uuid",
    "name": "Navin",
    "email": "navin@example.com"
  },
  "tenant": {
    "id": "t1-uuid",
    "name": "Navins Blog",
    "slug": "navins-blog",
    "createdAt": "2026-10-03T00:00:00.000Z"
  },
  "membership": {
    "id": "m1-uuid",
    "userId": "a1b2c3d4-uuid",
    "tenantId": "t1-uuid",
    "role": "owner",
    "createAt": "2026-10-03T00:00:00.000Z"
  }
}
```

**Validation fail `400`:**
```json
{
  "message": "Validation failed",
  "errors": { "_errors": [], "issues": "...zod error..." }
}
```
Common causes: bad email, password < 8 chars, `tenantSlug` not matching `/^[a-z0-9-]+$/`.

### 2. Create Tenant — `POST /api/tenants`

Creates a standalone tenant (no user/membership).

**Test request:**
```bash
curl -X POST http://localhost:3000/api/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Blog",
    "slug": "acme-blog"
  }'
```

**Success `201`:**
```json
{
  "message": "Tenant created successfully",
  "tenant": {
    "id": "t2-uuid",
    "name": "Acme Blog",
    "slug": "acme-blog",
    "createdAt": "2026-10-03T00:00:00.000Z"
  }
}
```

**Validation fail `400`:**
```json
{
  "message": "Validation failed",
  "errors": { "slug": "Slug can only contain lowercase letters, numbers and hyphens" }
}
```

### 3. Posts — not yet available

`src/modules/posts/post.routes.ts`, `post.controller.ts`, `post.service.ts` are empty and not mounted in `src/app.ts`. No test request yet.

## Status / Next Steps

- Implement login + JWT issuance/verification
- Fill `middleware/auth.ts` (JWT guard) and `middleware/tenant.ts` (tenant scoping)
- Implement posts CRUD scoped by `tenantId`
- Add `scripts` to `package.json`, error handler, and tests
