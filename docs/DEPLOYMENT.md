# 🚀 Deployment Guide

Complete deployment guide for Traveloop frontend, backend, and database.

---

## Deployment Architecture

```
GitHub Repository
  ↓
  ├── Frontend Build → Vercel/Netlify
  ├── Backend Build → Heroku/Railway/Render
  └── Database → MongoDB Atlas
```

---

## Backend Deployment (Express.js)

### Option 1: Heroku Deployment

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Steps

```bash
# 1. Login to Heroku
heroku login

# 2. Create Heroku app
heroku create traveloop-backend

# 3. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your_secret_key
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
heroku config:set CLOUDINARY_API_KEY=your_api_key
heroku config:set CLOUDINARY_API_SECRET=your_api_secret

# 4. Deploy
git push heroku main

# 5. View logs
heroku logs --tail
```

#### Procfile (backend/Procfile)

```
web: node server.js
```

### Option 2: Railway Deployment

```bash
# 1. Login
railway login

# 2. Link project
railway link

# 3. Set environment variables in dashboard
# 4. Deploy
git push

# 5. View logs
railway logs
```

### Option 3: Render Deployment

1. Connect GitHub repository
2. Create new Web Service
3. Set build command: `npm install && npm run build`
4. Set start command: `node server.js`
5. Add environment variables
6. Deploy

---

## Frontend Deployment (React + Vite)

### Option 1: Vercel Deployment

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Configure environment variables in Vercel dashboard
VITE_API_URL=https://traveloop-backend.herokuapp.com/api/v1
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

**vercel.json Configuration:**

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@vite_api_url",
    "VITE_CLOUDINARY_CLOUD_NAME": "@vite_cloudinary_cloud_name"
  }
}
```

### Option 2: Netlify Deployment

1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables
5. Deploy

**netlify.toml Configuration:**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Database Deployment (MongoDB Atlas)

### Setup MongoDB Atlas

1. **Create MongoDB Account:** https://www.mongodb.com/cloud/atlas
2. **Create Cluster:**
   - Select cloud provider (AWS, GCP, Azure)
   - Choose region
   - Select tier (M0 free tier for hackathon)

3. **Configure Network Access:**
   - Allow access from 0.0.0.0/0 (during hackathon)
   - Restrict in production

4. **Create Database User:**
   - Username: your_username
   - Password: strong_password

5. **Get Connection String:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/traveloop?retryWrites=true&w=majority
   ```

6. **Update .env files:**
   - Backend: `MONGODB_URI=mongodb+srv://...`
   - Frontend: No direct DB access (only through API)

---

## Pre-Deployment Checklist

### Backend
- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] API endpoints tested
- [ ] Error handling working
- [ ] CORS configured for production domain
- [ ] JWT secrets changed
- [ ] Database backups created
- [ ] Rate limiting implemented
- [ ] Input validation in place
- [ ] Security headers set (Helmet)
- [ ] Logging configured
- [ ] Performance optimized

### Frontend
- [ ] API URL points to production backend
- [ ] Environment variables configured
- [ ] Build process successful
- [ ] No console errors
- [ ] Images optimized
- [ ] Unnecessary dependencies removed
- [ ] Analytics configured
- [ ] Error tracking configured
- [ ] Performance monitored

### Database
- [ ] Indexes created
- [ ] Backups scheduled
- [ ] Monitoring enabled
- [ ] Query optimization done
- [ ] Data validation rules enforced

---

## Deployment Commands

### Deploy All Services

```bash
# 1. Backend
cd backend
git add .
git commit -m "deploy: prepare for production"
git push heroku main

# 2. Frontend
cd ../frontend
npm run build
vercel --prod

# 3. Database (MongoDB Atlas - manual)
# Go to https://cloud.mongodb.com
```

### Rollback Deployment

```bash
# Heroku
heroku releases
heroku rollback v10

# Vercel
vercel rollback

# Git (if needed)
git revert <commit-hash>
git push origin main
```

---

## Monitoring & Logging

### Backend Monitoring

```bash
# Heroku logs
heroku logs --tail

# Error tracking
npm install sentry

# Performance monitoring
npm install datadog-browser-logs
```

### Frontend Monitoring

```javascript
// Error tracking with Sentry
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production"
});
```

### Database Monitoring (MongoDB Atlas)

1. Go to Cluster → Monitoring
2. Set up alerts for:
   - High memory usage
   - Slow queries
   - Connection spikes

---

## Performance Optimization

### Backend
```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Implement caching
const redis = require('redis');

// Add rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

### Frontend
```javascript
// Code splitting
const routes = [
  {
    path: '/',
    component: React.lazy(() => import('./pages/Home'))
  }
];

// Image optimization
<img src="image.jpg" loading="lazy" />
```

### Database
```javascript
// Add indexes
db.users.createIndex({ email: 1 });
db.trips.createIndex({ owner: 1, createdAt: -1 });

// Use aggregation pipelines
db.trips.aggregate([
  { $match: { owner: ObjectId("...") } },
  { $group: { _id: "$status", count: { $sum: 1 } } }
]);
```

---

## SSL/HTTPS Configuration

### For Custom Domain

1. **Heroku:**
   ```bash
   heroku domains:add yourdomain.com
   ```

2. **Vercel/Netlify:**
   - Add custom domain in settings
   - SSL automatically configured

3. **Cloudflare (Optional):**
   - Add domain to Cloudflare
   - Enable SSL/TLS encryption
   - Set DNS records

---

## CI/CD Pipeline (.github/workflows/deploy.yml)

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        run: |
          git remote add heroku https://git.heroku.com/traveloop-backend.git
          git push heroku main

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## Post-Deployment

1. **Test all endpoints** with Postman
2. **Monitor logs** for errors
3. **Check performance** metrics
4. **Verify database** connectivity
5. **Test file uploads** with Cloudinary
6. **Check CORS** errors
7. **Monitor API response times**
8. **Review security** configurations

---

**Last Updated:** May 2026
