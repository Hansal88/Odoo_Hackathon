# 📋 Postman Testing Guide

Complete guide for API testing using Postman collections.

---

## Import Collection & Environment

### Step 1: Open Postman
- Download: https://www.postman.com/downloads/
- Create account or login

### Step 2: Import Collection
1. Click "Import" button
2. Select file: `postman/Traveloop-API.postman_collection.json`
3. Collection imported ✓

### Step 3: Import Environment
1. Click "Environments" (left sidebar)
2. Click "Import"
3. Select file: `postman/Traveloop-ENV.postman_environment.json`
4. Environment imported ✓

### Step 4: Select Environment
1. Top right corner, select "Traveloop Environment"
2. Now all variables are available

---

## Environment Variables

### Available Variables

| Variable | Description | Example |
|----------|-------------|---------|
| base_url | API base URL | http://localhost:5000/api/v1 |
| jwt_token | JWT authentication token | eyJhbGc... |
| user_id | Current user ID | 507f1f77bcf86cd799439011 |
| trip_id | Trip ID for testing | 507f1f77bcf86cd799439012 |

### Update Variables

1. Click "Traveloop Environment"
2. Edit values
3. Click "Save"

---

## Testing Workflow

### 1. User Registration

**Endpoint:** POST /auth/register

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "TestPass123!",
  "phone": "+1234567890"
}
```

**Expected Response:** 201
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": { ... }
  }
}
```

**Next:** Copy token to environment variable `jwt_token`

### 2. User Login

**Endpoint:** POST /auth/login

```json
{
  "email": "test@example.com",
  "password": "TestPass123!"
}
```

**Expected Response:** 200
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": { ... }
  }
}
```

**Tip:** Save token to `jwt_token` variable

### 3. Get User Profile

**Endpoint:** GET /users/profile

**Headers:** 
```
Authorization: Bearer {{jwt_token}}
```

**Expected Response:** 200
```json
{
  "success": true,
  "data": {
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

### 4. Create Trip

**Endpoint:** POST /trips

**Headers:**
```
Authorization: Bearer {{jwt_token}}
```

**Body:**
```json
{
  "title": "Summer Vacation",
  "description": "Two weeks in Europe",
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
```

**Expected Response:** 201
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Summer Vacation"
  }
}
```

**Next:** Copy trip ID to `trip_id` variable

### 5. Get Trip Details

**Endpoint:** GET /trips/{{trip_id}}

**Headers:**
```
Authorization: Bearer {{jwt_token}}
```

**Expected Response:** 200
```json
{
  "success": true,
  "data": { ... }
}
```

---

## Testing Authentication

### Test Token Refresh

**Endpoint:** POST /auth/refresh

**Headers:**
```
Authorization: Bearer {{jwt_token}}
```

**Expected Response:** 200
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc..." // New token
  }
}
```

### Test Invalid Token

**Endpoint:** GET /users/profile

**Headers:**
```
Authorization: Bearer invalid_token_123
```

**Expected Response:** 401
```json
{
  "success": false,
  "message": "Invalid or malformed token"
}
```

### Test Missing Token

**Endpoint:** GET /users/profile

**No Authorization header**

**Expected Response:** 401
```json
{
  "success": false,
  "message": "Token is required"
}
```

---

## Testing Error Scenarios

### Validation Error

**Endpoint:** POST /auth/register

**Invalid Body:**
```json
{
  "email": "invalid-email",
  "password": "123"
}
```

**Expected Response:** 422
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Not Found Error

**Endpoint:** GET /trips/invalid-id

**Expected Response:** 404
```json
{
  "success": false,
  "message": "Trip not found"
}
```

### Duplicate Entry Error

**Endpoint:** POST /auth/register

**With existing email:**
```json
{
  "email": "existing@example.com",
  "password": "TestPass123!"
}
```

**Expected Response:** 409
```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

## Advanced Testing

### Test Pagination

**Endpoint:** GET /trips?page=1&limit=10

**Parameters:**
| Key | Value |
|-----|-------|
| page | 1 |
| limit | 10 |

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50
  }
}
```

### Test Filtering

**Endpoint:** GET /trips?status=planning

**Parameters:**
| Key | Value |
|-----|-------|
| status | planning |

### Test Sorting

**Endpoint:** GET /trips?sort=-createdAt

**Parameters:**
| Key | Value |
|-----|-------|
| sort | -createdAt |

---

## Postman Tests (Scripts)

### Auto-save Token

```javascript
// In "Tests" tab of login endpoint
const jsonData = pm.response.json();
pm.environment.set("jwt_token", jsonData.data.token);
pm.environment.set("user_id", jsonData.data.user._id);
```

### Validate Response Structure

```javascript
// In "Tests" tab of any endpoint
pm.test("Response has success field", () => {
  pm.expect(pm.response.json().success).to.be.true;
});

pm.test("Response has correct status code", () => {
  pm.expect(pm.response.code).to.equal(200);
});
```

### Check Performance

```javascript
// In "Tests" tab
pm.test("Response time is less than 500ms", () => {
  pm.expect(pm.response.responseTime).to.be.below(500);
});
```

---

## Testing File Uploads

### Upload Avatar

**Endpoint:** POST /users/avatar

**Headers:**
```
Authorization: Bearer {{jwt_token}}
```

**Body:** form-data
| Key | Value |
|-----|-------|
| avatar | (select image file) |

**Expected Response:** 200
```json
{
  "success": true,
  "data": {
    "avatar": "https://res.cloudinary.com/..."
  }
}
```

---

## Mock Responses (Optional)

Create mock responses for offline testing:

1. Click "Mock Servers" in Postman
2. Create new mock server
3. Link to collection
4. Define responses for each request

---

## Export Test Report

1. Run collection (top right arrow icon)
2. Select all requests
3. Click "Run"
4. View results
5. Click "Export Results" to save report

---

## Integration with CI/CD

### Newman (CLI Testing)

```bash
# Install Newman
npm install -g newman

# Run collection
newman run postman/Traveloop-API.postman_collection.json \
  -e postman/Traveloop-ENV.postman_environment.json \
  --reporters cli,json \
  --reporter-json-export result.json
```

### GitHub Actions Integration

```yaml
- name: Run API Tests
  run: |
    npm install -g newman
    newman run postman/Traveloop-API.postman_collection.json \
      -e postman/Traveloop-ENV.postman_environment.json
```

---

## Tips & Tricks

### Keyboard Shortcuts
- `Ctrl+K` - Focus search
- `Ctrl+Alt+C` - Open console
- `Ctrl+S` - Save request
- `Ctrl+Enter` - Send request

### Useful Features
- **Pre-request Scripts:** Setup data before request
- **Tests:** Validate response
- **Visualize:** Format response as HTML
- **Console:** Debug requests
- **History:** See previous requests

### Best Practices
- Organize requests in folders
- Use descriptive request names
- Add descriptions to requests
- Use environment variables
- Create test scenarios
- Share collection with team
- Version control collection

---

**Last Updated:** May 2026
