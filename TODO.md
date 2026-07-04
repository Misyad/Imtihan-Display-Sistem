# 🚀 Imtihan Display System - Production Roadmap

**Generated:** 2026-07-04  
**Target:** Production-ready in 4 weeks  
**Status:** Sprint 1 - Week 1

---

## 📊 Progress Overview

- **Sprint 1 (Week 1):** 🔴 0% - Security & Stability
- **Sprint 2 (Week 2-3):** 🔴 0% - Production Readiness  
- **Sprint 3 (Week 4):** 🔴 0% - Testing & Launch Prep
- **Overall Progress:** 0/35 tasks completed (0%)

---

# 🔥 WEEK 1: CRITICAL FOUNDATION (5 days)

## Day 1-2: Authentication System (16-20 hours)

### Setup
- [ ] Install dependencies
  ```bash
  npm install next-auth@beta @auth/drizzle-adapter drizzle-orm drizzle-kit pg bcryptjs
  npm install -D @types/bcryptjs
  ```
- [ ] Create `.env.local` file
  ```env
  DATABASE_URL=postgresql://user:password@localhost:5432/imtihan
  NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
  NEXTAUTH_URL=http://localhost:3000
  ```

### Database Schema for Auth
- [ ] Create `lib/db/schema.ts`
  - Users table (id, email, password, name, role, createdAt)
  - Sessions table (NextAuth requirement)
  - Verification tokens table

### Authentication Implementation
- [ ] Create `app/api/auth/[...nextauth]/route.ts`
  - Configure NextAuth with Credentials provider
  - Setup Drizzle adapter
  - Add JWT callbacks
  
- [ ] Create `app/(auth)/login/page.tsx`
  - Login form with email + password
  - Error handling
  - Redirect after login

- [ ] Create `lib/auth/password.ts`
  - hashPassword() function
  - verifyPassword() function

- [ ] Create middleware for protected routes
  - `middleware.ts` at root
  - Protect /operator, /settings, /papan-soal
  - Allow /display, /obs, /obs-split, /interactive, /remote (public viewing)

### Seed Initial Admin User
- [ ] Create `lib/db/seed-admin.ts`
  - Script to create first admin user
  - Email: admin@imtihan.local
  - Password: (generate strong password)

### Testing
- [ ] Test login flow
- [ ] Test protected route access
- [ ] Test logout
- [ ] Test invalid credentials

**Estimated Time:** 16-20 hours  
**Priority:** 🔴 CRITICAL  
**Blocker for:** All other features

---

## Day 3-4: Database Migration (16-20 hours)

### PostgreSQL Setup
- [ ] Install PostgreSQL locally OR use Supabase (recommended)
  - Supabase: Free tier, managed, includes backups
  - Local: For development only

- [ ] Create database `imtihan`
  ```sql
  CREATE DATABASE imtihan;
  ```

### Drizzle ORM Setup
- [ ] Create `lib/db/schema.ts` (complete)
  - profiles table
  - questions table
  - category_quotas table
  - used_questions table
  - activity_logs table
  - users table (from Day 1-2)

- [ ] Create `lib/db/index.ts`
  - Database connection
  - Drizzle client export

- [ ] Create `drizzle.config.ts`
  - Configuration for migrations

### Generate Migrations
- [ ] Run migration generation
  ```bash
  npx drizzle-kit generate:pg
  ```

- [ ] Run migrations
  ```bash
  npx drizzle-kit push:pg
  ```

### Data Migration from localStorage
- [ ] Create migration script `scripts/migrate-localstorage.ts`
  - Read from localStorage persistence
  - Transform to database format
  - Insert into PostgreSQL
  - Validate integrity

- [ ] Test migration with sample data

### Update Zustand Store
- [ ] Modify `lib/store.ts`
  - Keep Zustand for client state (activeQuestion, showAnswer)
  - Remove profiles from Zustand persistence
  - Fetch profiles from API on mount
  - Sync updates to database via API

### Create API Routes
- [ ] Create `app/api/profiles/route.ts`
  - GET /api/profiles - List all profiles
  - POST /api/profiles - Create profile

- [ ] Create `app/api/profiles/[id]/route.ts`
  - GET /api/profiles/[id] - Get profile
  - PATCH /api/profiles/[id] - Update profile
  - DELETE /api/profiles/[id] - Delete profile

