# 📡 API Documentation & Swagger Setup

Complete API documentation for Traveloop backend with Swagger/OpenAPI integration.

---

## Setup Swagger Documentation

### 1. Install Swagger Dependencies

```bash
cd backend
npm install swagger-jsdoc swagger-ui-express
```

### 2. Create Swagger Configuration (backend/src/config/swagger.js)

```javascript
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Traveloop API',
      version: '1.0.0',
      description: 'Personalized Travel Planning Platform API',
      contact: {
        name: 'Traveloop Team',
        email: 'support@traveloop.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://api.traveloop.com/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
  ],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
```

### 3. Setup in app.js

```javascript
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
```

---

## API Endpoints

### Authentication Endpoints

#### Register User
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "phone": "+1234567890"
}

Response 201:
{
  "success": true,
  "statusCode": 201,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "User registered successfully"
}
```

#### Login
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login successful"
}
```

#### Refresh Token
```
POST /api/v1/auth/refresh
Headers: Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Token refreshed"
}
```

#### Logout
```
POST /api/v1/auth/logout
Headers: Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "Logout successful"
}
```

---

### User Endpoints

#### Get Profile
```
GET /api/v1/users/profile
Headers: Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "avatar": "https://res.cloudinary.com/...",
    "bio": "Travel enthusiast",
    "preferences": {
      "travelStyle": "adventure",
      "budget": "mid-range",
      "interests": ["hiking", "culture", "food"]
    }
  },
  "message": "Profile fetched"
}
```

#### Update Profile
```
PUT /api/v1/users/profile
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Updated",
  "bio": "Updated bio",
  "preferences": {
    "travelStyle": "luxury",
    "budget": "high",
    "interests": ["luxury", "beaches"]
  }
}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "data": { ... },
  "message": "Profile updated successfully"
}
```

#### Upload Avatar
```
POST /api/v1/users/avatar
Headers: Authorization: Bearer {token}
Content-Type: multipart/form-data

Field: avatar (image file)

Response 200:
{
  "success": true,
  "statusCode": 200,
  "data": {
    "avatar": "https://res.cloudinary.com/..."
  },
  "message": "Avatar uploaded"
}
```

---

### Trip Endpoints

#### Create Trip
```
POST /api/v1/trips
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Summer Europe Trip",
  "description": "Exploring Europe this summer",
  "destination": {
    "country": "France",
    "city": "Paris",
    "latitude": 48.8566,
    "longitude": 2.3522
  },
  "startDate": "2024-06-01",
  "endDate": "2024-06-15",
  "budget": 5000
}

Response 201:
{
  "success": true,
  "statusCode": 201,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Summer Europe Trip",
    "owner": "507f1f77bcf86cd799439011",
    "status": "planning",
    "collaborators": [],
    "itineraries": [],
    ...
  },
  "message": "Trip created successfully"
}
```

#### Get All Trips
```
GET /api/v1/trips
Headers: Authorization: Bearer {token}
Query: page=1&limit=10&status=planning

Response 200:
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Summer Europe Trip",
      ...
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50
  },
  "message": "Trips fetched"
}
```

#### Get Single Trip
```
GET /api/v1/trips/:tripId
Headers: Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "data": { ... },
  "message": "Trip fetched"
}
```

#### Update Trip
```
PUT /api/v1/trips/:tripId
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Summer Europe Trip 2024",
  "budget": 6000
}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "data": { ... },
  "message": "Trip updated"
}
```

#### Delete Trip
```
DELETE /api/v1/trips/:tripId
Headers: Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "message": "Trip deleted"
}
```

#### Add Collaborator
```
POST /api/v1/trips/:tripId/collaborators
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "friend@example.com"
}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "data": {
    "collaborators": ["507f1f77bcf86cd799439013"]
  },
  "message": "Collaborator added"
}
```

---

### Itinerary Endpoints

#### Create Itinerary
```
POST /api/v1/itineraries
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "tripId": "507f1f77bcf86cd799439012",
  "day": 1,
  "activities": [
    {
      "time": "09:00",
      "activity": "Breakfast at café",
      "location": "Montmartre, Paris",
      "notes": "Traditional French breakfast"
    },
    {
      "time": "14:00",
      "activity": "Eiffel Tower visit",
      "location": "Eiffel Tower, Paris",
      "notes": "Pre-booked tickets"
    }
  ]
}

Response 201:
{
  "success": true,
  "statusCode": 201,
  "data": { ... },
  "message": "Itinerary created"
}
```

#### Get Trip Itineraries
```
GET /api/v1/trips/:tripId/itineraries
Headers: Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "day": 1,
      "activities": [...]
    }
  ],
  "message": "Itineraries fetched"
}
```

---

### Health Check

#### Server Health
```
GET /api/health

Response 200:
{
  "success": true,
  "statusCode": 200,
  "data": {
    "status": "ok",
    "timestamp": "2024-05-10T10:30:00.000Z",
    "uptime": "3600s",
    "environment": "production"
  },
  "message": "Server is healthy"
}
```

---

## Error Response Examples

### Validation Error
```
POST /api/v1/auth/register
{
  "email": "invalid-email",
  "password": "123"
}

Response 422:
{
  "success": false,
  "statusCode": 422,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

### Unauthorized Error
```
GET /api/v1/users/profile
(no token provided)

Response 401:
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized",
  "errors": [
    {
      "field": "authorization",
      "message": "Token is required"
    }
  ]
}
```

### Not Found Error
```
GET /api/v1/trips/invalid-id

Response 404:
{
  "success": false,
  "statusCode": 404,
  "message": "Trip not found"
}
```

---

## Swagger JSDoc Examples

### Controller Documentation

```javascript
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
exports.register = asyncHandler(async (req, res) => {
  // Implementation
});
```

---

**Last Updated:** May 2026
