# 🌍 Traveloop - Personalized Travel Planning Platform

> A production-ready hackathon project with React/Vite frontend, Node.js/Express backend, MongoDB database, and Odoo integration.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Team Structure](#team-structure)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Git Strategy](#git-strategy)
- [API Standards](#api-standards)
- [Database Schema](#database-schema)
- [Frontend-Backend Integration](#frontend-backend-integration)
- [Deployment](#deployment)
- [Common Issues & Solutions](#common-issues--solutions)
- [Resources](#resources)

---

## 🎯 Project Overview

**Traveloop** is a personalized travel planning platform that enables users to:
- Create and manage travel itineraries
- Collaborate with other travelers
- Integrate with Odoo for booking management
- Upload travel photos and documents to Cloudinary
- Generate AI-powered travel recommendations

**Tech Stack:**
- **Frontend:** React 18 + Vite + TailwindCSS
- **Backend:** Node.js + Express.js + MongoDB
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **File Upload:** Cloudinary + Multer
- **API Documentation:** Swagger/OpenAPI
- **ERP Integration:** Odoo

---

## 👥 Team Structure

| Developer | Role | Responsibilities |
|-----------|------|------------------|
| **Hansal** | Backend Lead | APIs, Database Models, Authentication |
| **Rishi** | Odoo/Full-Stack | Odoo Integration, Backend Support |
| **Pranali** | Frontend Lead | React Components, UI/UX, Styling |
| **Dhruv** | Tester | checking all pages, testing APIs, Verifying deployment |
| **Mentor** | Reviewer | Code Review, Architecture Guidance, Deployment |

---

## 🏗️ Project Architecture

```
traveloop/
│
├── frontend/                    # React + Vite application
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── common/         # Buttons, Headers, Footers
│   │   │   ├── layout/         # Page layouts
│   │   │   └── features/       # Feature-specific components
│   │   ├── pages/              # Page components (routes)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API client services
│   │   │   └── apiClient.js    # Axios instance with interceptors
│   │   ├── store/              # State management (Zustand/Redux)
│   │   ├── styles/             # Global styles & Tailwind config
│   │   ├── utils/              # Helper functions
│   │   ├── constants/          # API endpoints, errors
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── .env.example
│   ├── .env.local (gitignored)
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
├── backend/                     # Express.js API server
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js           # MongoDB connection
│   │   │   ├── env.js          # Environment validation
│   │   │   └── cloudinary.js   # Cloudinary setup
│   │   ├── controllers/        # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── tripController.js
│   │   │   └── itineraryController.js
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Trip.js
│   │   │   ├── Itinerary.js
│   │   │   └── Document.js
│   │   ├── routes/             # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── tripRoutes.js
│   │   │   └── itineraryRoutes.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   ├── authMiddleware.js
│   │   │   └── validateRequest.js
│   │   ├── services/           # Business logic
│   │   │   ├── authService.js
│   │   │   ├── tripService.js
│   │   │   └── odooService.js
│   │   ├── utils/
│   │   │   ├── asyncHandler.js
│   │   │   ├── apiResponse.js
│   │   │   ├── apiError.js
│   │   │   └── validators.js
│   │   ├── validations/        # Input validation schemas
│   │   │   └── schemas.js
│   │   └── app.js
│   ├── server.js
│   ├── .env.example
│   ├── .env (gitignored)
│   ├── package.json
│   └── README.md
│
├── odoo/                        # Odoo module integration
│   ├── traveloop_integration/   # Custom Odoo module
│   │   ├── __init__.py
│   │   ├── __manifest__.py
│   │   ├── models/
│   │   ├── views/
│   │   └── controllers/
│   └── README.md
│
├── docs/                        # Documentation
│   ├── API.md                  # API documentation
│   ├── ARCHITECTURE.md         # System architecture
│   ├── DATABASE.md             # MongoDB schema
│   ├── DEPLOYMENT.md           # Deployment guide
│   ├── SETUP.md                # Local setup guide
│   ├── GIT_WORKFLOW.md         # Git & GitHub workflow
│   └── POSTMAN.md              # Postman API testing
│
├── scripts/                     # Helper scripts
│   ├── setup.sh                # Initial setup script
│   ├── start-dev.sh            # Start frontend & backend
│   ├── start-dev.ps1           # PowerShell version
│   ├── seed-db.js              # MongoDB seed data
│   └── cleanup.sh              # Clean cache & logs
│
├── postman/                     # Postman collections
│   ├── Traveloop-API.postman_collection.json
│   └── Traveloop-ENV.postman_environment.json
│
├── .gitignore
├── .github/
│   ├── workflows/              # GitHub Actions CI/CD
│   └── ISSUE_TEMPLATE/
├── docker-compose.yml          # Optional: Docker setup
├── package.json                # Root package.json (for root scripts)
└── README.md                   # This file

```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16+ (Check: `node --version`)
- **npm** v8+ (Check: `npm --version`)
- **Git** (Check: `git --version`)
- **MongoDB** running locally or Atlas connection string
- **VS Code** with recommended extensions (see setup guide)

### Initial Setup (One-time)

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/traveloop.git
cd traveloop
```

#### 2. Install Dependencies
```bash
# Install root dependencies (if any)
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

#### 3. Environment Setup

**Backend `.env` file:**
```bash
cd backend
cp .env.example .env
# Edit .env with your values:
# - MONGODB_URI
# - JWT_SECRET
# - CLOUDINARY credentials
# - NODE_ENV
```

**Frontend `.env` file:**
```bash
cd ../frontend
cp .env.example .env
# Edit .env with your values:
# - VITE_API_URL
# - VITE_CLOUDINARY_CLOUD_NAME
```

#### 4. Start Development
```bash
# From project root
npm run dev

# Or manually:
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## 🔄 Development Workflow

### Branch Strategy (Git Flow Lite)

```
main (production)
  ↑
  ├── release/ (pre-production testing)
  ↑
  └── develop (integration branch)
      ├── feature/auth-* (feature branches)
      ├── feature/trips-*
      ├── feature/odoo-*
      ├── fix/bug-*
      └── docs/*
```

### Creating a Feature Branch

**Step 1: Update local develop**
```bash
git checkout develop
git pull origin develop
```

**Step 2: Create feature branch**
```bash
# Format: feature/{feature-name}
# Examples:
git checkout -b feature/user-authentication
git checkout -b feature/trip-creation
git checkout -b feature/odoo-integration
```

**Step 3: Make changes and commit**
```bash
# Add changes
git add .
# Commit with conventional message (see below)
git commit -m "feat: implement JWT authentication flow"
git commit -m "fix: resolve MongoDB connection timeout"
git commit -m "docs: update API documentation"
```

**Step 4: Push and create Pull Request**
```bash
git push origin feature/{feature-name}
# Go to GitHub → Create Pull Request → develop branch
```

---

## 📝 Git Conventions

### Branch Naming Convention

```
feature/{feature-name}      # New feature
fix/{bug-name}              # Bug fix
docs/{doc-name}             # Documentation
refactor/{component}        # Code refactoring
test/{test-name}            # Tests
perf/{performance-area}     # Performance improvement
```

### Commit Message Convention (Conventional Commits)

```
type(scope): message

type: feat, fix, docs, style, refactor, test, perf, chore
scope: auth, user, trip, itinerary, odoo, upload, etc.

Examples:
feat(auth): implement JWT token refresh mechanism
fix(trip): resolve MongoDB query timeout issue
docs(api): add authentication endpoints documentation
refactor(user): simplify user profile update logic
```

### Pull Request Workflow

1. **Create PR with descriptive title:**
   ```
   [FEATURE] Implement User Authentication
   [FIX] Resolve MongoDB connection pooling issue
   [DOCS] Update API documentation
   ```

2. **PR Description Template:**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] New feature
   - [ ] Bug fix
   - [ ] Breaking change
   - [ ] Documentation

   ## Testing
   How was this tested?

   ## Checklist
   - [ ] Code follows conventions
   - [ ] No merge conflicts
   - [ ] Tested locally
   - [ ] Documented changes
   - [ ] No console errors/warnings
   ```

3. **Review Process:**
   - Mentor reviews all PRs
   - Minimum 1 approval required
   - All CI checks must pass
   - Resolve conflicts before merge

---

## 📡 API Standards

### API Response Format

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "User fetched successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry |
| 422 | Unprocessable | Invalid data |
| 500 | Server Error | Internal error |

### API Endpoint Naming

```
GET    /api/v1/users              # List all users
GET    /api/v1/users/:id          # Get single user
POST   /api/v1/users              # Create user
PUT    /api/v1/users/:id          # Update user
DELETE /api/v1/users/:id          # Delete user
GET    /api/v1/users/:id/trips    # Get user's trips
POST   /api/v1/trips              # Create trip
GET    /api/v1/trips/:id          # Get trip details
```

---

## 💾 Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  avatar: String (Cloudinary URL),
  bio: String,
  preferences: {
    travelStyle: String,
    budget: String,
    interests: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Trip Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  owner: ObjectId (references User),
  collaborators: [ObjectId] (references Users),
  destination: {
    country: String,
    city: String,
    latitude: Number,
    longitude: Number
  },
  startDate: Date,
  endDate: Date,
  budget: Number,
  itineraries: [ObjectId] (references Itinerary),
  status: String (planning, ongoing, completed),
  createdAt: Date,
  updatedAt: Date
}
```

### Itinerary Model
```javascript
{
  _id: ObjectId,
  trip: ObjectId (references Trip),
  day: Number,
  activities: [{
    time: String,
    activity: String,
    location: String,
    notes: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔗 Frontend-Backend Integration

### API Client Setup (Frontend)

**services/apiClient.js:**
```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - refresh or redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Example API Call (Frontend)

```javascript
// services/userService.js
import apiClient from './apiClient';

export const userService = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.put('/users/profile', data),
};
```

### Backend API Handler (Backend)

```javascript
// controllers/authController.js
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

exports.register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password required');
  }

  // Validate and create user
  const user = await User.create({ email, password, name });

  res.status(201).json(
    new ApiResponse(201, user, 'User registered successfully')
  );
});
```

---

## 🚢 Deployment

### Deployment Strategy

**Frontend:** Vercel/Netlify
**Backend:** Heroku/Railway/Render
**Database:** MongoDB Atlas
**Files:** Cloudinary

### Deployment Checklist

- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] API endpoints tested in Postman
- [ ] Frontend API URLs updated
- [ ] CORS origins configured
- [ ] JWT secrets changed
- [ ] Database backups created

---

## ⚠️ Common Issues & Solutions

### Issue 1: CORS Error
```
❌ Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
```javascript
// backend/src/app.js
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));
```

### Issue 2: MongoDB Connection Timeout
```
❌ MongooseError: Cannot connect to MongoDB
```
**Solution:**
- Check MongoDB is running: `mongod`
- Verify MONGODB_URI in .env
- Check firewall rules
- Increase connection timeout

### Issue 3: JWT Token Expired
```
❌ TokenExpiredError: jwt expired
```
**Solution:**
- Implement token refresh mechanism
- Store token in httpOnly cookie
- Extend JWT expiration for hackathon

### Issue 4: Merge Conflicts
```
❌ Conflict in backend/package.json
```
**Solution:**
```bash
git status                    # See conflicts
git merge --abort             # Abort and try again
git pull --rebase             # Use rebase instead
```

### Issue 5: Node Modules Large
```
❌ node_modules taking 500MB+
```
**Solution:**
```bash
npm ci --production           # Clean install
npm prune                     # Remove unused packages
```

---

## 🌟 Best Practices

### Frontend-Backend Communication

✅ **DO:**
- Always use axios/fetch interceptors for auth tokens
- Validate input on frontend before sending
- Handle loading and error states
- Use environment variables for API URL
- Log API responses only in development

❌ **DON'T:**
- Store tokens in localStorage only (use httpOnly cookies)
- Make API calls in component render
- Send sensitive data in query params
- Ignore CORS errors
- Use hardcoded API URLs

### MongoDB Schema Design

✅ **DO:**
- Use proper indexes for frequent queries
- Keep documents reasonably sized
- Use references for large datasets
- Implement soft delete if needed
- Add timestamps (createdAt, updatedAt)

❌ **DON'T:**
- Deeply nest documents
- Duplicate data across collections
- Use ObjectId as strings
- Forget to add indexes
- Leave undefined fields

### Error Handling

✅ **DO:**
- Throw descriptive errors
- Include error context (what, why, how to fix)
- Log errors with timestamps
- Return consistent error format
- Handle async/await errors with try-catch

❌ **DON'T:**
- Use generic "Something went wrong" messages
- Log sensitive data
- Ignore unhandled rejections
- Mix error handling approaches
- Throw plain strings

---

## 📚 Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [JWT.io](https://jwt.io/)
- [REST API Best Practices](https://restfulapi.net/)
- [Mongoose Docs](https://mongoosejs.com/)

---

## 📞 Support

**Need help?**
- Check docs/ folder for detailed guides
- Review Postman collection for API examples
- Check GitHub Issues for known problems
- Ask in team Slack/Discord

---

**Last Updated:** May 2026
**Hackathon:** Odoo Hackathon
**Team:** Hansal, Rishi, Pranali, Mentor
