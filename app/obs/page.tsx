"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useQuestionStore } from "@/lib/store";
import { BookOpen, Maximize2 } from "lucide-react";
import { motion } from "framer-motion";
import { QuestionDisplay } from "@/components/features/question-display";

export default function ObsPage() {
  const { activeProfileId, profiles, activeQuestion, showAnswer } = useQuestionStore();
  const [mounted, setMounted] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const activeProfile = profiles[activeProfileId];
  const currentQuestionData = activeProfile?.questions.find(q => q.nomor === activeQuestion);

  useEffect(() => {
    setMounted(true);

    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowCursor(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowCursor(false), 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (!mounted || !activeProfile) return null;

  return (
    <div className={cn(
      "fixed inset-0 bg-transparent flex flex-col justify-end p-12 overflow-hidden pointer-events-none transition-all duration-700",
      !showCursor && "no-cursor"
    )}>
      {/* Fullscreen Trigger */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: showCursor ? 1 : 0 }}
        onClick={toggleFullscreen}
        className="absolute top-8 right-8 z-[100] p-4 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 text-white/40 hover:text-white transition-all active:scale-95 pointer-events-auto"
      >
        <Maximize2 className="w-6 h-6" />
      </motion.button>

      <div className="max-w-4xl w-full mx-auto relative h-64 flex flex-col justify-end">
        <QuestionDisplay 
          activeQuestion={activeQuestion}
          questionData={currentQuestionData}
          showAnswer={showAnswer}
          layout="overlay"
        />
      </div>
    </div>
  );
}
