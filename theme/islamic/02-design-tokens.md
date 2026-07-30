# 02-design-tokens.md

# Imtihan Display System
## Design Tokens

Version : 3.0

---

# Introduction

Seluruh UI wajib menggunakan Design Tokens.

Tidak diperbolehkan menggunakan nilai secara langsung (hardcoded).

Semua komponen harus mengambil nilai dari Theme Provider.

---

# Theme Structure

Theme

```
Theme
│
├── Colors
├── Typography
├── Radius
├── Border
├── Shadow
├── Elevation
├── Motion
├── Icon
├── Spacing
├── Pattern
├── Ornament
└── Layout
```

---

# Color Philosophy

Palet warna mengikuti referensi utama.

Tidak menggunakan banyak warna.

Fokus pada:

- Emerald
- Gold
- Cream
- White
- Charcoal

---

# Primary Palette

## Emerald

50

```
#EAF7F2
```

100

```
#D5EFE5
```

200

```
#A8DFC9
```

300

```
#7CCFAE
```

400

```
#3FAE83
```

500

```
#0F6D54
```

(Default)

600

```
#0C5A45
```

700

```
#094738
```

800

```
#06342B
```

900

```
#04231D
```

---

# Gold Palette

50

```
#FFF8E7
```

100

```
#FFF2D1
```

200

```
#FCE7A5
```

300

```
#F4D97B
```

400

```
#E6C45A
```

500

```
#D4AF37
```

(Default)

600

```
#BE9922
```

700

```
#A77918
```

800

```
#7E5A11
```

900

```
#5B400A
```

---

# Cream Palette

50

```
#FFFFFF
```

100

```
#FFFDF9
```

200

```
#FBF7EE
```

300

```
#F6F1E5
```

400

```
#F1E9D8
```

500

```
#E9DEC9
```

---

# Neutral

White

```
#FFFFFF
```

Gray

```
#CFCFCF
```

Muted

```
#9E9E9E
```

Dark

```
#2A2A2A
```

Black

```
#111111
```

---

# Semantic Colors

Success

```
#22C55E
```

Warning

```
#F59E0B
```

Danger

```
#DC2626
```

Info

```
#3B82F6
```

---

# Background

Primary

Emerald Pattern

Secondary

Cream

Overlay

rgba(0,0,0,.45)

Glass

rgba(255,255,255,.08)

---

# Border

Default

```
1px solid Gold-500
```

Light

```
1px solid rgba(212,175,55,.20)
```

Strong

```
2px solid Gold-500
```

---

# Radius

XS

4

SM

8

MD

12

LG

16

XL

20

2XL

28

Round

9999

---

# Shadow

Small

```
0 2px 8px rgba(0,0,0,.12)
```

Medium

```
0 10px 25px rgba(0,0,0,.18)
```

Large

```
0 20px 50px rgba(0,0,0,.28)
```

Premium

```
0 30px 80px rgba(0,0,0,.35)
```

---

# Typography

Heading

Cinzel

Fallback

Georgia

---

Body

Inter

Fallback

sans-serif

---

Arabic

Amiri

Fallback

Noto Naskh Arabic

---

Monospace

JetBrains Mono

---

# Font Size

Display

64

Hero

48

H1

40

H2

32

H3

28

H4

24

Title

20

Body

16

Small

14

Caption

12

Micro

10

---

# Font Weight

Light

300

Regular

400

Medium

500

SemiBold

600

Bold

700

Black

800

---

# Line Height

Compact

1.2

Normal

1.5

Relaxed

1.8

Arabic

2.0

---

# Spacing

2

4

8

12

16

20

24

32

40

48

64

80

96

120

160

---

# Icon Size

XS

16

SM

20

MD

24

LG

32

XL

40

XXL

48

---

# Layout

Navbar Height

96

Sidebar

320

Container

1440

Section Gap

64

Card Gap

24

---

# Motion

Fast

120ms

Normal

240ms

Slow

360ms

---

# Easing

easeOut

easeInOut

easeOutExpo

---

# Blur

Light

8

Medium

16

Heavy

24

---

# Opacity

Disabled

40%

Hover

90%

Muted

70%

Pattern

5%

---

# Pattern Density

Low

3%

Medium

5%

High

8%

---

# Ornament Size

Small

24

Medium

48

Large

96

Hero

180

---

# Z Index

Background

0

Content

10

Navbar

100

Dropdown

500

Dialog

1000

Toast

1500

Loading

2000

---

# CSS Variables

```
--color-primary
--color-primary-dark
--color-gold
--color-gold-light
--color-background
--color-surface
--radius-lg
--shadow-md
--font-heading
--font-body
--spacing-md
```

---

# Theme Rules

Semua komponen WAJIB menggunakan token.

Tidak diperbolehkan:

❌ color: #0F6D54

Harus:

✅ color: var(--color-primary)

---

Tidak diperbolehkan:

❌ border-radius: 16px

Harus:

✅ border-radius: var(--radius-lg)

---

Tidak diperbolehkan:

❌ margin:24px

Harus:

✅ margin:var(--spacing-lg)

---

# Token Naming

Color

color-primary

Typography

font-heading

Spacing

spacing-lg

Radius

radius-xl

Shadow

shadow-premium

Motion

motion-fast

Pattern

pattern-low

---

# Design Rule

Design Tokens adalah satu-satunya sumber nilai visual.

Seluruh halaman, seluruh komponen, seluruh animasi, dan seluruh tema harus mengambil konfigurasi dari token ini.

Perubahan satu token harus dapat mengubah keseluruhan aplikasi secara konsisten tanpa perlu memodifikasi komponen satu per satu.