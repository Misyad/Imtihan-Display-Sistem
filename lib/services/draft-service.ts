import { Question, QuestionDraft } from '@/types/index';

const DRAFT_KEY = 'imtihan-question-drafts';
const DEBOUNCE_KEY = 'imtihan-draft-debounce';

export class DraftService {
  static saveDraft(questionId: string, data: Partial<Question>): void {
    if (typeof window === 'undefined') return;

    const drafts = this.getAllDrafts();
    drafts[questionId] = {
      id: questionId,
      data,
      savedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }

  static getDraft(questionId: string): QuestionDraft | null {
    if (typeof window === 'undefined') return null;

    const drafts = this.getAllDrafts();
    return drafts[questionId] || null;
  }

  static getAllDrafts(): Record<string, QuestionDraft> {
    if (typeof window === 'undefined') return {};

    try {
      const stored = localStorage.getItem(DRAFT_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to get drafts:', error);
      return {};
    }
  }

  static clearDraft(questionId: string): void {
    if (typeof window === 'undefined') return;

    const drafts = this.getAllDrafts();
    delete drafts[questionId];

    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }

  static hasDraft(questionId: string): boolean {
    return !!this.getDraft(questionId);
  }

  static clearAllDrafts(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      console.error('Failed to clear all drafts:', error);
    }
  }

  static debouncedSave(
    questionId: string,
    data: Partial<Question>,
    delay: number = 1000
  ): void {
    if (typeof window === 'undefined') return;

    const existingTimer = localStorage.getItem(DEBOUNCE_KEY);
    if (existingTimer) {
      const timerId = parseInt(existingTimer, 10);
      if (!isNaN(timerId)) {
        clearTimeout(timerId);
      }
    }

    const timerId = setTimeout(() => {
      this.saveDraft(questionId, data);
      localStorage.removeItem(DEBOUNCE_KEY);
    }, delay);

    localStorage.setItem(DEBOUNCE_KEY, timerId.toString());
  }

  static getDraftAge(draft: QuestionDraft): number {
    const savedAt = new Date(draft.savedAt).getTime();
    const now = Date.now();
    return now - savedAt;
  }

  static formatDraftAge(draft: QuestionDraft): string {
    const ageMs = this.getDraftAge(draft);
    const ageMinutes = Math.floor(ageMs / 60000);
    const ageHours = Math.floor(ageMinutes / 60);
    const ageDays = Math.floor(ageHours / 24);

    if (ageDays > 0) {
      return `${ageDays} hari yang lalu`;
    }
    if (ageHours > 0) {
      return `${ageHours} jam yang lalu`;
    }
    if (ageMinutes > 0) {
      return `${ageMinutes} menit yang lalu`;
    }
    return 'Baru saja';
  }
}
