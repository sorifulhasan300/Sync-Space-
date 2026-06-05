# SyncSpace - Resource Booking & Scheduling API

A RESTful API for managing resource bookings and scheduling across organizations. Built with TypeScript, Express.js, MongoDB, and JWT.

---

## 🎯 Project Overview

**SyncSpace** is a multi-tenant resource booking management system that enables organizations to:

- Manage resources (rooms, desks, devices)
- Define resource availability schedules
- Create and manage bookings
- Control user access through role-based permissions
- Track resource utilization

**Multi-tenant Architecture**: Each organization (tenant) has isolated data and users.

---

## 🛠️ Tech Stack

### Core

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js 5.x

### Database & ORM

- **Database**: MongoDB (with Mongoose ODM)
- **Connection**: Mongoose 9.x

### Authentication & Security

- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Input Validation**: Zod (Schema validation)
- **Rate Limiting**: express-rate-limit

### API Documentation

- **Swagger/OpenAPI**: swagger-jsdoc + swagger-ui-express
- **HTTP Status**: http-status-codes

### Development Tools

- **Bundler**: esbuild
- **Type Checking**: TypeScript 6.x
- **Dev Runner**: tsx
- **Date Library**: Luxon

### Dependency Management

- **Package Manager**: pnpm

---

## Key Features

- ✅ Multi-tenant architecture (organization isolation)
- ✅ JWT authentication
- ✅ Role-based access (ORG_ADMIN, EMPLOYEE)
- ✅ Resource management (rooms, desks, devices)
- ✅ Booking system with availability
- ✅ Rate limiting
- ✅ Swagger API docs
- ✅ Soft deletes
- ✅ Input validation (Zod)

---

## 📁 Folder Structure

```
src/
├── app/modules/          # Feature modules (auth, resource, booking, etc)
├── config/               # Database, env, swagger config
├── middleware/           # Auth, error handling, rate limiting
├── models/               # Mongoose schemas
├── types/                # TypeScript definitions
├── utils/                # AppError class
├── validations/          # Zod schemas
├── app.ts                # Express setup
└── server.ts             # Server startup
```

---

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/sorifulhasan300/Sync-Space-
cd SyncSpace
```

### Step 2: Install Dependencies

```bash
pnpm install
```

This will install all dependencies listed in `package.json` using pnpm's fast, disk-space efficient package management.

### Step 3: Create Environment File

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Then edit `.env` with your configuration (see [Environment Configuration](#environment-configuration) section).

### Step 4: Verify Setup

```bash
pnpm run dev
```

You should see:

```
Server is running at http://localhost:3000
MongoDB Connected Successfully!

