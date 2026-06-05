# Development Guide - SyncSpace

This document provides guidelines for developing features and maintaining code quality in the SyncSpace project.

## Table of Contents

- [Code Organization](#code-organization)
- [Creating a New Feature](#creating-a-new-feature)
- [Naming Conventions](#naming-conventions)
- [Error Handling](#error-handling)
- [Database Operations](#database-operations)
- [API Design](#api-design)
- [Testing Endpoints](#testing-endpoints)
- [Code Review Checklist](#code-review-checklist)
- [Common Patterns](#common-patterns)

---

## Code Organization

### Module Structure

Every feature module should follow this structure:

```
modules/feature-name/
├── feature-name.controller.ts    # HTTP request handlers
├── feature-name.service.ts       # Business logic and DB queries
├── feature-name.route.ts         # API endpoint definitions
├── feature-name.validation.ts    # Input validation schemas
└── (feature-name.interface.ts)   # Optional: TypeScript interfaces
```

### File Naming Convention

- Controllers: `*.controller.ts`
- Services: `*.service.ts`
- Routes: `*.route.ts`
- Validations: `*.validation.ts`
- Models: `*.ts` (in models folder)
- Middleware: `*.middleware.ts`

---

## Creating a New Feature

### Step 1: Create the Model

**File: `src/models/YourFeature.ts`**

```typescript
import { Schema, model, Document } from "mongoose";

export interface IYourFeature extends Document {
  tenantId: Schema.Types.ObjectId;
  field1: string;
  field2: number;
  isDeleted: boolean;
}

const YourFeatureSchema = new Schema<IYourFeature>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    field1: { type: String, required: true },
    field2: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Add indexes for common queries
YourFeatureSchema.index({ tenantId: 1, field1: 1 }, { unique: true });
YourFeatureSchema.index({ tenantId: 1, isDeleted: 1 });

export const YourFeature = model<IYourFeature>(
  "YourFeature",
  YourFeatureSchema,
);
```

**Key points:**

- Extend `Document` from Mongoose
- Always include `tenantId` for multi-tenancy
- Include `isDeleted` for soft delete capability
- Add appropriate indexes
- Set `timestamps: true` for createdAt/updatedAt

### Step 2: Create Validation Schema

**File: `src/validations/your-feature.validation.ts`**

```typescript
import { z } from "zod";

export const CreateYourFeatureSchema = z.object({
  field1: z.string().min(1, "Field1 is required"),
  field2: z.number().optional().default(0),
});

export const UpdateYourFeatureSchema = CreateYourFeatureSchema.partial();

export type CreateYourFeatureDTO = z.infer<typeof CreateYourFeatureSchema>;
export type UpdateYourFeatureDTO = z.infer<typeof UpdateYourFeatureSchema>;
```

### Step 3: Create Service

**File: `src/app/modules/your-feature/your-feature.service.ts`**

```typescript
import { YourFeature } from "../../../models/YourFeature";
import { AppError } from "../../../utils/AppError";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

export const YourFeatureService = {
  create: async (tenantId: string, data: any) => {
    const tenantObjectId = new mongoose.Types.ObjectId(tenantId);

    // Check for duplicates
    const existing = await YourFeature.findOne({
      tenantId: tenantObjectId,
      field1: data.field1,
      isDeleted: false,
    });

    if (existing) {
      throw new AppError(
        "Item with this field1 already exists",
        StatusCodes.BAD_REQUEST,
      );
    }

    const item = await YourFeature.create({
      ...data,
      tenantId: tenantObjectId,
    });

    return item;
  },

  getAll: async (tenantId: string) => {
    const tenantObjectId = new mongoose.Types.ObjectId(tenantId);
    return await YourFeature.find({
      tenantId: tenantObjectId,
      isDeleted: false,
    });
  },

  getById: async (tenantId: string, itemId: string) => {
    const tenantObjectId = new mongoose.Types.ObjectId(tenantId);
    const itemObjectId = new mongoose.Types.ObjectId(itemId);

    const item = await YourFeature.findOne({
      _id: itemObjectId,
      tenantId: tenantObjectId,
      isDeleted: false,
    });

    if (!item) {
      throw new AppError("Item not found", StatusCodes.NOT_FOUND);
    }

    return item;
  },

  update: async (tenantId: string, itemId: string, data: any) => {
    const tenantObjectId = new mongoose.Types.ObjectId(tenantId);
    const itemObjectId = new mongoose.Types.ObjectId(itemId);

    const item = await YourFeature.findOneAndUpdate(
      {
        _id: itemObjectId,
        tenantId: tenantObjectId,
        isDeleted: false,
      },
      { $set: data },
      { new: true },
    );

    if (!item) {
      throw new AppError("Item not found", StatusCodes.NOT_FOUND);
    }

    return item;
  },

  delete: async (tenantId: string, itemId: string) => {
    const tenantObjectId = new mongoose.Types.ObjectId(tenantId);
    const itemObjectId = new mongoose.Types.ObjectId(itemId);

    const item = await YourFeature.findOneAndUpdate(
      {
        _id: itemObjectId,
        tenantId: tenantObjectId,
        isDeleted: false,
      },
      { isDeleted: true },
      { new: true },
    );

    if (!item) {
      throw new AppError("Item not found", StatusCodes.NOT_FOUND);
    }

    return item;
  },
};
```

### Step 4: Create Controller

**File: `src/app/modules/your-feature/your-feature.controller.ts`**

```typescript
import { Request, Response, NextFunction } from "express";
import { YourFeatureService } from "./your-feature.service";
import { AuthenticatedRequest } from "../../../types";

export const YourFeatureController = {
  create: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await YourFeatureService.create(
        req.user!.tenantId,
        req.body,
      );
      res.status(201).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  getAll: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await YourFeatureService.getAll(req.user!.tenantId);
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const result = await YourFeatureService.getById(req.user!.tenantId, id);
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const result = await YourFeatureService.update(
        req.user!.tenantId,
        id,
        req.body,
      );
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const result = await YourFeatureService.delete(req.user!.tenantId, id);
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
```

### Step 5: Create Routes

**File: `src/app/modules/your-feature/your-feature.route.ts`**

```typescript
import { Router } from "express";
import { YourFeatureController } from "./your-feature.controller";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { CreateYourFeatureSchema } from "../../../validations/your-feature.validation";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/v1/your-feature:
 *   post:
 *     tags:
 *       - YourFeature
 *     summary: Create new item
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - field1
 *             properties:
 *               field1:
 *                 type: string
 *               field2:
 *                 type: number
 */
router.post("/", YourFeatureController.create);

/**
 * @swagger
 * /api/v1/your-feature:
 *   get:
 *     tags:
 *       - YourFeature
 *     summary: Get all items
 *     security:
 *       - BearerAuth: []
 */
router.get("/", YourFeatureController.getAll);

/**
 * @swagger
 * /api/v1/your-feature/{id}:
 *   get:
 *     tags:
 *       - YourFeature
 *     summary: Get item by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get("/:id", YourFeatureController.getById);

router.put("/:id", YourFeatureController.update);
router.delete("/:id", YourFeatureController.delete);

export const YourFeatureRoutes = router;
```

### Step 6: Register Routes

**File: `src/router/router.ts`**

Add to the router aggregator:

```typescript
import { YourFeatureRoutes } from "../app/modules/your-feature/your-feature.route";

router.use("/your-feature", YourFeatureRoutes);
```

---

## Naming Conventions

### Variables and Functions

```typescript
// camelCase for variables and functions
const userName = "John";
function getUserProfile() {}

// UPPER_SNAKE_CASE for constants
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = "https://api.example.com";

// PascalCase for classes and types
class UserService {}
interface IUserResponse {}
type UserRole = "admin" | "user";
```

### Routes

```typescript
// Use lowercase, hyphenated paths
GET    /api/v1/user-profiles
POST   /api/v1/user-profiles
GET    /api/v1/user-profiles/:id
PUT    /api/v1/user-profiles/:id
DELETE /api/v1/user-profiles/:id

// Plural nouns for collections
GET /api/v1/resources      ✅
GET /api/v1/resource       ❌

// Use verbs for actions
POST   /api/v1/resources/:id/reserve    ✅
GET    /api/v1/resources/:id/availability ✅
```

### Database Fields

```typescript
// camelCase for field names
{
  userId: "...",           // ✅
  user_id: "...",          // ❌
  userName: "...",         // ✅
  user_name: "...",        // ❌
  isDeleted: true,         // ✅
  is_deleted: true,        // ❌
}
```

---

## Error Handling

### Always Use AppError

```typescript
import { AppError } from "../utils/AppError";
import { StatusCodes } from "http-status-codes";

// ✅ Good
throw new AppError("User not found", StatusCodes.NOT_FOUND);

// ❌ Avoid
throw new Error("User not found");
const error = new Error("User not found") as any;
error.statusCode = 404;
throw error;
```

### Error Messages

```typescript
// ✅ Clear, user-friendly
throw new AppError(
  "Email already exists in this organization",
  StatusCodes.BAD_REQUEST,
);

// ❌ Too technical
throw new AppError(
  "Duplicate key error collection: user index: email_1_tenantId_1 dup key",
  StatusCodes.BAD_REQUEST,
);
```

### Error Handling in Controllers

```typescript
// ✅ Use try-catch and pass to next()
export const myController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await MyService.doSomething();
    res.json({ status: "success", data: result });
  } catch (error) {
    next(error); // Passes to global error handler
  }
};
```

---

## Database Operations

### Always Use Mongoose ObjectId

```typescript
import mongoose from "mongoose";

// ✅ Correct
const tenantId = new mongoose.Types.ObjectId(req.user.tenantId);
const item = await Item.findOne({ tenantId });

// ❌ Incorrect - TypeScript will complain
const item = await Item.findOne({ tenantId: "string-id" });
```

### Always Filter by tenantId

```typescript
// ✅ Always scope to tenant
const items = await Item.find({
  tenantId: userTenantId,
  isDeleted: false,
});

// ❌ Missing tenant isolation
const items = await Item.find({ isDeleted: false });
```

### Always Exclude Soft Deleted Records

```typescript
// ✅ Exclude deleted items
const items = await Item.find({
  tenantId,
  isDeleted: false,
});

// ❌ Includes deleted items
const items = await Item.find({ tenantId });
```

### Use Transactions for Multiple Operations

```typescript
const session = await mongoose.startSession();
session.startTransaction();

try {
  await Item.create([item], { session });
  await Log.create([log], { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

---

## API Design

### Request/Response Format

```typescript
// ✅ Consistent response format
{
  "status": "success",
  "data": { /* actual data */ }
}

// ✅ Error response
{
  "status": "error",
  "statusCode": 400,
  "message": "Validation failed"
}

// ❌ Inconsistent
{
  "success": true,
  "result": { /* data */ }
}
```

### HTTP Methods

```typescript
GET     - Retrieve resource (no side effects)
POST    - Create new resource
PUT     - Update entire resource
PATCH   - Partial update
DELETE  - Delete resource
```

### Status Codes

```typescript
200 - OK (successful GET, PUT)
201 - Created (successful POST)
204 - No Content (DELETE success)
400 - Bad Request (invalid input)
401 - Unauthorized (no/invalid token)
403 - Forbidden (insufficient permissions)
404 - Not Found
429 - Too Many Requests (rate limit)
500 - Internal Server Error
```

---

## Testing Endpoints

### Using Swagger UI

1. Go to `http://localhost:3000/api-docs`
2. Click on endpoint
3. Click "Try it out"
4. Fill in parameters/body
5. Click "Execute"

### Using Curl

```bash
# GET with authorization
curl -X GET http://localhost:3000/api/v1/resources \
  -H "Authorization: Bearer your_token"

# POST with body
curl -X POST http://localhost:3000/api/v1/resources \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{"name":"Room A","type":"ROOM"}'

# DELETE
curl -X DELETE http://localhost:3000/api/v1/resources/123 \
  -H "Authorization: Bearer your_token"
```

### Using Postman

1. Create new request
2. Select HTTP method
3. Enter URL
4. Add headers (if needed)
5. Add body (if needed)
6. Click "Send"

---

## Code Review Checklist

When reviewing code, check:

- [ ] **Naming** - Variables, functions, classes follow conventions
- [ ] **Error Handling** - Uses AppError, no generic Error
- [ ] **Multi-tenancy** - All operations scoped to tenantId
- [ ] **Soft Deletes** - Checks isDeleted in queries
- [ ] **Authentication** - Routes have authMiddleware
- [ ] **Authorization** - Routes check user role if needed
- [ ] **Validation** - Input validated with Zod schemas
- [ ] **Documentation** - JSDoc comments for unclear code
- [ ] **Swagger** - API endpoints documented
- [ ] **TypeScript** - No `any` types, proper types used
- [ ] **DRY** - No code duplication
- [ ] **SOLID** - Single responsibility principle followed
- [ ] **Performance** - Database indexes present
- [ ] **Security** - No hardcoded secrets
- [ ] **Logging** - Important operations logged (if applicable)

---

## Common Patterns

### Service Pattern

```typescript
// Service contains business logic
export const ItemService = {
  create: async (tenantId, data) => {
    // Validate
    // Create
    // Return
  },

  update: async (tenantId, id, data) => {
    // Validate
    // Update
    // Return
  },
};

// Controller uses service
export const ItemController = {
  create: async (req, res, next) => {
    try {
      const result = await ItemService.create(req.user.tenantId, req.body);
      res.status(201).json({ status: "success", data: result });
    } catch (error) {
      next(error);
    }
  },
};
```

### Middleware Pattern

```typescript
// Middleware for reusable logic
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return next(new AppError("Validation failed", StatusCodes.BAD_REQUEST));
    }
    req.body = validation.data;
    next();
  };
};

// Use in routes
router.post("/", validateBody(CreateItemSchema), ItemController.create);
```

### Error Boundary Pattern

```typescript
// All async operations wrapped in try-catch
export const safeAsync = (fn: Function) => {
  return async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Internal server error",
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  };
};
```

---

## Performance Tips

### Add Database Indexes

```typescript
// ✅ Good - queries use these indexes
schema.index({ tenantId: 1, isDeleted: 1 });
schema.index({ tenantId: 1, email: 1 }, { unique: true });

// Query that uses index
await User.find({ tenantId, isDeleted: false });
```

### Lean Queries (if not modifying)

```typescript
// ✅ Lighter weight when not modifying
const items = await Item.find({ tenantId }).lean();

// ❌ Unnecessary for read-only operations
const items = await Item.find({ tenantId });
```

### Pagination for Large Datasets

```typescript
// ✅ Implement pagination
const page = req.query.page || 1;
const limit = req.query.limit || 10;
const skip = (page - 1) * limit;

const items = await Item.find({ tenantId }).skip(skip).limit(limit);
```

---

This guide should help maintain code quality and consistency across the project. Follow these patterns and conventions when adding new features.
