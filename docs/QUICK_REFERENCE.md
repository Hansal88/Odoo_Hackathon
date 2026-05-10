# ⚡ Quick Reference Guide

Fast reference for common commands and patterns.

---

## Git Quick Commands

```bash
# Daily workflow
git checkout develop                    # Switch to develop
git pull origin develop                 # Get latest changes
git checkout -b feature/xyz             # Create feature branch
git add .                               # Stage all changes
git commit -m "feat(scope): message"    # Commit with convention
git push origin feature/xyz             # Push to GitHub
# Create PR on GitHub UI

# If conflicts occur
git fetch origin
git rebase origin/develop               # Rebase on latest develop
# Resolve conflicts in editor
git add .
git rebase --continue
git push --force-with-lease

# View history
git log --oneline -n 10                 # Last 10 commits
git log --graph --oneline --all         # Visual tree
git diff                                # See unstaged changes
git status                              # Current status
```

---

## MongoDB Quick Commands

```bash
# Connect
mongosh

# Database operations
show databases                          # List databases
use traveloop                           # Switch database
show collections                        # List collections

# Query operations
db.users.find()                         # Find all
db.users.findOne({ email: "test@..." }) # Find one
db.users.find({ status: "active" })     # Find with filter
db.users.count()                        # Count documents

# Insert
db.users.insertOne({ name: "John", email: "john@..." })
db.users.insertMany([{...}, {...}])

# Update
db.users.updateOne({ _id: ObjectId("...") }, { $set: { name: "Jane" } })

# Delete
db.users.deleteOne({ _id: ObjectId("...") })

# Indexes
db.users.createIndex({ email: 1 })     # Create index
db.users.getIndexes()                   # List indexes

# Aggregation
db.trips.aggregate([
  { $match: { owner: ObjectId("...") } },
  { $group: { _id: "$status", count: { $sum: 1 } } }
])
```

---

## API Testing (Postman)

```
POST /auth/register
{
  "name": "John",
  "email": "john@example.com",
  "password": "Pass123!"
}

GET /users/profile
Header: Authorization: Bearer {{jwt_token}}

POST /trips
Header: Authorization: Bearer {{jwt_token}}
{
  "title": "Summer Trip",
  "destination": { "country": "France", "city": "Paris" },
  "startDate": "2024-06-01",
  "endDate": "2024-06-15",
  "budget": 5000
}

GET /trips?page=1&limit=10
Header: Authorization: Bearer {{jwt_token}}

GET /health
(No auth needed)
```

---

## Environment Variables

### Backend (.env)

```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/traveloop
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.local)

```bash
VITE_API_URL=http://localhost:5000/api/v1
VITE_CLOUDINARY_CLOUD_NAME=your_name
VITE_NODE_ENV=development
VITE_DEBUG=true
```

---

## Common npm Scripts

```bash
# Backend
npm run dev                             # Start with auto-reload
npm start                               # Production start
npm test                                # Run tests
npm run lint                            # Check code style

# Frontend
npm run dev                             # Start dev server
npm run build                           # Build for production
npm run preview                         # Preview build
npm run lint                            # Check code style

# Root
npm run dev                             # Start both
npm run build                           # Build both
npm run clean                           # Clean dependencies
npm run setup                           # Initial setup
```

---

## Common JavaScript Patterns

### Async/Await Error Handling

```javascript
try {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, 'User not found');
  return res.json(new ApiResponse(200, user));
} catch (error) {
  next(error);
}
```

### Middleware Pattern

```javascript
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new ApiError(401, 'Token required');
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid token'));
  }
};
```

### Service Pattern

```javascript
class UserService {
  async register(userData) {
    const user = await User.create(userData);
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    return { user, token };
  }
}
```

### Validation Pattern

```javascript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2)
});

const validated = schema.parse(req.body);
```

---

## React Common Patterns

### Fetch Data Hook

```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await apiClient.get('/trips');
      setTrips(data.data);
    } catch (error) {
      setError(error.message);
    }
  };
  
  fetchData();
}, []);
```

### Loading & Error States

```javascript
if (loading) return <Spinner />;
if (error) return <Error message={error} />;
return <TripList trips={trips} />;
```

### Form Handling

```javascript
const [formData, setFormData] = useState({ name: '', email: '' });

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  await apiClient.post('/users', formData);
};
```

---

## Status Codes Quick Ref

```
200 OK               - Success
201 Created          - Resource created
400 Bad Request      - Validation error
401 Unauthorized     - Missing/invalid auth
403 Forbidden        - No permission
404 Not Found        - Resource doesn't exist
409 Conflict         - Duplicate entry
422 Unprocessable    - Invalid data
500 Server Error     - Internal error
```

---

## Naming Conventions

```
Variables:       const userName = 'John'
Constants:       const MAX_RETRIES = 5
Functions:       function getUserTrips() {}
Classes:         class UserService {}
Files:           userController.js
Branches:        feature/user-auth
Commits:         feat(auth): add login endpoint
```

---

## Useful Links

- Backend API: http://localhost:5000/api/docs
- Frontend Dev: http://localhost:5173
- MongoDB Compass: Installed locally
- Postman Collection: postman/Traveloop-API.postman_collection.json
- GitHub: https://github.com/team/traveloop
- Slack Channel: #traveloop-dev

---

## Troubleshooting Checklist

```
❌ MongoDB not connecting?
   □ Check mongod is running
   □ Verify MONGODB_URI in .env
   □ Check firewall settings

❌ API endpoint 404?
   □ Check route is defined in routes/
   □ Verify base URL (localhost:5000/api/v1)
   □ Check method (GET/POST/etc.)

❌ JWT Token expired?
   □ Clear browser localStorage
   □ Login again to get new token
   □ Check JWT_EXPIRES_IN in .env

❌ CORS error?
   □ Check CORS_ORIGIN in backend .env
   □ Verify frontend URL matches
   □ Restart backend server

❌ Port already in use?
   □ Kill process: lsof -i :5000 (Mac/Linux)
   □ Or: netstat -ano | findstr :5000 (Windows)
   □ Kill: kill -9 <PID>
```

---

## Performance Tips

```javascript
// ✓ Use indexes for frequent queries
db.users.createIndex({ email: 1 })

// ✓ Paginate large results
GET /api/trips?page=1&limit=10

// ✓ Cache responses
const cached = await redis.get('key')

// ✓ Lazy load components
const Home = React.lazy(() => import('./Home'))

// ✗ Avoid N+1 queries
// Instead of loop, use aggregation pipeline

// ✗ Don't send sensitive data
// Don't include passwords in responses
```

---

**Last Updated:** May 2026
**Keep this handy!** 📌