- [ ] Create `app/api/questions/route.ts`
  - POST /api/questions - Bulk import questions
  - GET /api/questions?profileId=x - Get questions for profile

- [ ] Create `app/api/questions/[id]/route.ts`
  - PATCH /api/questions/[id] - Update question
  - DELETE /api/questions/[id] - Delete question

### Testing
- [ ] Test database connection
- [ ] Test CRUD operations for profiles
- [ ] Test CRUD operations for questions
- [ ] Test data persistence after browser refresh
- [ ] Verify localStorage data migrated correctly

**Estimated Time:** 16-20 hours  
**Priority:** 🔴 CRITICAL  
**Blocker for:** Scalability

---

## Day 5: Error Handling & Monitoring (8-10 hours)

### Sentry Setup
- [ ] Create Sentry account (free tier)
  - https://sentry.io

- [ ] Install Sentry
  ```bash
  npx @sentry/wizard@latest -i nextjs
  ```

- [ ] Configure `sentry.client.config.ts`
- [ ] Configure `sentry.server.config.ts`
- [ ] Configure `sentry.edge.config.ts`

### Error Boundaries
- [ ] Create `app/error.tsx` (global error boundary)
  - User-friendly error message
  - Error ID for support
  - Reset button
  - Report to Sentry

- [ ] Create `app/operator/error.tsx` (page-specific)
- [ ] Create `app/settings/error.tsx` (page-specific)

### Global Error Handler
- [ ] Create `lib/errors/handler.ts`
  - AppError class (extends Error)
  - ValidationError class
  - AuthenticationError class
  - NotFoundError class

- [ ] Create error handling middleware
  - API route error wrapper
  - Standardized error responses

### Socket.IO Error Handling
- [ ] Update `server.js`
  - Wrap socket handlers in try-catch
  - Emit error events to clients
  - Log errors with context
  - Add reconnection logic client-side

- [ ] Update `lib/store.ts`
  - Handle socket errors
  - Show connection status to user
  - Retry failed operations

### Error UI Components
- [ ] Create `components/ui/error-state.tsx`
  - Error illustration
  - Error message
  - Action buttons (retry, go back)

- [ ] Create `components/ui/connection-status.tsx`
  - Online/Offline indicator
  - Reconnecting state
  - Last sync timestamp

### Logging
- [ ] Install winston or pino
  ```bash
  npm install pino pino-pretty
  ```

- [ ] Create `lib/logger.ts`
  - Structured logging
  - Log levels (error, warn, info, debug)
  - Context enrichment

- [ ] Add logging to critical paths
  - Authentication events
  - Database operations
  - Socket events
  - Error occurrences

### Testing
- [ ] Test error boundary (throw error manually)
- [ ] Test API error responses
- [ ] Test socket error handling
- [ ] Test Sentry error reporting
- [ ] Test connection status indicator

**Estimated Time:** 8-10 hours  
**Priority:** 🔴 CRITICAL  
**Blocker for:** Production debugging

---

# 📅 WEEK 2-3: PRODUCTION READINESS (10 days)

## Sprint 2: Security & Infrastructure

### Authorization/RBAC (8-10 hours)
- [ ] Define roles enum
  ```typescript
  enum Role {
    ADMIN = 'admin',       // Full access
    MODERATOR = 'moderator', // Operator + Display
    VIEWER = 'viewer'       // Display only
  }
  ```

- [ ] Create `lib/auth/permissions.ts`
  - Permission matrix
  - can() helper function
  - Role-based access checks

- [ ] Add role to User schema
- [ ] Update middleware for role checks
- [ ] Protect API routes by role
- [ ] Update UI to show/hide based on permissions

- [ ] Test role enforcement
  - Admin can access everything
  - Moderator cannot access settings
  - Viewer cannot control (read-only)

**Priority:** 🟡 HIGH

---

### Input Validation (8-10 hours)
- [ ] Install Zod
  ```bash
  npm install zod
  ```

- [ ] Create validation schemas
  - `lib/validation/profile.ts` (ProfileSchema)
  - `lib/validation/question.ts` (QuestionSchema, QuestionsArraySchema)
  - `lib/validation/auth.ts` (LoginSchema, RegisterSchema)
  - `lib/validation/settings.ts` (SettingsSchema)

- [ ] Apply validation to API routes
  - Validate request body
  - Return validation errors (400)
  - Sanitize input (DOMPurify for text)

