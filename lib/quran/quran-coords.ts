import coordsData from "@/data/quran-coords.json";
import { parseAyatRange } from "./data";

export interface QuranCoordBox {
  page: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export type QuranCoordsMap = Record<string, QuranCoordBox[]>;

const coords = coordsData as QuranCoordsMap;

export const QURAN_IMG_W = 1080;
export const QURAN_IMG_H = 1745;

export function getBoxesForAyah(surah: number, ayah: number): QuranCoordBox[] {
  return coords[`${surah}:${ayah}`] ?? [];
}

export function getBoxesForRefOnPage(surah: number, ayatString: string, page: number): QuranCoordBox[] {
  const out: QuranCoordBox[] = [];
  for (const ayah of parseAyatRange(ayatString)) {
    for (const box of getBoxesForAyah(surah, ayah)) {
      if (box.page === page) out.push(box);
    }
  }
  return out;
}

export function unionBoxes(boxes: QuranCoordBox[]): QuranCoordBox | null {
  if (boxes.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const b of boxes) {
    minX = Math.min(minX, b.x);
    minY = Math.min(minY, b.y);
    maxX = Math.max(maxX, b.x + b.w);
    maxY = Math.max(maxY, b.y + b.h);
  }
  return { page: boxes[0].page, x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}
