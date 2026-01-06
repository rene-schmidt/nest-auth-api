# 🔐 NestJS Authentication & User Management API

A production-ready REST API built with **NestJS**, featuring **JWT authentication**, **refresh token rotation**, **role-based access control (RBAC)**, and **Prisma ORM** with **PostgreSQL**.

This project serves as a clean and scalable backend foundation with secure authentication flows and protected admin endpoints.

---

## 🚀 Features

### Authentication
- JWT access & refresh tokens
- Refresh token rotation
- Secure logout
- Refresh token hashing (stored in database)

### User Management
- User registration & login
- Authenticated user endpoint
- User balance retrieval

### Role-Based Access Control (RBAC)
- USER and ADMIN roles
- Custom @Roles() decorator
- JwtAuthGuard and RolesGuard

### Admin Functionality
- Delete users
- Edit user balances
- Admin-only protected routes

### Database
- Prisma ORM
- PostgreSQL
- Type-safe queries
- Clean schema design

---

## 🧱 Tech Stack

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Passport.js
- JWT
- bcrypt

---

## 📁 Project Structure

```text
src/
├── admin/
│   ├── admin.controller.ts
│   └── admin.service.ts
├── auth/
│   ├── decorators/
│   │   └── roles.decorator.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── auth.controller.ts
│   └── auth.service.ts
├── prisma/
│   ├── prisma.service.ts
│   └── schema.prisma
├── users/
│   ├── users.controller.ts
│   └── users.service.ts
└── main.ts
```

---

## ⚙️ Prerequisites

Make sure you have installed:

- Node.js (v18+ recommended)
- npm
- PostgreSQL
- Git

---

## ⚙️ Environment Variables

Create a .env file in the project root:

DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME  
JWT_ACCESS_SECRET=super_secret_access_key  
JWT_REFRESH_SECRET=super_secret_refresh_key  

---

## 📦 Installation

Clone the repository:

git clone https://github.com/your-username/your-repo.git  
cd your-repo  

Install dependencies:

npm install

---

## 🗄️ Database Setup (Prisma)

Generate Prisma Client:
npx prisma generate

Run database migrations:
npx prisma migrate dev --name init

(Optional) Open Prisma Studio:
npx prisma studio

---

## ▶️ Running the Application

Development mode:
npm run start

Watch mode:
npm run start:dev

Production mode:
npm run start:prod

Server runs on:
http://localhost:3000

---

## 🔑 Authentication Flow

Register a user:
POST /auth/register

Login a user:
POST /auth/login

Authenticated requests:
Authorization: Bearer <access_token>

Refresh tokens:
POST /auth/refresh

Logout:
POST /auth/logout

---

## 📌 API Endpoints

Auth:
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET /auth/me

User:
- GET /user/balance

Admin (ADMIN only):
- DELETE /admin/users/:id
- POST /admin/users/:id/balance

---

## 🧠 Notes

- Passwords are hashed using bcrypt
- Refresh tokens are hashed and stored securely
- Admin routes are protected via JWT + role guards
- Designed as a scalable backend foundation

---

## 📄 License

MIT License
