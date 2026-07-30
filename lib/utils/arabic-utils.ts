import { Question } from '@/types/index';

export function containsArabic(text: string): boolean {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  return arabicPattern.test(text);
}

export function detectRTL(text: string): boolean {
  return containsArabic(text);
}

export function convertArabicComma(text: string): string {
  return text.replace(/,/g, '،');
}

export function convertArabicNumbers(text: string): string {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  
  return text.replace(/\d/g, (match) => {
    const digit = parseInt(match, 10);
    return arabicNumbers[digit] || match;
  });
}

export function processArabicText(text: string, options?: {
  convertComma?: boolean;
  convertNumbers?: boolean;
}): string {
  if (!text) return text;

  let processed = text;

  if (options?.convertComma) {
    processed = convertArabicComma(processed);
  }

  if (options?.convertNumbers) {
    processed = convertArabicNumbers(processed);
  }

  return processed;
}

export function getTextDirection(text: string): 'rtl' | 'ltr' {
  return detectRTL(text) ? 'rtl' : 'ltr';
}

export function normalizeArabicText(text: string): string {
  return text
    .replace(/آ/g, 'ا')
    .replace(/إ/g, 'ا')
    .replace(/أ/g, 'ا')
    .replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه');
}

export function extractArabicWords(text: string): string[] {
  const arabicWordPattern = /[\u0600-\u06FF]+/g;
  const matches = text.match(arabicWordPattern);
  return matches || [];
}

export function calculateArabicPercentage(text: string): number {
  if (!text || text.length === 0) return 0;
  
  const arabicChars = text.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g);
  const arabicCount = arabicChars ? arabicChars.length : 0;
  
  return Math.round((arabicCount / text.length) * 100);
}

export function shouldUseArabicFont(question: Partial<Question>): boolean {
  const soalArabicPercentage = calculateArabicPercentage(question.soal || '');
  const jawabanArabicPercentage = calculateArabicPercentage(question.jawaban || '');
  
  return soalArabicPercentage > 30 || jawabanArabicPercentage > 30 || question.isRTL === true;
}

export const ARABIC_CATEGORIES = [
  'Tauhid',
  'Fiqih',
  'Nahwu',
  'Sharaf',
  'Tajwid',
  'Akhlak',
  'Hafalan',
  'Tafsir',
  'Hadits',
  'Aqidah',
];

export function isArabicCategory(kategori: string): boolean {
  return ARABIC_CATEGORIES.some(cat => 
    kategori.toLowerCase().includes(cat.toLowerCase())
  );
}
