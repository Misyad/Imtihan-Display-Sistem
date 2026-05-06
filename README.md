# Imtihan Display Sistem 🌙

Sistem display ujian digital modern bertema **Islamic Cinematic** yang dirancang khusus untuk acara wisuda santri (*Haflah At-Takhrij*), cerdas cermat, atau imtihan niha'i. Dibangun dengan fokus pada estetika premium, performa tinggi, dan kemudahan kontrol.

## 🚀 Fitur Utama

- **Real-time Synchronization**: Seluruh perangkat (Operator, Display, Remote, OBS, Interactive Board) tersinkronisasi secara instan menggunakan Socket.IO.
- **Interactive Board (`/interactive`)**: Mode All-in-One untuk skenario satu layar. Menampilkan grid nomor soal dengan pop-up cinematic untuk soal dan jawaban.
- **Cinematic Display (`/display`)**: Tampilan audience layar penuh khusus untuk monitor/proyektor sekunder dengan animasi transisi yang sangat halus.
- **Operator Dashboard (`/operator`)**: Pusat kendali utama dengan Live Preview, manajemen soal, dan kontrol sistem.
- **Smart Remote Mobile (`/remote`)**: Kendalikan seluruh sistem dari HP via Wi-Fi dengan feedback getar (*haptic*).
- **OBS Livestream Support**: 
  - `/obs`: Overlay lower-third transparan.
  - `/obs-split`: Layout split-screen (Kamera + Soal).
- **Excel Import**: Import dan validasi data soal secara masal via file Excel.
- **Offline & Local Network Ready**: Dirancang khusus untuk berjalan di jaringan lokal tanpa membutuhkan koneksi internet.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4 (OKLCH Emerald & Gold Theme)
- **State Management**: Zustand (dengan Persistence & Socket Sync)
- **Animations**: Framer Motion
- **Real-time**: Socket.IO
- **Icons**: Lucide React

## 📦 Instalasi & Menjalankan

1. Instal dependensi:
   ```bash
   npm install
   ```
2. Jalankan aplikasi dan server socket:
   ```bash
   npm run dev-full
   ```
3. Akses via IP Laptop (misal: `http://192.168.1.5:3000`) agar HP Remote bisa terhubung.

## 📖 Panduan Skenario Penggunaan

### Skenario 1: Satu Layar (Laptop Saja)
- Buka halaman `/interactive`. 
- Operasikan langsung dengan mengklik nomor soal. 
- Pop-up soal dan jawaban akan muncul secara otomatis dan elegan.

### Skenario 2: Dua Layar (Operator + Proyektor)
- Laptop Utama: Buka `/operator`.
- Monitor/Proyektor: Buka `/display`.
- Kendalikan dari laptop, tampilan akan berubah secara otomatis di proyektor.

### Skenario 3: Remote Control (Panggung)
- Buka `/interactive` atau `/display` pada layar utama.
- Scan QR Code dari dashboard untuk membuka `/remote` di HP.
- Juri/Ustadz bisa berdiri di panggung dan mengendalikan soal langsung dari HP.

### Skenario 4: Livestreaming (OBS)
- Tambahkan Browser Source di OBS dengan URL `/obs` atau `/obs-split`.
- Setiap aksi di operator akan terupdate secara real-time di streaming Anda.

## 📁 Struktur Proyek

- `/app`: Routing dan halaman utama.
- `/components`: Komponen UI (Atomic Design) dan fitur reusable.
- `/lib`: Manajemen state (Zustand) dan koneksi Socket.IO.
- `/data`: Dataset soal (JSON) dan mock data.
- `/server.js`: Server WebSocket mandiri.

---
**Developed by Antigravity AI**
*Bi taufiqillah wa najah*
