# 🏗️ System Architecture

Complete system architecture for Traveloop platform.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (Browser)                  │
│                      React + Vite App                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Components | Hooks | State Management | Routing    │  │
│  │  Pages | Services | Utils | Styles                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ (HTTPS/REST)
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER (Express.js)                   │
│                    Backend Server (Node.js)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes | Controllers | Middleware                  │  │
│  │  Services | Models | Utils | Error Handling         │  │
│  │  JWT Auth | Validation | Rate Limiting              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
        ↕ (Mongoose)    ↕ (REST)         ↕ (API)
    ┌──────────┐   ┌──────────────┐   ┌──────────┐
    │ MongoDB  │   │ Cloudinary   │   │   Odoo   │
    │ Database │   │ File Storage │   │   ERP    │
    └──────────┘   └──────────────┘   └──────────┘
```

---

## Frontend Architecture

### Component Hierarchy

```
App
├── Layout
│   ├── Header
│   ├── Sidebar
│   └── Footer
├── Pages
│   ├── Home
│   ├── Login
│   ├── Register
│   ├── Dashboard
│   │   ├── TripList
│   │   │   └── TripCard
│   │   └── CreateTrip
│   ├── TripDetails
│   │   ├── ItineraryView
│   │   ├── Collaborators
│   │   └── Documents
│   └── Profile
├── Common Components
│   ├── Button
│   ├── Modal
│   ├── Input
│   └── Toast
└── Context/Stores
    ├── AuthContext
    ├── TripStore
    └── UserStore
```

### Data Flow

```
User Action
    ↓
Component (React)
    ↓
Service Layer (apiClient)
    ↓
Backend API
    ↓
Database
    ↓
Response
    ↓
State Update (Zustand/Redux)
    ↓
Re-render Component
```

---

## Backend Architecture (Clean Architecture)

### Folder Structure Logic

```
backend/src/
│
├── routes/           # Entry points, request routing
│   └── Translates HTTP → Controllers
│
├── controllers/      # Request handlers, orchestration
│   └── Calls services, returns responses
│
├── services/         # Business logic, rules
│   └── Calls models, external APIs
│
├── models/           # Database schemas (Mongoose)
│   └── Data validation, queries
│
├── middleware/       # Request processing
│   └── Auth, validation, error handling
│
├── utils/            # Helper functions
│   └── asyncHandler, validators, responses
│
├── config/           # Configuration
│   └── Database, environment, secrets
│
└── validations/      # Input validation schemas
    └── Zod/JOI schemas
```

### Request Flow

```
HTTP Request
    ↓
Middleware (Auth, Validation)
    ↓
Controller (Orchestration)
    ↓
Service (Business Logic)
    ↓
Model (Database Query)
    ↓
Database
    ↓
Response Object
    ↓
Middleware (Error Handling)
    ↓
HTTP Response
```

---

## Database Schema Relationships

```
User Collection
├── _id (primary key)
├── email (unique)
├── password (hashed)
└── Relationships:
    ├── owns → Trips (one-to-many)
    ├── collaborates → Trips (many-to-many)
    └── friends → Users (many-to-many)

Trip Collection
├── _id (primary key)
├── owner → User._id (foreign key)
├── collaborators → [User._id] (array of foreign keys)
└── Relationships:
    ├── has → Itineraries (one-to-many)
    └── has → Documents (one-to-many)

Itinerary Collection
├── _id (primary key)
├── trip → Trip._id (foreign key)
└── Relationships:
    └── activities (embedded documents)

Document Collection
├── _id (primary key)
├── trip → Trip._id (foreign key)
└── uploadedBy → User._id (foreign key)
```

---

## Authentication Flow

```
User Input (Email, Password)
    ↓
POST /auth/register or /auth/login
    ↓
Controller validates input
    ↓
Service checks database
    ↓
Password hashing (bcryptjs)
    ↓
JWT token generation
    ↓
Token sent to frontend
    ↓
Frontend stores token (localStorage/cookie)
    ↓
Token sent in Authorization header
    ↓
Auth middleware verifies token
    ↓
Request continues to protected route
```

---

## File Upload Flow

```
User selects image
    ↓
Frontend (React)
    ↓
