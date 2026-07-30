# 05-application-screens.md

# Imtihan Display System
## Application Screens Specification

Version : 3.0

---

# Introduction

Dokumen ini mendefinisikan seluruh halaman dalam aplikasi.

Setiap halaman memiliki:

- Tujuan
- User
- Layout
- Components
- Interaction
- Empty State
- Loading State
- Error State
- Permission
- Responsive Behavior

Tidak diperbolehkan membuat halaman baru tanpa mengikuti spesifikasi ini.

---

# Navigation Structure

```
Login
│
├── Dashboard
│
├── Event
│   ├── Event List
│   ├── Create Event
│   ├── Edit Event
│   └── Detail Event
│
├── Session
│   ├── Session List
│   ├── Operator
│   ├── Display
│   ├── Interactive Board
│   ├── OBS Overlay
│   └── OBS Split
│
├── Question Bank
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

# Dashboard

## Purpose

Memberikan ringkasan kondisi sistem.

---

## Main Components

Header

Quick Action

Statistics

Current Event

Current Session

Upcoming Schedule

Recent Activity

Server Status

---

## Layout

```
Header

↓

Statistics

↓

Quick Action

↓

Current Event

↓

Session Status

↓

Activity

↓

Server Health
```

---

## Statistics

Menampilkan:

Jumlah Event

Jumlah Peserta

Jumlah Soal

Jumlah Operator

Jumlah Display

Jumlah Session

---

## Quick Actions

Create Event

Start Session

Open Operator

Open Display

Question Bank

Reports

---

## Empty State

Belum ada event.

Tampilkan tombol:

Create First Event

---

## Loading

Skeleton Cards

---

## Error

Alert + Retry

---

# Event List

## Purpose

Mengelola seluruh event.

---

## Components

Toolbar

Search

Filter

Table

Pagination

Bulk Action

---

## Table Columns

Nama Event

Tanggal

Lokasi

Status

Operator

Session

Action

---

## Actions

View

Edit

Duplicate

Archive

Delete

---

# Event Detail

Menampilkan seluruh informasi event.

Tab:

Overview

Sessions

Participants

Questions

Settings

Reports

---

# Session List

Menampilkan seluruh sesi dalam event.

Card View.

---

# Operator

## Purpose

Operator mengendalikan jalannya ujian.

---

## Layout

```
Toolbar

↓

Question Navigator

↓

Question Editor

↓

Preview

↓

Live Status
```

---

## Components

Question List

Editor

Image Upload

Answer Manager

Arabic Editor

Live Preview

Socket Status

Timer

---

## Actions

Next

Previous

Publish

Hide

Reset

Save

Duplicate

Delete

---

## Live Information

Audience Connected

Operator Connected

Latency

Current Question

---

# Display

## Purpose

Menampilkan soal kepada peserta.

---

## Layout

```
Logo

↓

Question

↓

Image

↓

Options

↓

Footer
```

---

## Rules

Tidak ada sidebar.

Tidak ada tombol.

Mode fullscreen.

---

# Interactive Board

## Purpose

Media interaksi peserta.

---

## Components

Question Grid

Selection

Voting

Result

Timer

---

# OBS Overlay

## Purpose

Overlay untuk OBS Studio.

---

## Elements

Question

Answer

Logo

Session

Lower Third

Sponsor

Watermark

---

# OBS Split

Layout untuk operator dan OBS.

```
Operator

│

OBS Preview
```

---

# Question Bank

## Purpose

Manajemen seluruh bank soal.

---

## Toolbar

Create

Import

Export

Duplicate

Category

Search

---

## Table

Question

Category

Difficulty

Updated

Action

---

## Editor

Question

Image

Choices

Correct Answer

Explanation

Reference

Tags

---

## Preview

Realtime Preview

---

# Participants

## Components

Table

Search

Import Excel

Export

QR Code

Print Badge

Attendance

---

# Reports

Charts

Statistics

Attendance

Session Result

Question Usage

Operator Activity

Export PDF

Export Excel

---

# Settings

## Sections

General

Theme

Socket

Display

OBS

Users

Roles

Permissions

System

Backup

---

# Profile

Avatar

Personal Information

Password

Activity

Sessions

Devices

---

# Login

## Components

Logo

Title

Username

Password

Remember Me

Login

Version

---

# Permission Matrix

Administrator

Semua akses.

---

Operator

Operator + Display.

---

Observer

Read Only.

---

Guest

Display Only.

---

# Common Loading

Skeleton

Progress

Spinner

---

# Common Empty State

Illustration

Title

Description

Action

---

# Common Error

Icon

Description

Retry

Contact Administrator

---

# Responsive Rules

Desktop

Semua fitur.

Tablet

Sidebar Collapse.

Mobile

Fitur terbatas.

Display dan Operator tidak direkomendasikan digunakan di mobile.

---

# Performance

Dashboard < 2 detik

Operator realtime

Display <100ms perubahan soal

OBS tanpa reload

---

# UX Principles

- Maksimal tiga klik untuk mencapai fitur utama.
- Semua aksi penting memiliki konfirmasi.
- Tidak ada kehilangan data tanpa peringatan.
- Status koneksi selalu terlihat.
- Semua perubahan realtime memiliki indikator sinkronisasi.

---

# Final Principle

Setiap layar harus memiliki identitas visual yang sama, menggunakan Layout System dan Component Library, sehingga pengguna merasakan pengalaman yang konsisten di seluruh aplikasi.