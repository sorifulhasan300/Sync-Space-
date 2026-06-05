# Swagger Documentation Guide

## Overview

This project uses Swagger (OpenAPI 3.0) for API documentation. The documentation is automatically generated from JSDoc comments in your route files.

## Accessing the Documentation

Once the server is running, access the Swagger UI at:

```
http://localhost:5000/api-docs
```

## Configuration

Swagger configuration is located in `src/config/swagger.ts`. It defines:

- API title, version, and description
- Server URLs (development and production)
- Security schemes (Bearer JWT authentication)
- Common schemas (User, Resource, Booking, Error)

## How to Document Routes

### Basic Route Documentation

Add JSDoc comments to your route handlers with `@swagger` tags:

```typescript
/**
 * @swagger
 * /api/v1/resources:
 *   post:
 *     tags:
 *       - Resources
 *     summary: Create a new resource
 *     description: Create a new room, desk, or device resource
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: Meeting Room A
 *               type:
 *                 type: string
 *                 enum: [ROOM, DESK, DEVICE]
 *                 example: ROOM
 *     responses:
 *       201:
 *         description: Resource created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resource'
 *       400:
 *         description: Bad request
 */
```

### Key Properties

1. **tags** - Group related endpoints (e.g., Auth, Resources, Bookings)
2. **summary** - Short description of what the endpoint does
3. **description** - Detailed description
4. **security** - Define required authentication (use `BearerAuth: []` for JWT)
5. **parameters** - Query, path, or header parameters
6. **requestBody** - Body schema for POST/PUT requests
7. **responses** - Possible responses with status codes and schemas

### Referencing Schemas

Use `$ref` to reference predefined schemas:

```yaml
schema:
  $ref: "#/components/schemas/User"
```

Available schemas:

- `User` - User object
- `Resource` - Resource object
- `Booking` - Booking object
- `Error` - Error response object

### Example: GET Endpoint with Path Parameter

```typescript
/**
 * @swagger
 * /api/v1/resources/{resourceId}:
 *   get:
 *     tags:
 *       - Resources
 *     summary: Get resource by ID
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Resource found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resource'
 *       404:
 *         description: Resource not found
 */
```

### Example: Protected Endpoint (Requires Authentication)

```typescript
/**
 * @swagger
 * /api/v1/bookings:
 *   post:
 *     tags:
 *       - Bookings
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             # ... schema definition
 *     responses:
 *       201:
 *         description: Booking created
 */
```

## Adding Custom Schemas

To add a new schema, edit `src/config/swagger.ts` and add it to the `components.schemas` section:

```typescript
components: {
  schemas: {
    YourNewSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
      },
    },
  },
},
```

Then reference it in your route documentation:

```yaml
schema:
  $ref: "#/components/schemas/YourNewSchema"
```

## Best Practices

1. **Keep descriptions concise** - Use summary for brief info, description for details
2. **Use consistent tags** - Group related endpoints with the same tag
3. **Include examples** - Help users understand expected data format
4. **Document errors** - Always include 4xx and 5xx responses
5. **Use proper HTTP methods** - POST (create), GET (read), PUT (update), DELETE (delete)
6. **Version your API** - Use `/api/v1/` in URLs for versioning

## Updating Configuration

Edit `src/config/swagger.ts` to:

- Change API title/version
- Add new servers
- Add custom schemas
- Modify security schemes
- Update API contact information

## References

- [Swagger/OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger JSDoc Documentation](https://github.com/Surnet/swagger-jsdoc)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
