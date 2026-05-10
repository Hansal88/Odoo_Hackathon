# 🛠️ Team Collaboration Guidelines

Best practices for effective team collaboration on Traveloop.

---

## Communication Protocols

### Daily Standup (15 min)
- **Time:** 10:00 AM (flexible)
- **Format:** Brief sync on Slack/Discord
- **Share:**
  - What you did yesterday
  - What you're doing today
  - Any blockers

### Code Review
- **Duration:** Mentor reviews PRs within 4 hours
- **Request:** @mention reviewer in PR comments
- **Approval:** 1 approval required before merge

### Issue Resolution
- **Response Time:** 30 min for urgent issues
- **Channel:** Slack → #traveloop-issues
- **Escalation:** Mention mentor for critical issues

---

## Coding Standards

### Naming Conventions

**Files/Folders:**
```
controllers/userController.js
services/tripService.js
models/Trip.js
routes/authRoutes.js
```

**Variables:**
```javascript
const userName = 'John';              // camelCase
const MAX_RETRIES = 5;                // UPPER_SNAKE_CASE for constants
class UserService {}                  // PascalCase for classes
async function fetchUserTrips() {}    // camelCase for functions
```

**Branches:**
```
feature/user-authentication
fix/mongodb-timeout
docs/api-endpoints
```

**Commits:**
```
feat(auth): implement JWT refresh mechanism
fix(trip): resolve query timeout issue
docs(api): update endpoint documentation
```

---

## Code Quality Standards

### JavaScript Best Practices

✅ **DO:**
```javascript
// Use async/await
const user = await User.findById(id);

// Error handling
try {
  const user = await User.findById(id);
  return res.json(apiResponse(200, user));
} catch (error) {
  next(new ApiError(400, 'User not found'));
}

// Validate inputs
if (!email || !email.includes('@')) {
  throw new ApiError(400, 'Invalid email');
}

// Use meaningful variable names
const userTripsCount = trips.length;
```

❌ **DON'T:**
```javascript
// Avoid callbacks
User.findById(id, (err, user) => {});

// Avoid silent failures
try { } catch (e) { }

// Avoid generic names
const x = 5;
const obj = {};

// Avoid console.log in production
console.log('Debug:', user);
```

---

## Conflict Prevention

### 1. Package.json Coordination

**Problem:** Everyone modifying package.json simultaneously

**Solution:**
- One person handles dependency updates
- Notify team before `npm install`
- Use `npm ci` for consistent installations

```bash
# Don't do this:
npm install some-package   # Creates new lock file

# Do this instead:
npm ci                      # Uses lock file
```

### 2. Database Schema Changes

**Problem:** Multiple schema modifications causing conflicts

**Solution:**
- Communicate schema changes in #design channel
- Create migration files for changes
- Test migrations on local DB first

```javascript
// migrations/001-add-user-preferences.js
db.users.updateMany({}, {
  $set: { preferences: { travelStyle: 'cultural' } }
});
```

### 3. API Endpoint Conflicts

**Problem:** Same route defined by multiple developers

**Solution:**
- Document planned endpoints in docs/API.md first
- Review API design with mentor before coding
- Use descriptive path names

```javascript
// Good: Clear, descriptive
GET /api/v1/users/:id/trips

// Bad: Ambiguous, vague
GET /api/users/get
```

### 4. Frontend Component Conflicts

**Problem:** Multiple developers creating similar components

**Solution:**
- Create component structure document
- Check before creating new component
- Reuse existing components
- Document component props clearly

---

## Testing Strategy

### Backend Testing

```bash
# Run tests before pushing
npm test

# Test specific endpoint
npm test -- --grep="user authentication"

# Check coverage
npm run test:coverage
```

**Test File Structure:**
```javascript
// tests/auth.test.js
describe('Authentication', () => {
  it('should register user with valid data', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, password, name });
    
    expect(res.status).toBe(201);
    expect(res.body.data.token).toBeDefined();
  });
});
```

### Frontend Testing

```bash
# Run frontend tests
npm test

# Test component
npm test -- Button.test.jsx

# Generate coverage report
npm run test:coverage
```

---

## Code Review Process

### Reviewer Checklist

#### Code Quality
- [ ] Code is readable and follows naming conventions
- [ ] No hardcoded values or secrets
- [ ] Comments explain complex logic
- [ ] DRY principle followed
- [ ] Error handling present

#### Functionality
- [ ] Logic is correct
- [ ] Edge cases handled
- [ ] Input validation done
- [ ] Returns correct response format
- [ ] No console errors

#### Performance
- [ ] No N+1 queries
- [ ] Efficient algorithms
- [ ] Database indexes used
- [ ] API response time acceptable

