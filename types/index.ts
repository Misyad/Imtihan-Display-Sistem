export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
}

export interface Statistics {
  totalUsers: number;
  activeSessions: number;
  uptime: string;
  lastUpdated: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  status: 'success' | 'warning' | 'error';
}

export interface QuranReference {
  surah: number;        // 1-114
  surahName: string;    // "Al-Ikhlas"
  ayat: string;         // "1-4" or "255"
}

export interface Question {
  id: string;
  nomor: number;
  kategori: string;
  soal: string;
  jawaban: string;
  soalImage?: string;
  jawabanImage?: string;
  catatan?: string;
  createdAt: string;
  updatedAt: string;
  isRTL?: boolean;
  quranRef?: QuranReference;
}

export interface QuestionFilter {
  search?: string;
  kategori?: string;
  sortBy: 'nomor' | 'terbaru' | 'terlama' | 'a-z' | 'z-a';
}

export interface QuestionDraft {
  id: string;
  data: Partial<Question>;
  savedAt: string;
}

export type ImportMode = 'merge' | 'replace' | 'append';
export type ExportFormat = 'json' | 'excel';

export interface ImportResult {
  success: number;
  failed: number;
  errors?: string[];
}

export interface QuestionStorageAdapter {
  getAll(): Promise<Question[]>;
  getById(id: string): Promise<Question | null>;
  create(data: Partial<Question>): Promise<Question>;
  update(id: string, data: Partial<Question>): Promise<Question>;
  delete(id: string): Promise<void>;
  search(query: string): Promise<Question[]>;
  reorder(ids: string[]): Promise<void>;
}
