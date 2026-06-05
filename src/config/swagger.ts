import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SyncSpace API",
      version: "1.0.0",
      description:
        "A comprehensive resource booking and scheduling management system API",
      contact: {
        name: "SyncSpace Team",
        email: "support@syncspace.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
      {
        url: "https://api.syncspace.com",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "error",
            },
            statusCode: {
              type: "number",
              example: 400,
            },
            message: {
              type: "string",
              example: "Error message",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            name: {
              type: "string",
              example: "John Doe",
            },
            email: {
              type: "string",
              example: "john@example.com",
            },
            role: {
              type: "string",
              enum: ["ORG_ADMIN", "EMPLOYEE"],
              example: "EMPLOYEE",
            },
            tenantId: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
          },
        },
        Resource: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            tenantId: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            name: {
              type: "string",
              example: "Meeting Room A",
            },
            type: {
              type: "string",
              enum: ["ROOM", "DESK", "DEVICE"],
              example: "ROOM",
            },
            bufferTime: {
              type: "number",
              example: 15,
              description: "Buffer time in minutes",
            },
            isDeleted: {
              type: "boolean",
              example: false,
            },
          },
        },
        Booking: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            resourceId: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            userId: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            tenantId: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            startTime: {
              type: "string",
              format: "date-time",
              example: "2024-12-20T10:00:00Z",
            },
            endTime: {
              type: "string",
              format: "date-time",
              example: "2024-12-20T11:00:00Z",
            },
            status: {
              type: "string",
              enum: ["PENDING", "CONFIRMED", "CANCELLED"],
              example: "CONFIRMED",
            },
            isDeleted: {
              type: "boolean",
              example: false,
            },
          },
        },
        Availability: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            resourceId: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            tenantId: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            dayOfWeek: {
              type: "string",
              enum: [
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY",
                "SATURDAY",
                "SUNDAY",
              ],
              example: "MONDAY",
            },
            startTime: {
              type: "string",
              example: "09:00",
              description: "Time in HH:mm format",
            },
            endTime: {
              type: "string",
              example: "17:00",
              description: "Time in HH:mm format",
            },
            isAvailable: {
              type: "boolean",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-12-01T10:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-12-01T10:00:00Z",
            },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/app/modules/**/*.ts",
    "./src/router/*.ts",
    "./src/swagger.examples.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
