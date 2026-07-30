# 09-responsive-system.md

# Imtihan Display System
## Responsive System

Version : 3.0

Status : Production

---

# Purpose

Responsive System memastikan seluruh aplikasi tetap konsisten,
mudah digunakan, dan nyaman dibaca pada berbagai ukuran layar.

Target utama bukan mobile.

Target utama adalah:

• Laptop Operator

• Desktop Admin

• TV Display

• Projector

• OBS Monitor

Mobile hanya digunakan untuk monitoring.

---

# Supported Devices

Desktop

Laptop

Tablet

Mobile

Smart TV

Projector

Ultra Wide Monitor

---

# Breakpoints

XS

0–639

Mobile

---

SM

640–767

Large Mobile

---

MD

768–1023

Tablet

---

LG

1024–1279

Laptop

---

XL

1280–1535

Desktop

---

2XL

1536+

Large Desktop

---

4K

2560+

Control Room

---

# Design Philosophy

Desktop First

Seluruh fitur dirancang untuk desktop.

Kemudian diadaptasi ke layar yang lebih kecil.

---

# Grid System

Desktop

12 Columns

---

Tablet

8 Columns

---

Mobile

4 Columns

---

Gap

24px

Desktop

16px

Tablet

12px

Mobile

---

# Container Width

SM

100%

MD

100%

LG

1200px

XL

1440px

2XL

1600px

---

# Header

Desktop

180px

Laptop

160px

Tablet

140px

Mobile

110px

---

# Navigation

Desktop

Top Navigation

Tablet

Top Navigation + Overflow

Mobile

Drawer Navigation

---

# Sidebar

Desktop

Visible

Tablet

Collapsed

Mobile

Hidden

---

# Dashboard

Desktop

4 Statistik per baris

Tablet

2 Statistik per baris

Mobile

1 Statistik per baris

---

# Question Bank

Desktop

Table

Tablet

Compact Table

Mobile

Card List

---

# Operator Screen

Desktop

3 Panel

Question

Editor

Preview

---

Tablet

2 Panel

---

Mobile

Tidak Didukung

---

# Display Screen

Desktop

Fullscreen

TV

Fullscreen

Projector

Fullscreen

Mobile

Read Only

---

# OBS Overlay

Selalu 16:9

1920×1080

Default

---

Support

1280×720

3840×2160

---

# Interactive Board

Desktop

Auto Grid

Tablet

2 Columns

Mobile

1 Column

---

# Dialog

Desktop

720px

Tablet

640px

Mobile

Full Width

---

# Drawer

Desktop

420px

Tablet

360px

Mobile

100%

---

# Forms

Desktop

2 Column

Tablet

2 Column

Mobile

1 Column

---

# Tables

Desktop

Full Feature

Tablet

Horizontal Scroll

Mobile

Card Layout

---

# Typography Scale

Desktop

100%

Tablet

95%

Mobile

90%

Display

140%

---

# Buttons

Desktop

44px

Tablet

44px

Mobile

48px

---

# Icon

Desktop

24

Tablet

24

Mobile

20

---

# Card Padding

Desktop

24

Tablet

20

Mobile

16

---

# Section Gap

Desktop

48

Tablet

32

Mobile

24

---

# Image Scaling

Contain

Default

Cover

Hero

Never Stretch

---

# Aspect Ratio

Card Image

16:9

Thumbnail

1:1

Avatar

1:1

Display

16:9

OBS

16:9

---

# Responsive Priority

Tetap dipertahankan:

Frame

Header

Logo

Identity

---

Boleh berubah:

Grid

Spacing

Typography

Columns

---

Tidak boleh berubah:

Brand

Color

Frame Style

Ornament Style

---

# Landscape Support

Tablet

Ya

Laptop

Ya

Display

Ya

Projector

Ya

---

# Portrait Support

Mobile

Ya

Tablet

Ya

Display

Tidak

---

# Smart TV

Minimum

1920×1080

Overscan Safe Area

5%

---

# Projector

Kontras tinggi

Font besar

Shadow ringan

Jarak baca jauh

---

# Zoom Support

100%

125%

150%

200%

---

# Print Layout

A4

Landscape

Portrait

PDF Ready

---

# Performance

Desktop

60 FPS

Tablet

60 FPS

Mobile

30 FPS Minimum

---

# Responsive Testing

Chrome

Firefox

Edge

Safari

---

Windows

macOS

Android

iPadOS

---

# QA Checklist

✓ Semua halaman dapat digunakan pada breakpoint resmi.

✓ Tidak ada elemen yang keluar dari frame.

✓ Header tetap proporsional.

✓ Navigasi tetap mudah dijangkau.

✓ Display tetap terbaca dari jarak jauh.

✓ OBS tetap sesuai rasio 16:9.

✓ Mobile hanya menampilkan fitur yang memang didukung.

---

# Final Principle

Responsive bukan berarti semua fitur harus tersedia di semua perangkat.

Responsive berarti setiap perangkat mendapatkan pengalaman terbaik sesuai konteks penggunaannya.

Desktop untuk bekerja.

Display untuk menampilkan.

Mobile untuk memantau.

Projector untuk presentasi.

Semua tetap mempertahankan identitas visual Imtihan Display System.