#### Security
- [ ] No security vulnerabilities
- [ ] Passwords hashed
- [ ] JWT validated
- [ ] SQL injection prevented
- [ ] XSS prevention implemented

#### Testing
- [ ] Code tested locally
- [ ] No missing error handling
- [ ] Edge cases tested
- [ ] Postman tests pass

---

## Commit Best Practices

### Atomic Commits

Each commit should represent ONE logical change:

✅ **Good:**
```
feat(auth): implement JWT token refresh
feat(auth): add password reset endpoint
fix(user): resolve profile update bug
```

❌ **Bad:**
```
feat: update everything
fix: bug fixes and auth refactor
update: multiple changes
```

### Commit Message Template

```
type(scope): message

Optional longer description if needed.

Fixes #123 (if fixing an issue)
Closes #456 (if closing an issue)
```

---

## Feature Development Workflow

### Step 1: Plan
- Discuss feature in team chat
- Document in GitHub issue
- Design API contract
- Design database schema

### Step 2: Develop
- Create feature branch
- Write code
- Write tests
- Test locally

### Step 3: Review
- Create PR with description
- Request mentor review
- Respond to feedback
- Make requested changes

### Step 4: Merge
- Ensure tests pass
- Ensure no conflicts
- Mentor approves
- Squash and merge

### Step 5: Deploy
- Verify on staging
- Deploy to production
- Monitor logs
- Test endpoints

---

## Common Mistakes & How to Avoid

### Mistake 1: Merge Conflicts

**Problem:** Can't merge due to conflicts

**Prevention:**
```bash
# Always pull before pushing
git pull origin develop

# Rebase instead of merge
git rebase origin/develop
```

**Resolution:**
```bash
# Resolve conflicts in files
git add .
git commit -m "resolve: merge conflicts"
git push origin feature/xyz
```

### Mistake 2: Lost Commits

**Problem:** Accidentally deleted commits

**Prevention:**
```bash
# Never force push to develop
git push origin feature/xyz --force-with-lease  # Use with caution

# Always create feature branch before major changes
git checkout -b feature/xyz
```

**Recovery:**
```bash
# Find lost commit
git reflog

# Restore branch
git reset --hard <commit-hash>
```

### Mistake 3: Breaking Changes

**Problem:** Change breaks other team member's code

**Prevention:**
- Communicate API changes
- Provide migration guide
- Add deprecation warnings first
- Test before merging

### Mistake 4: Hardcoded Secrets

**Problem:** Committed API keys to Git

**Prevention:**
```bash
# Before committing
grep -r "password\|secret\|api_key" --include="*.js"

# Use .env for all secrets
CLOUDINARY_API_SECRET=xxx

# Never commit .env
```

**If Happened:**
```bash
# Remove from Git history
git filter-branch --tree-filter 'rm -f .env' HEAD

# Rotate secrets immediately
```

---

## Integration Checkpoints

### Daily Checkpoint (EOD)
- [ ] All local changes committed
- [ ] Branch pushed to GitHub
- [ ] No breaking changes made
- [ ] Tests passing
- [ ] Team notified of blockers

### Weekly Checkpoint (Friday)
- [ ] All PRs merged to develop
- [ ] No unresolved conflicts
- [ ] Documentation updated
- [ ] Database backups created
- [ ] Security review done

### Pre-Release Checkpoint
- [ ] All features merged
- [ ] All tests passing
- [ ] Performance optimized
- [ ] Security audit complete
- [ ] Documentation finalized
- [ ] Deployment plan created

---

## Emergency Procedures

### Critical Bug Found in Production

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue

# 2. Make fix
# 3. Test thoroughly
# 4. Create PR to main (not develop)
# 5. Get immediate review and approval
# 6. Merge to main
# 7. Deploy to production
# 8. Also merge to develop
git checkout develop
git pull origin develop
git merge hotfix/critical-issue
git push origin develop
```

### Database Emergency

```bash
# 1. Stop application
# 2. Create backup
mongodump --uri="mongodb://..." --out ./backup

# 3. Fix issue
# 4. Test fix
# 5. Restore if needed
mongorestore ./backup

# 6. Resume application
# 7. Notify team
```

---

## Team Roles & Responsibilities

### Hansal (Backend Lead)
- Design API endpoints
- Implement authentication
- Manage database schema
- Review backend PRs
- Handle database issues

### Rishi (Odoo/Backend)
- Odoo integration
- Backend support
- Cross-module testing
- Review Odoo PRs
- Handle ERP issues

### Pranali (Frontend Lead)
- Design UI components
- Implement features
- Styling & animations
- Review frontend PRs
- Handle UI issues

### Mentor (Code Reviewer)
- Approve all PRs
- Architecture guidance
- Security review
- Deployment management
- Final QA testing

---

**Last Updated:** May 2026
