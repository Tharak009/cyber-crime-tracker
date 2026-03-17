# Cyber Crime Reporting & Case Tracking System

Full-stack application scaffold with:

- `backend/`: Java 17, Spring Boot 3, Spring Security 6, JWT, JPA, MySQL, Mail, WebSocket
- `frontend/`: React 18, Vite, Tailwind CSS, Axios, React Router, Chart.js

## Features

- Citizen registration, login, profile, password reset, email verification flow
- Complaint reporting, case tracking, evidence uploads, notifications
- Officer case assignment, status updates, investigation notes
- Admin statistics, user/officer management, announcements, report export
- Audit logging, feedback, support ticketing

## Backend Run

1. Install Java 17 and Maven.
2. Create MySQL database access matching `backend/src/main/resources/application.yml`.
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

## Frontend Run

1. Install Node.js 18+.
2. From `frontend/` run:

```bash
npm install
npm run dev
```

Frontend URL:

- `http://localhost:5173`

## Notes

- File uploads are stored under the backend `uploads/` directory by default.
- Email settings use placeholder SMTP values and should be replaced with real credentials.
- WebSocket endpoint is exposed at `/ws`.
- `schema.sql` documents the main MySQL schema, while JPA `ddl-auto=update` keeps entities synchronized during development.
