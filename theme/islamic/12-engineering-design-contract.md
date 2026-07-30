# 12-engineering-design-contract.md

# Imtihan Display System
## Engineering Design Contract

Version : 1.0

Status : Mandatory

Owner :
Product Team
Frontend Team
Design Team

---

# Purpose

Dokumen ini adalah kontrak antara Designer dan Frontend Engineer.

Seluruh implementasi UI wajib mengikuti aturan pada dokumen ini.

Tidak ada pengecualian.

---

# Golden Rule

UI bukan dibuat di halaman.

UI dibangun dari Design System.

---

# Architecture

Design System

↓

Reusable Components

↓

Business Components

↓

Pages

↓

Features

Halaman hanya menyusun komponen.

---

# Source of Truth

Seluruh visual berasal dari:

Design Tokens

↓

Theme

↓

Components

↓

Page

Bukan sebaliknya.

---

# Forbidden

Tidak diperbolehkan:

Hardcoded Color

Hardcoded Radius

Hardcoded Shadow

Hardcoded Font Size

Hardcoded Animation

Hardcoded Margin

Hardcoded Padding

---

Contoh

❌

```

className="bg-[#0F6D54]"

```

Harus

✅

```

className="bg-primary"

```

---

# Color Contract

Semua warna berasal dari:

theme.css

atau

tailwind.config.ts

---

Tidak boleh:

```

style={{
background:"#006633"
}}

```

---

# Typography Contract

Semua ukuran font menggunakan token.

Contoh

```

text-title

text-body

text-caption

```

---

Tidak diperbolehkan

```

text-[17px]

```

---

# Radius Contract

Gunakan:

radius-sm

radius-md

radius-lg

radius-xl

---

Tidak boleh:

```

rounded-[13px]

```

---

# Shadow Contract

Gunakan

shadow-sm

shadow-md

shadow-lg

shadow-premium

---

Tidak boleh:

```

shadow-[0_12px_30px_rgba(...)]

```

---

# Animation Contract

Gunakan:

motion-fast

motion-normal

motion-slow

---

Tidak boleh:

transition-all duration-700

---

# Component Contract

Halaman tidak boleh membuat Button baru.

Harus memakai

UiButton

---

Tidak boleh membuat Card baru.

Harus memakai

UiCard

---

Tidak boleh membuat Dialog baru.

Harus memakai

UiDialog

---

# Folder Structure

```

app/

components/

ui/

business/

layouts/

hooks/

services/

stores/

types/

utils/

```

---

# Import Rules

Seluruh halaman mengimpor dari:

components/ui

atau

components/business

---

Tidak boleh langsung membuat JSX panjang.

---

# Maximum JSX Depth

Ideal

5 Level

Maximum

7 Level

---

# File Size

Ideal

<200 Lines

Maximum

400 Lines

---

# Component Responsibility

Satu komponen.

Satu tanggung jawab.

---

# Smart vs Dumb Component

UI

Tidak tahu API.

Business Component

Boleh tahu data.

Page

Mengatur flow.

---

# State Rules

Global

Zustand

Server

TanStack Query

Local

React State

---

# Socket Rules

Socket tidak boleh berada di Button.

Socket hanya boleh berada di:

hooks

services

providers

---

# API Rules

Tidak boleh fetch di UI Component.

Gunakan Service Layer.

---

# Theme Rules

Dark

Light

Islamic Theme

Harus menggunakan Theme Provider.

---

# CSS Rules

Gunakan:

Tailwind

CSS Variables

Layer Utilities

---

Tidak boleh:

Inline Style

Kecuali nilai dinamis.

---

# Icon Rules

Gunakan satu library.

Lucide

atau

Heroicons

---

Tidak boleh campur.

---

# Image Rules

Gunakan:

next/image

---

Tidak boleh:

img

---

# Accessibility Contract

Semua komponen wajib memiliki:

ARIA

Keyboard

Focus

Label

---

# Performance Contract

Lazy Load

Dynamic Import

Memo

Virtual Table

Image Optimization

---

# Error State

Semua page memiliki:

Loading

Empty

Error

Offline

Forbidden

---

# Responsive Contract

Semua komponen wajib:

Desktop

Tablet

Mobile

Display

---

# Logging

Tidak boleh:

console.log

di production.

---

# Testing

Setiap Business Component wajib memiliki:

Unit Test

Integration Test

---

# Naming

PascalCase

Untuk Component.

camelCase

Untuk Function.

kebab-case

Untuk Route.

---

# Git Contract

Satu PR

Satu fitur.

---

Tidak boleh

UI + Backend + Refactor

dalam satu PR besar.

---

# Code Review Checklist

✓ Menggunakan Component Library

✓ Menggunakan Design Tokens

✓ Responsive

✓ Accessibility

✓ Performance

✓ Tidak ada Hardcode

✓ Tidak ada Duplicate Component

✓ Tidak ada CSS acak

---

# Pull Request Checklist

✓ Screenshot Desktop

✓ Screenshot Tablet

✓ Screenshot Mobile

✓ Lighthouse

✓ Accessibility

✓ QA

---

# Future Rules

Jika diperlukan komponen baru.

Urutannya:

Design

↓

Review

↓

Design System

↓

Implementation

↓

Release

---

Tidak boleh langsung membuat komponen di halaman.

---

# Final Principle

Design System bukan dokumentasi.

Design System adalah kontrak.

Jika implementasi berbeda dengan Design System.

Maka implementasi yang harus diubah.

Bukan Design System.