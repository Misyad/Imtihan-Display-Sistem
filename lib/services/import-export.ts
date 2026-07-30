import * as XLSX from 'xlsx';
import { Question, ImportMode, ImportResult } from '@/types/index';
import { QuestionStorageAdapter } from './question-storage';

export async function importQuestions(
  file: File,
  mode: ImportMode,
  storage: QuestionStorageAdapter
): Promise<ImportResult> {
  try {
    const parsedQuestions = await parseImportFile(file);

    if (parsedQuestions.length === 0) {
      return {
        success: 0,
        failed: 0,
        errors: ['Tidak ada data valid ditemukan dalam file'],
      };
    }

    const validation = validateImportData(parsedQuestions);
    if (validation.errors.length > 0) {
      return {
        success: 0,
        failed: parsedQuestions.length,
        errors: validation.errors,
      };
    }

    const result = await applyImportMode(parsedQuestions, mode, storage);

    return result;
  } catch (error) {
    return {
      success: 0,
      failed: 1,
      errors: [error instanceof Error ? error.message : 'Gagal mengimpor file'],
    };
  }
}

function validateImportData(questions: Partial<Question>[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const nomors = new Set<number>();

  questions.forEach((q, index) => {
    const rowNum = index + 1;

    if (!q.nomor || q.nomor <= 0 || isNaN(q.nomor)) {
      errors.push(`Baris ${rowNum}: Nomor soal harus diisi dan lebih dari 0`);
    } else if (nomors.has(q.nomor)) {
      errors.push(`Baris ${rowNum}: Nomor soal ${q.nomor} duplikat dalam file`);
    } else {
      nomors.add(q.nomor);
    }

    if (!q.soal || q.soal.trim() === '') {
      errors.push(`Baris ${rowNum}: Pertanyaan harus diisi`);
    }

    if (!q.jawaban || q.jawaban.trim() === '') {
      errors.push(`Baris ${rowNum}: Jawaban harus diisi`);
    }
  });

  return { valid: errors.length === 0, errors };
}

async function parseImportFile(file: File): Promise<Partial<Question>[]> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'json') {
    return parseJSON(file);
  } else if (extension === 'xlsx' || extension === 'xls') {
    return parseExcel(file);
  }

  throw new Error('Format file tidak didukung. Gunakan JSON atau Excel (.xlsx, .xls)');
}

async function parseJSON(file: File): Promise<Partial<Question>[]> {
  const text = await file.text();
  const data = JSON.parse(text);

  const questions = Array.isArray(data) ? data : [data];

  return questions.map((item: any, index: number) => ({
    nomor: parseInt(item.nomor || item.no || item.Nomor || index + 1),
    kategori: item.kategori || item.Kategori || item.category || 'Umum',
    soal: item.soal || item.Soal || item.question || item.Question || '',
    jawaban: item.jawaban || item.Jawaban || item.answer || item.Answer || '',
    soalImage: item.soalImage || item.soal_image || item.imageSoal || '',
    jawabanImage: item.jawabanImage || item.jawaban_image || item.imageJawaban || '',
    catatan: item.catatan || item.notes || '',
    isRTL: item.isRTL || false,
    quranRef: item.quranRef || undefined,
  }));
}

async function parseExcel(file: File): Promise<Partial<Question>[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  return rows.map((row: any) => {
    const question: Partial<Question> = {
      nomor: parseInt(row.nomor || row.No || row.Nomor || 0),
      kategori: row.kategori || row.Kategori || row.Category || 'Umum',
      soal: row.soal || row.Soal || row.Question || row.Pertanyaan || '',
      jawaban: row.jawaban || row.Jawaban || row.Answer || '',
      soalImage: row.soalImage || row.gambar_soal || row.imageSoal || '',
      jawabanImage: row.jawabanImage || row.gambar_jawaban || row.imageJawaban || '',
      catatan: row.catatan || row.Catatan || row.notes || '',
    };

    // Parse quranRef from Excel columns
    const surah = row.quranRef_surah || row.surah || row.Surah;
    const surahName = row.quranRef_surahName || row.surahName || row.SurahName;
    const ayat = row.quranRef_ayat || row.ayat || row.Ayat;

    if (surah && surahName && ayat) {
      question.quranRef = {
        surah: parseInt(surah),
        surahName: String(surahName),
        ayat: String(ayat),
      };
    }

    return question;
  });
}

