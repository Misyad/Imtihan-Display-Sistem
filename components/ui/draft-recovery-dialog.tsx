'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Clock, X } from 'lucide-react';
import { DraftService } from '@/lib/services/draft-service';
import { QuestionDraft } from '@/types/index';

interface DraftRecoveryDialogProps {
  draft: QuestionDraft;
  onRecover: (data: Partial<QuestionDraft['data']>) => void;
  onDismiss: () => void;
}

export function DraftRecoveryDialog({
  draft,
  onRecover,
  onDismiss,
}: DraftRecoveryDialogProps) {
  const ageText = DraftService.formatDraftAge(draft);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 right-4 z-50 w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-4 bg-amber-500/10 border-b border-amber-500/20">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-foreground">Draft Tersimpan Ditemukan</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Ada draft yang disimpan {ageText}. Apakah Anda ingin memulihkannya?
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{new Date(draft.savedAt).toLocaleString('id-ID')}</span>
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="p-3 flex gap-2">
          <button
            onClick={onDismiss}
            className="flex-1 px-4 py-2 text-sm font-semibold bg-background border border-border rounded-xl hover:bg-muted transition-colors"
          >
            Abaikan
          </button>
          <button
            onClick={() => onRecover(draft.data)}
            className="flex-1 px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          >
            Pulihkan Draft
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
