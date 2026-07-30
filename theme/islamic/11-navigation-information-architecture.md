# 11-navigation-information-architecture.md

# Imtihan Display System
## Navigation & Information Architecture

Version : 3.0

Status : Production

---

# Purpose

Dokumen ini mendefinisikan struktur informasi aplikasi,
alur navigasi,
hierarki halaman,
hubungan antar modul,
serta perjalanan pengguna (User Journey).

Navigation harus:

- Predictable
- Consistent
- Fast
- Role Based
- Realtime Friendly

---

# IA Principles

Semua informasi disusun berdasarkan:

Task First

↓

Frequency

↓

Role

↓

Hierarchy

↓

Security

Artinya halaman yang paling sering digunakan harus paling mudah diakses.

---

# Navigation Philosophy

User tidak boleh berpikir:

"Saya harus klik menu mana?"

User harus langsung tahu.

Navigasi harus natural.

---

# Global Navigation

Top Navigation

```
Logo

Dashboard
Event
Session
Question Bank
Participants
Reports
Settings

User Profile
```

---

# Secondary Navigation

Digunakan untuk halaman yang kompleks.

Contoh:

Event

```
Overview

Sessions

Participants

Questions

Reports

Settings
```

---

# Breadcrumb

Seluruh halaman level 3 wajib memiliki breadcrumb.

Contoh:

Dashboard

>

Event

>

Session

>

Operator

---

# Sitemap

```
Login
│
├── Dashboard
│
├── Events
│   ├── List
│   ├── Create
│   ├── Detail
│   ├── Edit
│   └── Archive
│
├── Sessions
│   ├── List
│   ├── Operator
│   ├── Display
│   ├── Interactive
│   ├── OBS Overlay
│   └── OBS Split
│
├── Question Bank
│   ├── Categories
│   ├── Questions
│   ├── Import
│   ├── Export
│   └── History
│
├── Participants
│
├── Reports
│
├── Settings
│
└── Profile
```

---

# Navigation Depth

Ideal:

3 Level

Maximum:

4 Level

Tidak boleh lebih.

---

# User Journey

Administrator

```
Login

↓

Dashboard

↓

Create Event

↓

Create Session

↓

Assign Operator

↓

Publish

↓

Finish
```

---

Operator

```
Login

↓

Dashboard

↓

Operator

↓

Edit Question

↓

Publish

↓

Next Question
```

---

Observer

```
Login

↓

Dashboard

↓

Reports

↓

Statistics
```

---

Guest

```
Display Only
```

---

# Module Relationship

Dashboard

↓

Event

↓

Session

↓

Question

↓

Display

↓

Report

Semua modul saling terhubung.

---

# Context Navigation

Saat membuka Session.

Harus tersedia shortcut ke:

Operator

Display

OBS

Interactive

Reports

---

# Quick Navigation

Shortcut

Ctrl + K

Membuka Global Search.

---

# Recently Opened

Simpan:

5 halaman terakhir.

---

# Favorites

User dapat menyimpan menu favorit.

---

# Search Navigation

Global Search harus dapat mencari:

Event

Session

Question

Participant

Report

User

---

# Deep Linking

Setiap halaman harus memiliki URL yang dapat dibagikan.

Contoh:

/events/123

/sessions/123/operator

/questions/456

---

# URL Convention

Gunakan:

kebab-case

Contoh:

question-bank

session-report

event-detail

---

# Route Groups

Public

/login

---

Authenticated

/dashboard

/events

/sessions

/questions

---

Display

/display

/interactive

/obs

---

# Permission Matrix

Administrator

Semua Route

Operator

Operator

Display

Question

Observer

Read Only

Guest

Display

---

# Navigation State

Menu aktif selalu memiliki:

Gold Indicator

Bold Text

Emerald Background

---

# Scroll Position

Saat kembali ke halaman sebelumnya.

Scroll harus dipulihkan.

---

# Back Navigation

Browser Back

Harus bekerja.

Tidak kehilangan state.

---

# Unsaved Changes

Jika user keluar.

Munculkan dialog:

"You have unsaved changes."

---

# Empty Navigation

Jika user tidak memiliki permission.

Sembunyikan menu.

Jangan disable.

---

# Notification Navigation

Klik notifikasi.

Harus langsung membuka halaman terkait.

---

# Mobile Navigation

Drawer

Bottom Sheet

Search

---

# Display Navigation

Display tidak memiliki menu.

Hanya fullscreen.

---

# OBS Navigation

OBS tidak memiliki menu.

Hanya overlay.

---

# Error Navigation

404

↓

Back

↓

Dashboard

---

# Loading Navigation

Gunakan Top Progress Bar.

Bukan Fullscreen Loader.

---

# Navigation Analytics

Catat:

Most Visited

Last Opened

Search Keywords

Shortcut Usage

---

# Navigation QA Checklist

✓ Semua menu memiliki tujuan yang jelas.

✓ Tidak ada halaman yatim (orphan page).

✓ Semua halaman dapat dicapai dalam ≤3 klik.

✓ Breadcrumb selalu benar.

✓ URL konsisten.

✓ Browser Back berfungsi.

✓ Permission sesuai.

✓ Deep Link valid.

---

# Final Principle

Navigasi bukan sekadar daftar menu.

Navigasi adalah peta yang membantu pengguna menyelesaikan pekerjaannya secepat mungkin.

Setiap klik harus terasa logis.

Setiap halaman harus memiliki konteks.

Setiap pengguna harus selalu tahu di mana mereka berada.