"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useQuestionStore } from "@/lib/store";
import { BookOpen, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ObsSplitPage() {
  const { activeQuestion, showAnswer, questions } = useQuestionStore();
  const [mounted, setMounted] = useState(false);

  const currentQuestionData = questions.find(q => q.nomor === activeQuestion);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col items-center justify-center overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-950/20 via-zinc-950 to-black" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />

      <div className="relative z-10 w-full h-full flex flex-row items-stretch p-12 gap-12 max-w-[1920px] max-h-[1080px] aspect-video mx-auto">
        
        {/* LEFT SIDE: Camera Placeholder */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex-1 relative rounded-[3rem] overflow-hidden border-4 border-emerald-500/20 bg-zinc-900 shadow-2xl flex items-center justify-center group"
        >
           <div className="absolute inset-0 border-[12px] border-emerald-500/5 rounded-[3rem]" />
           <div className="text-center space-y-4 opacity-40">
              <div className="w-32 h-32 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500/20">
                 <User className="w-16 h-16 text-emerald-500" />
              </div>
              <h2 className="text-emerald-500 font-black uppercase tracking-[0.4em] text-xl text-center">Main Camera</h2>
           </div>
           <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-emerald-500/40 rounded-tl-3xl" />
           <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-emerald-500/40 rounded-br-3xl" />
        </motion.div>

        {/* RIGHT SIDE: Question/Answer Box */}
        <div className="flex-1 flex flex-col justify-center gap-8">
           
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="flex items-center justify-between px-6"
           >
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20">
                    <BookOpen className="w-6 h-6 text-white" />
                 </div>
                 <div className="text-left">
                    <h3 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">Bidang Studi</h3>
                    <p className="text-white text-xl font-black uppercase tracking-tight">
                       {currentQuestionData?.kategori || "Imtihan Umum"}
                    </p>
                 </div>
              </div>
              <div className="text-right">
                 <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] block">No. Soal</span>
                 <span className="text-5xl font-black text-amber-400 italic">
                    {activeQuestion?.toString().padStart(2, '0') || "--"}
                 </span>
              </div>
           </motion.div>

           <div className="relative min-h-[500px] flex items-center justify-center p-12 rounded-[3.5rem] bg-zinc-900/50 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                {activeQuestion ? (
                   !showAnswer ? (
                      <motion.div 
                        key={`q-${activeQuestion}`}
                        initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                        transition={{ duration: 0.6 }}
                        className="w-full"
                      >
                         <p className="text-4xl md:text-5xl font-bold text-white leading-tight text-left drop-shadow-sm">
                            "{currentQuestionData?.soal}"
                         </p>
                      </motion.div>
                   ) : (
                      <motion.div 
                        key={`a-${activeQuestion}`}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.6, type: "spring", damping: 15 }}
                        className="px-12 py-10 rounded-[2.5rem] bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_80px_rgba(251,191,36,0.3)] text-center w-full"
                      >
                         <span className="block text-amber-950/60 text-xs font-black uppercase tracking-[0.5em] mb-4">Jawaban Benar</span>
                         <h1 className="text-6xl md:text-7xl font-black text-amber-950 tracking-tight">
                            {currentQuestionData?.jawaban || "MUMTAZ"}
                         </h1>
                      </motion.div>
                   )
                ) : (
                   <motion.div 
                    key="waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-6"
                   >
                      <div className="w-16 h-16 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                   </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
}
