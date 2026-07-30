'use client';

import { useState } from 'react';
import { Question } from '@/types/index';
import { QuestionTable } from '@/components/features/question-table';
import { QuestionDrawer } from '@/components/features/question-drawer';
import { ImportExportDialog } from '@/components/features/import-export-dialog';
import { Toaster } from '@/components/ui/toast';
import { BookOpen, Plus, Upload, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuestionStore } from '@/lib/store';

export default function BankSoalPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { profiles, activeProfileId } = useQuestionStore();
  const activeProfile = profiles[activeProfileId];
  const totalQuestions = activeProfile?.questions.length || 0;

  const handleEdit = (question: Question) => {
    setSelectedQuestion(question);
    setIsDrawerOpen(true);
  };

  const handleCreate = () => {
    setSelectedQuestion(null);
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    setIsDrawerOpen(false);
    setSelectedQuestion(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleImport = () => {
    setIsImportExportOpen(true);
  };

  const handleExport = () => {
    setIsImportExportOpen(true);
  };

  const handleImportExportClose = () => {
    setIsImportExportOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-6 md:p-12 transition-colors duration-500">
      <Toaster />
      
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center shadow-xl shadow-purple-600/20">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                Bank Soal
              </h1>
              <p className="text-slate-500 dark:text-zinc-400 font-medium">
                Kelola bank soal dengan mudah
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleImport}
              className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span className="font-medium">Import</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-xl text-foreground hover:bg-muted transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="font-medium">Export</span>
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreate}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Soal</span>
            </motion.button>
          </div>
        </header>

        <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Total Soal</p>
            <p className="text-2xl font-bold text-foreground">{totalQuestions}</p>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Lembaga Aktif</p>
            <p className="text-lg font-semibold text-foreground">{activeProfile?.settings.name}</p>
          </div>
        </div>

        <QuestionTable
          key={refreshKey}
          onEdit={handleEdit}
          onCreate={handleCreate}
          onImport={handleImport}
          onExport={handleExport}
        />
      </div>

      <QuestionDrawer
        isOpen={isDrawerOpen}
        question={selectedQuestion}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedQuestion(null);
        }}
        onSave={handleSave}
      />

      <ImportExportDialog
        isOpen={isImportExportOpen}
        onClose={handleImportExportClose}
      />
    </div>
  );
}
