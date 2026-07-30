# 14-domain-architecture.md

# Imtihan Display System
## Domain Architecture

Version : 1.0

Status : Production

Owner

Product Team

Software Architect

Frontend Team

Backend Team

---

# Purpose

Dokumen ini mendefinisikan batas domain (Bounded Context),
hubungan antar domain,
serta aturan komunikasi antar domain.

Domain adalah pusat dari seluruh aplikasi.

UI, API, Database, dan Socket hanyalah implementasi.

---

# Philosophy

Seluruh aplikasi dibangun berdasarkan domain bisnis.

Bukan berdasarkan halaman.

Bukan berdasarkan database.

Bukan berdasarkan framework.

---

# Core Domains

Imtihan Display System terdiri dari domain berikut.

Authentication

↓

Identity

↓

Organization

↓

Event

↓

Session

↓

Question

↓

Display

↓

Interactive

↓

Participant

↓

Assessment

↓

Reporting

↓

Realtime

↓

System

---

# Domain Relationship

```

Authentication
│
└── Identity
│
└── Organization
│
└── Event
│
├── Session
│     │
│     ├── Question
│     ├── Participant
│     ├── Display
│     ├── Interactive
│     ├── OBS
│     └── Assessment
│
└── Reporting
│
└── System

```

---

# Authentication Domain

Responsible

Login

Logout

Refresh Token

Session

Permission

Role

MFA (Future)

---

# Identity Domain

Responsible

User

Profile

Avatar

Preference

Language

Theme

---

# Organization Domain

Responsible

Institution

Region

Branch

Committee

Operator

Supervisor

---

# Event Domain

Responsible

Create Event

Event Settings

Venue

Schedule

Poster

Banner

Status

---

# Session Domain

Responsible

Session Lifecycle

Operator Assignment

Question Flow

Countdown

Timing

Current Question

---

# Question Domain

Responsible

Question Bank

Category

Difficulty

Choices

Answer

Media

Import

Export

Version

---

# Participant Domain

Responsible

Registration

Attendance

QR

Grouping

Seat

Status

---

# Display Domain

Responsible

Presentation Screen

Question Rendering

Media Rendering

Fullscreen

Theme

---

# Interactive Domain

Responsible

Audience Interaction

Voting

Selection

Answer

Timer

Realtime Update

---

# OBS Domain

Responsible

Overlay

Split Screen

Lower Third

Sponsor

Watermark

---

# Assessment Domain

Responsible

Scoring

Result

Ranking

Judging

Validation

Review

---

# Reporting Domain

Responsible

Statistics

Charts

Attendance

Usage

PDF

Excel

---

# Realtime Domain

Responsible

Socket

Broadcast

Presence

Synchronization

Latency

Heartbeat

Recovery

---

# Notification Domain

Responsible

Toast

Announcement

Realtime Alert

Email

Future Push Notification

---

# System Domain

Responsible

Configuration

Logs

Monitoring

Audit

Health

Backup

Maintenance

---

# Shared Kernel

Shared Model

Date

Pagination

Permission

Media

File

Address

Language

Currency

Theme

---

# Domain Dependency Rules

Question

Tidak boleh mengetahui Display.

Display

Tidak boleh mengetahui Assessment.

Assessment

Tidak boleh mengetahui OBS.

Reporting

Hanya membaca domain lain.

---

# Domain Communication

Semua komunikasi dilakukan melalui:

Service

↓

Event

↓

Query

Tidak boleh:

Direct Import

---

# Domain Events

Contoh.

EventCreated

↓

SessionCreated

↓

QuestionPublished

↓

DisplayUpdated

↓

AudienceAnswered

↓

SessionFinished

↓

ReportGenerated

---

# Domain Ownership

Authentication

Frontend + Backend

Event

Business Team

Question

Education Team

Display

Presentation Team

Reporting

Analytics Team

---

# Aggregate Root

Authentication

User

---

Event

Event

---

Session

Session

---

Question

Question

---

Participant

Participant

---

Display

DisplayState

---

Assessment

Assessment

---

# Entity

Question

Choice

Participant

Session

Judge

Operator

Report

---

# Value Object

Email

Phone

Color

Theme

Countdown

Duration

Score

Ranking

QRCode

---

# Repository

QuestionRepository

SessionRepository

EventRepository

ParticipantRepository

ReportRepository

---

# Domain Services

QuestionService

DisplayService

RealtimeService

AssessmentService

ReportService

---

# Factory

QuestionFactory

SessionFactory

EventFactory

---

# Domain Policies

Question tidak dapat dipublish jika:

Belum memiliki jawaban.

Session tidak dapat dimulai jika:

Operator belum login.

Display tidak aktif.

---

# Lifecycle

Event

Draft

↓

Published

↓

Running

↓

Completed

↓

Archived

---

Question

Draft

↓

Review

↓

Approved

↓

Published

↓

Archived

---

Session

Waiting

↓

Ready

↓

Running

↓

Paused

↓

Finished

↓

Archived

---

# Domain Security

Permission selalu dicek di Domain.

Bukan di UI.

---

# Domain Validation

Seluruh business rule berada di domain.

Bukan di React Component.

---

# Anti Pattern

Dilarang.

Component mengetahui business rule.

API mengetahui UI.

Database mengetahui Domain.

Socket mengetahui Component.

---

# Future Domains

AI Question Generator

OCR

Speech Recognition

Certificate

Finance

Attendance Face Recognition

Live Translation

---

# Final Principle

Domain adalah inti aplikasi.

Framework dapat berubah.

Database dapat berubah.

UI dapat berubah.

Namun Domain harus tetap stabil.

Seluruh keputusan teknis harus mengikuti aturan domain, bukan sebaliknya.