async function applyImportMode(
  imported: Partial<Question>[],
  mode: ImportMode,
  storage: QuestionStorageAdapter
): Promise<ImportResult> {
  const errors: string[] = [];
  let success = 0;
  let failed = 0;

  const existingQuestions = await storage.getAll();

  switch (mode) {
    case 'replace':
      for (const item of imported) {
        try {
          const newQuestion: Question = {
            id: `q-${item.nomor}`,
            nomor: item.nomor!,
            kategori: item.kategori || 'Umum',
            soal: item.soal!,
            jawaban: item.jawaban!,
            soalImage: item.soalImage,
            jawabanImage: item.jawabanImage,
            catatan: item.catatan,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isRTL: item.isRTL || false,
            quranRef: item.quranRef,
          };

          await storage.create(newQuestion);
          success++;
        } catch (error) {
          failed++;
          errors.push(
            `Baris ${item.nomor}: ${error instanceof Error ? error.message : 'Gagal mengimpor'}`
          );
        }
      }
      break;

    case 'merge':
      for (const item of imported) {
        try {
          const existing = existingQuestions.find(q => q.nomor === item.nomor);

          if (existing) {
            await storage.update(existing.id, {
              ...item,
              updatedAt: new Date().toISOString(),
            });
          } else {
            const newQuestion: Question = {
              id: `q-${item.nomor}`,
              nomor: item.nomor!,
              kategori: item.kategori || 'Umum',
              soal: item.soal!,
              jawaban: item.jawaban!,
              soalImage: item.soalImage,
              jawabanImage: item.jawabanImage,
              catatan: item.catatan,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isRTL: item.isRTL || false,
              quranRef: item.quranRef,
            };
            await storage.create(newQuestion);
          }
          success++;
        } catch (error) {
          failed++;
          errors.push(
            `Baris ${item.nomor}: ${error instanceof Error ? error.message : 'Gagal mengimpor'}`
          );
        }
      }
      break;

    case 'append':
      const maxNomor = existingQuestions.length > 0
        ? Math.max(...existingQuestions.map(q => q.nomor))
        : 0;

      for (let i = 0; i < imported.length; i++) {
        try {
          const item = imported[i];
          const newNomor = maxNomor + i + 1;

          const newQuestion: Question = {
            id: `q-${newNomor}`,
            nomor: newNomor,
            kategori: item.kategori || 'Umum',
            soal: item.soal!,
            jawaban: item.jawaban!,
            soalImage: item.soalImage,
            jawabanImage: item.jawabanImage,
            catatan: item.catatan,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isRTL: item.isRTL || false,
            quranRef: item.quranRef,
          };

          await storage.create(newQuestion);
          success++;
        } catch (error) {
          failed++;
          errors.push(
            `Baris ${i + 1}: ${error instanceof Error ? error.message : 'Gagal mengimpor'}`
          );
        }
      }
      break;
  }

  return { success, failed, errors: errors.length > 0 ? errors : undefined };
}

export async function exportQuestions(
  questions: Question[],
  format: 'json' | 'excel'
): Promise<Blob> {
  if (format === 'json') {
    const json = JSON.stringify(questions, null, 2);
    return new Blob([json], { type: 'application/json' });
  }

  if (format === 'excel') {
    const worksheet = XLSX.utils.json_to_sheet(
      questions.map(q => ({
        nomor: q.nomor,
        kategori: q.kategori,
        soal: q.soal,
        jawaban: q.jawaban,
        soalImage: q.soalImage || '',
        jawabanImage: q.jawabanImage || '',
        catatan: q.catatan || '',
        quranRef_surah: q.quranRef?.surah || '',
        quranRef_surahName: q.quranRef?.surahName || '',
        quranRef_ayat: q.quranRef?.ayat || '',
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bank Soal');

    const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

    return new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  }

  throw new Error('Format tidak didukung');
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
