import { Question } from '@/types/index';

export interface QuestionStorageAdapter {
  getAll(): Promise<Question[]>;
  getById(id: string): Promise<Question | null>;
  create(data: Partial<Question>): Promise<Question>;
  update(id: string, data: Partial<Question>): Promise<Question>;
  delete(id: string): Promise<void>;
  search(query: string): Promise<Question[]>;
  reorder(ids: string[]): Promise<void>;
}