- [ ] Enhance Excel import validation
  - Duplicate number detection
  - Category validation
  - Required fields check
  - Data type validation
  - Row-level error reporting

- [ ] Add client-side validation
  - Form validation with Zod
  - Real-time feedback
  - Inline error messages

- [ ] Test validation
  - Valid input succeeds
  - Invalid input rejected
  - Error messages helpful

**Priority:** 🟡 HIGH

---

### Rate Limiting (4-6 hours)
- [ ] Install rate limiters
  ```bash
  npm install express-rate-limit rate-limiter-flexible
  ```

- [ ] Create `server.js` rate limiting
  - Global limit: 100 requests/minute
  - Socket event limit: 10 events/second per client
  - State update limit: 5/second per client

- [ ] Create API rate limiting
  - `lib/api/rate-limit.ts`
  - Per-IP limiting
  - Per-user limiting (after auth)
  - Different limits per endpoint

- [ ] Add rate limit headers
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset

- [ ] Handle rate limit errors
  - 429 Too Many Requests
  - Retry-After header
  - User-friendly message

- [ ] Test rate limiting
  - Rapid requests blocked
  - Normal usage unaffected
  - Rate limit resets correctly

**Priority:** 🟡 HIGH

---

### Security Hardening (6-8 hours)
- [ ] Fix CORS configuration
  ```typescript
  // server.js
  const io = new Server(server, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true
    }
  });
  ```

- [ ] Add security headers
  - Install helmet
    ```bash
    npm install helmet
    ```
  - Configure in server.js
  - CSP, HSTS, X-Frame-Options, etc.

- [ ] File upload security
  - File type validation (magic bytes, not just extension)
  - File size limit (5MB)
  - Virus scanning (optional: ClamAV)
  - Sanitize filename
  - Store in secure location

- [ ] XSS prevention
  - Install DOMPurify
    ```bash
    npm install isomorphic-dompurify
    ```
  - Sanitize all user input
  - Escape output (React does this by default)

- [ ] Environment variable security
  - Create `.env.example`
  - Validate env vars on startup
  - Never commit secrets
  - Use secret manager in production

- [ ] Dependency security
  - Run `npm audit`
  - Fix critical vulnerabilities
  - Add `npm audit` to CI/CD

- [ ] Test security
  - Penetration testing basics
  - OWASP Top 10 checklist
  - Security headers verification

**Priority:** 🟡 HIGH

---

### Backup System (6-8 hours)
- [ ] Create backup utilities
  - `lib/backup/export.ts`
    - Export all data to JSON
    - Include metadata (timestamp, version)
    - Compress (gzip)

  - `lib/backup/import.ts`
    - Validate backup file structure
    - Version compatibility check
    - Import with transaction
    - Rollback on error

- [ ] Create backup UI
  - `app/settings/backup/page.tsx`
  - Export button (downloads .json.gz)
  - Import button (file upload)
  - Backup history list
  - Restore confirmation dialog

- [ ] Automated database backup
  - Cron job (if self-hosted)
  - OR use Supabase automated backups
  - Daily backups
  - Retention: 7 days

- [ ] Backup restoration testing
  - Test restore from backup
  - Verify data integrity
  - Test with corrupted backup

- [ ] Disaster recovery documentation
  - `DISASTER_RECOVERY.md`
  - Step-by-step restore process
  - Contact information
  - RTO/RPO definitions

**Priority:** 🟡 HIGH

---

### Monitoring Setup (4-6 hours)
- [ ] Sentry dashboard configuration
  - Error grouping rules
  - Alert rules (email/slack)
  - Performance monitoring
  - Release tracking

- [ ] Uptime monitoring
  - Setup UptimeRobot (free)
  - OR use Better Uptime
  - Monitor /api/health endpoint
  - Alert on downtime

- [ ] Create health check endpoint
  - `app/api/health/route.ts`
  - Check database connection
  - Check Socket.IO server
  - Return status + timestamp

- [ ] Performance monitoring
  - Enable Next.js analytics
  - Track Core Web Vitals
  - Monitor API response times

- [ ] Custom business metrics
  - Active sessions count
  - Questions answered per day
  - Average session duration
  - Error rate

- [ ] Setup monitoring dashboard
  - Sentry for errors
  - Vercel Analytics for performance
  - UptimeRobot for uptime

**Priority:** 🟡 HIGH

---

