# PRD (Product Requirements Document)

# Question Bank Management

### Imtihan Display Sistem v2.2

---

# 1. Overview

## Background

Saat ini Imtihan Display Sistem telah memiliki fitur Import Excel dan mekanisme menampilkan soal secara real-time ke berbagai client (Display, OBS, Remote, Interactive). Namun proses pengelolaan soal masih bergantung pada file JSON hasil import dan belum menyediakan antarmuka untuk melakukan perubahan secara langsung.
Hal tersebut menyebabkan setiap perubahan kecil seperti memperbaiki typo, mengganti gambar, atau mengubah jawaban harus dilakukan melalui proses import ulang.

Fitur **Question Bank Management** hadir sebagai pusat pengelolaan seluruh soal secara visual tanpa perlu membuka file JSON ataupun Excel.

---

# 2. Goals

Menyediakan sistem CRUD (Create, Read, Update, Delete) soal yang cepat, intuitif, dan aman sehingga panitia dapat:

* menambah soal
* mengedit soal
* menghapus soal
* menduplikasi soal
* mencari soal
* mengurutkan soal
* mengelola gambar
* melakukan preview hasil secara real-time

tanpa mengganggu jalannya display.

---

# 3. Non Goals

Versi pertama tidak mencakup:

* Collaborative editing
* Version history
* Approval workflow
* AI Question Generator
* OCR soal dari gambar

Fitur tersebut akan menjadi roadmap versi selanjutnya.

---

# 4. Target Users

## Operator

Mengelola seluruh soal.

## Admin

Import, export, backup dan maintenance.

## Moderator

Melakukan koreksi soal ketika acara berlangsung.

---

# 5. Navigation

Menu baru ditambahkan pada sidebar.

```text
Dashboard

Operator
Display
Interactive
Remote
OBS
OBS Split
Papan Soal
Settings

📚 Bank Soal
```

---

# 6. Main Page

## Layout

```
──────────────────────────────────────────────

📚 Bank Soal

Cari...

Kategori ▼

Jumlah Soal : 120

+ Tambah Soal

──────────────────────────────────────────────

Table

No
Kategori
Preview
Status
Aksi

──────────────────────────────────────────────
```

---

# 7. Table Features

Kolom

* Nomor
* Kategori
* Pertanyaan (preview)
* Ada gambar
* Ada jawaban
* Last Update
* Action

Action

* View
* Edit
* Duplicate
* Delete

---

# 8. Search

Support

* nomor soal
* isi pertanyaan
* jawaban
* kategori

Realtime search.

---

# 9. Filter

Filter berdasarkan

* Semua
* Tauhid
* Fiqih
* Nahwu
* Sharaf
* Tajwid
* Akhlak
* Hafalan
* Custom Category

---

# 10. Sorting

Sort berdasarkan

* Nomor
* Terbaru
* Terlama
* A-Z
* Z-A

---

# 11. Create Question

Field

Nomor

Kategori

Pertanyaan

Jawaban

RTL

Upload gambar soal

Upload gambar jawaban

Catatan

Button

Simpan

Batal

---

# 12. Edit Question

Halaman edit menggunakan Drawer Full Width.

Layout

```
────────────────────────────────────────

Editor

────────────────────────────────────────

Nomor

Kategori

Pertanyaan

Jawaban

RTL

Upload Image

────────────────────────────────────────

Live Preview

────────────────────────────────────────
```

---

# 13. Live Preview

Preview menggunakan renderer yang sama dengan halaman Display.

Perubahan pada editor langsung muncul di preview.

Target latency

< 100 ms

Preview harus identik dengan tampilan projector.

---

# 14. Rich Text Support

Editor mendukung

* Bold
* Italic
* Underline
* Bullet
* Numbering
* Superscript
* Subscript
* Copy Paste Word
* Arabic RTL

---

# 15. Arabic Mode

Tombol

RTL

Ketika aktif

* direction RTL
* align right
* Arabic comma
* Arabic numbering
* line-height Arabic

---

# 16. Image Upload

Support

PNG

JPG

JPEG

WEBP

Drag & Drop

Clipboard Paste

