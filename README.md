# HydroGuard

Smart Water Monitoring & Management System.

Stack: React + Vite, Spring Boot, Supabase PostgreSQL, Arduino/ESP32 IoT layer.

Folders:
- frontend/ — React web application
- backend/ — Spring Boot REST API
- database/ — Supabase SQL schema
- docs/ — architecture and API notes

## Current MVP

- Responsive React dashboard, monitoring, history, alerts, settings and login screens.
- Frontend API service with demo fallback data when the backend is not running.
- Spring Boot REST API with in-memory system status, readings, alerts, settings and pump controls.
- Supabase schema and seed files remain available for the next persistence phase.

## Run locally

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
mvn spring-boot:run
```

If Maven is not on your system `PATH`, use the portable Maven installed in this repo:

```powershell
$env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-17.0.20.8-hotspot"
$env:Path="$env:JAVA_HOME\bin;..\tools\apache-maven-3.9.11\bin;$env:Path"
..\tools\apache-maven-3.9.11\bin\mvn.cmd spring-boot:run
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- API base: `http://localhost:8080/api`

Create `frontend/.env` if you need a different backend URL:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```