# 📅 WEEK 4: TESTING & LAUNCH PREP (5 days)

## Manual Testing (16-20 hours)

### Functional Testing
- [ ] Test all authentication flows
  - Login with valid credentials
  - Login with invalid credentials
  - Logout
  - Protected route access
  - Session persistence

- [ ] Test all CRUD operations
  - Create profile
  - Update profile
  - Delete profile
  - Switch profile
  - Import questions (Excel)
  - Update settings

- [ ] Test real-time synchronization
  - Operator → Display sync
  - Operator → Remote sync
  - Operator → OBS sync
  - Multiple clients simultaneously

- [ ] Test question flow
  - Select question
  - Toggle answer
  - Mark as used
  - Reset question
  - Navigate questions

- [ ] Test all 6 display modes
  - / (dashboard)
  - /operator
  - /display
  - /interactive
  - /remote
  - /obs
  - /obs-split
  - /papan-soal
  - /settings

### Cross-browser Testing
- [ ] Chrome (Windows/Mac)
- [ ] Firefox (Windows/Mac)
- [ ] Safari (Mac/iOS)
- [ ] Edge (Windows)

### Cross-device Testing
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (iPad)
- [ ] Mobile (iPhone, Android)

### Network Conditions
- [ ] Fast 3G
- [ ] Slow 3G
- [ ] Offline → Online recovery
- [ ] Socket disconnect → reconnect

### Load Testing (Basic)
- [ ] Test with 500+ questions
- [ ] Test rapid question switching
- [ ] Test multiple concurrent users (5+)
- [ ] Test long-running session (4+ hours)

### Security Testing
- [ ] SQL injection attempts (N/A - using ORM)
- [ ] XSS attempts (script tags in input)
- [ ] CSRF attempts
- [ ] Rate limit enforcement
- [ ] File upload malicious files
- [ ] Unauthorized access attempts

### Usability Testing
- [ ] First-time user setup (no guidance)
- [ ] Operator flow (intuitive?)
- [ ] Remote control (easy to use?)
- [ ] Error messages (helpful?)
- [ ] Recovery from errors (possible?)

**Priority:** 🔴 CRITICAL

---

## Bug Fixing (8-12 hours)
- [ ] Fix all critical bugs found in testing
- [ ] Fix all high-priority bugs
- [ ] Document known medium/low bugs

**Priority:** 🔴 CRITICAL

---

## Documentation (8-10 hours)
- [ ] Create `DEPLOYMENT.md`
  - Environment setup
  - Database setup
  - Secrets configuration
  - Deployment steps
  - Rollback procedure

- [ ] Create `USER_GUIDE.md`
  - Setup wizard
  - Operator guide
  - Remote control guide
  - Settings configuration
  - Troubleshooting

- [ ] Create `API_DOCUMENTATION.md`
  - All API endpoints
  - Request/response examples
  - Authentication
  - Error codes

- [ ] Update `README.md`
  - Production setup instructions
  - Environment variables
  - Database migration steps

- [ ] Create `SUPPORT.md`
  - Common issues
  - FAQ
  - Contact information
  - Bug reporting process

**Priority:** 🟡 HIGH

---

## Staging Deployment (4-6 hours)
- [ ] Setup staging environment
  - Vercel/Railway/Render
  - Separate database
  - Environment variables

- [ ] Deploy to staging
  - Run migrations
  - Seed initial data
  - Test deployment

- [ ] Staging testing
  - Full testing cycle on staging
  - Performance testing
  - Multi-user testing

- [ ] Fix staging issues

**Priority:** 🟡 HIGH

---

# 📅 WEEK 5: PRODUCTION LAUNCH (Optional - can be same as Week 4)

## Production Deployment (4-6 hours)
- [ ] Setup production environment
  - Domain configuration
  - SSL certificate
  - Database (production tier)
  - Monitoring alerts

- [ ] Deploy to production
  - Run migrations
  - Seed initial admin user
  - Verify all services running

- [ ] Smoke testing production
  - Test login
  - Test one complete flow
  - Verify monitoring working
  - Verify backups scheduled

**Priority:** 🔴 CRITICAL

---

## User Training (4-6 hours)
- [ ] Prepare training materials
  - Video tutorial (screen recording)
  - Quick start guide (PDF)
  - Cheat sheet (shortcuts, tips)

- [ ] Conduct training session
  - Operator training (1-2 hours)
  - Remote control demo (30 min)
  - Q&A session

