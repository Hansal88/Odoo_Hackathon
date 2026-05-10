# 🔀 Git & GitHub Workflow Guide

Complete Git workflow for Traveloop team collaboration.

---

## 📋 Table of Contents

- [Setup](#setup)
- [Branch Strategy](#branch-strategy)
- [Daily Workflow](#daily-workflow)
- [Pull Request Process](#pull-request-process)
- [Conflict Resolution](#conflict-resolution)
- [Commit Conventions](#commit-conventions)
- [Code Review Checklist](#code-review-checklist)

---

## 🔧 Setup

### Initial Repository Setup (Mentor/Lead)

```bash
# Create repository on GitHub
# Clone to local machine
git clone https://github.com/team/traveloop.git
cd traveloop

# Create develop branch
git checkout -b develop
git push -u origin develop

# Protect branches on GitHub Settings:
# - main: require PR review, status checks
# - develop: require PR review
```

### Developer Setup (All Team Members)

```bash
# Clone repository
git clone https://github.com/team/traveloop.git
cd traveloop

# Set git config (one-time)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify config
git config --list

# Fetch all branches
git fetch origin
git branch -a
```

---

## 🌳 Branch Strategy (Git Flow Lite)

### Branch Structure

```
main (PRODUCTION)
  ↑ (merge only on release)
  |
release/ (PRE-RELEASE TESTING)
  ↑ (merge from develop, tested features)
  |
develop (INTEGRATION BRANCH - main dev branch)
  ↑
  ├── feature/* (new features)
  ├── fix/* (bug fixes)
  ├── docs/* (documentation)
  ├── refactor/* (code refactoring)
  └── perf/* (performance improvements)
```

### Branch Naming Convention

| Branch Type | Pattern | Example |
|---|---|---|
| Feature | `feature/{name}` | `feature/user-authentication` |
| Bug Fix | `fix/{name}` | `fix/mongodb-timeout` |
| Documentation | `docs/{name}` | `docs/api-endpoints` |
| Refactor | `refactor/{component}` | `refactor/user-model` |
| Performance | `perf/{area}` | `perf/database-queries` |
| Hotfix | `hotfix/{name}` | `hotfix/login-error` |

---

## 📅 Daily Workflow

### Morning: Start Work

```bash
# Make sure you're in the right directory
cd traveloop

# Switch to develop branch
git checkout develop

# Pull latest changes
git pull origin develop

# Create your feature branch
git checkout -b feature/your-feature-name

# Verify you're on correct branch
git branch  # Should show * feature/your-feature-name
```

### During Development: Commit Changes

```bash
# Check status
git status

# Stage specific files
git add src/components/Header.jsx
git add src/services/apiClient.js

# Or stage all changes (be careful!)
git add .

# Commit with meaningful message
git commit -m "feat(auth): implement JWT token refresh mechanism"
git commit -m "fix(trip): resolve MongoDB query timeout"
git commit -m "docs(api): update authentication endpoints"

# View commit history
git log --oneline -n 5
```

### Throughout Day: Keep Branch Updated

```bash
# If develop branch gets updated while you're working
git fetch origin

# Rebase your changes on top of latest develop
git rebase origin/develop

# If conflicts occur, see "Conflict Resolution" section below
```

### End of Day: Push Changes

```bash
# Push your branch to GitHub
git push origin feature/your-feature-name

# Verify on GitHub
# Visit https://github.com/team/traveloop/branches
```

---

## 🔄 Pull Request Process

### Step 1: Create Pull Request on GitHub

1. Go to GitHub repository
2. Click "Pull Requests" tab
3. Click "New Pull Request"
4. Set:
   - **Base:** `develop`
   - **Compare:** `feature/your-feature-name`

### Step 2: Fill PR Details

**Title Format:**
```
[TYPE] Feature/Fix Description

Examples:
[FEATURE] Implement User Authentication
[FIX] Resolve MongoDB Connection Issue
[DOCS] Update API Documentation
```

**Description Template:**
```markdown
## Description
Brief description of what this PR does.

## Changes Made
- Changed A
- Changed B
- Changed C

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation

## Testing
How was this tested?
- [ ] Tested locally
- [ ] No console errors
- [ ] Tested with Postman

## Checklist
- [ ] Code follows team conventions
- [ ] No merge conflicts
- [ ] Tested end-to-end
- [ ] API documented
- [ ] No hardcoded values
- [ ] Error handling implemented
```

### Step 3: Wait for Review

**Reviewer (Mentor) Checks:**
- Code quality and conventions
- Logic and error handling
- Performance implications
- Security issues
- Test coverage

**Status Checks Must Pass:**
- ✅ All CI tests pass
- ✅ No merge conflicts
- ✅ Minimum 1 approval

### Step 4: Address Feedback

```bash
# Make requested changes
# Don't create new commits for feedback
git add .
git commit --amend --no-edit
git push origin feature/your-feature-name --force-with-lease
```

### Step 5: Merge to Develop

Once approved:
1. Mentor clicks "Merge Pull Request"
2. Select "Squash and merge" (keep history clean)
3. Delete branch after merge

```bash
# Update local develop
git checkout develop
git pull origin develop

# Delete local feature branch
git branch -d feature/your-feature-name
```

---

## ⚠️ Conflict Resolution

### Identify Conflicts

```bash
# During rebase or merge
git status

# Shows files with conflicts marked as "BOTH ADDED" or "BOTH MODIFIED"
```

### Resolve Conflicts

**Option 1: Use VS Code**
1. VS Code shows conflict markers visually
2. Click "Accept Current Change" or "Accept Incoming Change"
3. Remove conflict markers
4. Save file

**Option 2: Manual Resolution**
```
// Conflict marker looks like:
<<<<<<< HEAD
  your code here
=======
  their code here
>>>>>>> feature-branch
```

Remove markers and keep correct code:
```javascript
// final merged code here
```

### Complete Merge After Resolving

```bash
# Stage resolved files
git add .

# If rebasing:
git rebase --continue

# If merging:
git commit -m "Merge: resolve conflicts in file.js"

# Push
git push origin feature/your-feature-name
```

---

## ✍️ Commit Message Convention

### Format (Conventional Commits)

```
type(scope): message

type: feat, fix, docs, style, refactor, test, perf, chore
scope: auth, user, trip, itinerary, odoo, upload, etc.
message: lowercase, imperative, no period
```

### Examples

```bash
# Feature
git commit -m "feat(auth): implement JWT token refresh"
git commit -m "feat(trip): add trip duration calculator"

# Bug Fix
git commit -m "fix(trip): resolve MongoDB timeout on query"
git commit -m "fix(auth): prevent token expiration race condition"

# Documentation
git commit -m "docs(api): add authentication endpoint docs"
git commit -m "docs: add MongoDB schema documentation"

# Refactor
git commit -m "refactor(user): simplify profile update logic"

# Performance
git commit -m "perf(trip): optimize trip list query with indexes"

# Tests
git commit -m "test(auth): add JWT validation tests"

# Style
git commit -m "style: fix linting errors in userController"

# Chore
git commit -m "chore: update dependencies"
```

### Commit Message Tips

✅ **DO:**
- Use imperative mood ("add" not "added")
- Be specific and descriptive
- Reference issue numbers: `fix: resolve MongoDB issue (#123)`
- Include context in body if needed
- Keep subject line under 50 characters

❌ **DON'T:**
- Write vague messages: "fix stuff", "update"
- Mix multiple features in one commit
- Use casual language
- Commit debug code or logs

---

## 🔍 Code Review Checklist

### Reviewer (Mentor) Checks

**Code Quality**
- [ ] Code follows naming conventions
- [ ] No hardcoded values
- [ ] DRY principle followed
- [ ] Functions are single-responsibility
- [ ] Comments explain "why" not "what"

**Functionality**
- [ ] Logic is correct
- [ ] Edge cases handled
- [ ] Error handling present
- [ ] Input validation done
- [ ] No security vulnerabilities

**Testing**
- [ ] Code tested locally
- [ ] Postman tests pass
- [ ] No console errors/warnings
- [ ] Frontend/backend integration works

**Performance**
- [ ] No N+1 queries
- [ ] Database indexes optimized
- [ ] No memory leaks
- [ ] API response time acceptable

**Documentation**
- [ ] Code comments added
- [ ] API documentation updated
- [ ] README updated if needed
- [ ] CHANGELOG updated

**Standards**
- [ ] Commit messages follow convention
- [ ] No merge conflicts
- [ ] Code style consistent
- [ ] No hardcoded environment values

---

## 🚨 Emergency: Hotfix Branch

For critical production bugs:

```bash
# Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# Make fix
git add .
git commit -m "hotfix: resolve critical login issue"
git push origin hotfix/critical-bug

# Create PR to main (not develop!)
# After merge to main, also merge to develop
git checkout develop
git merge hotfix/critical-bug
git push origin develop
```

---

## 📊 Useful Git Commands

```bash
# View branches
git branch -a                          # All branches
git branch -vv                         # With tracking info

# View logs
git log --oneline                      # Compact log
git log --graph --oneline --all        # Visual tree
git log --author="Hansal"              # Filter by author
git log --since="2 weeks ago"          # Filter by time

# Undo changes
git restore file.js                    # Undo unstaged changes
git restore --staged file.js           # Unstage file
git reset --soft HEAD~1                # Undo last commit, keep changes
git reset --hard HEAD~1                # Undo last commit, discard changes

# Stash changes temporarily
git stash                              # Save work in progress
git stash pop                          # Restore stashed changes
git stash list                         # View all stashes

# Check differences
git diff                               # Unstaged changes
git diff --staged                      # Staged changes
git diff develop...feature/xyz         # Between branches

# Find commits
git blame file.js                      # See who changed each line
git log --grep="authentication"        # Search commit messages
git log -S "functionName"              # Search code changes
```

---

## 🎯 Team Responsibilities

### Hansal (Backend Lead)
- Manages backend feature branches
- Reviews backend PRs
- Handles database migrations
- API endpoint development

### Rishi (Odoo/Backend)
- Manages Odoo integration features
- Supports backend development
- Reviews Odoo-related PRs
- Handles cross-module integration

### Pranali (Frontend Lead)
- Manages frontend feature branches
- Reviews frontend PRs
- Handles UI component library
- Frontend build optimization

### Mentor (Reviewer/Lead)
- Approves all PRs
- Ensures code quality
- Guides architecture decisions
- Manages releases to main

---

## ✅ Pre-Merge Checklist

Before creating PR, ensure:

```bash
# 1. Fetch latest develop
git fetch origin develop

# 2. Rebase on develop
git rebase origin/develop

# 3. Run tests (if applicable)
npm test

# 4. Check for lint errors
npm run lint

# 5. Build frontend
cd ../frontend
npm run build

# 6. Build backend
cd ../backend
npm run build

# 7. Verify no console errors
# Test locally in browser and Postman

# 8. Push clean commits
git push origin feature/your-feature
```

---

**Last Updated:** May 2026
**Team:** Traveloop Hackathon
