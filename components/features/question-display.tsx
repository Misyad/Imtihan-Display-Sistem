"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { GlassCard } from "@/components/ui/glass-card";
import { QuestionText } from "@/components/ui/question-text";
import { AutoScaleText } from "@/components/ui/auto-scale-text";
import { QuranViewer } from "@/components/ui/quran-viewer";
import { useQuestionStore } from "@/lib/store";
import type { QuranReference } from "@/types/index";

interface QuestionDisplayProps {
  activeQuestion: number | null;
  questionData?: {
    soal: string;
    jawaban: string;
    kategori: string;
    quranRef?: QuranReference;
  };
  showAnswer: boolean;
  layout?: "full" | "split" | "overlay";
}

export const QuestionDisplay = ({ 
  activeQuestion, 
  questionData, 
  showAnswer,
  layout = "full" 
}: QuestionDisplayProps) => {
  const showQuranRef = useQuestionStore((state) => state.showQuranRef);
  const [localShowQuran, setLocalShowQuran] = useState(false);

  if (!activeQuestion) return null;

  const hasQuranRef = questionData?.quranRef && showAnswer;
  const showQuranPanel = hasQuranRef && (showQuranRef || localShowQuran);

  return (
    <>
      <AnimatePresence mode="wait">
        {!showAnswer ? (
          <motion.div 
            key={`q-${activeQuestion}`}
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            className={cn(
              "flex flex-col items-center justify-center space-y-8 w-full h-full",
              layout === "split" && "items-start text-left space-y-6",
              layout === "overlay" && "items-start text-left space-y-2"
            )}
          >
            {questionData && (
              <StatusBadge icon={<BookOpen />} variant="emerald">
                {questionData.kategori}
              </StatusBadge>
            )}
            
            <div className="relative">
              <h1 className={cn(
                "font-black leading-none tracking-tighter text-white drop-shadow-2xl italic",
                layout === "full" ? "text-[15rem] md:text-[20rem]" : "text-6xl md:text-8xl text-gold-400"
              )}>
                {activeQuestion.toString().padStart(2, '0')}
              </h1>
            </div>

            {questionData && (
              <div className={cn("w-full flex-1 min-h-0 max-w-4xl", layout === "overlay" && "max-w-full")}>
                <AutoScaleText
                  className="font-bold leading-tight text-white tracking-tight"
                  align={layout === "full" ? "center" : "left"}
                  maxSize={layout === "full" ? 72 : 44}
                  minSize={14}
                >
                  <QuestionText text={questionData.soal} />
                </AutoScaleText>
              </div>
            )}
          </motion.div>
        ) : (
          <div key={`a-${activeQuestion}`} className="w-full h-full flex flex-col justify-center space-y-6">
            <GlassCard 
              variant="gold"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className={cn(
                "p-12 w-full flex-1 min-h-0 flex flex-col justify-center",
                layout === "full" ? "py-20 px-24" : "p-10"
              )}
            >
              <div className="relative z-10 space-y-4 flex flex-col justify-center flex-1 min-h-0">
                <h3 className="text-amber-500 text-xs font-black uppercase tracking-[0.5em]">Jawaban Benar</h3>
                <AutoScaleText
                  className="font-black text-amber-950 tracking-tight"
                  maxSize={layout === "full" ? 128 : 72}
                  minSize={14}
                >
                  <QuestionText text={questionData?.jawaban || "MUMTAZ"} />
                </AutoScaleText>
              </div>
            </GlassCard>

            {hasQuranRef && !showQuranRef && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <button
                  onClick={() => setLocalShowQuran(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg"
                >
                  <BookOpen className="w-5 h-5" />
                  📖 Lihat Referensi Al-Quran
                </button>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {hasQuranRef && questionData.quranRef && (
        <QuranViewer
          reference={questionData.quranRef}
          isOpen={!!showQuranPanel}
          onClose={() => setLocalShowQuran(false)}
          mode="fullscreen"
        />
      )}
    </>
  );
};
