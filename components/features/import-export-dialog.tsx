'use client';

import { useState } from 'react';
import { QuestionService } from '@/lib/services/question-service';
import { ImportResult, ImportMode, ExportFormat } from '@/types/index';
import { downloadBlob } from '@/lib/services/import-export';
import { toast } from '@/components/ui/toast';
import { Upload, Download, FileJson, FileSpreadsheet, X, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';

interface ImportExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportExportDialog({ isOpen, onClose }: ImportExportDialogProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [importMode, setImportMode] = useState<ImportMode>('merge');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('excel');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const questionService = new QuestionService();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    const validExtensions = ['json', 'xlsx', 'xls'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (!extension || !validExtensions.includes(extension)) {
      toast.error('Format file tidak didukung. Gunakan JSON atau Excel.');
      return;
    }

    setSelectedFile(file);
    setResult(null);
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setResult(null);

    try {
      const importResult = await questionService.importFromFile(selectedFile, importMode);
      setResult(importResult);
      
      if (importResult.success > 0) {
        toast.success(`Berhasil mengimpor ${importResult.success} soal`);
      }
      
      if (importResult.failed > 0) {
        toast.error(`${importResult.failed} soal gagal diimpor`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal mengimpor file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    setIsLoading(true);

    try {
      const blob = await questionService.exportToFile(exportFormat);
      const filename = `bank-soal-${new Date().toISOString().split('T')[0]}.${exportFormat === 'excel' ? 'xlsx' : 'json'}`;
      downloadBlob(blob, filename);
      toast.success(`Berhasil mengekspor bank soal ke ${exportFormat.toUpperCase()}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal mengekspor file');
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setResult(null);
    setImportMode('merge');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">Import / Export</h2>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex border-b border-border">
              <button
                onClick={() => { setActiveTab('import'); resetState(); }}
                className={cn(
                  'flex-1 py-3 text-sm font-semibold transition-colors',
                  activeTab === 'import' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Import
              </button>
              <button
                onClick={() => { setActiveTab('export'); resetState(); }}
                className={cn(
                  'flex-1 py-3 text-sm font-semibold transition-colors',
                  activeTab === 'export' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Export
              </button>
            </div>

            <div className="p-6 space-y-6">
              {activeTab === 'import' && (
                <>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      'border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer',
                      isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    )}
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    <input
                      id="file-input"
                      type="file"
                      accept=".json,.xlsx,.xls"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                    />
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground mb-1">
                      {selectedFile ? selectedFile.name : 'Drag & drop file atau klik untuk browse'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Format: JSON, Excel (.xlsx, .xls)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Mode Import
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'merge', label: 'Gabung', desc: 'Update duplikat' },
                        { value: 'replace', label: 'Ganti', desc: 'Hapus semua' },
                        { value: 'append', label: 'Tambah', desc: 'Di akhir' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setImportMode(option.value as ImportMode)}
                          className={cn(
                            'p-3 rounded-xl border text-left transition-colors',
                            importMode === option.value
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          )}
                        >
                          <p className="text-sm font-semibold text-foreground">{option.label}</p>
                          <p className="text-xs text-muted-foreground">{option.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {result && (
                    <div className={cn(
                      'p-4 rounded-xl border',
                      result.success > 0 && result.failed === 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'
                    )}>
                      <div className="flex items-center gap-2 mb-2">
                        {result.success > 0 && result.failed === 0 ? (
                          <Check className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-500" />
                        )}
                        <span className="font-semibold">Import Selesai</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Berhasil: {result.success} | Gagal: {result.failed}
                      </p>
                      {result.errors && result.errors.length > 0 && (
                        <ul className="mt-2 text-xs text-muted-foreground space-y-1">
                          {result.errors.slice(0, 3).map((error, i) => (
                            <li key={i}>• {error}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleImport}
                    disabled={!selectedFile || isLoading}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Mengimpor...
                      </span>
                    ) : 'Import'}
                  </button>
                </>
              )}

              {activeTab === 'export' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Format Export
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setExportFormat('excel')}
                        className={cn(
                          'flex items-center gap-3 p-4 rounded-xl border transition-colors',
                          exportFormat === 'excel'
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
                        <div className="text-left">
                          <p className="text-sm font-semibold text-foreground">Excel</p>
                          <p className="text-xs text-muted-foreground">.xlsx format</p>
                        </div>
                      </button>
                      <button
                        onClick={() => setExportFormat('json')}
                        className={cn(
                          'flex items-center gap-3 p-4 rounded-xl border transition-colors',
                          exportFormat === 'json'
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <FileJson className="w-6 h-6 text-blue-500" />
                        <div className="text-left">
                          <p className="text-sm font-semibold text-foreground">JSON</p>
                          <p className="text-xs text-muted-foreground">.json format</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleExport}
                    disabled={isLoading}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Mengekspor...
                      </span>
                    ) : 'Export'}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
