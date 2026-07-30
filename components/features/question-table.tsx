'use client';

import { useState, useCallback, useEffect } from 'react';
import { Question, QuestionFilter } from '@/types/index';
import { QuestionService } from '@/lib/services/question-service';
import { SearchBar } from './search-bar';
import { CategoryFilter } from './category-filter';
import { QuestionTableSkeleton } from '@/components/ui/skeleton';
import { Plus, Download, Upload, ChevronDown, Edit2, Copy, Trash2, MoreVertical, ArrowUpDown, FileQuestion, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from '@/components/ui/toast';

interface QuestionTableProps {
  onEdit: (question: Question) => void;
  onCreate: () => void;
  onImport: () => void;
  onExport: () => void;
}

export function QuestionTable({ onEdit, onCreate, onImport, onExport }: QuestionTableProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<QuestionFilter>({ sortBy: 'nomor' });
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [deleteConfirmQuestion, setDeleteConfirmQuestion] = useState<Question | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const questionService = new QuestionService();

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const [questionsData, categoriesData] = await Promise.all([
        questionService.getQuestions(filter),
        questionService.getCategories(),
      ]);
      setQuestions(questionsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleSearch = (search: string) => {
    setFilter(prev => ({ ...prev, search }));
  };

  const handleCategoryChange = (kategori: string) => {
    setFilter(prev => ({ 
      ...prev, 
      kategori: kategori === 'Semua' ? undefined : kategori 
    }));
  };

  const handleSortChange = (sortBy: QuestionFilter['sortBy']) => {
    setFilter(prev => ({ ...prev, sortBy }));
  };

  const handleDuplicate = async (question: Question) => {
    try {
      await questionService.duplicateQuestion(question.id);
      loadQuestions();
    } catch (error) {
      console.error('Failed to duplicate:', error);
    }
    setOpenActionMenu(null);
  };

  const handleDeleteClick = (question: Question) => {
    setDeleteConfirmQuestion(question);
    setOpenActionMenu(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmQuestion) return;
    setActionLoading(deleteConfirmQuestion.id);
    try {
      await questionService.deleteQuestion(deleteConfirmQuestion.id);
      toast.success(`Soal #${deleteConfirmQuestion.nomor} berhasil dihapus`);
      loadQuestions();
    } catch (error) {
      toast.error('Gagal menghapus soal');
    } finally {
      setActionLoading(null);
      setDeleteConfirmQuestion(null);
    }
  };

  const [sortOpen, setSortOpen] = useState(false);
  const sortOptions: { value: QuestionFilter['sortBy']; label: string }[] = [
    { value: 'nomor', label: 'Nomor' },
    { value: 'terbaru', label: 'Terbaru' },
    { value: 'terlama', label: 'Terlama' },
    { value: 'a-z', label: 'A-Z' },
    { value: 'z-a', label: 'Z-A' },
  ];

  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');
  const truncate = (text: string, maxLength: number = 50) => {
    if (!text) return '';
    const plain = stripHtml(text);
    return plain.length > maxLength ? plain.substring(0, maxLength) + '...' : plain;
  };

  if (loading) {
    return <QuestionTableSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <SearchBar
          value={filter.search || ''}
          onChange={handleSearch}
          className="flex-1"
        />
        <CategoryFilter
          categories={categories}
          value={filter.kategori || 'Semua'}
          onChange={handleCategoryChange}
          className="w-full md:w-48"
        />
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted transition-colors w-full md:w-auto"
          >
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">
              {sortOptions.find(o => o.value === filter.sortBy)?.label || 'Urutkan'}
            </span>
            <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', sortOpen && 'rotate-180')} />
          </button>
          {sortOpen && (
            <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-10 min-w-[140px]">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleSortChange(option.value);
                    setSortOpen(false);
                  }}
                  className={cn(
                    'w-full px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors first:rounded-t-xl last:rounded-b-xl',
                    filter.sortBy === option.value && 'bg-primary/10 text-primary font-medium'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:block bg-card rounded-2xl border border-border overflow-visible">
        {questions.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">No</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Kategori</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Pertanyaan</th>
                <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Update</th>
                <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {questions.map((question, index) => (
                  <motion.tr
                    key={question.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <span className="font-bold text-primary">#{question.nomor.toString().padStart(2, '0')}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                        {question.kategori}
                      </span>
                    </td>
                    <td className="px-4 py-4 max-w-md">
                      <p className="text-sm text-foreground truncate">{truncate(question.soal)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {question.soalImage && (
                          <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full font-medium">📷</span>
                        )}
                        {question.jawabanImage && (
                          <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded-full font-medium">🖼️</span>
                        )}
                        {question.jawaban && (
                          <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-500 rounded-full font-medium">✓</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {new Date(question.updatedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative flex justify-center">
                        <button
                          onClick={() => setOpenActionMenu(openActionMenu === question.id ? null : question.id)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                        
                        <AnimatePresence>
                          {openActionMenu === question.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-20 min-w-[140px] overflow-hidden"
                            >
                              <button
                                onClick={() => {
                                  onEdit(question);
                                  setOpenActionMenu(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setActionLoading(question.id);
                                  handleDuplicate(question);
                                }}
                                disabled={actionLoading === question.id}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted transition-colors disabled:opacity-50"
                              >
                                {actionLoading === question.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                                Duplikat
                              </button>
                              <button
                                onClick={() => handleDeleteClick(question)}
                                disabled={actionLoading === question.id}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4" />
                                Hapus
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <FileQuestion className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              {filter.search || filter.kategori ? 'Tidak Ditemukan' : 'Belum Ada Soal'}
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
              {filter.search || filter.kategori
                ? 'Tidak ada soal yang cocok dengan pencarian atau filter saat ini. Coba ubah kata kunci atau filter.'
                : 'Mulai dengan menambahkan soal pertama untuk bank soal Anda.'}
            </p>
            <button
              onClick={() => {
                if (filter.search || filter.kategori) {
                  setFilter({ sortBy: 'nomor' });
                } else {
                  onCreate();
                }
              }}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              {filter.search || filter.kategori ? 'Reset Filter' : 'Tambah Soal Pertama'}
            </button>
          </div>
        )}
      </div>

      {questions.length === 0 && (
        <div className="md:hidden flex flex-col items-center justify-center py-16 px-4">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
            <FileQuestion className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="text-base font-bold text-foreground mb-1">
            {filter.search || filter.kategori ? 'Tidak Ditemukan' : 'Belum Ada Soal'}
          </h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm mb-5">
            {filter.search || filter.kategori
              ? 'Coba ubah kata kunci atau filter.'
              : 'Mulai dengan menambahkan soal pertama.'}
          </p>
          <button
            onClick={() => {
              if (filter.search || filter.kategori) {
                setFilter({ sortBy: 'nomor' });
              } else {
                onCreate();
              }
            }}
            className="px-5 py-2 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            {filter.search || filter.kategori ? 'Reset Filter' : 'Tambah Soal'}
          </button>
        </div>
      )}

      <div className="md:hidden space-y-3">
        {questions.map((question) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-card rounded-xl border border-border space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-primary">#{question.nomor.toString().padStart(2, '0')}</span>
                <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                  {question.kategori}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDuplicate(question)}
                  disabled={actionLoading === question.id}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                  title="Duplikat"
                >
                  {actionLoading === question.id ? (
                    <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => handleDeleteClick(question)}
                  disabled={actionLoading === question.id}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors disabled:opacity-50"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </button>
                <button
                  onClick={() => onEdit(question)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
            <p className="text-sm text-foreground line-clamp-2">{truncate(question.soal)}</p>
            <div className="flex items-center gap-2">
              {question.soalImage && (
                <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full font-medium">📷</span>
              )}
              {question.jawabanImage && (
                <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded-full font-medium">🖼️</span>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                {new Date(question.updatedAt).toLocaleDateString('id-ID')}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={!!deleteConfirmQuestion}
        title="Hapus Soal"
        message={`Yakin ingin menghapus Soal #${deleteConfirmQuestion?.nomor}? Tindakan ini tidak bisa dibatalkan.`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmQuestion(null)}
        loading={!!actionLoading}
      />
    </div>
  );
}
