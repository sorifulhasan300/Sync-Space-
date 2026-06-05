/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User authentication endpoints
 *   - name: Resources
 *     description: Resource management endpoints
 *   - name: Bookings
 *     description: Booking management endpoints
 *   - name: Users
 *     description: User management endpoints
 */

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User authentication endpoints
 *   - name: Resources
 *     description: Resource management endpoints
 *   - name: Bookings
 *     description: Booking management endpoints
 *   - name: Availability
 *     description: Resource availability management endpoints
 *   - name: Users
 *     description: User management endpoints
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     description: Create a new user account with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - tenantId
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePassword123
 *               name:
 *                 type: string
 *                 example: John Doe
 *               tenantId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               role:
 *                 type: string
 *                 enum: [ORG_ADMIN, EMPLOYEE]
 *                 example: EMPLOYEE
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User login
 *     description: Authenticate user and receive JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

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
 *               - bufferTime
 *             properties:
 *               name:
 *                 type: string
 *                 example: Meeting Room A
 *               type:
 *                 type: string
 *                 enum: [ROOM, DESK, DEVICE]
 *                 example: ROOM
 *               bufferTime:
 *                 type: number
 *                 example: 15
 *                 description: Buffer time in minutes
 *     responses:
 *       201:
 *         description: Resource created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Resource'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     tags:
 *       - Resources
 *     summary: Get all resources
 *     description: Retrieve all resources for the authenticated organization
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Resources retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Resource'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/resources/{resourceId}:
 *   delete:
 *     tags:
 *       - Resources
 *     summary: Delete a resource (soft delete)
 *     description: Soft delete a resource by marking it as deleted
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource ID to delete
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Resource deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Resource'
 *       404:
 *         description: Resource not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/availability:
 *   post:
 *     tags:
 *       - Availability
 *     summary: Create resource availability
 *     description: Set availability hours for a resource on specific day
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resourceId
 *               - dayOfWeek
 *               - startTime
 *               - endTime
 *             properties:
 *               resourceId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               dayOfWeek:
 *                 type: string
 *                 enum: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY]
 *                 example: MONDAY
 *               startTime:
 *                 type: string
 *                 example: "09:00"
 *                 description: Time in HH:mm format
 *               endTime:
 *                 type: string
 *                 example: "17:00"
 *                 description: Time in HH:mm format
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Availability created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Availability'
 *       401:
 *         description: Unauthorized
 *   get:
 *     tags:
 *       - Availability
 *     summary: Get resource availability
 *     description: Get availability hours for a specific resource
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: resourceId
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Availability retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Availability'
 *       401:
 *         description: Unauthorized
 */
