# Expense Tracker

A full-stack web application for tracking personal expenses, built with a **Go (Gin)** REST API backend and a **React (Vite)** frontend.

---

## Live Demo

| | |
|---|---|
| **Frontend (Live App)** | [expense-tracker-x4y9.vercel.app](https://expense-tracker-x4y9.vercel.app) |
| **Backend API** | [expense-tracker-production-3f7e.up.railway.app](https://expense-tracker-production-3f7e.up.railway.app) |

---

## Screenshots

<p align="center">
  <img src="./screenshots/Screenshot 2026-06-18 013649.png" alt="Login Page" width="45%" />
  <img src="./screenshots/Screenshot 2026-06-18 013758.png" alt="Dashboard" width="45%" />
</p>
<p align="center">
  <img src="./screenshots/Screenshot 2026-06-18 013816.png" alt="Add Expense" width="45%" />
</p>

---

## Features

**Authentication**
- User registration
- User login
- User logout

**Expense Management**
- Add, edit, delete, and view expenses

**Income Management**
- Add, edit, delete, and view income entries

**Categories**
- Manage spending categories: Food, Transport, Shopping, Entertainment, Bills, Healthcare

**Dashboard**
- Summary overview (total income, total expenses, balance)
- Monthly statistics
- Expense distribution chart

**Reports**
- Generate spending/income reports
- Export reports to PDF

---

## Tech Stack

**Frontend**
- React
- Vite
- React Router
- Axios

**Backend**
- Go
- Gin (web framework)
- gin-contrib/cors
- JWT (`golang-jwt` or similar) for authentication

**Database**
- PostgreSQL

**DevOps / Hosting**
- Frontend → Vercel
- Backend → Railway
- Database → Neon

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Authenticate and receive a JWT |
| `POST` | `/auth/logout` | Log the current user out |
| `GET` | `/expenses` | List all expenses for the logged-in user |
| `POST` | `/expenses` | Create a new expense |
| `PUT` | `/expenses/:id` | Update an existing expense |
| `DELETE` | `/expenses/:id` | Delete an expense |
| `GET` | `/income` | List all income entries |
| `POST` | `/income` | Create a new income entry |
| `PUT` | `/income/:id` | Update an income entry |
| `DELETE` | `/income/:id` | Delete an income entry |

---

## Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- Go v1.21+

### Backend setup
```bash
cp .env.example .env     # set DATABASE_URL, JWT_SECRET, PORT
go mod tidy
go run main.go
```

### Frontend setup
```bash
cd frontend
npm install
cp .env.example .env     # set VITE_API_URL to your backend URL
npm run dev
```

---

## Project Structure

```
expense-tracker/
├── frontend/      # React + Vite application
│   ├── src/
│   └── package.json
└── cmd/       # Go (Gin) REST API
    ├── main.go
    
```

---

---



This project is licensed under the [MIT License](LICENSE).
