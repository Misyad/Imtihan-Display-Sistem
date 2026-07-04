# 🔐 Authentication Implementation Guide

**Last Updated:** 2026-07-04  
**Estimated Time:** 16-20 hours  
**Difficulty:** Medium

---

## 📋 Overview

This guide will walk you through implementing a complete authentication system using:
- **NextAuth.js v5** (Beta) - Modern authentication for Next.js
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Production-ready database
- **bcryptjs** - Password hashing

---

## 🎯 What You'll Build

- ✅ Login page with email/password
- ✅ Session management with JWT
- ✅ Protected routes (middleware)
- ✅ Role-based access control (RBAC)
- ✅ Logout functionality
- ✅ User management API

---

## 📦 Step 1: Install Dependencies (5 minutes)

```bash
npm install next-auth@beta @auth/drizzle-adapter drizzle-orm drizzle-kit pg bcryptjs
npm install -D @types/bcryptjs @types/pg
```

**Verify installation:**
```bash
npm list next-auth drizzle-orm bcryptjs
```

---

## 🗄️ Step 2: Database Schema (30 minutes)

### Create `lib/db/schema.ts`

```typescript
import { pgTable, text, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core';

// Role enum
export const roleEnum = pgEnum('role', ['admin', 'moderator', 'viewer']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(), // hashed
  name: text('name').notNull(),
  role: roleEnum('role').notNull().default('viewer'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// NextAuth required tables
export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: timestamp('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state')
});

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionToken: text('session_token').notNull().unique(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull()
});

export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull().unique(),
  expires: timestamp('expires').notNull()
});

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

---

## 🔌 Step 3: Database Connection (15 minutes)

### Create `lib/db/index.ts`

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
```

### Create `drizzle.config.ts` (at root)

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  }
} satisfies Config;
```

### Generate and Run Migrations

```bash
# Generate migration files
npx drizzle-kit generate:pg

# Push to database (for development)
npx drizzle-kit push:pg

# Or run migrations (for production)
npx drizzle-kit migrate
```

---

## 🔑 Step 4: Password Utilities (20 minutes)

### Create `lib/auth/password.ts`

```typescript
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string, 
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

---

## 🔐 Step 5: NextAuth Configuration (45 minutes)

### Create `.env.local`

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/imtihan

# NextAuth
NEXTAUTH_SECRET=your-secret-key-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# For production
# NEXTAUTH_URL=https://yourdomain.com
```

**Generate secret:**
```bash
openssl rand -base64 32
```

### Create `auth.ts` (at root or `lib/auth/config.ts`)

```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { verifyPassword } from '@/lib/auth/password';
import { eq } from 'drizzle-orm';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        // Find user by email
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .limit(1);

        if (!user) {
          throw new Error('Invalid credentials');
        }

        // Verify password
        const isValidPassword = await verifyPassword(
          credentials.password as string,
          user.password
        );

        if (!isValidPassword) {
          throw new Error('Invalid credentials');
        }

        // Return user without password
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  }
});
```

### Create `app/api/auth/[...nextauth]/route.ts`

```typescript
import { handlers } from '@/auth';

export const { GET, POST } = handlers;
```

### Update `types/next-auth.d.ts` (create if not exists)

```typescript
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'admin' | 'moderator' | 'viewer';
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: 'admin' | 'moderator' | 'viewer';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'admin' | 'moderator' | 'viewer';
  }
}
```

---

## 🛡️ Step 6: Protected Routes Middleware (30 minutes)

### Create `middleware.ts` (at root)

```typescript
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/operator',
  '/settings',
  '/papan-soal',
];

// Routes that are public (viewing only)
const publicRoutes = [
  '/display',
  '/interactive',
  '/remote',
  '/obs',
  '/obs-split',
  '/',
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isProtectedRoute && !req.auth) {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

## 📄 Step 7: Login Page (60 minutes)

### Create `app/(auth)/login/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/operator';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email atau password salah');
        setLoading(false);
        return;
      }

      // Redirect on success
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-950/20 via-zinc-950 to-black" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/patterns/islamic-art.png')]" />

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-zinc-900 rounded-[3rem] p-12 border border-white/5 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-600/20">
              <span className="text-2xl font-black text-white">IM</span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
              Imtihan Display
            </h1>
            <p className="text-sm text-zinc-400 uppercase tracking-widest">
              Login ke Dashboard
            </p>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
              <p className="text-sm text-rose-500 font-medium">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-[10px] font-black uppercase tracking-widest text-zinc-400"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full p-4 rounded-2xl bg-zinc-800 border-2 border-transparent focus:border-emerald-500 text-white font-medium transition-all outline-none disabled:opacity-50"
                placeholder="admin@imtihan.local"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-[10px] font-black uppercase tracking-widest text-zinc-400"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full p-4 rounded-2xl bg-zinc-800 border-2 border-transparent focus:border-emerald-500 text-white font-medium transition-all outline-none disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-black uppercase tracking-widest hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Login
                </>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-8 p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/50">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-black">
              Demo Credentials
            </p>
            <p className="text-xs text-zinc-400 font-mono">
              admin@imtihan.local / Admin123!
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-600 mt-6 uppercase tracking-widest">
          &copy; 2024 Imtihan Display System
        </p>
      </motion.div>
    </div>
  );
}
```

### Create layout for auth pages `app/(auth)/layout.tsx`

```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

---

## 👤 Step 8: Create Seed Admin User (30 minutes)

