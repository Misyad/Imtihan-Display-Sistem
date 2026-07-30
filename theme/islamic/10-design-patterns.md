# 10-design-patterns.md

# Imtihan Display System
## Design Patterns

Version : 3.0

Status : Production

---

# Introduction

Design Pattern mendefinisikan pola interaksi standar.

Tujuan utamanya adalah memastikan seluruh aplikasi memiliki perilaku yang konsisten.

Pengguna tidak perlu belajar ulang ketika berpindah halaman.

---

# Principles

Semua pattern harus memenuhi:

Predictable

Consistent

Efficient

Accessible

Realtime Ready

---

# CRUD Pattern

## Create

Toolbar

↓

Create Button

↓

Dialog

↓

Validation

↓

Save

↓

Toast Success

↓

Refresh Data

---

## Read

Search

↓

Filter

↓

Table

↓

Pagination

↓

Detail

---

## Update

Open Dialog

↓

Edit

↓

Save

↓

Realtime Update

↓

Toast

---

## Delete

Delete Button

↓

Confirmation Dialog

↓

Delete

↓

Undo (Optional)

↓

Toast

---

# Search Pattern

Search selalu berada di kiri toolbar.

Shortcut:

Ctrl + K

Debounce:

300ms

Search harus realtime.

---

# Filter Pattern

Search

↓

Filter

↓

Sort

↓

Result Count

↓

Table

---

# Empty State Pattern

Illustration

↓

Title

↓

Description

↓

Primary Action

---

# Loading Pattern

Skeleton

↓

Content

Spinner hanya digunakan jika skeleton tidak memungkinkan.

---

# Error Pattern

Error Icon

↓

Title

↓

Description

↓

Retry

↓

Contact Admin

---

# Confirmation Pattern

Title

↓

Description

↓

Danger Action

↓

Cancel

---

# Wizard Pattern

Step Indicator

↓

Content

↓

Navigation

Previous

Next

Finish

---

# Import Pattern

Upload

↓

Validation

↓

Preview

↓

Import

↓

Summary

---

# Export Pattern

Choose Format

↓

Progress

↓

Download

---

# Upload Pattern

Drag Drop

↓

Preview

↓

Validation

↓

Upload

↓

Success

---

# Download Pattern

Download

↓

Preparing

↓

Ready

↓

Completed

---

# Table Pattern

Toolbar

↓

Filter

↓

Table

↓

Pagination

↓

Bulk Action

---

# Bulk Action

Select

↓

Toolbar Active

↓

Action

↓

Confirmation

↓

Execute

---

# Form Pattern

Section

↓

Label

↓

Input

↓

Help Text

↓

Validation

---

# Save Pattern

Save

↓

Loading

↓

Success

↓

Updated Timestamp

---

# Realtime Pattern

Local Update

↓

Socket Broadcast

↓

Display Update

↓

Confirmation Indicator

---

# Socket Status Pattern

Connected

Green

Disconnected

Red

Reconnecting

Gold

Offline

Gray

---

# Session Pattern

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

# Timer Pattern

Running

Pause

Resume

Reset

Stop

---

# Question Navigation

Question List

↓

Current Question

↓

Preview

↓

Publish

↓

Display Update

---

# Live Preview Pattern

Editor

↓

Preview

↓

Socket

↓

Display

Semua sinkron tanpa reload.

---

# Notification Pattern

Info

Success

Warning

Danger

Semua muncul pada posisi yang sama.

---

# Toast Pattern

Top Right

5 Second

Dismiss

Action (Optional)

---

# Dialog Pattern

Header

↓

Body

↓

Footer

↓

Action

---

# Drawer Pattern

Header

↓

Scrollable Content

↓

Footer

---

# Card Pattern

Header

↓

Divider

↓

Body

↓

Footer

---

# Dashboard Pattern

Hero

↓

Statistics

↓

Quick Action

↓

Activity

↓

System Status

---

# Login Pattern

Logo

↓

Title

↓

Form

↓

Submit

↓

Version

---

# Authentication Pattern

Login

↓

Token Validation

↓

Permission

↓

Dashboard

---

# Permission Pattern

Administrator

↓

Operator

↓

Observer

↓

Guest

Semua halaman harus memeriksa permission sebelum dirender.

---

# Offline Pattern

Connection Lost

↓

Banner

↓

Retry

↓

Reconnect

↓

Sync

---

# Auto Save Pattern

Edit

↓

Idle 2 Seconds

↓

Save

↓

Indicator Updated

---

# Conflict Pattern

Jika dua operator mengedit data yang sama:

Warning

↓

Compare

↓

Resolve

↓

Save

---

# Undo Pattern

Delete

↓

Toast

↓

Undo (10 Seconds)

---

# Print Pattern

Preview

↓

Printer

↓

Result

---

# QR Pattern

Generate

↓

Preview

↓

Download

↓

Print

---

# Report Pattern

Filter

↓

Generate

↓

Preview

↓

Export

---

# Accessibility Pattern

Keyboard

↓

Mouse

↓

Touch

↓

Screen Reader

Semua memiliki pengalaman yang sama.

---

# Final Principle

Setiap fitur baru wajib menggunakan pattern yang sudah ditetapkan.

Jika muncul kebutuhan pattern baru, pattern tersebut harus ditambahkan ke Design System terlebih dahulu sebelum diimplementasikan.