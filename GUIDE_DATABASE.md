# 🗄️ Database Migration Guide

**Last Updated:** 2026-07-04  
**Estimated Time:** 16-20 hours  
**Difficulty:** Medium-High

---

## 📋 Overview

This guide covers migrating from localStorage to PostgreSQL database.

---

## 🎯 Goals

- ✅ PostgreSQL database setup
- ✅ Complete schema with relationships
- ✅ Migration script from localStorage
- ✅ REST API for all operations
- ✅ Updated Zustand store
- ✅ Real-time sync maintained

---

## 📦 Step 1: Database Setup (30 min)

### Option A: Supabase (Recommended)

1. Go to https://supabase.com
2. Create new project
3. Copy connection string
4. Add to `.env.local`:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
```

### Option B: Local PostgreSQL

```bash
# Install PostgreSQL
brew install postgresql@15

# Create database
createdb imtihan

# Connection string
DATABASE_URL=postgresql://localhost:5432/imtihan
```

---

## 🗂️ Step 2: Schema (60 min)

Full schema is too long for this file. See database schema in the audit report section "Database Audit" for complete table definitions including:

- users (authentication)
- profiles (institutions)
- questions
- category_quotas
- used_questions
- sessions
- activity_logs

Key commands:

```bash
# Generate migrations
npx drizzle-kit generate:pg

# Push to database
npx drizzle-kit push:pg
```

---

## 🔄 Step 3: Migration Script (90 min)

Create `scripts/migrate-from-localstorage.ts` to migrate existing data.

Process:
1. Export localStorage from browser console
2. Parse JSON data
3. Insert into PostgreSQL
4. Verify integrity

---

## 🔌 Step 4: API Routes (120 min)

Create REST endpoints:

- `GET/POST /api/profiles`
- `GET/PATCH/DELETE /api/profiles/[id]`
- `GET/POST /api/questions`
- `PATCH/DELETE /api/questions/[id]`

All routes protected with authentication and role-based access.

---

## 🔄 Step 5: Update Zustand Store (60 min)

Modify `lib/store.ts`:

- Remove profiles from Zustand persistence
- Fetch from API on mount
- Keep activeQuestion, showAnswer as client state
- Sync to database via API calls
- Maintain Socket.IO for real-time updates

---

## ✅ Step 6: Testing (30 min)

Test:
- Database connection
- Data migration
- CRUD operations
- Real-time sync still works
- Performance acceptable

---

## 📚 Resources

- Drizzle ORM: https://orm.drizzle.team/
- Supabase: https://supabase.com/docs
- PostgreSQL: https://www.postgresql.org/docs/

---

**Full implementation details available in TODO.md and audit report.**

**Estimated Total Time:** 16-20 hours
