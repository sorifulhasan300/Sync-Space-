# SyncSpace - Resource Booking & Scheduling Management API

A comprehensive RESTful API for managing resource bookings and scheduling across organizations. Built with TypeScript, Express.js, MongoDB, and JWT authentication.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [Development Approach & Best Practices](#development-approach--best-practices)
- [Folder Structure Explanation](#folder-structure-explanation)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Authentication & Authorization](#authentication--authorization)
- [Troubleshooting](#troubleshooting)

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

## ✨ Key Features

✅ **Multi-Tenant Architecture** - Isolated data per organization
✅ **JWT Authentication** - Secure token-based authentication
✅ **Role-Based Access Control** - ORG_ADMIN and EMPLOYEE roles
✅ **Resource Management** - Create and manage rooms, desks, devices
✅ **Availability Scheduling** - Set availability for each day of week
✅ **Booking System** - Reserve resources with time slots
✅ **Rate Limiting** - Protect API from abuse
✅ **Comprehensive Error Handling** - Standardized error responses
✅ **API Documentation** - Interactive Swagger UI
✅ **Input Validation** - Zod-based schema validation
✅ **Soft Delete** - Logical deletion without data loss

---

## 📁 Project Structure

```
SyncSpace/
├── src/
│   ├── app.ts                    # Express app setup & middleware
│   ├── server.ts                 # Server startup
│   ├── swagger.examples.ts       # Swagger endpoint documentation
│   │
│   ├── app/
│   │   └── modules/              # Feature modules (separated by domain)
│   │       ├── auth/             # Authentication
│   │       │   ├── auth.controller.ts
│   │       │   ├── auth.service.ts
│   │       │   ├── auth.route.ts
│   │       │   └── auth.validation.ts
│   │       ├── user/             # User management
│   │       ├── organization/     # Organization management
│   │       ├── resource/         # Resource management
│   │       ├── booking/          # Booking management
│   │       └── availability/     # Availability scheduling
│   │
│   ├── config/
│   │   ├── db.ts                 # MongoDB connection
│   │   ├── env.config.ts         # Environment variables with Zod validation
│   │   └── swagger.ts            # Swagger configuration
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT verification & user attachment
│   │   ├── error.middleware.ts   # Global error handler
│   │   ├── not-found.middleware.ts
│   │   ├── rateLimiter.middleware.ts
│   │   └── validateRequest.ts    # Request body validation
│   │
│   ├── models/
│   │   ├── User.ts               # User schema & password hashing
│   │   ├── Organization.ts       # Organization schema
│   │   ├── Resource.ts           # Resource schema
│   │   ├── Booking.ts            # Booking schema
│   │   └── (Availability.ts)     # To be added
│   │
│   ├── types/
│   │   └── index.d.ts            # TypeScript type definitions
│   │
│   ├── utils/
│   │   └── AppError.ts           # Custom error class
│   │
│   ├── validations/
│   │   ├── auth.validation.ts    # Auth DTOs
│   │   ├── booking.validation.ts
│   │   └── organization.validation.ts
│   │
│   ├── constants/                # Application constants
│   └── router/
│       └── router.ts             # Central route aggregator
│
├── .env                          # Environment variables (not in git)
├── .env.example                  # Example env file (in git)
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── README.md                     # This file
└── SWAGGER_GUIDE.md              # Swagger documentation guide

```

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **pnpm** v10+ ([Install](https://pnpm.io/installation))
- **MongoDB Atlas** account ([Sign up](https://www.mongodb.com/cloud/atlas)) or local MongoDB
- **Git** for version control
- **Postman** or **Insomnia** for API testing (optional)

### Verify Installation

```bash
node --version       # v18.x or higher
pnpm --version      # v10.x or higher
git --version
```

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
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
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
# MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dbname
# Local MongoDB: mongodb://localhost:27017/syncspace
DATABASE_URL=mongodb+srv://your_username:your_password@cluster.mongodb.net/?appName=Cluster0

# JWT Configuration
# Must be at least 8 characters long
JWT_SECRET=your_secure_secret_key_min_8_chars
```

### Environment Variables Explanation

| Variable       | Description                                    | Example               |
| -------------- | ---------------------------------------------- | --------------------- |
| `PORT`         | Server port (default: 3000)                    | `3000`                |
| `NODE_ENV`     | Environment mode (development/production/test) | `development`         |
| `DATABASE_URL` | MongoDB connection string                      | `mongodb+srv://...`   |
| `JWT_SECRET`   | Secret key for JWT signing (min 8 chars)       | `your_secret_key_123` |

### Setting Up MongoDB Connection

#### Option A: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string from "Connect" button
4. Replace username and password in `DATABASE_URL`

#### Option B: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use: `mongodb://localhost:27017/syncspace`

---

## 🏃 Running the Project

### Development Mode (with auto-reload)

```bash
pnpm run dev
```

Uses `tsx` with watch mode for hot-reload during development.

### Production Build

```bash
# Build TypeScript to JavaScript
pnpm run build

# Start production server
node dist/server.js
```

### Verify Server is Running

```bash
curl http://localhost:3000/test
```

Expected response:

```json
{
  "status": "success",
  "message": "Server is running and Database connection is verified!",
  "timestamp": "2024-12-20T10:30:00.000Z"
}
```

---

## 📚 API Documentation

### Access Swagger UI

Once server is running, visit:

```
http://localhost:3000/api-docs
```

Swagger UI provides:

- Interactive API documentation
- Try-it-out feature to test endpoints
- Request/response schemas
- Error responses

### API Base URL

```
http://localhost:3000/api/v1
```

### Authentication Header

All protected routes require JWT token in Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

---

## 🎓 Development Approach & Best Practices

### 1. **Modular Architecture (Domain-Driven Design)**

Each feature is organized in a dedicated module under `src/app/modules/`:

```
auth/
├── auth.controller.ts    # HTTP request handlers
├── auth.service.ts       # Business logic
├── auth.route.ts         # Route definitions
└── auth.validation.ts    # Input validation schemas
```

**Benefits:**

- Easy to navigate and maintain
- Clear separation of concerns
- Scalable for adding new features
- Self-contained modules

### 2. **Three-Layer Architecture**

```
Route → Controller → Service → Database
```

- **Route Layer**: Defines endpoints and applies middleware
- **Controller Layer**: Handles HTTP requests/responses
- **Service Layer**: Contains business logic
- **Database Layer**: MongoDB/Mongoose interactions

### 3. **Error Handling Strategy**

Use the custom `AppError` class for consistent error responses:

```typescript
import { AppError } from "../utils/AppError";
import { StatusCodes } from "http-status-codes";

// Throw errors with proper status codes
throw new AppError("User not found", StatusCodes.NOT_FOUND);
```

All errors are caught by the global error handler middleware and return standardized responses.

### 4. **Authentication & Authorization**

**Authentication Flow:**

1. User registers with email, password, and organization (tenant)
2. Password hashed with bcrypt and stored in database
3. On login, JWT token is generated with user info
4. Token sent in `Authorization: Bearer <token>` header
5. `authMiddleware` verifies token and attaches user info to request

**Authorization:**

- `authMiddleware`: Verifies authentication
- `roleMiddleware`: Checks user role (ORG_ADMIN, EMPLOYEE)

### 5. **Input Validation**

Use Zod for type-safe schema validation:

```typescript
import { z } from "zod";

const CreateResourceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["ROOM", "DESK", "DEVICE"]),
  bufferTime: z.number().default(0),
});
```

### 6. **Multi-Tenancy**

Every operation is scoped to a tenant (organization):

```typescript
// Always filter by tenantId
const resources = await Resource.find({
  tenantId: user.tenantId,
  isDeleted: false,
});
```

### 7. **Soft Deletes**

Data is never permanently deleted, only marked as deleted:

```typescript
// Mark as deleted, don't remove from database
await Resource.findByIdAndUpdate(id, { isDeleted: true });

// Always exclude deleted records in queries
const resources = await Resource.find({ isDeleted: false });
```

---

## 📂 Folder Structure Explanation

### `src/app/modules/`

Each module represents a business domain with MVC-like pattern:

```
auth/
├── auth.controller.ts    - Handles HTTP requests from routes
├── auth.service.ts       - Contains business logic and DB operations
├── auth.route.ts         - Express router with endpoint definitions
└── auth.validation.ts    - Zod schemas for request validation
```

**Why this structure?**

- **Cohesion**: Related code is grouped together
- **Independence**: Each module can be developed independently
- **Reusability**: Services can be reused in controllers
- **Testability**: Easy to unit test services

### `src/config/`

Application configuration files:

```
db.ts          - MongoDB connection setup
env.config.ts  - Environment variables with Zod validation
swagger.ts     - API documentation configuration
```

### `src/middleware/`

Express middleware for cross-cutting concerns:

```
auth.middleware.ts           - JWT verification
error.middleware.ts          - Global error handler
not-found.middleware.ts      - 404 handler
rateLimiter.middleware.ts    - Rate limiting
validateRequest.ts           - Request validation middleware
```

### `src/models/`

Mongoose schemas for database collections:

```
User.ts          - User schema with password hashing
Organization.ts  - Organization (tenant) schema
Resource.ts      - Resource schema
Booking.ts       - Booking schema
```

Each model includes:

- Interface definition
- Schema definition
- Indexes for performance
- Custom methods (e.g., comparePassword)

### `src/utils/`

Utility functions and custom classes:

```
AppError.ts  - Custom error class extending Error
```

---

## 💾 Database Schema

### User Collection

```typescript
{
  _id: ObjectId,
  tenantId: ObjectId,        // Reference to Organization
  email: String,             // Unique per tenant
  password: String,          // Hashed with bcrypt
  name: String,
  role: "ORG_ADMIN" | "EMPLOYEE",
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `tenantId + email` (unique)

### Organization Collection

```typescript
{
  _id: ObjectId,
  name: String,
  email: String,
  status: "active" | "inactive",
  createdAt: Date,
  updatedAt: Date
}
```

### Resource Collection

```typescript
{
  _id: ObjectId,
  tenantId: ObjectId,        // Scoped to organization
  name: String,              // Unique per tenant
  type: "ROOM" | "DESK" | "DEVICE",
  bufferTime: Number,        // Minutes between bookings
  isDeleted: Boolean,        // Soft delete flag
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `tenantId + name` (unique)
- `tenantId + isDeleted`

### Booking Collection

```typescript
{
  _id: ObjectId,
  resourceId: ObjectId,      // Reference to Resource
  userId: ObjectId,          // Reference to User
  tenantId: ObjectId,        // Scoped to organization
  startTime: Date,
  endTime: Date,
  status: "PENDING" | "CONFIRMED" | "CANCELLED",
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Availability Collection

```typescript
{
  _id: ObjectId,
  resourceId: ObjectId,      // Reference to Resource
  tenantId: ObjectId,        // Scoped to organization
  dayOfWeek: "MONDAY" | "TUESDAY" | ... | "SUNDAY",
  startTime: String,         // "09:00" format
  endTime: String,           // "17:00" format
  isAvailable: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔗 API Endpoints

### Authentication

```http
POST   /api/v1/auth/register     - Register new user
POST   /api/v1/auth/login        - Login and get JWT token
```

### Resources

```http
POST   /api/v1/resource          - Create resource (Auth required)
GET    /api/v1/resource          - Get all resources (Auth required)
DELETE /api/v1/resource/:id      - Delete resource (Auth required)
```

### Availability

```http
POST   /api/v1/availability      - Set availability (Auth required)
GET    /api/v1/availability      - Get availability (Auth required)
```

### Bookings

```http
POST   /api/v1/booking           - Create booking (Auth required)
GET    /api/v1/booking           - Get bookings (Auth required)
```

### Organizations

```http
POST   /api/v1/organizations     - Create organization
GET    /api/v1/organizations/:id - Get organization details
```

### Users

```http
GET    /api/v1/users             - Get all users (Auth required)
GET    /api/v1/users/:id         - Get user details (Auth required)
```

---

## ⚠️ Error Handling

All errors return standardized JSON response:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Error description",
  "stack": "Error stack trace (only in development)"
}
```

### Common Status Codes

| Code  | Meaning               | Example                  |
| ----- | --------------------- | ------------------------ |
| `200` | OK                    | Request successful       |
| `201` | Created               | Resource created         |
| `400` | Bad Request           | Invalid input            |
| `401` | Unauthorized          | Missing/invalid token    |
| `403` | Forbidden             | Insufficient permissions |
| `404` | Not Found             | Resource doesn't exist   |
| `429` | Too Many Requests     | Rate limit exceeded      |
| `500` | Internal Server Error | Server error             |

### Global Error Handler

All errors thrown with `AppError` are automatically caught and handled by `globalErrorHandler` middleware. No try-catch needed in most cases.

---

## 🔐 Authentication & Authorization

### JWT Token Structure

Token contains encoded payload:

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "tenantId": "507f1f77bcf86cd799439012",
  "role": "EMPLOYEE",
  "iat": 1703078400,
  "exp": 1703164800
}
```

### Token Expiration

- Default: 24 hours
- Configurable in auth.service.ts

### Role-Based Access

```typescript
// Protect routes by role
app.delete("/admin-only", authMiddleware, roleMiddleware("ORG_ADMIN"), handler);
```

### Multi-Tenancy Security

- All queries automatically scoped to `req.user.tenantId`
- Users can only see data from their organization
- Even with valid JWT, users cannot access other tenants' data

---

## 🐛 Troubleshooting

### Issue: "Database connection failed"

**Solution:**

- Check `DATABASE_URL` in `.env`
- Verify MongoDB Atlas cluster is running
- Check network access in Atlas (whitelist your IP)
- Test connection with MongoDB Compass

### Issue: "JWT_SECRET must be at least 8 characters"

**Solution:**

- Set longer `JWT_SECRET` in `.env`
- Example: `JWT_SECRET=your_super_secure_secret_key_123`

### Issue: Port 3000 already in use

**Solution:**

```bash
# Change PORT in .env
PORT=5000

# Or kill process using port 3000
# On Windows: netstat -ano | findstr :3000
# On Mac/Linux: lsof -i :3000
```

### Issue: "Cannot POST /api/v1/resource" or "Cannot GET /api/v1/resource"

**Solution:**

- Verify route is registered in `src/router/router.ts`
- Check if module route file exports routes correctly
- Ensure route path is correct in controller

### Issue: "401 Unauthorized"

**Solution:**

- Include JWT token in `Authorization` header
- Token format: `Authorization: Bearer <token>`
- Ensure token hasn't expired (24 hours from creation)

### Issue: "403 Forbidden"

**Solution:**

- User doesn't have required role
- Check `roleMiddleware` settings on route
- Verify user role in database

### Issue: TypeScript compilation errors

**Solution:**

```bash
# Check TypeScript version
pnpm run build

# Fix any type errors shown in output
# Ensure all imports are correct
```

---

## 📖 Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [Zod Validation](https://zod.dev/)
- [OpenAPI/Swagger Specification](https://swagger.io/specification/)

---

## 📝 Building the Project - Step-by-Step Approach

### 1. **Planning Phase**

Before writing code:

- Define data models and relationships
- Plan API endpoints and request/response schemas
- Design database schema with indexes
- Plan middleware and authentication flow

### 2. **Setup Phase**

- Initialize project with TypeScript and Express
- Setup database connection
- Configure environment variables
- Setup middleware (CORS, JSON, error handling)

### 3. **Feature Development (per module)**

For each feature:

```
1. Create Models (Database Schema)
   └─ Define Mongoose schema
   └─ Add indexes for performance

2. Create Validation Schemas (Zod)
   └─ Define input validation rules

3. Create Service (Business Logic)
   └─ Query database
   └─ Apply business rules
   └─ Throw AppError for failures

4. Create Controller (HTTP Handler)
   └─ Call service
   └─ Handle response/errors
   └─ Return standardized JSON

5. Create Routes
   └─ Define endpoints
   └─ Apply middleware (auth, validation)
   └─ Connect to controller

6. Document with Swagger
   └─ Add JSDoc comments
   └─ Define request/response schemas
```

### 4. **Integration Phase**

- Register routes in `router.ts`
- Test endpoints with Postman/Insomnia
- Verify authentication and authorization
- Check error handling

### 5. **Documentation Phase**

- Document API endpoints
- Add inline code comments
- Update README
- Create usage examples

### 6. **Testing Phase**

- Manual API testing
- Edge case testing
- Error scenario testing
- Multi-tenant isolation testing

### 7. **Deployment Preparation**

- Set production environment variables
- Build TypeScript to JavaScript
- Test production build
- Setup CI/CD pipeline

---

## 🔄 Typical Workflow

When adding a new feature:

1. **Create Model** in `src/models/`
2. **Create Validation** in `src/validations/`
3. **Create Service** in `src/app/modules/feature/feature.service.ts`
4. **Create Controller** in `src/app/modules/feature/feature.controller.ts`
5. **Create Routes** in `src/app/modules/feature/feature.route.ts`
6. **Register Routes** in `src/router/router.ts`
7. **Add Swagger Documentation** in `src/swagger.examples.ts`
8. **Test Endpoints** using Swagger UI or Postman

---

## 📞 Support & Questions

For issues or questions:

1. Check the Troubleshooting section above
2. Review API documentation in Swagger UI
3. Check error messages in console output
4. Verify environment variables are set correctly

---

## 📄 License

ISC License - See LICENSE file for details

---

**Last Updated**: December 2024
**Version**: 1.0.0
