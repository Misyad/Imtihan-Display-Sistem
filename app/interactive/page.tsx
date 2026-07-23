"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useQuestionStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, Award, CheckCircle2, RotateCcw } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { GlassCard } from "@/components/ui/glass-card";
import { SlideDisplay } from "@/components/features/slide-display";
import { QuestionText } from "@/components/ui/question-text";

export default function InteractivePage() {
  const { 
    activeProfileId,
    profiles,
    activeQuestion, 
    showAnswer, 
    setActiveQuestion, 
    toggleAnswer, 
    resetQuestion,
    markQuestionUsed
  } = useQuestionStore();

  const [mounted, setMounted] = useState(false);
  const [buttonScale, setButtonScale] = useState(100);
  const activeProfile = profiles[activeProfileId];
  const questions = activeProfile?.questions || [];
  const usedQuestions = activeProfile?.usedQuestions || [];
  const settings = activeProfile?.settings;
  const currentQuestionData = questions.find(q => q.nomor === activeQuestion);
  const gridCount = Math.max(100, questions.length);
  const baseMinSize = gridCount <= 20 ? 140 : gridCount <= 50 ? 90 : 60;
  const dynamicMinSize = Math.round((baseMinSize * buttonScale) / 100);
  const answerText = currentQuestionData?.jawaban || "MUMTAZ";


  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNumberClick = (num: number) => {
    const hasData = questions.some(q => q.nomor === num);
    const isUsed = usedQuestions.includes(num);
    const isClickable = hasData && !isUsed && num !== activeQuestion;

    if (isClickable) {
      setActiveQuestion(num);
    }
  };

  const handleClose = () => {
    if (activeQuestion !== null) {
      markQuestionUsed(activeQuestion);
    }
    resetQuestion();
  };

  if (!mounted || !activeProfile) return null;

  return (
    <div className="fixed inset-x-0 top-16 bottom-0 flex flex-col overflow-hidden font-sans transition-all duration-500 bg-zinc-950">
      {/* Background Cinematic */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-950/20 via-zinc-950 to-black" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
         <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-4 md:flex-row">
         <div className="flex min-w-0 items-center gap-4 md:w-auto">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-emerald-600 shadow-emerald-600/20">
               <Award className="w-6 h-6 text-white" />
            </div>
            <div>
               <h1 className="truncate text-lg font-black text-white uppercase tracking-tighter">{settings?.instituteName || "Interactive Board"}</h1>
               <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500">{settings?.eventName || "Synced Mode"}</p>
            </div>
         </div>
         <div className="flex w-full flex-wrap items-center justify-end gap-3 sm:gap-4 md:w-auto">
            <div className="flex min-w-0 flex-1 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white sm:flex-none">
               <label htmlFor="question-button-scale" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Tombol {buttonScale}%
               </label>
               <input
                  id="question-button-scale"
                  type="range"
                  min="80"
                  max="150"
                  step="10"
                  value={buttonScale}
                  onChange={(event) => setButtonScale(Number(event.target.value))}
                  className="w-24 accent-emerald-500"
                  aria-label="Ukuran tombol nomor soal"
               />
               <button
                  type="button"
                  onClick={() => setButtonScale(100)}
                  className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                  title="Reset ukuran tombol"
                  aria-label="Reset ukuran tombol ke 100 persen"
               >
                  <RotateCcw className="h-3.5 w-3.5" />
               </button>
            </div>
            <div className="hidden text-right text-white md:block">
               <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Selesai</p>
               <p className="text-xl font-black">{usedQuestions.length} <span className="opacity-30 text-sm">/ {questions.length}</span></p>
            </div>
            <div className="hidden h-8 w-px bg-white/10 sm:block" />
            <StatusBadge variant="emerald" icon={<div className="w-2 h-2 rounded-full animate-pulse bg-emerald-400" />}>
               REALTIME SYNCED
            </StatusBadge>
         </div>
         </div>
      </header>

      {/* Main Grid Area */}
      <main className="relative z-10 flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar flex flex-col items-center justify-start">
         <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-start pt-6">
            <div style={{ gridTemplateColumns: `repeat(auto-fill, ${dynamicMinSize}px)` }}
              className="grid gap-2 md:gap-3 justify-center w-full transition-all duration-200">
               {Array.from({ length: gridCount }, (_, i) => i + 1).map((num) => {
                  const isUsed = usedQuestions.includes(num);
                  const isActive = activeQuestion === num;
                  const hasData = questions.some(q => q.nomor === num);

                  // Dynamic Size based on total count
                  const sizeClass = gridCount <= 20 ? "aspect-square text-5xl md:text-6xl" : gridCount <= 50 ? "aspect-square text-3xl md:text-4xl" : "aspect-square text-xl md:text-2xl";

                  return (
                     <motion.button
                        key={num}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleNumberClick(num)}
                        disabled={!hasData || isUsed || isActive}
                        className={cn(
                           "relative flex items-center justify-center font-black transition-all duration-300 border-2 rounded-xl",
                           sizeClass,
                           !isUsed && hasData && "bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-emerald-500/50 hover:text-emerald-400 cursor-pointer",
                           isUsed && "bg-rose-500/10 border-rose-500/30 text-rose-500 cursor-not-allowed",
                           isActive && "bg-emerald-600 border-emerald-400 text-white shadow-xl shadow-emerald-600/40 cursor-not-allowed",
                           !hasData && "opacity-20 grayscale cursor-not-allowed pointer-events-none"
                        )}
                     >
                        {num}
                        {isUsed && (
                           <CheckCircle2 className={cn(
                             "absolute bg-zinc-950 rounded-full text-rose-500",
                             gridCount <= 20 ? "-top-3 -right-3 w-8 h-8" : "-top-1.5 -right-1.5 w-4 h-4"
                           )} />
                        )}
                     </motion.button>
                  );
               })}
            </div>
         </div>
      </main>

      <footer className="relative z-10 p-6 text-center text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em] bg-black/20">
         &copy; 2024 Imtihan Display &bull; MULTI-MODE INTEGRATED
      </footer>

      {/* INTEGRATED MODAL (DRIVEN BY GLOBAL STATE) */}
      <AnimatePresence>
         {activeQuestion && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12"
            >
               <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={handleClose} />
               
               <button 
                  onClick={handleClose}
                  className="absolute top-8 right-8 z-[110] w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all pointer-events-auto"
               >
                  <X className="w-6 h-6" />
               </button>

               <div className="relative z-[110] w-full max-w-6xl h-full flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center text-center">
                    <AnimatePresence mode="wait">
                      {!showAnswer ? (
                            <motion.div 
                              key={`question-${activeQuestion}`}
                              initial={{ opacity: 0, scale: 0.9, y: 20 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                              className="flex flex-col items-center space-y-12 w-full"
                            >
                              <StatusBadge icon={<BookOpen />} variant="emerald">
                                  {currentQuestionData?.kategori || "UMUM"}
                              </StatusBadge>

                              <div className="relative">
                                  <div className="absolute -inset-20 bg-emerald-500/10 rounded-full blur-[100px]" />
                                  <h1 className="relative text-[10rem] md:text-[15rem] font-black leading-none tracking-tighter text-white drop-shadow-2xl italic">
                                    {activeQuestion?.toString().padStart(2, '0')}
                                  </h1>
                              </div>

                              <p dir="auto" className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-4xl tracking-tight whitespace-pre-line">
                                  <QuestionText text={currentQuestionData?.soal || ""} />
                              </p>

                              <button 
                                  onClick={() => toggleAnswer()}
                                  className="px-12 py-5 rounded-full bg-emerald-600 text-white font-black uppercase tracking-[0.4em] hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 active:scale-95 pointer-events-auto"
                              >
                                  Buka Jawaban
                              </button>
                            </motion.div>
                        ) : (
                            <motion.div
                              key={`answer-${activeQuestion}`}
                              initial={{ opacity: 0, y: 50, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 1.1 }}
                              className="w-full"
                            >
                              <GlassCard variant="gold" className="py-20 px-12 md:px-24 mx-auto max-w-5xl">
                                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.1),_transparent)] animate-pulse" />
                                  <div className="relative z-10 space-y-8">
                                    <h3 className="text-amber-500 text-xl md:text-3xl font-bold uppercase tracking-[0.6em]">Natijah Imtihan</h3>
                                    <h1 className={cn(
                                      "font-black leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 whitespace-pre-line break-words",
                                      answerText.length > 300
                                        ? "text-2xl md:text-3xl"
                                        : answerText.length > 150
                                          ? "text-3xl md:text-4xl"
                                          : answerText.length > 70
                                            ? "text-4xl md:text-5xl"
                                            : "text-6xl md:text-8xl"
                                    )}>
                                        <QuestionText text={answerText} />
                                    </h1>
                                    <button 
                                        onClick={handleClose}
                                        className="mt-8 px-8 py-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-500 font-bold uppercase tracking-widest hover:bg-amber-500/10 transition-all pointer-events-auto"
                                    >
                                        Kembali ke Papan
                                    </button>
                                  </div>
                              </GlassCard>
                            </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