Preview

Replace Image

Remove Image

---

# 17. Duplicate Question

Klik Duplicate

System membuat

Nomor otomatis berikutnya

Seluruh isi soal disalin.

---

# 18. Delete Question

Menggunakan confirmation dialog.

```
Yakin ingin menghapus soal?

[Hapus]

[Batal]
```

---

# 19. Drag & Drop Reorder

Operator dapat mengubah urutan soal.

Saat selesai

Nomor soal diperbarui otomatis.

---

# 20. Auto Save

Selama editing

Draft disimpan otomatis setiap 10 detik.

Jika browser tertutup

draft dapat dipulihkan.

---

# 21. Validation

Nomor wajib unik.

Pertanyaan wajib diisi.

Jawaban wajib diisi.

Ukuran gambar maksimal mengikuti batas sistem yang berlaku.

---

# 22. Keyboard Shortcut

Ctrl + S

Simpan

Ctrl + D

Duplicate

Ctrl + Z

Undo

Ctrl + Shift + Z

Redo

Esc

Close Drawer

---

# 23. Export

Export

JSON

Excel

---

# 24. Import

Import

Excel

JSON

Merge

Replace

Append

---

# 25. UX Requirements

Semua aksi CRUD

Toast Notification

Loading State

Skeleton

Optimistic UI

Undo Delete (5 detik)

---

# 26. Technical Requirements

Seluruh operasi soal dilakukan melalui abstraction layer.

```
QuestionService

getQuestions()

getQuestion()

createQuestion()

updateQuestion()

deleteQuestion()

duplicateQuestion()

reorderQuestion()

searchQuestion()

importQuestions()

exportQuestions()
```

Implementasi awal tetap menggunakan storage yang saat ini dipakai proyek agar kompatibel dengan arsitektur eksisting, dan nantinya dapat diganti ke database tanpa mengubah UI. Hal ini selaras dengan rencana migrasi database yang sudah tercantum pada roadmap proyek.

---

# 27. Performance Target

Load 1.000 soal

< 1 detik

Search

< 100 ms

Save

< 300 ms

Render Preview

< 100 ms

Memory

< 150 MB

---

# 28. Security

* Validasi seluruh input.
* Sanitasi HTML/Rich Text.
* Validasi tipe file dan ukuran gambar.
* Escape karakter berbahaya.
* Konfirmasi sebelum penghapusan.
* Blok upload file yang tidak sesuai format.

---

# 29. Future Roadmap

Version History

Question Approval

Role Permission

Bulk Edit

Bulk Delete

Question Analytics

Favorite Questions

AI Question Generator

OCR Import

Question Templates

Cloud Sync

---

# 30. Success Metrics

* 95% perubahan soal dilakukan tanpa import ulang.
* Waktu edit satu soal kurang dari 30 detik.
* Waktu pencarian soal kurang dari 2 detik pada 1.000 soal.
* Tidak ada gangguan sinkronisasi Display saat proses edit.
* Tingkat kegagalan penyimpanan kurang dari 0,1%.

---

# 31. Acceptance Criteria

✅ Operator dapat membuat soal baru.

✅ Operator dapat mengedit soal tanpa reload halaman.

✅ Operator dapat menghapus soal.

✅ Operator dapat menduplikasi soal.

✅ Operator dapat melakukan drag & drop urutan soal.

✅ Preview selalu identik dengan halaman Display.

✅ Perubahan tersimpan tanpa memengaruhi sesi display yang sedang berjalan hingga operator memilih untuk menerapkannya.

✅ Import dan Export tetap kompatibel dengan format soal yang digunakan sistem saat ini.

---

# 32. Estimated Development

| Modul                       | Estimasi |
| --------------------------- | -------: |
| UI Table & Search           |    8 jam |
| CRUD Question               |   12 jam |
| Rich Text Editor            |   10 jam |
| Live Preview                |    8 jam |
| Upload Image                |    6 jam |
| Drag & Drop                 |    6 jam |
| Import / Export Integration |    6 jam |
| Validation & Testing        |    8 jam |

**Total Estimasi:** **64 jam** (± 8 hari kerja)