POST /users/avatar (multipart/form-data)
    ↓
Multer middleware processes file
    ↓
File validation
    ↓
Upload to Cloudinary
    ↓
Cloudinary returns URL
    ↓
Save URL to database
    ↓
Return response with image URL
    ↓
Frontend displays image
```

---

## Odoo Integration Flow

```
Traveloop Application
    ↓
Need to create booking in Odoo
    ↓
Backend service calls Odoo API
    ↓
Authentication with Odoo API key
    ↓
Create record in Odoo (Sale Order, etc.)
    ↓
Odoo returns record ID
    ↓
Save Odoo ID in Traveloop database
    ↓
Sync status back to Traveloop
    ↓
Display status to user
```

---

## Error Handling Architecture

```
Error Occurs
    ↓
Check error type
    ├── Validation Error → 422
    ├── Auth Error → 401
    ├── Not Found → 404
    ├── Conflict → 409
    ├── Server Error → 500
    └── Custom ApiError → Custom status
    ↓
Error Handler Middleware
    ↓
Format response
    ↓
Log error
    ↓
Return JSON response
    ↓
Frontend error boundary
    ↓
Display user-friendly message
```

---

## Caching Strategy

### Frontend Caching

```javascript
// Cache API responses
const cache = new Map();

function getCachedData(key) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  // Fetch from API
}
```

### Backend Caching

```javascript
// Redis cache (optional)
const cached = await redis.get('user:123');
if (cached) return cached;

// Query database
const user = await User.findById(123);
await redis.set('user:123', user);
```

### Browser Caching

```
Cache-Control: max-age=3600
ETag: "33a64df..."
```

---

## Security Architecture

### JWT Authentication

```
1. User logs in
2. Server generates JWT (header.payload.signature)
3. Frontend stores JWT
4. Frontend sends JWT in Authorization header
5. Backend verifies JWT signature
6. Backend extracts user ID from payload
7. Request continues with authenticated user
8. JWT expires after set time
```

### Password Security

```
User enters password
    ↓
Frontend: Validate format (8+ chars, special char)
    ↓
Backend: Hash with bcryptjs (salt rounds: 10)
    ↓
Store hashed password (NOT plaintext)
    ↓
On login: Compare hashed password
    ↓
Never store or log plaintext password
```

### Data Validation

```
Frontend Validation (UX)
    ├── Real-time feedback
    └── Prevents unnecessary API calls

Backend Validation (Security)
    ├── Essential check
    ├── Prevents injection attacks
    └── Ensures data integrity
```

---

## Performance Optimization

### Frontend Optimization

1. **Code Splitting:** Load components on demand
2. **Image Optimization:** Use webp, lazy loading
3. **Bundling:** Tree-shaking, minification
4. **Caching:** HTTP cache headers, localStorage
5. **State Management:** Prevent unnecessary re-renders

### Backend Optimization

1. **Database Indexes:** Speed up queries
2. **Query Optimization:** Avoid N+1 queries
3. **Pagination:** Limit data per request
4. **Caching:** Redis for frequent data
5. **Compression:** gzip responses
6. **Rate Limiting:** Prevent abuse

### Database Optimization

1. **Indexing:** Index frequently queried fields
2. **Aggregation Pipeline:** Process data in database
3. **Connection Pooling:** Reuse connections
4. **Query Analysis:** Use explain() to optimize

---

## Deployment Architecture

```
Development
    ↓
├── Commit to feature branch
├── Create Pull Request
├── Code review & tests
└── Merge to develop

Staging
    ↓
├── Automated tests run
├── Build frontend & backend
├── Deploy to staging servers
└── Manual testing

Production
    ↓
├── Create release
├── Deploy to production
├── Monitor for errors
└── Rollback if needed
```

---

## Monitoring Architecture

```
Application Logs
    ↓
├── Error logs (Sentry)
├── Performance logs (DataDog)
├── API logs (Morgan)
└── Database logs (MongoDB)

Metrics
    ├── API response time
    ├── Error rate
    ├── Database query time
    ├── User count
    └── Server health

Alerts
    ├── High error rate
    ├── Slow API response
    ├── Database connection error
    └── Server down
```

---

**Last Updated:** May 2026
