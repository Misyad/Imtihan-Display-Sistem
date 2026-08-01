'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { QuranService } from '@/lib/quran/quran-service';
import { getBoxesForRefOnPage, unionBoxes, QURAN_IMG_W, QURAN_IMG_H } from '@/lib/quran/quran-coords';
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
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [fitPending, setFitPending] = useState(false);
  const [viewSize, setViewSize] = useState<{
    cW: number;
    cH: number;
    imgW: number;
    imgH: number;
    imgLeft: number;
    imgTop: number;
  } | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number; active: boolean } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const MIN_SCALE = 1;
  const MAX_SCALE = 5;

  const displayData = QuranService.getDisplayData(reference);
  const { verses, page, surahInfo, imageUrl } = displayData;

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(page);
      setLoading(true);
      setImageError(false);
      setFitPending(true);
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
    setFitPending(true);
  };

  const zoomAt = (delta: number) => {
    if (!viewSize) return;
    const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + delta));
    const ss = viewSize.imgW / QURAN_IMG_W;
    const ccX = viewSize.cW / 2;
    const ccY = viewSize.cH / 2;
    const px = (ccX - viewSize.imgLeft - offset.x) / (scale * ss);
    const py = (ccY - viewSize.imgTop - offset.y) / (scale * ss);
    setScale(next);
    setOffset({
      x: ccX - viewSize.imgLeft - px * ss * next,
      y: ccY - viewSize.imgTop - py * ss * next,
    });
  };

  const resetZoom = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (scale <= 1) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: offset.x,
      origY: offset.y,
      active: true,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || !drag.active) return;
    setOffset({
      x: drag.origX + (e.clientX - drag.startX),
      y: drag.origY + (e.clientY - drag.startY),
    });
  };

  const endDrag = () => {
    if (dragRef.current) dragRef.current.active = false;
  };

  // measure the mushaf display area and image size
  useEffect(() => {
    const el = containerRef.current;
    if (!isOpen || !el) return;
    const compute = () => {
      const r = el.getBoundingClientRect();
      const baseH = Math.min(r.height, window.innerHeight * 0.8);
      const imgW = baseH * (QURAN_IMG_W / QURAN_IMG_H);
      setViewSize({
        cW: r.width,
        cH: r.height,
        imgW,
        imgH: baseH,
        imgLeft: (r.width - imgW) / 2,
        imgTop: (r.height - baseH) / 2,
      });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener('resize', compute);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', compute);
    };
  }, [isOpen]);

  // auto-zoom to the annotated ayah region once the image is ready
  useEffect(() => {
    if (!isOpen || !fitPending || loading || !viewSize) return;
    const boxes = getBoxesForRefOnPage(reference.surah, reference.ayat, currentPage);
    const u = unionBoxes(boxes);
    if (!u) {
      setScale(1);
      setOffset({ x: 0, y: 0 });
      setFitPending(false);
      return;
    }
    const { cW, cH, imgW, imgLeft, imgTop } = viewSize;
    const ss = imgW / QURAN_IMG_W;
    let s = Math.min(cW / (u.w * ss), cH / (u.h * ss)) * 0.85;
    s = Math.max(MIN_SCALE, Math.min(MAX_SCALE, s));
    const cx = u.x + u.w / 2;
    const cy = u.y + u.h / 2;
    setScale(s);
    setOffset({
      x: cW / 2 - imgLeft - cx * ss * s,
      y: cH / 2 - imgTop - cy * ss * s,
    });
    setFitPending(false);
  }, [isOpen, fitPending, loading, viewSize, currentPage, reference]);

  const targetBox = useMemo(() => {
    if (!isOpen) return null;
    return unionBoxes(getBoxesForRefOnPage(reference.surah, reference.ayat, currentPage));
  }, [isOpen, reference, currentPage]);

  const highlightStyle = useMemo(() => {
    if (!targetBox || !viewSize) return null;
    const ss = viewSize.imgW / QURAN_IMG_W;
    return {
      left: viewSize.imgLeft + targetBox.x * ss * scale + offset.x,
      top: viewSize.imgTop + targetBox.y * ss * scale + offset.y,
      width: targetBox.w * ss * scale,
      height: targetBox.h * ss * scale,
    };
  }, [targetBox, viewSize, scale, offset]);

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

            {/* Mushaf image with auto-zoom + manual zoom */}
            <div
              ref={containerRef}
              className={cn(
                'relative flex-1 min-h-0 overflow-hidden bg-zinc-100',
                scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
              )}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                </div>
              )}

              {imageError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <p className="text-zinc-600">Gagal memuat gambar mushaf</p>
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
              ) : viewSize ? (
                <>
                  <img
                    src={currentImageUrl}
                    alt={`Quran page ${currentPage}`}
                    draggable={false}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    className="absolute select-none shadow-2xl"
                    style={{
                      left: viewSize.imgLeft,
                      top: viewSize.imgTop,
                      width: viewSize.imgW,
                      height: viewSize.imgH,
                      transformOrigin: '0 0',
                      transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                      opacity: loading ? 0 : 1,
                    }}
                  />
                  {highlightStyle && scale > 1.01 && (
                    <div
                      className="absolute pointer-events-none rounded-md border-[3px] border-emerald-500/80 shadow-[0_0_0_1px_rgba(255,255,255,0.7)]"
                      style={highlightStyle}
                    />
                  )}
                </>
              ) : null}
            </div>

            {/* Bottom controls */}
            <div className="flex items-center justify-center gap-4 pb-6 px-4 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => zoomAt(-1)}
                  disabled={scale <= MIN_SCALE}
                  className="w-11 h-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed text-xl font-bold text-zinc-700 transition-colors"
                >
                  −
                </button>
                <button
                  onClick={resetZoom}
                  className="h-11 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-sm font-semibold text-zinc-700 transition-colors"
                >
                  {Math.round(scale * 100)}%
                </button>
                <button
                  onClick={() => zoomAt(1)}
                  disabled={scale >= MAX_SCALE}
                  className="w-11 h-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed text-xl font-bold text-zinc-700 transition-colors"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-4">
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

              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors shadow-lg flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Kembali ke Soal
              </button>
            </div>
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
