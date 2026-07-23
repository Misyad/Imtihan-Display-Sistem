"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Maximize2, RotateCcw, Eye, EyeOff } from "lucide-react";
import { useQuestionStore } from "@/lib/store";

export default function PapanSoalPage() {
  const { 
    activeProfileId,
    profiles,
    activeQuestion, 
    showAnswer,
    setActiveQuestion, 
    toggleAnswer,
    resetUsedQuestions 
  } = useQuestionStore();

  const activeProfile = profiles[activeProfileId];
  const usedQuestions = activeProfile?.usedQuestions || [];
  const questions = activeProfile?.questions || [];
  const gridCount = Math.max(100, questions.length);

  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch with persisted state
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-4 md:p-8 transition-colors duration-500">
      {/* Background Islamic Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] flex items-center justify-center overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-zinc-900/50 backdrop-blur-md p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-emerald-900 dark:text-emerald-400 text-left">
              Papan Monitor Imtihan
            </h1>
            <p className="text-slate-500 dark:text-zinc-400 font-medium text-left">
              Sistem Navigasi Soal Digital
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Legend */}
            <div className="flex items-center gap-4 bg-slate-100 dark:bg-zinc-800/50 px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-emerald-700 dark:text-emerald-400">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)] animate-pulse" />
                <span className="text-amber-700 dark:text-amber-400">Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                <span className="text-rose-700 dark:text-rose-400">Used</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => resetUsedQuestions()}
                className="p-3 rounded-2xl bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-rose-100 hover:text-rose-600 transition-all active:scale-95"
                title="Reset All"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button 
                onClick={toggleFullscreen}
                className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                title="Fullscreen Mode"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Current Status Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
             <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
             
             <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-widest">
                    Sedang Berlangsung
                  </div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-7xl md:text-8xl font-black tracking-tighter">
                      {activeQuestion ? activeQuestion.toString().padStart(3, '0') : "---"}
                    </span>
                    <span className="text-2xl font-light opacity-80 uppercase tracking-widest">
                      Nomor Soal
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-4">
                  <button 
                    onClick={() => toggleAnswer()}
                    disabled={!activeQuestion}
                    className={cn(
                      "flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all backdrop-blur-md",
                      showAnswer 
                        ? "bg-amber-400 text-amber-900 shadow-xl shadow-amber-400/20" 
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/20",
                      !activeQuestion && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {showAnswer ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    {showAnswer ? "Sembunyikan Jawaban" : "Lihat Jawaban"}
                  </button>
                  <p className="text-emerald-50/70 text-sm italic font-serif max-w-[200px] text-center md:text-right">
                    "Ilmu adalah cahaya yang menerangi jalan kesuksesan."
                  </p>
                </div>
             </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-emerald-100 dark:border-emerald-900/30 shadow-sm flex flex-col justify-center items-center text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Selesai</h3>
            <p className="text-4xl font-black text-emerald-900 dark:text-emerald-400">
              {usedQuestions.length}
              <span className="text-lg opacity-40 ml-2">/ {gridCount}</span>
            </p>
          </div>
        </div>

        {/* The Grid */}
        <div className="bg-white/50 dark:bg-zinc-900/30 backdrop-blur-md rounded-[2.5rem] p-6 md:p-10 border border-white/50 dark:border-zinc-800/50 shadow-inner">
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-[repeat(20,minmax(0,1fr))] gap-3 md:gap-4">
            {Array.from({ length: gridCount }, (_, i) => i + 1).map((num) => {
              const isActive = activeQuestion === num;
              const isUsed = usedQuestions.includes(num);
              const hasData = questions.some(q => q.nomor === num);
              const isClickable = hasData && !isUsed && !isActive;

              return (
                <button
                  key={num}
                  onClick={() => isClickable && setActiveQuestion(num)}
                  disabled={!isClickable}
                  className={cn(
                    "relative aspect-square rounded-xl md:rounded-2xl flex items-center justify-center text-base md:text-lg font-black transition-all duration-300 transform select-none",
                    "border-2",
                    !isActive && !isUsed && hasData && "bg-white dark:bg-zinc-800 border-emerald-100 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-500 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer",
                    isActive && "bg-amber-400 border-amber-500 text-white shadow-lg shadow-amber-400/40 ring-4 ring-amber-400/20 scale-110 z-20 cursor-not-allowed",
                    isUsed && !isActive && "bg-rose-500 border-rose-600 text-white opacity-80 cursor-not-allowed",
                    !hasData && "opacity-20 grayscale cursor-not-allowed"
                  )}
                >
                  {num}
                  
                  {isUsed && !isActive && (
                    <CheckCircle2 className="absolute -top-1.5 -right-1.5 w-4 h-4 text-white bg-rose-600 rounded-full border-2 border-white dark:border-zinc-900" />
                  )}
                  {isActive && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white rounded-full flex items-center justify-center border-2 border-amber-500">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <footer className="text-center py-6 text-slate-400 dark:text-zinc-600 text-xs font-bold uppercase tracking-[0.2em]">
          &copy; 2024 Imtihan Display Sistem &bull; Modern Islamic Aesthetic
        </footer>
      </div>
    </div>
  );
}
