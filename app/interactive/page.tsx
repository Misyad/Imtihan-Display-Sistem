"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useQuestionStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, Award, CheckCircle2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { GlassCard } from "@/components/ui/glass-card";
import { GameDisplay } from "@/components/features/game-display";

export default function InteractivePage() {
  const { 
    activeProfileId,
    profiles,
    activeQuestion, 
    showAnswer, 
    setActiveQuestion, 
    toggleAnswer, 
    resetQuestion 
  } = useQuestionStore();

  const [mounted, setMounted] = useState(false);
  const activeProfile = profiles[activeProfileId];
  const questions = activeProfile?.questions || [];
  const usedQuestions = activeProfile?.usedQuestions || [];
  const settings = activeProfile?.settings;
  const currentQuestionData = questions.find(q => q.nomor === activeQuestion);

  const totalQuota = settings?.categoryQuotas?.reduce((acc, q) => acc + q.quota, 0) || 0;
  const gridCount = totalQuota > 0 ? totalQuota : Math.max(100, questions.length);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNumberClick = (num: number) => {
    setActiveQuestion(num);
  };

  const handleClose = () => {
    resetQuestion();
  };

  if (!mounted || !activeProfile) return null;

  return (
    <div className={cn(
      "fixed inset-0 flex flex-col overflow-hidden font-sans transition-all duration-500",
      settings?.layoutTheme === "game" ? "game-bg" : "bg-zinc-950"
    )}>
      {/* Background Cinematic (Only for classic) */}
      {settings?.layoutTheme !== "game" && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-950/20 via-zinc-950 to-black" />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
        </>
      )}

      {/* Header */}
      <header className={cn(
        "relative z-10 p-8 flex justify-between items-center backdrop-blur-md border-b",
        settings?.layoutTheme === "game" ? "bg-amber-100/10 border-white/10" : "bg-zinc-900/50 border-white/5"
      )}>
         <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
              settings?.layoutTheme === "game" ? "bg-amber-500 shadow-amber-500/20" : "bg-emerald-600 shadow-emerald-600/20"
            )}>
               <Award className="w-7 h-7 text-white" />
            </div>
            <div>
               <h1 className="text-xl font-black text-white uppercase tracking-tighter">{settings?.instituteName || "Interactive Board"}</h1>
               <p className={cn(
                 "text-[10px] font-bold uppercase tracking-[0.3em]",
                 settings?.layoutTheme === "game" ? "text-amber-400" : "text-emerald-500"
               )}>{settings?.eventName || "Synced Mode"}</p>
            </div>
         </div>
         <div className="flex items-center gap-6">
            <div className="text-right hidden md:block text-white">
               <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Selesai</p>
               <p className="text-xl font-black">{usedQuestions.length} <span className="opacity-30 text-sm">/ {questions.length}</span></p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <StatusBadge variant={settings?.layoutTheme === "game" ? "amber" : "emerald"} icon={<div className={cn("w-2 h-2 rounded-full animate-pulse", settings?.layoutTheme === "game" ? "bg-amber-400" : "bg-emerald-400")} />}>
               REALTIME SYNCED
            </StatusBadge>
         </div>
      </header>

      {/* Main Grid Area */}
      <main className="relative z-10 flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar flex items-center justify-center">
         <div className="w-full max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
            <div className={cn(
              "grid gap-4 md:gap-6 justify-center w-full",
              gridCount <= 20 ? "grid-cols-4 sm:grid-cols-5" : 
              gridCount <= 50 ? "grid-cols-5 sm:grid-cols-8 md:grid-cols-10" :
              "grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-[repeat(20,minmax(0,1fr))]"
            )}>
               {Array.from({ length: gridCount }, (_, i) => i + 1).map((num) => {
                  const isUsed = usedQuestions.includes(num);
                  const isActive = activeQuestion === num;
                  const hasData = questions.some(q => q.nomor === num);

                  // Dynamic Size based on total count
                  const sizeClass = gridCount <= 20 ? "h-24 md:h-32 text-4xl" : 
                                   gridCount <= 50 ? "h-20 md:h-24 text-2xl" : 
                                   "aspect-square text-lg";

                  if (settings?.layoutTheme === "game") {
                    return (
                      <motion.button
                         key={num}
                         whileHover={{ scale: 1.1, rotate: 2 }}
                         whileTap={{ scale: 0.9 }}
                         onClick={() => handleNumberClick(num)}
                         className={cn(
                            "game-button flex items-center justify-center font-black text-white",
                            sizeClass,
                            isUsed && "bg-slate-500 border-slate-700 shadow-slate-900 grayscale",
                            isActive && "border-amber-400 scale-110 z-20",
                            !hasData && !isUsed && "opacity-20 grayscale pointer-events-none"
                         )}
                      >
                         {num}
                      </motion.button>
                    )
                  }

                  return (
                     <motion.button
                        key={num}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleNumberClick(num)}
                        className={cn(
                           "relative flex items-center justify-center font-black transition-all duration-300 border-2 rounded-3xl",
                           sizeClass,
                           !isUsed && "bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-emerald-500/50 hover:text-emerald-400",
                           isUsed && "bg-rose-500/10 border-rose-500/30 text-rose-500",
                           isActive && "bg-emerald-600 border-emerald-400 text-white shadow-xl shadow-emerald-600/40",
                           !hasData && !isUsed && "opacity-20 grayscale cursor-not-allowed pointer-events-none"
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
         &copy; 2024 Imtihan Display &bull; {settings?.layoutTheme === "game" ? "GAME MODE" : "MULTI-MODE INTEGRATED"}
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
                  {settings?.layoutTheme === "game" ? (
                    <GameDisplay 
                      activeQuestion={activeQuestion}
                      questionData={currentQuestionData}
                      showAnswer={showAnswer}
                      instituteName={settings.instituteName}
                    />
                  ) : (
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

                              <p className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-4xl tracking-tight">
                                  "{currentQuestionData?.soal}"
                              </p>

                              <button 
                                  onClick={toggleAnswer}
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
                                    <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600">
                                        {currentQuestionData?.jawaban || "MUMTAZ"}
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
                  )}
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
