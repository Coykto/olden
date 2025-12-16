# System Architecture Overview: Olden Forge

---

## 1. Application & Technology Stack

_The core frameworks and languages powering the application._

- **Backend Framework:** Django 5.0+ (Python 3.10+)
  - Full-stack framework handling routing, ORM, admin interface, and server-side rendering
  - *Evolution:* FastAPI/Uvicorn already in dependencies — may be used for future API endpoints if needed for AJAX-heavy features or external integrations

- **Frontend:** Django Templates + Vanilla CSS/JavaScript
  - Server-side rendered HTML with custom styling
  - No JavaScript framework currently
  - *Evolution:* May add HTMX or Alpine.js for enhanced interactivity without full SPA complexity

- **Package Management:** uv
  - Modern Python package manager for fast, reliable dependency resolution

---

## 2. Data & Persistence

_How data is stored and managed._

- **Primary Database:** SQLite
  - File-based database (`db.sqlite3`)
  - Suitable for initial deployment on small hosting
  - *Evolution:* Migrate to PostgreSQL for production when scaling (better concurrency, full-text search, JSON support)

- **Game Data Import:** UnityPy
  - Extracts game assets (JSON data, images) from Unity asset bundles
  - Imported data stored in Django models

- **Media Storage:** Local filesystem (`/media/gamedata/`)
  - Extracted portraits, icons, and other game images
  - *Evolution:* Consider S3-compatible object storage for production if media grows large

---

## 3. Infrastructure & Deployment

_How the application is hosted and deployed._

- **Current:** Local development (`python manage.py runserver`)

- **Planned Initial Deployment:**
  - Small VPS or shared hosting
  - SQLite database (single-file, easy to backup)
  - Static files served by Django or nginx

- **Evolution:**
  - PostgreSQL database
  - nginx + gunicorn/uvicorn for production WSGI/ASGI
  - Consider containerization (Docker) for reproducible deployments

---

## 4. Django App Structure

_Internal organization of the codebase._

- **`config/`** — Django project settings, URLs, WSGI/ASGI config
- **`core/`** — Shared utilities: damage calculator, data reader, asset extractor, combat types
- **`gamedata/`** — Game data models and import management command
- **`hero_builder/`** — Hero builder views, templates, and UI logic

---

## 5. External Services & APIs

_Third-party services the application depends on._

- **None currently** — Self-contained application
- *Evolution:* May add authentication provider (Django Allauth, social auth) if user accounts are needed for build persistence
