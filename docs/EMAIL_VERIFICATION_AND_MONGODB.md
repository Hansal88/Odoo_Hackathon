# Email Verification & MongoDB Atlas Setup Guide

## Overview
This guide covers setting up email verification with Gmail and connecting MongoDB Atlas to the Traveloop backend.

---

## 📧 Email Verification Setup

### Features
- ✅ Send verification emails on user registration
- ✅ Verify email with token link
- ✅ Resend verification email (with rate limiting)
- ✅ 24-hour token expiry
- ✅ Beautiful HTML email templates

### Email Configuration

#### Step 1: Generate Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification" (if not already enabled)
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select "Mail" and "Windows Computer"
5. Google will generate a 16-character password
6. Copy this password (without spaces)

#### Step 2: Configure .env File

Update your `.backend/.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password

# Frontend URL for verification link
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# MongoDB Configuration (see MongoDB section below)
MONGODB_URI=your-mongodb-atlas-uri
```

⚠️ **Important:** Never commit `.env` file to version control. Add it to `.gitignore`.

---

## 🗄️ MongoDB Atlas Setup

### What is MongoDB Atlas?
MongoDB Atlas is a fully managed MongoDB cloud database service. It's perfect for development and production.

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Start Free"
3. Create an account or sign in
4. Create a new project (e.g., "Traveloop")

### Step 2: Create a Database Cluster

1. Click "Create a Deployment"
2. Choose "Free" tier (M0)
3. Select your preferred cloud provider and region
4. Click "Create"
5. Wait 2-3 minutes for cluster creation

### Step 3: Create Database User

1. Go to "Database Access"
2. Click "Add New Database User"
3. Create username and password:
   - Username: `traveloop_user` (or your choice)
   - Password: (generate strong password)
4. Click "Add User"

### Step 4: Configure IP Whitelist

1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (for development)
   - Or add your specific IP address
4. Click "Confirm"

### Step 5: Get Connection String

1. Go to "Database" → "Clusters"
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.x or higher"
5. Copy the connection string

Example format:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/traveloop?retryWrites=true&w=majority
```

### Step 6: Update .env File

```env
MONGODB_URI=mongodb+srv://traveloop_user:your-password@cluster0.xxxxx.mongodb.net/traveloop?retryWrites=true&w=majority
```

---

## 📡 API Endpoints

### Authentication Endpoints

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "john@example.com"
  }
}
```

#### 2. Verify Email
```http
GET /api/auth/verify-email/:token
```

After clicking the email verification link, the user will be redirected to:
```
http://localhost:5173/verify-email?token=abc123...
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "userId": "507f1f77bcf86cd799439011"
  }
}
```

#### 3. Resend Verification Email
```http
POST /api/auth/resend-verification-email
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Verification email sent successfully"
}
```

**Rate Limiting:** Max 1 request per minute per email

#### 4. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200) - If verified:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "507f1f77bcf86cd799439011",
    "name": "John Doe"
  }
}
```

**Response (401) - If not verified:**
```json
{
  "success": false,
  "message": "Please verify your email first",
  "email": "john@example.com"
}
```

---

## 🧪 Testing the Setup

### Test Email Verification Flow

1. **Register a test user:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "TestPass123"
     }'
   ```

2. **Check your email** for the verification link

3. **Click the verification link** in the email

4. **Try to login** - should succeed now

### Check Database Connection

Visit the health endpoint:
```
http://localhost:5000/api/health
```

Response with database info:
```json
{
  "status": "ok",
  "timestamp": 1715427600000,
  "uptime": 123.45,
  "database": {
    "connected": true,
    "readyState": 1,
    "host": "cluster0.xxxxx.mongodb.net",
    "database": "traveloop"
  },
  "environment": "development"
}
```

---

## 🐛 Troubleshooting

### Email Not Sending?

1. **Check App Password:**
   - Verify you're using a 16-character App Password, not your Google password
   - Remove any spaces from the password

2. **Gmail Security:**
   - Ensure "Less secure app access" is not the issue (use App Passwords instead)
   - Check Gmail's security log for blocked attempts

3. **Check Backend Logs:**
   ```
   npm run dev
   ```
   Look for email transporter connection messages

### MongoDB Connection Error?

1. **Check Connection String:**
   - Verify username and password are correct
   - Ensure password doesn't contain special characters that need URL encoding
   - If password has special chars, URL encode them (e.g., `@` → `%40`)

2. **Network Access:**
   - Make sure your IP is in MongoDB Atlas whitelist
   - Test with "Allow Access from Anywhere" for development

3. **Database Name:**
   - Ensure the database name matches in connection string

4. **Check Server Logs:**
   ```
   Server running in development mode on port 5000
   🔄 Connecting to MongoDB...
   ✅ MongoDB connected successfully (development)
   ```

### Verification Link Expired?

- Tokens expire after 24 hours
- Use "Resend Verification Email" endpoint to get a new token

---

## 🔒 Security Best Practices

1. **Never commit .env** to version control
2. **Use strong passwords** for database users
3. **Enable 2FA** on Gmail account
4. **Use App Passwords** instead of main password
5. **Whitelist only necessary IPs** in production
6. **Rotate passwords** regularly
7. **Use environment variables** for sensitive data

---

## 📚 Frontend Integration

### Verification Page Setup (React)

Create a verification page component:

```jsx
// pages/VerifyEmailPage.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    // Call backend verification endpoint
    fetch(`http://localhost:5000/api/auth/verify-email/${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="verify-email-container">
      {status === 'verifying' && <p>Verifying your email...</p>}
      {status === 'success' && <p>✅ Email verified successfully! You can now login.</p>}
      {status === 'error' && <p>❌ Verification failed. Please try again.</p>}
    </div>
  );
}
```

---

## 🚀 Deployment Considerations

### Production Environment

1. **MongoDB Atlas:**
   - Use dedicated database cluster (M1 or higher)
   - Enable auto-scaling
   - Set up automated backups

2. **Email:**
   - Use SendGrid, AWS SES, or similar service instead of Gmail
   - Gmail is for development only
   - Set up email templates

3. **Environment Variables:**
   - Use platform secrets (Vercel, Heroku, etc.)
   - Never log sensitive data

4. **Rate Limiting:**
   - Implement rate limiting on auth endpoints
   - Consider using redis for session management

---

## 📞 Support

For issues:
1. Check the troubleshooting section
2. Review backend logs
3. Verify all environment variables are set
4. Test endpoints using Postman (collection provided)

---

## ✅ Checklist

- [ ] Gmail App Password created
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelist configured
- [ ] Connection string obtained
- [ ] `.env` file configured
- [ ] Backend running and connected to MongoDB
- [ ] Email transporter verified
- [ ] Test registration and verification flow
- [ ] Frontend verification page created

---

**Last Updated:** May 10, 2026
