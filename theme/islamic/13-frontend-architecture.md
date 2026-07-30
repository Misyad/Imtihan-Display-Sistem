# 13-frontend-architecture.md

# Imtihan Display System
## Frontend Architecture

Version : 1.0

Status : Production

Target Stack

- Next.js 15 (App Router)
- React 19
- TypeScript Strict
- Tailwind CSS v4
- shadcn/ui
- Zustand
- TanStack Query
- Socket.IO
- React Hook Form
- Zod

---

# Vision

Frontend bukan sekadar kumpulan halaman.

Frontend adalah platform.

Semua fitur harus dibangun menggunakan arsitektur modular sehingga dapat berkembang selama bertahun-tahun tanpa menghasilkan technical debt yang besar.

---

# Core Principles

Architecture harus:

Scalable

Maintainable

Testable

Composable

Reusable

Predictable

Realtime Ready

Offline Ready

---

# High Level Architecture

```

Application

↓

Route

↓

Page

↓

Layout

↓

Feature

↓

Business Component

↓

UI Component

↓

Hooks

↓

Services

↓

API

```

Tidak diperbolehkan melewati layer.

---

# Layer Responsibility

## App Layer

Bertanggung jawab terhadap:

- Routing
- Layout
- Metadata
- Middleware
- Authentication Boundary

Tidak mengandung business logic.

---

## Feature Layer

Setiap fitur berdiri sendiri.

Contoh:

```
features/
    dashboard/
    event/
    session/
    operator/
    display/
    question-bank/
    reports/
```

Setiap feature memiliki:

- components
- hooks
- services
- schema
- types
- utils

---

## Business Components

Business Component memahami domain.

Contoh:

```
QuestionCard

SessionCard

EventToolbar

ParticipantTable

StatisticsWidget
```

Business Component boleh menggunakan hook.

---

## UI Components

UI Component bersifat generic.

Contoh:

```
Button

Card

Input

Dialog

Badge

Tabs

Table
```

UI Component tidak boleh mengetahui API.

---

## Hooks Layer

Seluruh logic reusable berada di hook.

Contoh:

```
useSocket()

useQuestion()

useSession()

useCountdown()

useRealtime()
```

---

## Service Layer

Semua komunikasi keluar aplikasi.

Contoh:

```
QuestionService

EventService

SessionService

DisplayService

ReportService
```

Service hanya bertugas:

Request

Response

Transform

Error

---

## Store Layer

Menggunakan Zustand.

Store hanya menyimpan:

UI State

Session State

Realtime State

Theme

Preference

Tidak menyimpan server cache.

---

## Server State

Menggunakan TanStack Query.

Semua data API harus melalui Query.

```
API

↓

Query

↓

Component

```

---

# Data Flow

```
User

↓

Component

↓

Hook

↓

Service

↓

API

↓

TanStack Query

↓

UI Update
```

---

# Realtime Flow

```
Socket.IO

↓

Socket Provider

↓

Feature Hook

↓

Store

↓

UI
```

Tidak boleh:

Socket → Component langsung

---

# Dependency Rule

Layer atas boleh mengetahui layer bawah.

Layer bawah tidak boleh mengetahui layer atas.

```
Page

↓

Feature

↓

Business

↓

UI
```

UI tidak boleh mengimpor Feature.

---

# Error Boundary

Setiap route utama memiliki:

```
error.tsx

loading.tsx

not-found.tsx
```

---

# Route Groups

```
(auth)

(app)

(display)

(obs)

(api)
```

---

# Layout Hierarchy

```
Root Layout

↓

App Layout

↓

Module Layout

↓

Page Layout
```

---

# Feature Communication

Feature tidak boleh saling mengakses store secara langsung.

Gunakan:

Service

atau

Events

---

# State Separation

UI State

↓

Domain State

↓

Server State

↓

Realtime State

↓

Persistent State

Masing-masing memiliki store sendiri.

---

# Theme System

Semua warna berasal dari Theme Provider.

Komponen tidak mengetahui warna.

Komponen hanya mengetahui semantic token.

Contoh:

```
primary

secondary

success

danger

warning
```

---

# Validation

Semua form:

React Hook Form

+

Zod

---

# Forms

```
Input

↓

Validation

↓

Transform

↓

Submit

↓

Toast

↓

Invalidate Query
```

---

# Authentication

Middleware

↓

Session

↓

Permission

↓

Page

Tidak boleh mengecek role di Button.

---

# Authorization

RBAC.

Permission berasal dari server.

---

# Logging

Development:

console

Production:

Logger Service

---

# Configuration

Semua konfigurasi berada di:

```
config/
```

Contoh:

```
api.ts

theme.ts

routes.ts

permission.ts

socket.ts
```

---

# Constants

Seluruh constant berada di:

```
constants/
```

---

# Types

Global Type

```
types/
```

Feature Type

```
features/*/types
```

---

# Utility

```
utils/

helpers/

lib/
```

Dipisahkan dengan jelas.

---

# Performance

Wajib menggunakan:

Dynamic Import

Code Splitting

Lazy Loading

Image Optimization

Memoization

Virtualization

---

# Accessibility

Seluruh UI Component wajib memenuhi:

WCAG 2.2 AA

---

# Testing

UI Component

↓

Unit Test

Business Component

↓

Integration Test

Feature

↓

E2E Test

---

# Folder Ownership

Feature memiliki seluruh resource miliknya.

Tidak boleh saling berbagi file secara acak.

---

# Feature Independence

Menghapus satu feature tidak boleh merusak feature lain.

---

# Scalability

Arsitektur harus mampu berkembang hingga:

100+ halaman

500+ komponen

1000+ route

tanpa refactor besar.

---

# Anti Pattern

Dilarang:

Page > fetch()

Page > socket()

Page > business logic

Component > API

UI > Zustand

Hardcoded URL

Global CSS acak

Shared mutable state

Circular dependency

---

# Quality Gates

Sebelum merge:

✓ Lint

✓ Type Check

✓ Unit Test

✓ Build Success

✓ Accessibility

✓ Responsive

✓ Design QA

---

# Definition of Done

Sebuah fitur dianggap selesai jika:

- Menggunakan Component Library
- Menggunakan Design Tokens
- Mengikuti Feature Architecture
- Responsive
- Accessible
- Memiliki Loading State
- Memiliki Empty State
- Memiliki Error State
- Memiliki Test
- Lolos Code Review

---

# Final Principle

Frontend Architecture dirancang agar aplikasi dapat berkembang menjadi platform enterprise tanpa kehilangan konsistensi, performa, maupun kemudahan pemeliharaan.

Setiap keputusan implementasi harus mengutamakan modularitas, keterbacaan, dan kemudahan pengembangan jangka panjang.