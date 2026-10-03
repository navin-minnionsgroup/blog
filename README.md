# Multi-Tenant Blog API

A learning-focused backend for a **multi-tenant blogging platform** built with **Express + TypeScript + Drizzle ORM + PostgreSQL**.

Each register creates 3 linked records in one DB transaction: a `user`, a `tenant` (blog/workspace), and a `membership` (`owner`). Login returns a JWT (`7d` expiry). Posts are tenant-scoped via `authMiddleware` + `tenantMiddleware`.

## Tech Stack

- **Runtime:** Node.js + TypeScript (`tsx` for dev, `bunx` script)
- **Framework:** Express 5 (`express.json`)
- **DB:** PostgreSQL 16 (via Docker Compose)
- **ORM:** Drizzle ORM + Drizzle Kit (`src/db/migrations`)
- **Auth:** `bcrypt` (hash, cost 12) + `jsonwebtoken` (`userId` payload)
- **Validation:** `zod` (body schemas + `src/config/env.ts`)
- **Config:** `dotenv`

## Current Features

- `POST /api/auth/register` — transactional user + tenant + owner membership
- `POST /api/auth/login` — email/password → JWT
- `POST /api/tenants` — standalone tenant create
- `POST /api/posts` — auth + tenant-scoped post create
- `GET /api/posts` — auth + tenant-scoped list (first membership's tenant only)
- `GET /api/test/me` — auth check, returns `userId`, `tenantId`, `role`
- Middlewares: `authMiddleware` (Bearer JWT), `tenantMiddleware` (first membership lookup)

## Project Structure

```
src/
  app.ts                 # Express app + route mounting
  server.ts              # Bootstrap (PORT from env)
  config/env.ts          # Zod-validated env (DATABASE_URL, PORT, JWT_SECRET)
  types/express.d.ts      # req.user, req.tenantId, req.tenantRole augmentation
  db/
    index.ts             # Drizzle + pg Pool
    schema/              # tenants, users, posts, memberships
    migrations/          # Drizzle SQL
  modules/
    auth/
      auth.schema.ts     # registerSchema, loginSchema
      auth.service.ts    # registerUser (tx), loginUser (bcrypt + jwt)
      auth.controller.ts # registerController, loginController
      auth.routes.ts     # POST /register, POST /login
      auth.test.routes.ts# GET /me (auth + tenant guard)
    tenants/             # schema, service, controller, routes (POST /)
    posts/
      post.schema.ts     # title, slug /^[a-z0-9-]+$/, content, published
      post.service.ts    # createPost, getPosts(tenantId)
      post.controller.ts # createPostController, getPostsController
      post.routes.ts     # POST /, GET / (both guarded)
  middleware/
    auth.ts              # Bearer JWT verify → req.user
    tenant.ts            # membership lookup → req.tenantId/role
docker-compose.yml       # postgres:16-alpine, db: tenant_blog
drizzle.config.ts        # schema: ./src/db/schema/index.ts
```

## Data Model (brief)

- **tenants** (`id, name, slug unique, created_at`)
- **users** (`id, name, email unique, password_hash, created_at`)
- **memberships** (`id, user_id → users, tenant_id → tenants, role, created_at`)
- **posts** (`id, tenant_id → tenants, author_id → users, title, slug, content, published, created_at, updated_at`)

> Limitation: `tenantMiddleware` picks the user's **first** membership (`limit(1)`). No multi-tenant switching / roles yet.

## Prerequisites

- Node.js 20+ and npm / bun
- Docker + Docker Compose

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

4. Migrate:
   ```bash
   npx drizzle-kit migrate
   # after schema changes:
   npx drizzle-kit generate
   ```

5. Start dev server:
   ```bash
   npm run dev
   # = bunx tsx src/server.ts
   ```
   Server: `http://localhost:3000`

## API Routes + Test Request / Response

Base URL: `http://localhost:3000`

Auth header for guarded routes:
```
Authorization: Bearer <token-from-login>
```

### 1. Register — `POST /api/auth/register`

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
  "user": { "id": "uuid", "name": "Navin", "email": "navin@example.com" },
  "tenant": { "id": "uuid", "name": "Navins Blog", "slug": "navins-blog", "createdAt": "2026-10-03T00:00:00.000Z" },
  "membership": { "id": "uuid", "userId": "uuid", "tenantId": "uuid", "role": "owner", "createAt": "2026-10-03T00:00:00.000Z" }
}
```

**Fail `400`:**
```json
{ "message": "Validation failed", "errors": {} }
```
Causes: bad email, password < 8 chars, `tenantSlug` not `/^[a-z0-9-]+$/`.

### 2. Login — `POST /api/auth/login`

**Test request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "navin@example.com", "password": "password123" }'
```

**Success `200`:**
```json
{
  "message": "Login successful",
  "user": { "id": "uuid", "name": "Navin", "email": "navin@example.com" },
  "token": "eyJhbGciOi..."
}
```

**Fail `400 / 401`:**
```json
{ "message": "Validation failed", "errors": {} }
{ "message": "Invalid email or password" }
```

### 3. Create Tenant — `POST /api/tenants`

**Test request:**
```bash
curl -X POST http://localhost:3000/api/tenants \
  -H "Content-Type: application/json" \
  -d '{ "name": "Acme Blog", "slug": "acme-blog" }'
```

**Success `201`:**
```json
{
  "message": "Tenant created successfully",
  "tenant": { "id": "uuid", "name": "Acme Blog", "slug": "acme-blog", "createdAt": "2026-10-03T00:00:00.000Z" }
}
```

### 4. Create Post (guarded) — `POST /api/posts`

**Test request:**
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "title": "Hello World",
    "slug": "hello-world",
    "content": "First post content",
    "published": true
  }'
```

**Success `201`:**
```json
{
  "message": "Post created successfully",
  "post": {
    "id": "uuid",
    "tenantId": "uuid",
    "authorId": "uuid",
    "title": "Hello World",
    "slug": "hello-world",
    "content": "First post content",
    "published": true,
    "createdAt": "2026-10-03T00:00:00.000Z",
    "updatedAt": "2026-10-03T00:00:00.000Z"
  }
}
```

**Fails:** `400` validation, `401` missing/bad token or no tenant, `403` no membership.

### 5. List Posts (guarded) — `GET /api/posts`

```bash
curl http://localhost:3000/api/posts \
  -H "Authorization: Bearer <TOKEN>"
```

**Success `200`:**
```json
{ "posts": [] }
```

### 6. Auth Check — `GET /api/test/me`

```bash
curl http://localhost:3000/api/test/me \
  -H "Authorization: Bearer <TOKEN>"
```

**Success `200`:**
```json
{
  "message": "You are authenticated",
  "userId": "uuid",
  "tenantId": "uuid",
  "role": "owner"
}
```

## Status / Next Steps

- Tenant switching (multi-membership), role checks (owner/admin/member)
- Post update/delete, slug uniqueness per tenant, pagination
- Global error handler, logout/refresh tokens
- Tests for auth + posts
