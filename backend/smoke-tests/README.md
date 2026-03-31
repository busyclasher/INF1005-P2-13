# Backend smoke tests

Quick scripts to verify the PHP API is reachable and returning valid JSON.

## Prereqs

- Start MySQL and create/import the DB schema your project expects.
- Create `backend/.env` from `backend/.env.example` and fill in DB credentials.
- Start the backend server from the project root:

```bash
php -S localhost:8000 -t backend
```

Your API base should be:

- `http://localhost:8000/api`

## PowerShell (Windows)

From the project root:

```powershell
.\backend\smoke-tests\smoke.ps1 -ApiBase "http://localhost:8000/api"
```

## Bash (macOS/Linux/Git Bash)

From the project root:

```bash
API_BASE="http://localhost:8000/api" bash backend/smoke-tests/smoke.sh
```

## Optional: Postman

Import `backend/smoke-tests/postman_collection.json`, then set a collection variable:

- `apiBase` = `http://localhost:8000/api`

