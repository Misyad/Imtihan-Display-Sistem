'use client';

import { useState, useEffect } from 'react';
import { Question, QuestionDraft } from '@/types/index';
import { QuestionService } from '@/lib/services/question-service';
import { DraftService } from '@/lib/services/draft-service';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { DraftRecoveryDialog } from '@/components/ui/draft-recovery-dialog';
import { toast } from '@/components/ui/toast';
import { X, Save, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

interface QuestionDrawerProps {
  isOpen: boolean;
  question?: Question | null;
  onClose: () => void;
  onSave: () => void;
}

export function QuestionDrawer({ isOpen, question, onClose, onSave }: QuestionDrawerProps) {
  const [formData, setFormData] = useState<Partial<Question>>({
    nomor: 1,
    kategori: 'Umum',
    soal: '',
    jawaban: '',
    catatan: '',
    isRTL: false,
  });
  const [isRTL, setIsRTL] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [showDraftRecovery, setShowDraftRecovery] = useState(false);
  const [draft, setDraft] = useState<QuestionDraft | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const questionService = new QuestionService();
  const isNewQuestion = !question?.id;
  const draftId = question?.id || 'new-question';

  useEffect(() => {
    if (isOpen) {
      if (question) {
        setFormData({
          nomor: question.nomor,
          kategori: question.kategori,
          soal: question.soal,
          jawaban: question.jawaban,
          soalImage: question.soalImage,
          jawabanImage: question.jawabanImage,
          catatan: question.catatan,
          isRTL: question.isRTL,
        });
        setIsRTL(question.isRTL || false);
      } else {
        setFormData({
          nomor: 1,
          kategori: 'Umum',
          soal: '',
          jawaban: '',
          catatan: '',
          isRTL: false,
        });
        setIsRTL(false);
      }
      setHasUnsavedChanges(false);

      const existingDraft = DraftService.getDraft(draftId);
      if (existingDraft && isNewQuestion) {
        setDraft(existingDraft);
        setShowDraftRecovery(true);
      }
    }
  }, [isOpen, question, draftId, isNewQuestion]);

  useEffect(() => {
    if (!isOpen || !hasUnsavedChanges) return;

    const interval = setInterval(() => {
      DraftService.saveDraft(draftId, formData);
    }, 10000);

    return () => clearInterval(interval);
  }, [isOpen, hasUnsavedChanges, formData, draftId]);

  const handleRecoverDraft = (data: Partial<Question>) => {
    setFormData(data);
    setIsRTL(data.isRTL || false);
    setHasUnsavedChanges(true);
    setShowDraftRecovery(false);
    DraftService.clearDraft(draftId);
  };

  const handleDismissDraft = () => {
    setShowDraftRecovery(false);
    DraftService.clearDraft(draftId);
  };

  const handleInputChange = (field: keyof Question, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleRTLChange = (newRTL: boolean) => {
    setIsRTL(newRTL);
    handleInputChange('isRTL', newRTL);
  };

  const handleSave = async () => {
    try {
      if (!formData.nomor || formData.nomor <= 0) {
        toast.error('Nomor soal harus diisi dan lebih dari 0');
        return;
      }
      if (!formData.soal || formData.soal.trim() === '') {
        toast.error('Pertanyaan harus diisi');
        return;
      }
      if (!formData.jawaban || formData.jawaban.trim() === '') {
        toast.error('Jawaban harus diisi');
        return;
      }

      setIsSaving(true);
      const questionData = {
        ...formData,
        isRTL,
        updatedAt: new Date().toISOString(),
      };

      if (isNewQuestion) {
        await questionService.createQuestion({
          ...questionData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        });
        toast.success('Soal berhasil dibuat');
      } else {
        await questionService.updateQuestion(question!.id, questionData);
        toast.success('Soal berhasil diperbarui');
      }

      DraftService.clearDraft(draftId);
      setHasUnsavedChanges(false);
      onSave();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan soal');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  const confirmClose = () => {
    setShowConfirmClose(false);
    setHasUnsavedChanges(false);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={question?.id || 'new'}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full md:w-[90vw] lg:w-[85vw] xl:w-[80vw] bg-background border-l border-border shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
              <h2 className="text-xl font-bold text-foreground">
                {isNewQuestion ? 'Tambah Soal Baru' : `Edit Soal #${question?.nomor}`}
              </h2>
              <div className="flex items-center gap-3">
                {hasUnsavedChanges && (
                  <span className="text-xs text-amber-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Belum disimpan
                  </span>
                )}
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaving ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <div className="w-full lg:w-3/5 p-6 overflow-y-auto">
                <div className="space-y-6 max-w-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nomor Soal *
                      </label>
                      <input
                        type="number"
                        value={formData.nomor || ''}
                        onChange={(e) => handleInputChange('nomor', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Kategori *
                      </label>
                      <input
                        type="text"
                        value={formData.kategori || ''}
                        onChange={(e) => handleInputChange('kategori', e.target.value)}
                        className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Contoh: Tauhid"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Pertanyaan *
                    </label>
                    <RichTextEditor
                      key={`soal-${question?.id || 'new'}`}
                      value={formData.soal || ''}
                      onChange={(value) => handleInputChange('soal', value)}
                      placeholder="Tulis pertanyaan di sini..."
                      isRTL={isRTL}
                      onRTLChange={handleRTLChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Jawaban *
                    </label>
                    <RichTextEditor
                      key={`jawab-${question?.id || 'new'}`}
                      value={formData.jawaban || ''}
                      onChange={(value) => handleInputChange('jawaban', value)}
                      placeholder="Tulis jawaban di sini..."
                      isRTL={isRTL}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Catatan (Opsional)
                    </label>
                    <textarea
                      value={formData.catatan || ''}
                      onChange={(e) => handleInputChange('catatan', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      placeholder="Catatan tambahan..."
                    />
                  </div>
                </div>
              </div>

              <div className="hidden lg:block w-2/5 p-6 bg-muted/30 border-l border-border overflow-y-auto">
                <div className="sticky top-0">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Live Preview
                  </h3>
                  <div className="bg-zinc-900 rounded-2xl p-8 min-h-[400px] flex flex-col items-center justify-center">
                    <div className="text-center space-y-6">
                      <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full uppercase tracking-widest">
                        {formData.kategori || 'Kategori'}
                      </span>
                      <div className="text-8xl font-black text-white italic">
                        {(formData.nomor || 0).toString().padStart(2, '0')}
                      </div>
                      <div
                        className={cn(
                          'text-2xl font-bold text-white max-w-md whitespace-pre-line',
                          isRTL && 'text-right direction-rtl font-arabic'
                        )}
                        dir={isRTL ? 'rtl' : 'ltr'}
                        dangerouslySetInnerHTML={{ __html: formData.soal || 'Pertanyaan akan tampil di sini...' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={showConfirmClose}
        title="Perubahan Belum Disimpan"
        message="Anda memiliki perubahan yang belum disimpan. Yakin ingin menutup editor?"
        confirmLabel="Tutup Tanpa Menyimpan"
        cancelLabel="Kembali ke Editor"
        variant="warning"
        onConfirm={confirmClose}
        onCancel={() => setShowConfirmClose(false)}
      />

      {showDraftRecovery && draft && (
        <DraftRecoveryDialog
          draft={draft}
          onRecover={handleRecoverDraft}
          onDismiss={handleDismissDraft}
        />
      )}
    </>
  );
}
