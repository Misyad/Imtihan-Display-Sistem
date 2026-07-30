import { Question, QuestionStorageAdapter } from '@/types/index';
import { useQuestionStore, QuestionEntry } from '@/lib/store';

export class LocalStorageAdapter implements QuestionStorageAdapter {
  private getStoreQuestions(): Question[] {
    const state = useQuestionStore.getState();
    const profile = state.profiles[state.activeProfileId];
    if (!profile) return [];
    
    return profile.questions.map((q: QuestionEntry) => ({
      id: `q-${state.activeProfileId}-${q.nomor}`,
      nomor: q.nomor,
      kategori: q.kategori,
      soal: q.soal,
      jawaban: q.jawaban,
      soalImage: q.soalImage,
      jawabanImage: q.jawabanImage,
      catatan: q.catatan || '',
      createdAt: q.createdAt || new Date().toISOString(),
      updatedAt: q.updatedAt || new Date().toISOString(),
      isRTL: q.isRTL || false,
      quranRef: q.quranRef,
    }));
  }

  private setStoreQuestions(questions: Question[]): void {
    const state = useQuestionStore.getState();
    const profile = state.profiles[state.activeProfileId];
    if (!profile) return;

    const questionEntries: QuestionEntry[] = questions.map(q => ({
      nomor: q.nomor,
      kategori: q.kategori,
      soal: q.soal,
      jawaban: q.jawaban,
      soalImage: q.soalImage,
      jawabanImage: q.jawabanImage,
      catatan: q.catatan,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
      isRTL: q.isRTL,
      quranRef: q.quranRef,
    }));

    state.setQuestions(questionEntries);
  }

  async getAll(): Promise<Question[]> {
    return this.getStoreQuestions();
  }

  async getById(id: string): Promise<Question | null> {
    const questions = this.getStoreQuestions();
    return questions.find(q => q.id === id) || null;
  }

  async create(data: Partial<Question>): Promise<Question> {
    const state = useQuestionStore.getState();
    const questions = this.getStoreQuestions();
    const newQuestion: Question = {
      id: `q-${state.activeProfileId}-${data.nomor || questions.length + 1}`,
      nomor: data.nomor || questions.length + 1,
      kategori: data.kategori || 'Umum',
      soal: data.soal || '',
      jawaban: data.jawaban || '',
      soalImage: data.soalImage,
      jawabanImage: data.jawabanImage,
      catatan: data.catatan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isRTL: data.isRTL || false,
      quranRef: data.quranRef,
    };
    
    questions.push(newQuestion);
    this.setStoreQuestions(questions);
    
    return newQuestion;
  }

  async update(id: string, data: Partial<Question>): Promise<Question> {
    const questions = this.getStoreQuestions();
    const index = questions.findIndex(q => q.id === id);
    
    if (index === -1) {
      throw new Error(`Question with id ${id} not found`);
    }

    const updatedQuestion: Question = {
      ...questions[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    questions[index] = updatedQuestion;
    this.setStoreQuestions(questions);

    return updatedQuestion;
  }

  async delete(id: string): Promise<void> {
    const questions = this.getStoreQuestions();
    const filtered = questions.filter(q => q.id !== id);
    this.setStoreQuestions(filtered);
  }

  async search(query: string): Promise<Question[]> {
    const questions = this.getStoreQuestions();
    const lowerQuery = query.toLowerCase();
    
    return questions.filter(q => 
      q.nomor.toString().includes(query) ||
      q.kategori.toLowerCase().includes(lowerQuery) ||
      q.soal.toLowerCase().includes(lowerQuery) ||
      q.jawaban.toLowerCase().includes(lowerQuery) ||
      q.quranRef?.surahName.toLowerCase().includes(lowerQuery) ||
      q.quranRef?.ayat.includes(query)
    );
  }

  async reorder(ids: string[]): Promise<void> {
    const questions = this.getStoreQuestions();
    const reordered: Question[] = [];
    
    ids.forEach((id, index) => {
      const question = questions.find(q => q.id === id);
      if (question) {
        reordered.push({
          ...question,
          nomor: index + 1,
          updatedAt: new Date().toISOString(),
        });
      }
    });

    this.setStoreQuestions(reordered);
  }
}
