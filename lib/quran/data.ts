import quranData from "quran-json/dist/quran_id.json";
import { PAGE_BREAKS } from "./page-breaks";
import type { Verse, SurahInfo } from "./types";

type RawSurah = {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: "meccan" | "medinan";
  total_verses: number;
  verses: { id: number; text: string; translation: string }[];
};

type RevelationType = "makkiyah" | "madaniiyah";

function findPage(surahId: number, ayahNumber: number): number {
  let currentPage = 1;
  for (const [page, surah, ayah] of PAGE_BREAKS) {
    if (surah > surahId || (surah === surahId && ayah > ayahNumber)) {
      break;
    }
    currentPage = page;
  }
  return currentPage;
}

function findJuz(surahId: number, ayahNumber: number): number {
  // Simplified juz calculation (each juz ~20 pages)
  const page = findPage(surahId, ayahNumber);
  return Math.min(30, Math.ceil(page / 20));
}

export const ALL_SURAH: SurahInfo[] = [];
export const ALL_VERSES: Verse[] = [];

let globalId = 1;
const rawQuran = quranData as unknown as RawSurah[];

for (const surah of rawQuran) {
  const surahId = surah.id;
  const type: RevelationType = surah.type === "meccan" ? "makkiyah" : "madaniiyah";
  let pageStart = 604;
  let pageEnd = 1;

  for (const verse of surah.verses) {
    const ayahNum = verse.id;
    const page = findPage(surahId, ayahNum);
    const juz = findJuz(surahId, ayahNum);

    if (page < pageStart) pageStart = page;
    if (page > pageEnd) pageEnd = page;

    ALL_VERSES.push({
      id: globalId++,
      surah: surahId,
      ayah: ayahNum,
      text_arabic: verse.text,
      translation_id: verse.translation || "",
      page,
      juz,
      hizb: Math.ceil(juz * 2) - 1,
      sajdah: false,
    });
  }

  ALL_SURAH.push({
    id: surahId,
    name_arabic: surah.name,
    name_transliteration: surah.transliteration,
    name_translation: surah.translation,
    type,
    total_verses: surah.total_verses,
    page_start: pageStart,
    page_end: pageEnd,
  });
}

export function getVersesByPage(page: number): Verse[] {
  return ALL_VERSES.filter((v) => v.page === page);
}

export function getAyah(surahId: number, ayahNumber: number): Verse | undefined {
  return ALL_VERSES.find((v) => v.surah === surahId && v.ayah === ayahNumber);
}

export function getSurah(surahId: number): SurahInfo | undefined {
  return ALL_SURAH.find((s) => s.id === surahId);
}

export function getPageByAyah(surahId: number, ayahNumber: number): number {
  return findPage(surahId, ayahNumber);
}

/**
 * Parse ayat string like "1-4", "255", "1,2,3" and return array of ayah numbers
 */
export function parseAyatRange(ayatString: string): number[] {
  const ayatNumbers: number[] = [];
  
  // Handle comma-separated: "1,2,3"
  if (ayatString.includes(',')) {
    return ayatString.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  }
  
  // Handle range: "1-4"
  if (ayatString.includes('-')) {
    const [start, end] = ayatString.split('-').map(s => parseInt(s.trim()));
    if (!isNaN(start) && !isNaN(end)) {
      for (let i = start; i <= end; i++) {
        ayatNumbers.push(i);
      }
    }
    return ayatNumbers;
  }
  
  // Single ayah: "255"
  const single = parseInt(ayatString.trim());
  if (!isNaN(single)) {
    return [single];
  }
  
  return [];
}

/**
 * Get all verses for a surah+ayat reference
 */
export function getVersesForReference(surahId: number, ayatString: string): Verse[] {
  const ayatNumbers = parseAyatRange(ayatString);
  return ayatNumbers
    .map(ayahNum => getAyah(surahId, ayahNum))
    .filter((v): v is Verse => v !== undefined);
}
