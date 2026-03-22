# Cyber Crime Reporting & Case Tracking System

Full-stack application with:

- `backend/`: Java 17, Spring Boot 3, Spring Security 6, JWT, JPA, MySQL, Mail, WebSocket
- `frontend/`: React 18, Vite, Tailwind CSS, Axios, React Router, Chart.js

## Features

- Citizen registration, login, profile, password reset, email verification flow
- Complaint reporting, case tracking, evidence uploads, notifications
- Officer case assignment, status updates, investigation notes
- Admin statistics, user/officer management, announcements, report export
- Audit logging, feedback, support ticketing

## Local Development

### Backend

1. Install Java 17 and Maven.
2. Create environment values using [`backend/.env.example`](./backend/.env.example).
3. From `backend/` run:

```bash
mvn spring-boot:run
```

Default seeded admin:

- Email: `admin@cybercrime.local`
- Password: `Admin@123`

Main API base URL:

- `http://localhost:8081`

Swagger UI:

- `http://localhost:8081/swagger-ui/index.html`

### Frontend

1. Install Node.js 18+.
2. Create environment values using [`frontend/.env.example`](./frontend/.env.example).
3. From `frontend/` run:

```bash
npm install
npm run dev
```

Frontend URL:

- `http://localhost:5173`

## Practical Deployment With Docker Compose

This is the most practical deployment path for a VPS or local production-style setup.

### What You Get

- `mysql`: MySQL 8 database
- `backend`: Spring Boot application
- `frontend`: Nginx serving the built React app
- frontend requests proxied through `/api`
- WebSocket proxied through `/api/ws`
- persistent Docker volumes for:
  - MySQL data
  - uploaded evidence files

### Files Added For Deployment

- [`docker-compose.yml`](./docker-compose.yml)
- [`backend/Dockerfile`](./backend/Dockerfile)
- [`backend/.dockerignore`](./backend/.dockerignore)
- [`frontend/Dockerfile`](./frontend/Dockerfile)
- [`frontend/nginx.conf`](./frontend/nginx.conf)
- [`frontend/.dockerignore`](./frontend/.dockerignore)
- [`.env.docker.example`](./.env.docker.example)

### One-Time Setup

1. Copy the Docker env template:

```bash
cp .env.docker.example .env
```

2. Edit `.env` and set at minimum:

- `DB_USERNAME`
- `DB_PASSWORD`
- `MYSQL_ROOT_PASSWORD`
- `JWT_SECRET`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `FRONTEND_URL`

Recommended production value:

- `FRONTEND_URL=https://your-domain.com`

### Start The Whole Stack

From the project root:

```bash
docker compose up --build -d
```

### Access

- Frontend: `http://your-server-ip`
- Backend API: `http://your-server-ip:8081`
- Swagger UI: `http://your-server-ip:8081/swagger-ui/index.html`

### Stop

```bash
docker compose down
```

### Reset Data

This removes containers and volumes, including MySQL data and uploaded files:

```bash
docker compose down -v
```

## Deployment Notes

- The frontend is built with `VITE_API_BASE_URL=/api` inside Docker, so browser traffic stays same-origin through Nginx.
- Nginx proxies:
  - `/api/*` to the Spring Boot backend
  - `/api/ws` to the Spring WebSocket endpoint
- The backend uses environment-driven configuration for:
  - database URL and credentials
  - JWT secret
  - mail credentials
  - frontend URL
  - upload storage path
- Uploaded evidence is stored in the Docker volume mounted at `/app/uploads`.

## Production Checklist

- Replace placeholder mail settings with real SMTP credentials.
- Use a strong `JWT_SECRET`.
- Set `FRONTEND_URL` to your real domain.
- Put the server behind HTTPS with a reverse proxy or cloud load balancer.
- Restrict direct exposure of port `8081` if you only want public traffic through Nginx.
- Consider replacing `spring.jpa.hibernate.ddl-auto=update` with proper DB migrations for long-term production use.

## Notes

- `schema.sql` documents the main MySQL schema.
- JPA `ddl-auto=update` keeps entities synchronized during development.
- WebSocket endpoint is exposed internally at `/ws` and proxied publicly through `/api/ws` in Docker deployment.

## Beginner-Friendly Oracle Cloud Deployment

If you want the easiest beginner Oracle deployment, use:

- one Oracle Cloud Always Free Ubuntu VM
- MySQL on the same VM
- Spring Boot backend as a `systemd` service
- React frontend built and served by Nginx

Oracle-specific files added for this setup:

- [`deploy/oracle/README.md`](./deploy/oracle/README.md)
- [`deploy/oracle/backend.env.example`](./deploy/oracle/backend.env.example)
- [`deploy/oracle/systemd/cybercrime-backend.service`](./deploy/oracle/systemd/cybercrime-backend.service)
- [`deploy/oracle/nginx/cybercrime.conf`](./deploy/oracle/nginx/cybercrime.conf)
- [`frontend/.env.oracle.example`](./frontend/.env.oracle.example)

This is easier than splitting the frontend and backend across multiple free services because:

- one server
- one IP address
- simpler file upload handling
- simpler WebSocket routing
- simpler MySQL setup for a beginner

## Beginner-Friendly Railway Deployment

If you prefer Railway, this repo now includes Railway-specific setup files for an exact 3-service deployment:

- `mysql` database service
- `backend` web service
- `frontend` web service

Files added for Railway:

- [`backend/railway.toml`](./backend/railway.toml)
- [`frontend/railway.toml`](./frontend/railway.toml)
- [`deploy/railway/README.md`](./deploy/railway/README.md)
- [`deploy/railway/backend.variables.example`](./deploy/railway/backend.variables.example)
- [`deploy/railway/frontend.variables.example`](./deploy/railway/frontend.variables.example)

Follow the step-by-step guide here:

- [`deploy/railway/README.md`](./deploy/railway/README.md)
