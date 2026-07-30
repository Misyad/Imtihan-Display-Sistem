import { getAyah, getSurah, getPageByAyah, getVersesForReference } from './data';
import type { Verse, SurahInfo, QuranReference } from './types';

export class QuranService {
  /**
   * Get Kemenag mushaf page image URL
   */
  static getPageImageUrl(page: number): string {
    const pageStr = page.toString().padStart(3, '0');
    return `https://media.qurankemenag.net/khat2/QK_${pageStr}.webp`;
  }

  /**
   * Get verse by surah and ayah number
   */
  static getVerse(surah: number, ayah: number): Verse | undefined {
    return getAyah(surah, ayah);
  }

  /**
   * Get surah info by surah number
   */
  static getSurahInfo(surahId: number): SurahInfo | undefined {
    return getSurah(surahId);
  }

  /**
   * Get all verses for a reference (handles ranges like "1-4")
   */
  static getVersesForRef(ref: QuranReference): Verse[] {
    return getVersesForReference(ref.surah, ref.ayat);
  }

  /**
   * Get the mushaf page number for a verse
   */
  static getPageForVerse(surah: number, ayah: number): number {
    return getPageByAyah(surah, ayah);
  }

  /**
   * Get display data for a Quran reference
   */
  static getDisplayData(ref: QuranReference): {
    verses: Verse[];
    page: number;
    surahInfo: SurahInfo | undefined;
    imageUrl: string;
  } {
    const verses = this.getVersesForRef(ref);
    const firstVerse = verses[0];
    const page = firstVerse ? firstVerse.page : 1;
    const surahInfo = this.getSurahInfo(ref.surah);
    const imageUrl = this.getPageImageUrl(page);

    return {
      verses,
      page,
      surahInfo,
      imageUrl,
    };
  }
}
