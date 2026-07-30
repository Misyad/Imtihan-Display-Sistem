# 15-clean-architecture.md

# Imtihan Display System
## Clean Architecture

Version : 1.0

Status : Production

Owner

Software Architect

Frontend Team

Backend Team

---

# Purpose

Clean Architecture memastikan bahwa seluruh kode tetap mudah dipelihara,
mudah diuji,
dan tidak bergantung pada framework.

Framework adalah alat.

Business Rule adalah inti.

---

# Core Principle

Dependencies selalu mengarah ke dalam.

```

Framework

↓

Infrastructure

↓

Application

↓

Domain

```

Domain tidak mengetahui layer di luar dirinya.

---

# Architecture Layers

```

Presentation

↓

Application

↓

Domain

↓

Infrastructure

```

---

# Layer Responsibilities

## Presentation

Bertanggung jawab terhadap:

UI

Layout

Navigation

Interaction

Rendering

Validation ringan

Tidak boleh memiliki business rule.

---

## Application

Bertanggung jawab terhadap:

Use Case

Workflow

Transaction

Permission

Command

Query

Application Service

---

## Domain

Berisi:

Entity

Value Object

Aggregate

Repository Interface

Business Rule

Policy

Specification

Factory

Domain Event

---

## Infrastructure

Berisi:

API

Socket

Storage

Database

Logger

Analytics

Notification

---

# Dependency Rule

Presentation

↓

Application

↓

Domain

Infrastructure mengimplementasikan interface Domain.

---

# Example

```

Operator Page

↓

PublishQuestionUseCase

↓

Question Aggregate

↓

QuestionRepository

↓

QuestionApiRepository

↓

REST API

```

---

# Presentation Layer

Folder:

```
app/

components/

layouts/

```

Presentation hanya memanggil Use Case.

---

# Application Layer

Folder:

```
application/

usecases/

commands/

queries/

dto/

```

---

# Use Case

Satu use case.

Satu tujuan.

Contoh.

PublishQuestion

CreateSession

FinishSession

GenerateReport

Login

ImportQuestion

---

# Use Case Rules

Tidak boleh mengetahui:

React

Tailwind

Socket

Next.js

Browser

---

# DTO

DTO digunakan sebagai kontrak antar layer.

Contoh.

```
CreateQuestionDTO

PublishSessionDTO

LoginDTO

```

---

# Domain Layer

Folder

```
domain/

entities/

aggregates/

events/

repositories/

services/

value-objects/

```

---

# Entity

Entity memiliki identitas.

Contoh.

Question

Event

Session

Participant

---

# Value Object

Tidak memiliki identitas.

Contoh.

Score

Duration

QRCode

ThemeColor

Email

---

# Aggregate

Aggregate menjaga konsistensi.

Question Aggregate

Mengelola:

Question

Choice

Media

Answer

---

# Domain Service

Jika business rule melibatkan banyak entity.

Gunakan Domain Service.

---

# Repository

Repository hanya interface.

Contoh.

```
interface QuestionRepository
```

Tidak ada HTTP.

Tidak ada Fetch.

---

# Infrastructure Layer

Folder

```
infra/

api/

socket/

storage/

logger/

```

---

# Repository Implementation

```
QuestionRepository

↓

QuestionApiRepository

```

Application tidak mengetahui implementasinya.

---

# API Client

Semua request melalui:

ApiClient

↓

Service

↓

Repository

↓

Use Case

---

# Socket

Socket adalah Infrastructure.

Bukan Domain.

---

# State Management

Presentation

↓

Use Case

↓

Store Update

↓

Render

---

# Dependency Injection

Seluruh dependency berasal dari Container.

Tidak menggunakan new secara langsung.

---

# Error Handling

Domain Error

↓

Application Error

↓

Presentation Error

↓

UI

---

# Validation

Presentation

↓

Basic Validation

Application

↓

Workflow Validation

Domain

↓

Business Validation

---

# Example

Presentation

Email kosong?

Application

User login?

Domain

Password benar?

---

# Configuration

Semua konfigurasi berada di:

```
config/
```

---

# Feature Structure

```
question/

presentation/

application/

domain/

infra/

```

Feature bersifat mandiri.

---

# Testing Strategy

Presentation

↓

UI Test

Application

↓

Use Case Test

Domain

↓

Business Rule Test

Infrastructure

↓

Integration Test

---

# Replaceability

Harus dapat mengganti:

REST

↓

GraphQL

Tanpa mengubah Domain.

---

Harus dapat mengganti:

Socket.IO

↓

WebSocket

Tanpa mengubah Domain.

---

Harus dapat mengganti:

Next.js

↓

React Native

Tanpa mengubah Domain.

---

# Anti Pattern

Dilarang.

Entity menggunakan fetch()

Use Case menggunakan React Hook

Repository menggunakan Zustand

Component mengetahui Database

Business Rule di JSX

---

# Example Flow

```

Operator

↓

Click Publish

↓

PublishQuestionUseCase

↓

Question Aggregate

↓

Repository

↓

REST API

↓

Socket Broadcast

↓

Display Update

```

---

# Quality Checklist

✓ Dependency mengarah ke dalam

✓ Domain bebas framework

✓ Use Case tunggal

✓ Repository berupa interface

✓ UI bebas business rule

✓ Infrastructure dapat diganti

---

# Definition of Done

Sebuah fitur dianggap selesai jika:

- Mengikuti Clean Architecture
- Memiliki Use Case
- Memiliki Repository Interface
- Memiliki Domain Entity
- Memiliki Test
- Tidak melanggar dependency rule

---

# Final Principle

Framework akan berubah.

Library akan berubah.

Teknologi akan berubah.

Namun Domain dan Use Case harus tetap stabil selama umur aplikasi.