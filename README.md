# Multi-Tenant Feature Flag Management System

A SaaS-like feature flag system with 3 React frontends and a shared Node.js/Express/MongoDB backend.

## Project Structure

```
byepo-feature-flags/
├── backend/                  → Express API (port 5000)
├── frontend-superadmin/      → Super Admin App (port 3001)
├── frontend-admin/           → Org Admin App (port 3002)
└── frontend-user/            → End User App (port 3003)
```

## Prerequisites

- Node.js v18+
- MongoDB running locally on port 27017

## Setup Environment
cd backend
cp .env.example .env
# Fill in your values in .env


## Quick Start

Open **4 separate terminals** and run each:

### Terminal 1 — Backend
```bash
cd backend
npm install
npm run dev
```

### Terminal 2 — Super Admin App
```bash
cd frontend-superadmin
npm install
npm run dev
# → http://localhost:3001
```

### Terminal 3 — Admin App
```bash
cd frontend-admin
npm install
npm run dev
# → http://localhost:3002
```

### Terminal 4 — User App
```bash
cd frontend-user
npm install
npm run dev
# → http://localhost:3003
```

---

## Credentials & Flow

### 1. Super Admin Login
- URL: http://localhost:3001
- Email: `superadmin@system.com`
- Password: `SuperAdmin@123`
- Create organizations (e.g., "ABC Company")

### 2. Organization Admin
- URL: http://localhost:3002/signup
- Fill: Name, Email, Password, select "ABC Company"
- Login and manage feature flags (create `dark_mode`, toggle, delete)

### 3. End User
- URL: http://localhost:3003
- Select org from dropdown (e.g., "ABC Company")
- Enter feature key (e.g., `dark_mode`)
- Click "Check Feature" → see ENABLED / DISABLED

---

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/superadmin/login` | None | Super Admin login |
| POST | `/api/auth/admin/signup` | None | Admin signup |
| POST | `/api/auth/admin/login` | None | Admin login |
| GET | `/api/organizations/public` | None | List org names (signup dropdown) |
| POST | `/api/organizations` | Super Admin JWT | Create org |
| GET | `/api/organizations` | Super Admin JWT | List all orgs |
| POST | `/api/flags` | Org Admin JWT | Create flag |
| GET | `/api/flags` | Org Admin JWT | List flags for org |
| PATCH | `/api/flags/:id` | Org Admin JWT | Toggle/update flag |
| DELETE | `/api/flags/:id` | Org Admin JWT | Delete flag |
| GET | `/api/flags/check?orgName=X&key=Y` | None | Check flag (end user) |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Database | MongoDB (Mongoose) |
| Frontend | React 18, Vite |
| UI | Material UI (MUI v6) |
| HTTP | Axios |
| Routing | React Router v6 |
