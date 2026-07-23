"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { QuestionText } from "@/components/ui/question-text";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Trophy, Clock } from "lucide-react";

interface GameDisplayProps {
  activeQuestion: number | null;
  questionData?: {
    soal: string;
    jawaban: string;
    kategori: string;
  };
  showAnswer: boolean;
  instituteName?: string;
}

export const GameDisplay = ({ 
  activeQuestion, 
  questionData, 
  showAnswer,
  instituteName 
}: GameDisplayProps) => {
  if (!activeQuestion) return null;

  return (
    <div className="w-full h-full game-bg flex items-center justify-center p-8">
      <AnimatePresence mode="wait">
        {!showAnswer ? (
          <motion.div 
            key="q"
            initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="game-board w-full max-w-5xl p-12 flex flex-col items-center text-center relative"
          >
            {/* Ribbon Header */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 game-ribbon text-2xl flex items-center gap-4">
               <Star className="w-6 h-6 fill-amber-300 text-amber-300" />
               {instituteName || "Imtihan Game"}
               <Star className="w-6 h-6 fill-amber-300 text-amber-300" />
            </div>

            <div className="mt-8 space-y-10">
               <div className="flex items-center justify-center gap-6">
                  <div className="game-button-blue px-8 py-3 text-white font-black text-2xl">
                     LEVEL {activeQuestion}
                  </div>
                  <div className="bg-amber-100 border-4 border-amber-800 rounded-2xl px-6 py-2 flex items-center gap-3">
                     <Clock className="w-6 h-6 text-amber-800" />
                     <span className="text-2xl font-black text-amber-900">00:30</span>
                  </div>
               </div>

               <h2 className="text-4xl md:text-5xl font-black text-amber-900 leading-tight">
                  <QuestionText text={questionData?.soal || "Memuat Pertanyaan..."} />
               </h2>

               <div className="flex gap-4">
                  <div className="game-button px-10 py-4 text-white font-black text-xl">
                     {questionData?.kategori || "UMUM"}
                  </div>
               </div>
            </div>

            {/* Decorative Leaves */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-emerald-600 rounded-full blur-2xl opacity-20" />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-600 rounded-full blur-2xl opacity-20" />
          </motion.div>
        ) : (
          <motion.div 
            key="a"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="game-board w-full max-w-4xl p-12 flex flex-col items-center text-center relative"
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 game-ribbon bg-rose-600 border-rose-900 shadow-rose-900 text-2xl">
               JAWABAN BENAR!
            </div>

            <div className="mt-12 space-y-8">
               <div className="w-32 h-32 bg-amber-400 rounded-full flex items-center justify-center border-8 border-amber-600 shadow-xl mx-auto animate-bounce">
                  <Trophy className="w-16 h-16 text-amber-900" />
               </div>

               <h1 className="text-6xl md:text-8xl font-black text-emerald-700 uppercase tracking-tight">
                  <QuestionText text={questionData?.jawaban || "MUMTAZ"} />
               </h1>

               <div className="flex justify-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                     <div className="w-16 h-16 rounded-2xl bg-amber-400 border-4 border-amber-700 flex items-center justify-center shadow-lg">
                        <Star className="w-8 h-8 text-amber-900 fill-amber-900" />
                     </div>
                     <span className="font-black text-amber-900">+10 XP</span>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
