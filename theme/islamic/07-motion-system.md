# 07-motion-system.md

# Imtihan Display System
## Motion System

Version : 3.0

Status : Draft

---

# Introduction

Motion bukan dekorasi.

Motion adalah bahasa komunikasi.

Setiap animasi harus membantu pengguna memahami perubahan keadaan sistem.

Motion tidak boleh digunakan hanya untuk mempercantik tampilan.

---

# Motion Principles

Seluruh animasi harus memenuhi lima prinsip.

Responsive

Natural

Purposeful

Elegant

Fast

---

# Philosophy

Motion harus terasa seperti:

• Membuka pintu aula

• Membuka kitab

• Menggeser lembar soal

• Menampilkan papan pengumuman

Bukan seperti game.

Bukan seperti aplikasi hiburan.

---

# Motion Hierarchy

Priority 1

Feedback

↓

Priority 2

Navigation

↓

Priority 3

Transition

↓

Priority 4

Decoration

---

# Duration

Instant

75ms

Very Fast

120ms

Fast

180ms

Default

240ms

Slow

320ms

Very Slow

480ms

Maximum

600ms

Tidak diperbolehkan lebih lama dari 600ms.

---

# Easing

Default

ease-out

Enter

ease-out

Exit

ease-in

Complex Layout

ease-in-out

---

# Animation Scale

Small

Button

Icon

Badge

Medium

Card

Panel

Dialog

Large

Page

Drawer

Fullscreen

---

# Hover

Hover tidak boleh:

Mengubah layout

Mengubah ukuran

Menggeser konten

Hover hanya boleh:

Brightness

Shadow

Border

Elevation

Cursor

---

# Focus

Focus menggunakan:

Gold Ring

2px

Opacity 100%

Tanpa glow.

---

# Button Motion

Hover

120ms

Pressed

90ms

Loading

Fade

Success

Check Animation

---

# Card Motion

Hover

Shadow bertambah

Border lebih terang

Naik 2px

Tidak boleh lebih.

---

# Navigation

Pergantian halaman

Fade + Slide

240ms

---

# Sidebar

Open

Slide

Close

Slide

Tidak bounce.

---

# Dialog

Open

Fade

Scale 98 → 100

Close

Fade

Scale 100 → 98

---

# Drawer

Open

Slide

Close

Slide

---

# Dropdown

Fade

Scale

Origin Top

---

# Tooltip

Fade

120ms

---

# Toast

Slide Right

Fade

Auto Hide

---

# Accordion

Height Animation

Opacity

---

# Tabs

Underline

Slide

Text Fade

---

# Pagination

Cross Fade

---

# Loading

Spinner sederhana.

Tidak menggunakan:

3D

Glow

Gradient

Rainbow

---

# Skeleton

Fade Pulse

Durasi

1.4s

Infinite

---

# Progress

Linear

Smooth

Tidak meloncat.

---

# Circular Progress

Clockwise

Linear

---

# Number Animation

Counter

Smooth

120fps target

---

# Statistics Card

Value berubah

Count Up

---

# Charts

Draw Animation

Opacity

---

# Notification

Slide Down

Fade

---

# Error

Shake kecil

Horizontal

6px

Satu kali.

---

# Success

Fade

Checkmark

Scale 90 →100

---

# Warning

Border Pulse

Satu kali.

---

# Display Screen

Pergantian soal

Cross Fade

250ms

Tidak slide.

---

# Interactive Board

Jawaban dipilih

Scale 100 →103

Border Gold

---

# OBS Overlay

Fade

200ms

---

# Live Update

Realtime update

Cross Fade

Tidak reload.

---

# Socket Status

Connected

Fade Green

Disconnected

Fade Red

Reconnect

Pulse Gold

---

# Timer

Per detik

Opacity

Tidak scale.

---

# Modal Stack

Background

Fade

Dialog

Scale

---

# Empty State

Illustration

Fade

Text

Fade

Button

Slide Up

---

# Hero Section

Fade

Parallax ringan

Maksimal 8px

---

# Decorative Motion

Pattern

Static

Frame

Static

Header

Static

Ornament

Static

Frame tidak pernah bergerak.

---

# Motion Restrictions

Tidak boleh menggunakan:

Bounce

Rubber

Elastic

Jelly

Flip

Rotate 360°

Explosion

Firework

Particle

Confetti

Neon Pulse

Cyber Glow

---

# Motion Accessibility

Jika pengguna mengaktifkan

Reduced Motion

Semua animasi berubah menjadi:

Fade

100ms

---

# Performance

Target

60 FPS

Desktop

Tablet

Display

OBS

---

# CSS Variables

--motion-fast

--motion-normal

--motion-slow

--motion-easing

---

# Motion Checklist

✓ Tidak mengganggu pekerjaan operator

✓ Tidak mengurangi keterbacaan

✓ Tidak memperlambat UI

✓ Konsisten

✓ Elegan

✓ Ringan

---

# Final Principle

Motion harus terasa seperti bagian alami dari sebuah sistem penyelenggaraan acara resmi.

Pengguna seharusnya menyadari perubahan informasi dengan mudah, bukan memperhatikan animasinya.