### Create `scripts/seed-admin.ts`

```typescript
import { db } from '../lib/db';
import { users } from '../lib/db/schema';
import { hashPassword } from '../lib/auth/password';

async function seedAdmin() {
  console.log('🌱 Seeding admin user...');

  const email = 'admin@imtihan.local';
  const password = 'Admin123!'; // Change this!
  const name = 'Administrator';
  const role = 'admin';

  try {
    const hashedPassword = await hashPassword(password);

    await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
      role,
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('   ⚠️  CHANGE THE PASSWORD AFTER FIRST LOGIN!');
  } catch (error) {
    if (error.code === '23505') {
      console.log('ℹ️  Admin user already exists');
    } else {
      console.error('❌ Error seeding admin:', error);
      throw error;
    }
  }

  process.exit(0);
}

seedAdmin();
```

### Add script to `package.json`

```json
{
  "scripts": {
    "seed:admin": "tsx scripts/seed-admin.ts"
  }
}
```

### Install tsx

```bash
npm install -D tsx
```

### Run seed script

```bash
npm run seed:admin
```

---

## 🔓 Step 9: Logout Functionality (15 minutes)

### Create `app/api/auth/signout/route.ts` (if needed)

NextAuth handles this automatically, but you can customize if needed.

### Add logout button to header

Update `app/layout.tsx` or create a `LogoutButton` component:

```typescript
// components/auth/logout-button.tsx
'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all text-sm font-bold"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  );
}
```

### Add to operator page header

```typescript
// app/operator/page.tsx
import { LogoutButton } from '@/components/auth/logout-button';
import { auth } from '@/auth';

export default async function OperatorPage() {
  const session = await auth();
  
  return (
    <nav className="...">
      <div className="flex items-center gap-4">
        <p className="text-sm text-zinc-400">
          {session?.user?.name} ({session?.user?.role})
        </p>
        <LogoutButton />
      </div>
    </nav>
  );
}
```

---

## ✅ Step 10: Testing (30 minutes)

### Manual Testing Checklist

- [ ] **Login with valid credentials**
  1. Go to http://localhost:3000/login
  2. Enter admin@imtihan.local / Admin123!
  3. Should redirect to /operator
  4. Should see user name in header

- [ ] **Login with invalid credentials**
  1. Enter wrong password
  2. Should show error message
  3. Should not redirect

- [ ] **Protected route access (not logged in)**
  1. Clear cookies (logout)
  2. Try to access /operator directly
  3. Should redirect to /login
  4. Should have callbackUrl in URL

- [ ] **Protected route access (logged in)**
  1. Login
  2. Access /operator
  3. Should load normally

- [ ] **Public route access (not logged in)**
  1. Logout
  2. Access /display
  3. Should load normally (no redirect)

- [ ] **Logout**
  1. Click logout button
  2. Should redirect to /login
  3. Try to access /operator
  4. Should redirect to /login (session cleared)

- [ ] **Session persistence**
  1. Login
  2. Close browser
  3. Open browser again
  4. Go to /operator
  5. Should still be logged in (no redirect)

### Automated Testing (Optional)

```typescript
// __tests__/auth.test.ts
import { describe, it, expect } from 'vitest';
import { verifyPassword, hashPassword } from '@/lib/auth/password';

describe('Password utilities', () => {
  it('should hash password correctly', async () => {
    const password = 'Test123!';
    const hash = await hashPassword(password);
    
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(50);
  });

  it('should verify correct password', async () => {
    const password = 'Test123!';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword(password, hash);
    
    expect(isValid).toBe(true);
  });

  it('should reject incorrect password', async () => {
    const password = 'Test123!';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword('WrongPassword', hash);
    
    expect(isValid).toBe(false);
  });
});
```

---

## 🐛 Troubleshooting

### Issue: "NEXTAUTH_SECRET environment variable is not set"
**Solution:** Add `NEXTAUTH_SECRET` to `.env.local`
```bash
openssl rand -base64 32
```

### Issue: "Database connection failed"
**Solution:** 
1. Verify PostgreSQL is running
2. Check `DATABASE_URL` in `.env.local`
3. Test connection: `psql $DATABASE_URL`

### Issue: "Cannot find module 'next-auth'"
**Solution:** Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Login redirects to error page
**Solution:** Check server console for errors. Common causes:
- User not found (run seed script)
- Wrong password
- Database not migrated

### Issue: "Session user is undefined"
**Solution:** Check JWT callback in `auth.ts` - make sure you're adding user data to token

---

## 🚀 Next Steps

After completing authentication:

1. ✅ **Implement Authorization (RBAC)**
   - See `GUIDE_RBAC.md`
   - Add role checks to pages
   - Restrict API endpoints by role

2. ✅ **Add User Management**
   - Create user CRUD API
   - Build user management UI in /settings
   - Allow admin to create/edit/delete users

3. ✅ **Enhance Security**
   - Add password reset flow
   - Implement email verification
   - Add 2FA (optional)
   - Add account lockout after failed attempts

4. ✅ **Update Socket.IO**
   - Add authentication to socket connections
   - Verify JWT token on socket connection
   - Restrict events by user role

---

## 📚 Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)

---

**Estimated Total Time:** 16-20 hours  
**Completion Checklist:** 10/10 steps  
**Status:** ✅ Ready for implementation

---

*Good luck! If you encounter any issues, check the troubleshooting section or reach out for support.*
