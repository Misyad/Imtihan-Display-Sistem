'use client';

import { useState, useEffect } from 'react';
import { QuranService } from '@/lib/quran/quran-service';
import type { QuranReference } from '@/types/index';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, BookOpen, Loader2, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuranViewerProps {
  reference: QuranReference;
  isOpen: boolean;
  onClose: () => void;
  mode?: 'slide-up' | 'inline' | 'fullscreen';
  zIndex?: number;
}

export function QuranViewer({ reference, isOpen, onClose, mode = 'slide-up', zIndex = 40 }: QuranViewerProps) {
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showText, setShowText] = useState(false);

  const displayData = QuranService.getDisplayData(reference);
  const { verses, page, surahInfo, imageUrl } = displayData;

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(page);
      setLoading(true);
      setImageError(false);
    }
  }, [isOpen, page]);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setImageError(true);
  };

  const goToPage = (delta: number) => {
    const newPage = Math.max(1, Math.min(604, currentPage + delta));
    setCurrentPage(newPage);
    setLoading(true);
    setImageError(false);
  };

  const currentImageUrl = QuranService.getPageImageUrl(currentPage);

  if (!isOpen) return null;

  if (mode === 'inline') {
    return (
      <div className="w-full bg-card/50 border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">
              {surahInfo?.name_transliteration} {reference.ayat}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        
        <div className="space-y-2">
          {verses.map((verse) => (
            <div key={verse.id} className="space-y-1">
              <p className="text-right text-xl leading-loose font-arabic text-foreground" dir="rtl">
                {verse.text_arabic}
              </p>
              <p className="text-sm text-muted-foreground">
                {verse.translation_id}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-xs text-muted-foreground">
          Juz {verses[0]?.juz} · Halaman {verses[0]?.page}
        </div>
      </div>
    );
  }

  // Fullscreen mode
  if (mode === 'fullscreen') {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999] bg-white flex flex-col"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-3 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors shadow-lg"
            >
              <X className="w-6 h-6 text-zinc-700" />
            </button>

            {/* Header info */}
            <div className="text-center pt-8 pb-4 px-4">
              <h2 className="text-2xl font-bold text-zinc-900">
                {surahInfo?.name_transliteration} · Ayat {reference.ayat}
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                {surahInfo?.name_translation}
              </p>
            </div>

            {/* Mushaf Image - main focus */}
            <div className="flex-1 flex items-center justify-center p-4 min-h-0">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                </div>
              )}
              
              {imageError ? (
                <div className="text-center p-8">
                  <p className="text-zinc-600 mb-4">Gagal memuat gambar mushaf</p>
                  <button
                    onClick={() => {
                      setImageError(false);
                      setLoading(true);
                    }}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-500 transition-colors"
                  >
                    Coba Lagi
                  </button>
                </div>
              ) : (
                <img
                  src={currentImageUrl}
                  alt={`Quran page ${currentPage}`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  className={cn(
                    'w-auto h-full object-contain max-h-[80vh] transition-opacity shadow-2xl',
                    loading ? 'opacity-0' : 'opacity-100'
                  )}
                />
              )}
            </div>

            {/* Bottom navigation */}
            <div className="flex items-center justify-center gap-6 pb-6 px-4">
              <button
                onClick={() => goToPage(-1)}
                disabled={currentPage <= 1}
                className="p-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-zinc-700" />
              </button>
              
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-zinc-900">
                  Halaman {currentPage} / 604
                </span>
                <span className="text-sm text-zinc-500">
                  Juz {verses[0]?.juz || 1}
                </span>
              </div>
              
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage >= 604}
                className="p-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-zinc-700" />
              </button>
            </div>

            {/* Text toggle button */}
            <div className="flex justify-center gap-4 pb-4">
              <button
                onClick={() => setShowText(!showText)}
                className="px-6 py-2 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-500 transition-colors shadow-lg"
              >
                {showText ? 'Sembunyikan' : 'Lihat'} Teks Ayat
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors shadow-lg flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Kembali ke Soal
              </button>
            </div>

            {/* Verse text overlay */}
            <AnimatePresence>
              {showText && (
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="absolute bottom-0 left-0 right-0 bg-white/98 backdrop-blur-md border-t border-zinc-200 shadow-2xl max-h-[50vh] overflow-y-auto"
                >
                  <div className="p-6 space-y-4">
                    {verses.map((verse) => (
                      <div
                        key={verse.id}
                        className="p-4 bg-zinc-50 rounded-xl space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                            Ayat {verse.ayah}
                          </span>
                        </div>
                        <p
                          className="text-right text-2xl leading-loose font-arabic text-zinc-900"
                          dir="rtl"
                        >
                          {verse.text_arabic}
                        </p>
                        <p className="text-sm text-zinc-600 leading-relaxed">
                          {verse.translation_id}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Slide-up panel mode
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            style={{ zIndex }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '60vh', zIndex: zIndex + 10 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-primary" />
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {surahInfo?.name_transliteration} · Ayat {reference.ayat}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {surahInfo?.name_translation}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Mushaf Image */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
                  <button
                    onClick={() => goToPage(-1)}
                    disabled={currentPage <= 1}
                    className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="text-sm font-medium text-foreground">
                    Halaman {currentPage} / 604 · Juz {verses[0]?.juz || 1}
                  </div>
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage >= 604}
                    className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative bg-zinc-900 flex items-center justify-center min-h-[300px]">
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  )}
                  
                  {imageError ? (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground mb-4">Gagal memuat gambar mushaf</p>
                      <button
                        onClick={() => {
                          setImageError(false);
                          setLoading(true);
                        }}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:bg-primary/90 transition-colors"
                      >
                        Coba Lagi
                      </button>
                    </div>
                  ) : (
                    <img
                      src={currentImageUrl}
                      alt={`Quran page ${currentPage}`}
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                      className={cn(
                        'w-full h-auto object-contain max-h-[400px] transition-opacity',
                        loading ? 'opacity-0' : 'opacity-100'
                      )}
                    />
                  )}
                </div>
              </div>

              {/* Verse Text */}
              <div className="space-y-4">
                {verses.map((verse, index) => (
                  <div
                    key={verse.id}
                    className="p-4 bg-card rounded-xl border border-border space-y-3"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full font-bold">
                        {verse.ayah}
                      </span>
                    </div>
                    <p
                      className="text-right text-2xl leading-loose font-arabic text-foreground"
                      dir="rtl"
                    >
                      {verse.text_arabic}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {verse.translation_id}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
