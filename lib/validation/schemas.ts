export interface ValidationErrorDetails {
  [key: string]: string[];
}

export function validateLogin(data: any): ValidationErrorDetails | null {
  const errors: ValidationErrorDetails = {};
  if (!data.email || typeof data.email !== "string" || !data.email.includes("@")) {
    errors.email = ["Email tidak valid."];
  }
  if (!data.password || typeof data.password !== "string" || data.password.length < 6) {
    errors.password = ["Password minimal harus 6 karakter."];
  }
  return Object.keys(errors).length > 0 ? errors : null;
}

export function validateProfile(data: any): ValidationErrorDetails | null {
  const errors: ValidationErrorDetails = {};
  if (!data.id || typeof data.id !== "string" || data.id.trim() === "") {
    errors.id = ["ID profil wajib diisi."];
  }
  if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
    errors.name = ["Nama profil/lembaga wajib diisi."];
  }
  return Object.keys(errors).length > 0 ? errors : null;
}

export function validateQuestion(data: any): ValidationErrorDetails | null {
  const errors: ValidationErrorDetails = {};
  if (typeof data.nomor !== "number" || data.nomor <= 0) {
    errors.nomor = ["Nomor soal harus berupa angka positif."];
  }
  if (!data.kategori || typeof data.kategori !== "string" || data.kategori.trim() === "") {
    errors.kategori = ["Kategori soal wajib diisi."];
  }
  if (!data.soal || typeof data.soal !== "string" || data.soal.trim() === "") {
    errors.soal = ["Teks soal wajib diisi."];
  }
  if (!data.jawaban || typeof data.jawaban !== "string" || data.jawaban.trim() === "") {
    errors.jawaban = ["Teks jawaban wajib diisi."];
  }
  return Object.keys(errors).length > 0 ? errors : null;
}

export function validateSettings(data: any): ValidationErrorDetails | null {
  const errors: ValidationErrorDetails = {};
  if (!data.instituteName || typeof data.instituteName !== "string" || data.instituteName.trim() === "") {
    errors.instituteName = ["Nama lembaga wajib diisi."];
  }
  if (!data.eventName || typeof data.eventName !== "string" || data.eventName.trim() === "") {
    errors.eventName = ["Nama acara wajib diisi."];
  }
  if (!data.academicYear || typeof data.academicYear !== "string" || data.academicYear.trim() === "") {
    errors.academicYear = ["Tahun akademik wajib diisi."];
  }
  if (data.fontSize && !["normal", "large", "extra-large"].includes(data.fontSize)) {
    errors.fontSize = ["Ukuran font tidak valid."];
  }
  return Object.keys(errors).length > 0 ? errors : null;
}
