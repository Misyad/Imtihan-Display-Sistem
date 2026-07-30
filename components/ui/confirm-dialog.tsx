'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  variant = 'danger',
  onConfirm,
  onCancel,
  loading,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
                    variant === 'danger' && 'bg-destructive/10 text-destructive',
                    variant === 'warning' && 'bg-amber-500/10 text-amber-500',
                    variant === 'info' && 'bg-primary/10 text-primary'
                  )}
                >
                  <AlertTriangle className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{message}</p>
                </div>
                
                <button
                  onClick={onCancel}
                  className="flex-shrink-0 p-1 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
            
            <div className="flex gap-3 p-4 bg-muted/50 border-t border-border">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 text-sm font-semibold bg-background border border-border rounded-xl hover:bg-muted transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={cn(
                  'flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                  variant === 'danger' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                  variant === 'warning' && 'bg-amber-500 text-white hover:bg-amber-600',
                  variant === 'info' && 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menghapus...
                  </span>
                ) : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
