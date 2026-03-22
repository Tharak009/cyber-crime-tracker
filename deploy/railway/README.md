# Railway Deployment Guide

This repo is set up for a 3-service Railway project:

- `mysql`: Railway MySQL database service
- `backend`: Spring Boot web service from [`/backend`](../../backend)
- `frontend`: React web service from [`/frontend`](../../frontend)

This is the exact setup these repo files support:

- [`/backend/railway.toml`](../../backend/railway.toml)
- [`/frontend/railway.toml`](../../frontend/railway.toml)
- [`backend.variables.example`](./backend.variables.example)
- [`frontend.variables.example`](./frontend.variables.example)

## Before You Start

1. Push this repo to GitHub.
2. Create or sign in to your Railway account.
3. Open Railway and click `New Project`.

## Service 1: MySQL

1. In the project canvas, click `+ New`.
2. Choose `Database` and then `MySQL`.
3. Let Railway create the service.
4. Rename the service to exactly:

```text
mysql
```

That exact name matters because the backend variable references use `${{mysql.*}}`.

Railway's MySQL service provides these variables automatically:

- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQLDATABASE`
- `MYSQL_URL`

## Service 2: Backend

1. Click `+ New`.
2. Choose `Deploy from GitHub Repo`.
3. Select this repository.
4. Rename the service to exactly:

```text
backend
```

5. Open the new `backend` service.
6. Go to `Settings`.
7. Set these values:

- `Root Directory`: `backend`
- `Config as Code File`: `/backend/railway.toml`

Do not add build or start commands manually. The config file and Dockerfile handle that.

### Backend Variables

Open the `Variables` tab for the `backend` service and add these exactly:

```text
DB_URL=jdbc:mysql://${{mysql.MYSQLHOST}}:${{mysql.MYSQLPORT}}/${{mysql.MYSQLDATABASE}}?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=${{mysql.MYSQLUSER}}
DB_PASSWORD=${{mysql.MYSQLPASSWORD}}
JWT_SECRET=replace-with-a-long-random-secret-at-least-64-characters
MAIL_USERNAME=replace-with-your-smtp-username
MAIL_PASSWORD=replace-with-your-smtp-password
FILE_STORAGE_PATH=/app/uploads
```

Do not set `FRONTEND_URL` yet. We add that after the frontend gets its Railway domain.

### Backend Volume

Your app stores uploaded evidence on disk, so attach a volume.

1. In the `backend` service, create a volume.
2. Set the mount path to:

```text
/app/uploads
```

### Backend Public Domain

1. In `backend` -> `Settings` -> `Networking`.
2. Click `Generate Domain`.
3. Wait until Railway gives you a public URL like:

```text
https://backend-production-xxxx.up.railway.app
```

Keep that service running. We use it in the frontend.

## Service 3: Frontend

1. Click `+ New`.
2. Choose `Deploy from GitHub Repo`.
3. Select the same repository.
4. Rename the service to exactly:

```text
frontend
```

5. Open the new `frontend` service.
6. Go to `Settings`.
7. Set these values:

- `Root Directory`: `frontend`
- `Config as Code File`: `/frontend/railway.toml`

The Railway config file handles build/start commands for this service.

### Frontend Variables

Open the `Variables` tab for the `frontend` service and add this exactly:

```text
VITE_API_BASE_URL=https://${{backend.RAILWAY_PUBLIC_DOMAIN}}
```

### Frontend Public Domain

1. In `frontend` -> `Settings` -> `Networking`.
2. Click `Generate Domain`.
3. Wait for Railway to give you a frontend URL like:

```text
https://frontend-production-xxxx.up.railway.app
```

## Final Backend Variable

Now go back to the `backend` service and add this variable:

```text
FRONTEND_URL=https://${{frontend.RAILWAY_PUBLIC_DOMAIN}}
```

This is required for backend CORS.

## Deploy Order

Once variables are in place, deploy or redeploy in this order:

1. `mysql`
2. `backend`
3. `frontend`
4. `backend` again after setting `FRONTEND_URL`

## Screen-by-Screen Checklist

### MySQL screen

- Create MySQL database
- Rename service to `mysql`

### Backend service settings screen

- Source: GitHub repo
- Root Directory: `backend`
- Config as Code File: `/backend/railway.toml`
- Generate Domain: yes
- Add Volume: `/app/uploads`

### Backend variables screen

Paste:

```text
DB_URL=jdbc:mysql://${{mysql.MYSQLHOST}}:${{mysql.MYSQLPORT}}/${{mysql.MYSQLDATABASE}}?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=${{mysql.MYSQLUSER}}
DB_PASSWORD=${{mysql.MYSQLPASSWORD}}
JWT_SECRET=replace-with-a-long-random-secret-at-least-64-characters
MAIL_USERNAME=replace-with-your-smtp-username
MAIL_PASSWORD=replace-with-your-smtp-password
FILE_STORAGE_PATH=/app/uploads
```

Later add:

```text
FRONTEND_URL=https://${{frontend.RAILWAY_PUBLIC_DOMAIN}}
```

### Frontend service settings screen

- Source: GitHub repo
- Root Directory: `frontend`
- Config as Code File: `/frontend/railway.toml`
- Generate Domain: yes

### Frontend variables screen

Paste:

```text
VITE_API_BASE_URL=https://${{backend.RAILWAY_PUBLIC_DOMAIN}}
```

## Smoke Test After Deploy

Check these in order:

1. Open the frontend Railway URL.
2. Open login and register pages.
3. Register a citizen user.
4. Log in as admin:

```text
admin@cybercrime.local
Admin@123
```

5. Create a complaint as a citizen.
6. Assign that complaint as admin.
7. Log in as an officer and verify the case appears.

## Troubleshooting

### Frontend loads but API calls fail

Check:

- `VITE_API_BASE_URL` points to `${{backend.RAILWAY_PUBLIC_DOMAIN}}`
- backend has a generated domain
- backend deployment is healthy

### Browser shows CORS errors

Check:

- backend has `FRONTEND_URL=https://${{frontend.RAILWAY_PUBLIC_DOMAIN}}`
- backend was redeployed after adding `FRONTEND_URL`

### Uploads fail or disappear

Check:

- backend volume exists
- mount path is `/app/uploads`
- `FILE_STORAGE_PATH=/app/uploads`

### Backend fails healthcheck

Check:

- backend domain is generated
- `/actuator/health` returns `200`
- MySQL service is healthy

## Important Note

This Railway setup is practical and exact for this repo, but it is not the cheapest possible frontend hosting option. If you later want to reduce Railway usage, we can move the frontend to Railway Static Hosting or another static host while keeping the same backend.
