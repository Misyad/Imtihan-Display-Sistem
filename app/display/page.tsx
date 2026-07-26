"use client";

import React, { useEffect, useState } from "react";
import { useQuestionStore } from "@/lib/store";
import { Award, Sparkles, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { CinematicLayout } from "@/components/layout/cinematic-layout";
import { StatusBadge } from "@/components/ui/status-badge";
import { QuestionDisplay } from "@/components/features/question-display";
import { GameDisplay } from "@/components/features/game-display";

export default function DisplayPage() {
  const { activeProfileId, profiles, activeQuestion, showAnswer } = useQuestionStore();
  const [mounted, setMounted] = useState(false);

  const activeProfile = profiles[activeProfileId];
  const currentQuestionData = activeProfile?.questions.find(q => q.nomor === activeQuestion);
  const settings = activeProfile?.settings;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !activeProfile) return null;

  return (
    <CinematicLayout>
      <div className="w-full h-full flex flex-col items-center justify-center text-center px-8">
        
        {/* Header Branding */}
        <div className="absolute top-12 left-0 right-0 flex justify-center pointer-events-none">
           <StatusBadge icon={<Award className="text-amber-500" />} variant="zinc">
             {settings?.instituteName} &bull; {settings?.eventName}
           </StatusBadge>
        </div>

        <div className="relative w-full flex items-center justify-center min-h-[60vh]">
          <QuestionDisplay 
            activeQuestion={activeQuestion}
            questionData={currentQuestionData}
            showAnswer={showAnswer}
            layout="full"
          />
        </div>

        {/* Cinematic Footer */}
        {settings?.showFooter && (
          <div className="absolute bottom-8 md:bottom-16 left-0 right-0 px-4 sm:px-8 md:px-20 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 sm:gap-0 opacity-40">
             <div className="order-first sm:order-none text-center font-serif italic text-amber-100/30 text-lg sm:text-xl md:text-2xl">"Bi taufiqillah wa najah"</div>
             <div className="text-center sm:text-left space-y-2 order-last sm:order-first">
                <p className="text-emerald-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">{settings.instituteName}</p>
                <div className="h-0.5 w-16 sm:w-24 bg-emerald-500/30 mx-auto sm:mx-0" />
             </div>
             <div className="text-center sm:text-right space-y-2 order-last">
                <p className="text-emerald-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Akademik {settings.academicYear}</p>
                <div className="h-0.5 w-16 sm:w-24 bg-emerald-500/30 mx-auto sm:ml-auto sm:mr-0" />
             </div>
          </div>
        )}
      </div>
    </CinematicLayout>
  );
}
