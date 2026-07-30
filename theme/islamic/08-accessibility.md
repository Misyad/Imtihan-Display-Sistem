# 08-accessibility.md

# Imtihan Display System
## Accessibility Guidelines

Version : 3.0

Status : Production

---

# Purpose

Dokumen ini memastikan seluruh aplikasi dapat digunakan oleh semua pengguna.

Accessibility bukan fitur tambahan.

Accessibility adalah standar minimum.

Seluruh komponen harus memenuhi WCAG 2.2 AA.

---

# Principles

Aplikasi harus:

Perceivable

Operable

Understandable

Robust

---

# Target Standard

WCAG 2.2 AA

Minimum.

---

# Contrast

Body Text

Minimum 4.5 : 1

Large Text

Minimum 3 : 1

Icon

Minimum 3 : 1

Focus Ring

Minimum 3 : 1

---

# Color Rules

Warna tidak boleh menjadi satu-satunya indikator.

Contoh salah:

● Hijau = Benar

● Merah = Salah

Harus menjadi:

✔ Hijau + Icon

✖ Merah + Icon

---

# Typography

Minimum Body

16px

Caption

14px

Line Height

1.5

Arabic

2.0

---

# Font Rules

Tidak menggunakan:

Thin Font

Decorative Font

Capital seluruh paragraf

---

# Keyboard Navigation

Semua halaman harus dapat digunakan hanya menggunakan keyboard.

Urutan:

Tab

Shift + Tab

Arrow

Enter

Esc

Space

---

# Focus Order

Header

↓

Navigation

↓

Toolbar

↓

Content

↓

Action

↓

Footer

---

# Focus Indicator

Gold Border

2px

Tidak boleh dihilangkan.

---

# Shortcut

Ctrl + K

Search

Ctrl + S

Save

Esc

Close Dialog

Arrow

Navigate

Tab

Focus

---

# Screen Reader

Seluruh elemen interaktif wajib memiliki:

aria-label

aria-labelledby

aria-describedby

---

# Images

Semua gambar wajib memiliki:

alt

Jika dekoratif:

alt=""

---

# Icons

Icon tidak boleh berdiri sendiri.

Harus memiliki:

Tooltip

atau

Label

---

# Buttons

Minimal ukuran:

44 x 44 px

---

# Touch Target

Desktop

44 px

Tablet

48 px

Mobile

48 px

---

# Forms

Semua input memiliki:

Label

Placeholder

Help Text

Validation

Error Message

---

# Validation

Error harus muncul:

Visual

+

Text

+

ARIA

---

# Error Message

Contoh:

✓ Nama wajib diisi.

✗ Invalid Input

---

# Required Field

Gunakan:

*

dan

Keterangan "Wajib"

---

# Tables

Support:

Keyboard

Sorting

Pagination

Sticky Header

---

# Responsive Zoom

Aplikasi harus tetap berfungsi pada:

100%

125%

150%

200%

---

# Reduced Motion

Jika pengguna mengaktifkan:

Reduce Motion

Semua animasi berubah menjadi Fade.

---

# High Contrast

Support:

Windows High Contrast

Browser High Contrast

---

# Arabic Support

RTL

Right Alignment

Ligature

Diacritic

Harakat

---

# Language

Gunakan atribut:

lang="id"

Untuk Arabic:

lang="ar"

---

# Display Screen

Font minimum:

40px

Kontras tinggi

Jarak baca jauh

---

# OBS Overlay

Minimum font:

32px

Shadow tipis

Tidak blur

---

# Color Blind

Pastikan tetap terbaca pada:

Protanopia

Deuteranopia

Tritanopia

---

# Audio

Jika ada notifikasi suara.

Harus memiliki indikator visual.

---

# Loading

Spinner

+

Loading Text

---

# Skeleton

Screen Reader:

aria-busy="true"

---

# Dialog

Saat dialog terbuka:

Focus dikunci.

Esc menutup dialog.

Focus kembali ke tombol sebelumnya.

---

# Notifications

Tidak menghilang sebelum dapat dibaca.

Minimal:

5 detik.

---

# Links

Selalu memiliki:

Underline saat hover

Focus state

---

# Empty State

Selalu memiliki:

Title

Description

Action

---

# Charts

Grafik tidak boleh hanya menggunakan warna.

Tambahkan:

Label

Pattern

Legend

---

# Performance

Accessibility tidak boleh mengurangi performa.

Target:

Lighthouse Accessibility

100

---

# Testing

Keyboard Test

Screen Reader Test

Contrast Test

Zoom Test

RTL Test

Reduced Motion Test

High Contrast Test

---

# QA Checklist

✓ Semua tombol dapat difokus.

✓ Semua gambar memiliki alt.

✓ Semua input memiliki label.

✓ Semua dialog dapat ditutup dengan Esc.

✓ Semua halaman dapat digunakan tanpa mouse.

✓ Kontras memenuhi WCAG AA.

✓ Tidak ada informasi yang hanya bergantung pada warna.

✓ Semua komponen mendukung keyboard.

---

# Final Principle

Aplikasi harus dapat digunakan oleh siapa pun, tanpa mengurangi pengalaman visual maupun fungsional.