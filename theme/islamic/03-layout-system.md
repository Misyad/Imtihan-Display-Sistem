# 03-layout-system.md

# Imtihan Display System
## Layout System

Version : 3.0

---

# Introduction

Layout System mendefinisikan struktur visual seluruh halaman.

Seluruh halaman WAJIB mengikuti layout ini.

Tidak diperbolehkan membuat layout baru yang keluar dari sistem.

Layout ini terinspirasi dari arsitektur Islam klasik dengan prinsip:

- Simetris
- Seimbang
- Formal
- Megah
- Bersih

---

# Global Layout

Seluruh halaman menggunakan struktur yang sama.

```

╔══════════════════════════════════════════════════════╗
║                 HEADER FRAME                         ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║   SIDEBAR         MAIN CONTENT                       ║
║                                                      ║
║                                                      ║
║                                                      ║
║                                                      ║
║                                                      ║
║                                                      ║
║                                                      ║
╠══════════════════════════════════════════════════════╣
║                 FOOTER FRAME                         ║
╚══════════════════════════════════════════════════════╝

```

---

# Page Frame

Frame merupakan identitas utama aplikasi.

Frame terdiri dari:

Top Frame

Left Border

Right Border

Bottom Frame

Corner Ornament

Frame selalu tampil.

Tidak boleh dihilangkan.

---

# Header Layout

Header mengikuti referensi.

```

                LOGO

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Title

Subtitle

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```

Header selalu berada di tengah.

---

# Header Height

Desktop

180px

Laptop

160px

Tablet

150px

Mobile

120px

---

# Header Composition

Header terdiri dari:

Background Cream

↓

Gold Ornament

↓

Institution Logo

↓

Islamic Calligraphy

↓

Divider

↓

Title

---

# Header Rules

Logo selalu center.

Divider selalu horizontal.

Background selalu cream.

Tidak boleh menggunakan warna lain.

---

# Sidebar

Sidebar berada di kiri.

```

╔══════════════╗

Dashboard

Operator

Display

Interactive

Bank Soal

OBS

Settings

╚══════════════╝

```

---

# Sidebar Width

Desktop

300px

Laptop

280px

Tablet

240px

---

# Sidebar Rules

Background Emerald.

Border Gold.

Menu Vertical.

Tidak floating.

---

# Sidebar Header

Berisi

Logo

Nama Sistem

Versi

---

# Sidebar Footer

Berisi

Status Server

Versi

Connection

---

# Main Content

Main Content berada di tengah.

Menggunakan padding besar.

```

╔════════════════════════════╗

CONTENT

╚════════════════════════════╝

```

---

# Content Width

Maximum

1600px

Centered.

---

# Content Padding

Top

32

Left

40

Right

40

Bottom

40

---

# Section Layout

```

Title

Subtitle

────────────────────

Content

```

---

# Grid System

12 Column

Gap

24px

---

# Card Layout

```

╔════════════════════════╗

Title

──────────────

Content

╚════════════════════════╝

```

---

# Card Position

Cards selalu sejajar.

Tidak boleh overlap.

---

# Dashboard Layout

```

Hero

↓

Statistics

↓

Current Session

↓

Quick Menu

↓

Activity

↓

Footer

```

---

# Statistics

4 Card

Desktop

4 Column

Tablet

2

Mobile

1

---

# Operator Layout

```

╔════════════════════════════════════════════════════╗

Question List

Editor

Preview

╚════════════════════════════════════════════════════╝

```

---

# Ratio

25%

40%

35%

---

# Question Bank

```

Toolbar

↓

Filter

↓

Search

↓

Table

↓

Pagination

```

---

# Display Layout

Display menggunakan layout simetris.

```

Logo

↓

Question

↓

Answer

↓

Footer

```

---

# Interactive Board

```

Header

↓

Question Grid

↓

Footer

```

---

# Grid

Auto Fit

Gap

16

---

# OBS Layout

```

Question

──────────────

Overlay

──────────────

Logo

```

---

# Dialog Layout

```

Title

──────────────

Body

──────────────

Action

```

---

# Drawer Layout

```

Header

↓

Content

↓

Footer

```

---

# Form Layout

```

Label

Input

Help Text

```

---

# Table Layout

```

Toolbar

↓

Table Header

↓

Rows

↓

Pagination

```

---

# Login Layout

```

Header

↓

Login Card

↓

Footer

```

---

# Empty State

```

Illustration

Title

Description

Button

```

---

# Loading

```

Logo

↓

Spinner

↓

Loading Text

```

---

# Footer Layout

Footer selalu memiliki.

Gold Divider.

Institution.

Copyright.

Version.

---

# Ornament Position

Ornamen hanya boleh berada pada:

Header

Corner

Divider

Footer

Tidak boleh masuk ke area konten.

---

# Safe Area

Minimal

32px

antara konten dan frame.

---

# Responsive

Desktop

Sidebar tetap.

Tablet

Sidebar collapse.

Mobile

Sidebar drawer.

---

# Scroll Rules

Sidebar

Independent Scroll.

Content

Independent Scroll.

Tidak boleh seluruh halaman ikut scroll.

---

# Alignment Rules

Semua heading rata kiri.

Header rata tengah.

Statistik rata tengah.

Table rata kiri.

---

# White Space

Minimal

24px

antara section.

Minimal

16px

antar komponen.

---

# Visual Hierarchy

1

Header

↓

2

Content

↓

3

Action

↓

4

Decoration

---

# Layout Rules

Semua halaman harus terasa berasal dari template yang sama.

Perbedaan hanya pada isi.

Bukan struktur.

---

# Forbidden

❌ Floating Navbar

❌ Floating Card

❌ Glass Background

❌ Blur Layout

❌ Random Padding

❌ Random Margin

❌ Asymmetrical Layout

---

# Required

✅ Frame tetap.

✅ Header tetap.

✅ Sidebar tetap.

✅ Footer tetap.

✅ Simetris.

✅ Elegan.

✅ Formal.

---

# Golden Ratio

Jika memungkinkan.

Gunakan proporsi

1 : 1.618

untuk:

Hero

Dashboard

Display

Card

---

# Final Principle

Layout harus membuat pengguna merasa bahwa mereka sedang mengoperasikan sistem resmi penyelenggaraan Haflah dan Imtihan.

Bukan dashboard administrasi biasa.

Setiap halaman harus mempertahankan identitas visual yang sama seperti bingkai referensi.