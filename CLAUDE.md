# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DNA-Tools is a full-stack character database/wiki application with a **Next.js 16** frontend and **Spring Boot 3.5** backend. It manages character data (stats, skills, introns, passive upgrades, consonance weapons) with admin CRUD and a public browsing interface.

## Development Commands

### Frontend (`frontend/`)
```bash
npm run dev       # Dev server on port 3000
npm run build     # Production build
npm run start     # Production server
npm run lint      # ESLint (eslint command directly, no args needed)
```

### Backend (`backend/dna-tools-api/`)
```bash
./gradlew bootRun   # Dev server on port 8080
./gradlew build     # Build JAR (includes tests)
./gradlew test      # Run JUnit tests only
```

### Database
```bash
docker-compose up   # MySQL 8.0 on port 3306 (db: dna, user: dna_user)
```
Schema is managed manually via `Script.sql` (Hibernate ddl-auto: none).

## Architecture

### Monorepo Layout
- `frontend/` — Next.js App Router (React 19, TypeScript strict, Tailwind CSS 4)
- `backend/dna-tools-api/` — Spring Boot (Java 21, Gradle, JPA/Hibernate, Spring Security)
- `docker-compose.yml` — MySQL 8.0 container

### Frontend Architecture
- **App Router** with route groups: `(main)/` for authenticated pages, `(public)/` for login
- **Co-location pattern**: Route-specific components live next to their pages in `_components/` or `_form/` folders
- **API proxy**: `/api/*` requests are rewritten to `http://localhost:8080/*` via `next.config.ts`
- **Path alias**: `@/*` maps to frontend root. Use relative imports for co-located files, `@/` for cross-cutting.
- **Key directories**:
  - `app/` — Routes, pages, and co-located components (`_components/`, `_form/`)
  - `components/ui/` — Shared UI primitives (FormInput, FilterBar, StatCard, etc.)
  - `api/` — Backend API call functions (server actions and fetch wrappers)
  - `domains/` — TypeScript types, form interfaces, field definitions, domain logic
  - `config/` — Constants (navigation, options, labels, filters, element styles)
  - `lib/` — General utilities

### Backend Architecture (Domain-Driven)
Each feature domain (`domain/admin/`, `domain/character/`, `domain/common/`, `domain/image/`) follows a layered pattern:
- `controller/` → `service/` → `repository/` → `entity/`
- `dto/` for request/response objects, `mapper/` for entity-to-DTO conversion

### API Routes
- **Public**: `GET /api/characters`, `GET /api/characters/{slug}`
- **Admin** (JWT via httpOnly cookie `admin_token`): `POST/PUT/DELETE /lee/characters/*`, `POST /lee/images/upload`, `POST /lee/signin`, `POST /lee/signout`, `GET /lee/me`

### Auth Flow
JWT (HS256, 1hr expiry) stored in httpOnly cookie. Frontend checks session via `getAdminMe()` server action. Spring Security filter chain with `JwtAuthenticationFilter`.

### Label/Code System
`CommonCodeLabelService` provides centralized code-to-label mapping (elements, weapons, features, stats). Labels are injected into API responses via `LabelContext`.

### Scheduled Jobs
`OrphanImageCleanupJob` runs hourly to delete uploaded images not linked to any character after 1 hour.

## Key Conventions
- Commit messages are in Korean
- Character `slug` field is the URL identifier and must be unique
- Images are stored at a configured filesystem path and served via `/images/**` endpoint
- Database schema changes are done manually in SQL, not via Hibernate auto-DDL