- [ ] Create support channel
  - WhatsApp group
  - Email support
  - Issue tracker

**Priority:** 🟡 HIGH

---

## Launch Checklist
- [ ] All critical bugs fixed
- [ ] Documentation complete
- [ ] Backups configured
- [ ] Monitoring alerts working
- [ ] Support ready
- [ ] Training completed
- [ ] Rollback plan ready
- [ ] Announcement prepared

**Priority:** 🔴 CRITICAL

---

# 📋 QUICK WINS (Can do anytime, <2 hours each)

- [ ] Fix CORS to whitelist origins only
- [ ] Create `.env.example` file
- [ ] Remove dead code (`components/features/DashboardStats.tsx`)
- [ ] Download islamic pattern image locally (no external URL)
- [ ] Add environment variable validation with Zod
- [ ] Create constants file for magic numbers (MAX_QUESTIONS = 200, etc.)
- [ ] Add `data-testid` attributes for testing
- [ ] Create loading spinner component
- [ ] Add keyboard shortcut hints in UI
- [ ] Create favicon (replace default Next.js)

---

# 🐛 KNOWN BUGS TO FIX

## Critical
- [ ] **Race condition on socket state update** (server.js:31)
  - Add state locking mechanism
  - Add version/timestamp to state

- [ ] **localStorage quota exceeded** (lib/store.ts)
  - Add error handling
  - Show warning to user
  - Implement compression or move to IndexedDB

- [ ] **Socket listener memory leak** (lib/store.ts:246)
  - Add cleanup in useEffect
  - Remove listeners on unmount

## High
- [ ] **Socket disconnect no reconnect** (lib/store.ts:14)
  - Add reconnection configuration
  - Show connection status to user

- [ ] **Excel import duplicate nomor** (app/operator/page.tsx:68)
  - Add duplicate detection
  - Show error with row numbers

- [ ] **Profile switch doesn't reset display** (lib/store.ts:105)
  - Add force reset event
  - Broadcast to all clients

## Medium
- [ ] **QR code localhost issue** (app/operator/page.tsx:306)
  - Detect localhost
  - Fetch actual IP
  - Show prominent warning

- [ ] **Grid count calculation wrong** (app/operator/page.tsx:86)
  - Fix formula to show ALL questions
  - Math.max(totalQuota, questions.length, 100)

- [ ] **Framer Motion animation blocking** (multiple pages)
  - Shorten animation duration
  - Add AnimatePresence mode="wait"

## Low
- [ ] **Dark mode flash on load** (app/layout.tsx)
  - Add inline script to prevent flash
  - Check localStorage before hydration

---

# 📊 PROGRESS TRACKING

## Sprint 1 (Week 1) - Completed: 0/3
- [ ] Authentication System
- [ ] Database Migration
- [ ] Error Handling

## Sprint 2 (Week 2-3) - Completed: 0/6
- [ ] Authorization/RBAC
- [ ] Input Validation
- [ ] Rate Limiting
- [ ] Security Hardening
- [ ] Backup System
- [ ] Monitoring Setup

## Sprint 3 (Week 4) - Completed: 0/4
- [ ] Manual Testing
- [ ] Bug Fixing
- [ ] Documentation
- [ ] Staging Deployment

## Sprint 4 (Week 5) - Completed: 0/2
- [ ] Production Deployment
- [ ] User Training

**Total Tasks:** 35  
**Completed:** 0  
**Progress:** 0%

---

# 🎯 SUCCESS CRITERIA

- [ ] All critical bugs fixed
- [ ] Authentication working (login/logout/protected routes)
- [ ] Database storing all data (no localStorage)
- [ ] Error rate < 0.1%
- [ ] Uptime > 99%
- [ ] Security audit passed (no critical vulnerabilities)
- [ ] Manual testing passed (all flows work)
- [ ] Documentation complete
- [ ] User training completed
- [ ] Production deployed successfully

---

# 📞 SUPPORT & ESCALATION

**Technical Issues:**
- Check `TROUBLESHOOTING.md`
- Check error logs (Sentry)
- Check server logs

**Urgent Issues:**
- Contact: [Your contact]
- Response time: < 2 hours

**Rollback Decision:**
- Error rate > 5%
- Critical functionality broken
- Security breach detected

---

**Last Updated:** 2026-07-04  
**Next Review:** End of Week 1
