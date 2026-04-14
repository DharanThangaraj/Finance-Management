# Finance Chit Fund / Monthly Savings System

A full-stack web app for managing member payments, dues, and reports for a small finance business.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose

## Features

- Admin login with JWT auth
- Member CRUD with monthly due split
- Payment tracking and status updates
- Dashboard stats: total members, collected, pending
- Overdue & current month non-payment lists
- Member payment history
- Clean responsive UI
- MVC folder structure, env-based config, validation, error handling

## Setup

### 1. Install backend dependencies

```bash
cd "c:\Users\dhara\Desktop\React project\Finance website\backend"
npm install
```

### 2. Install frontend dependencies

```bash
cd "c:\Users\dhara\Desktop\React project\Finance website\frontend"
npm install
```

### 3. Configure environment variables

Copy `backend/.env.example` to `backend/.env` and update the values.

### 4. Start MongoDB

Make sure MongoDB is running locally or update `MONGO_URI` with your connection string.

### 5. Run backend

```bash
cd "c:\Users\dhara\Desktop\React project\Finance website\backend"
npm run dev
```

### 6. Run frontend

```bash
cd "c:\Users\dhara\Desktop\React project\Finance website\frontend"
npm run dev
```

### 7. Access the app

Open `http://localhost:3000` in your browser.

## Sample Admin Login

The first admin user is created automatically from the `.env` values when the server starts.

- Email: `ADMIN_EMAIL`
- Password: `ADMIN_PASSWORD`

## API Endpoints

- `POST /api/auth/login`
- `GET /api/members`
- `GET /api/members/:id`
- `POST /api/members`
- `PUT /api/members/:id`
- `DELETE /api/members/:id`
- `GET /api/payments?memberId=...`
- `POST /api/payments`
- `PUT /api/payments/:id`
- `GET /api/dashboard`

## Database Schema

### User
- `name`
- `email`
- `password`
- `role`

### Member
- `name`
- `phone`
- `address`
- `joiningDate`
- `totalAmount`
- `durationMonths`
- `monthlyDue`

### Payment
- `member`
- `monthNumber`
- `amount`
- `status`
- `paidAt`

## Notes

- Keep `JWT_SECRET` secure in production.
- Use `npm run build` inside `frontend` for production deployment.
