# Dokumentasi Komprehensif: Imtihan Display Sistem 🌙

## 📌 Deskripsi Proyek
**Imtihan Display Sistem** adalah aplikasi berbasis web modern yang dirancang untuk kebutuhan display ujian digital, haflah wisuda, cerdas cermat, atau imtihan niha'i. Proyek ini mengedepankan estetika **Islamic Cinematic** dengan performa real-time tinggi.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4 (menggunakan OKLCH colors)
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Real-time Engine**: Socket.IO
- **Database (Mock)**: Excel & JSON

## 📂 Struktur Navigasi & Halaman
Sistem ini menggunakan sinkronisasi real-time antar berbagai antarmuka:

| Path | Nama Halaman | Deskripsi |
| :--- | :--- | :--- |
| `/interactive` | **Interactive Board** | Mode All-in-One untuk kontrol layar tunggal. |
| `/display` | **Cinematic Display** | Tampilan khusus proyektor/audience tanpa UI kontrol. |
| `/operator` | **Operator Dashboard** | Pusat kendali utama, manajemen soal, dan live preview. |
| `/remote` | **Smart Remote** | Kontrol jarak jauh via HP (optimasi mobile). |
| `/obs` | **OBS Overlay** | Overlay transparan untuk kebutuhan livestreaming. |
| `/obs-split` | **OBS Split-Screen** | Layout kamera berdampingan dengan soal. |

## ⚙️ Fitur Unggulan
1.  **Islamic Cinematic Theme**: Desain premium dengan dominasi warna *Emerald Green* dan *Gold*.
2.  **Haptic Feedback**: Getaran pada HP Remote saat tombol ditekan (meningkatkan user experience).
3.  **Excel Workflow**: Memungkinkan panitia menyiapkan ratusan soal via Excel dan mengimpornya secara instan.
4.  **Local Network Ready**: Berjalan stabil tanpa internet, cukup menggunakan router Wi-Fi lokal.
5.  **Multi-Display Sync**: Satu operator bisa mengendalikan banyak layar (proyektor, TV, dan streaming) sekaligus.

## 📋 Struktur File Utama
- `app/globals.css`: Definisi tema OKLCH, animasi transisi, dan utilitas "Game Mode".
- `server.js`: Server WebSocket mandiri menggunakan Express & Socket.IO.
- `lib/store.ts`: Manajemen state global menggunakan Zustand yang tersinkronisasi dengan Socket.IO.
- `components/ui/`: Library komponen UI khusus bertema Islamic Cinematic.

---
*Dokumentasi ini dibuat untuk mempermudah pengembangan dan maintenance sistem.*
