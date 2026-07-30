import { Question, QuestionFilter, ImportMode, ExportFormat, ImportResult } from '@/types/index';
import { QuestionStorageAdapter } from './question-storage';
import { LocalStorageAdapter } from './local-storage-adapter';
import { importQuestions, exportQuestions } from './import-export';

export class QuestionService {
  private storage: QuestionStorageAdapter;

  constructor(adapter?: QuestionStorageAdapter) {
    this.storage = adapter || new LocalStorageAdapter();
  }

  async getQuestions(filter?: QuestionFilter): Promise<Question[]> {
    let questions = await this.storage.getAll();

    if (filter?.search) {
      questions = await this.storage.search(filter.search);
    }

    if (filter?.kategori && filter.kategori !== 'Semua') {
      questions = questions.filter(q => q.kategori === filter.kategori);
    }

    questions = this.sortQuestions(questions, filter?.sortBy || 'nomor');

    return questions;
  }

  private sortQuestions(questions: Question[], sortBy: QuestionFilter['sortBy']): Question[] {
    const sorted = [...questions];

    switch (sortBy) {
      case 'nomor':
        return sorted.sort((a, b) => a.nomor - b.nomor);
      case 'terbaru':
        return sorted.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      case 'terlama':
        return sorted.sort((a, b) => 
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        );
      case 'a-z':
        return sorted.sort((a, b) => 
          `${a.kategori}-${a.nomor}`.localeCompare(`${b.kategori}-${b.nomor}`)
        );
      case 'z-a':
        return sorted.sort((a, b) => 
          `${b.kategori}-${b.nomor}`.localeCompare(`${a.kategori}-${a.nomor}`)
        );
      default:
        return sorted;
    }
  }

  async getQuestion(id: string): Promise<Question | null> {
    return await this.storage.getById(id);
  }

  async createQuestion(data: Partial<Question>): Promise<Question> {
    this.validateQuestion(data);
    
    const questions = await this.storage.getAll();
    if (questions.some(q => q.nomor === data.nomor)) {
      throw new Error(`Nomor soal ${data.nomor} sudah digunakan`);
    }

    return await this.storage.create(data);
  }

  async updateQuestion(id: string, data: Partial<Question>): Promise<Question> {
    if (data.nomor !== undefined) {
      const questions = await this.storage.getAll();
      const existing = questions.find(q => q.nomor === data.nomor && q.id !== id);
      if (existing) {
        throw new Error(`Nomor soal ${data.nomor} sudah digunakan`);
      }
    }

    return await this.storage.update(id, data);
  }

  async deleteQuestion(id: string): Promise<void> {
    return await this.storage.delete(id);
  }

  async duplicateQuestion(id: string): Promise<Question> {
    const original = await this.storage.getById(id);
    if (!original) {
      throw new Error('Soal tidak ditemukan');
    }

    const questions = await this.storage.getAll();
    const maxNomor = Math.max(...questions.map(q => q.nomor), 0);

    const duplicated: Partial<Question> = {
      ...original,
      nomor: maxNomor + 1,
      catatan: original.catatan ? `Copy of #${original.nomor}` : undefined,
    };

    return await this.storage.create(duplicated);
  }

  async reorderQuestions(orderedIds: string[]): Promise<void> {
    return await this.storage.reorder(orderedIds);
  }

  async searchQuestions(query: string): Promise<Question[]> {
    return await this.storage.search(query);
  }

  async importFromFile(file: File, mode: ImportMode): Promise<ImportResult> {
    return await importQuestions(file, mode, this.storage);
  }

  async exportToFile(format: ExportFormat): Promise<Blob> {
    const questions = await this.storage.getAll();
    return await exportQuestions(questions, format);
  }

  async getCategories(): Promise<string[]> {
    const questions = await this.storage.getAll();
    const categories = new Set(questions.map(q => q.kategori));
    return Array.from(categories).sort();
  }

  async getMaxNomor(): Promise<number> {
    const questions = await this.storage.getAll();
    return questions.length > 0 ? Math.max(...questions.map(q => q.nomor)) : 0;
  }

  private validateQuestion(data: Partial<Question>): void {
    if (!data.nomor || data.nomor <= 0) {
      throw new Error('Nomor soal harus diisi dan lebih dari 0');
    }
    if (!data.soal || data.soal.trim() === '') {
      throw new Error('Pertanyaan harus diisi');
    }
    if (!data.jawaban || data.jawaban.trim() === '') {
      throw new Error('Jawaban harus diisi');
    }
  }
}
