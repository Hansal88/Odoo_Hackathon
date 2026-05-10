# ⚙️ Local Setup Guide

Complete guide for setting up Traveloop development environment locally.

---

## Prerequisites

### Required Software
- **Node.js** 16+ ([Download](https://nodejs.org/))
- **npm** 8+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **MongoDB** (local or Atlas)
- **VS Code** ([Download](https://code.visualstudio.com/))

### Verify Installation

```bash
# Check versions
node --version        # v18.x.x
npm --version         # 8.x.x
git --version         # 2.x.x
mongod --version      # 6.x.x (if local)
```

---

## Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/team/traveloop.git
cd traveloop

# Verify folder structure
ls -la    # Should show: backend/, frontend/, docs/, etc.
```

---

## Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your values
# Use a text editor or:
# nano .env  (Linux/Mac)
# notepad .env  (Windows)
```

### .env Configuration

```bash
# Essential variables
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/traveloop
JWT_SECRET=your_development_secret
```

### Start Backend

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start

# Expected output:
# ✓ MongoDB connected
# ✓ Server running on port 5000
# ✓ API Docs: http://localhost:5000/api/docs
```

---

## Step 3: Frontend Setup

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local
nano .env.local
```

### .env.local Configuration

```bash
# Essential variables
VITE_API_URL=http://localhost:5000/api/v1
VITE_NODE_ENV=development
VITE_DEBUG=true
```

### Start Frontend

```bash
# Development mode
npm run dev

# Expected output:
# VITE v4.x.x ready in xxx ms
# ➜ Local: http://localhost:5173/
```

---

## Step 4: Database Setup

### Option A: Local MongoDB

```bash
# Install MongoDB Community Edition
# Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
# Mac: brew install mongodb-community
# Linux: Follow docs for your distro

# Start MongoDB
mongod

# Verify connection (new terminal)
mongosh

# Should show: "test>"
```

### Option B: MongoDB Atlas (Cloud)

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create account/login
3. Create cluster (M0 free tier)
4. Create database user
5. Get connection string
6. Update backend/.env:
   ```bash
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/traveloop
   ```

---

## Step 5: Verify Setup

### Test Backend

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Test API
curl http://localhost:5000/api/health

# Expected response:
# {"success":true,"statusCode":200,"data":{"status":"ok"}...}
```

### Test Frontend

```bash
# Terminal 2: Frontend
cd frontend
npm run dev

# Open browser: http://localhost:5173
# Should see Traveloop app loading
```

### Test Database

```bash
# Terminal 3: MongoDB
mongosh

# Show databases
show databases

# Use traveloop database
use traveloop

# Show collections
show collections

# Insert test document
db.users.insertOne({ email: "test@example.com" })

# Find document
db.users.findOne({ email: "test@example.com" })
```

---

## Step 6: Install Recommended VS Code Extensions

```json
{
  "extensions": [
    "ES7+ React/Redux/React-Native snippets",
    "MongoDB for VS Code",
    "Thunder Client or REST Client",
    "Prettier - Code formatter",
    "ESLint",
    "GitLens",
    "Postman",
    "MongoDB Atlas"
  ]
}
```

Or install via CLI:
```bash
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension mongodb.mongodb-vscode
code --install-extension rangav.vscode-thunder-client
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension eamodio.gitlens
```

---

## Step 7: Start Development

### Option A: Start Separately

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: MongoDB (if local)
mongod
```

### Option B: Start Together

```bash
# From root directory
npm run dev

# Starts both backend and frontend simultaneously
```

---

## Troubleshooting

### MongoDB Connection Error

```bash
# Error: MongooseError: Cannot connect to MongoDB

# Solutions:
# 1. Check MongoDB is running
mongosh

# 2. Verify connection string in .env
echo $MONGODB_URI

# 3. Check firewall rules
# 4. For Atlas: add IP to whitelist
# 5. Restart MongoDB: mongod
```

### Port Already in Use

```bash
# Error: EADDRINUSE: address already in use :::5000

# Solution: Kill process using port
# Linux/Mac:
lsof -i :5000
kill -9 <PID>

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### npm Install Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### CORS Errors

```bash
# Error: Access to XMLHttpRequest blocked by CORS

# Solution: Check backend CORS configuration
# backend/src/app.js
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
};
```

### Token Expired Error

```bash
# Error: TokenExpiredError: jwt expired

# Solution: Clear localStorage
localStorage.clear()

# Restart both frontend and backend
npm run dev
```

---

## Development Workflow

### Making Changes

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes
# 3. Test in browser/Postman
# 4. Commit changes
git add .
git commit -m "feat(auth): add login form"

# 5. Push to GitHub
git push origin feature/my-feature

# 6. Create Pull Request
```

### Testing Locally

```bash
# Frontend: Open http://localhost:5173 in browser
# Test UI, forms, navigation

# Backend: Use Postman or Thunder Client
# Test API endpoints, responses, error handling

# Database: Use MongoDB Compass or mongosh
# Verify data is saved correctly
```

### Debugging

```bash
# Backend: Check console logs
# Frontend: Open DevTools (F12)
# Database: Use MongoDB Compass GUI

# Browser DevTools:
# - Network tab: See API calls
# - Console: See errors
# - Application: See localStorage/cookies
```

---

## Performance Tips

### Frontend Performance

```javascript
// Lazy load routes
const Home = React.lazy(() => import('./pages/Home'));

// Debounce search
const debouncedSearch = debounce((query) => {
  fetchResults(query);
}, 300);

// Use React.memo for expensive components
export default React.memo(LargeList);
```

### Backend Performance

```javascript
// Add indexes to frequent queries
db.users.createIndex({ email: 1 });

// Use pagination
app.get('/api/trips?page=1&limit=10');

// Implement caching
const cached = await redis.get('key');
```

---

## Next Steps

1. **Review documentation:** Read docs/API.md, docs/DATABASE.md
2. **Set up Git workflow:** See docs/GIT_WORKFLOW.md
3. **Import Postman collection:** Download from postman/ folder
4. **Start coding:** Create feature branch and begin development
5. **Test thoroughly:** Use Postman, browser DevTools, MongoDB Compass

---

**Last Updated:** May 2026
**Questions?** Check README.md or ask mentor on Slack
