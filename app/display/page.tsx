"use client";

import React, { useEffect, useState } from "react";
import { useQuestionStore } from "@/lib/store";
import { Award, Sparkles, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { CinematicLayout } from "@/components/layout/cinematic-layout";
import { StatusBadge } from "@/components/ui/status-badge";
import { QuestionDisplay } from "@/components/features/question-display";
import { GameDisplay } from "@/components/features/game-display";
import { useAutoHideHeader } from "@/lib/hooks/use-auto-hide-header";
import { HeaderToggle } from "@/components/ui/header-toggle";

export default function DisplayPage() {
  const { activeProfileId, profiles, activeQuestion, showAnswer } = useQuestionStore();
  const [mounted, setMounted] = useState(false);

  const activeProfile = profiles[activeProfileId];
  const currentQuestionData = activeProfile?.questions.find(q => q.nomor === activeQuestion);
  const settings = activeProfile?.settings;
  const { isVisible, ref: headerRef, toggleHide, autoHideEnabled, toggleAutoHide } = useAutoHideHeader();
  const { isVisible: footerVisible, ref: footerRef } = useAutoHideHeader({
    showOnTopProximity: false,
    showOnBottomProximity: true,
    idleTimeout: 3000,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !activeProfile) return null;

  return (
    <CinematicLayout>
      <div className="w-full h-full flex flex-col items-center justify-center text-center px-8">
        
        {/* Header Branding */}
        <div
          ref={headerRef}
          className={cn(
            "absolute top-12 left-0 right-0 flex justify-center pointer-events-none header-auto-hide",
            isVisible ? "visible" : "hidden"
          )}
        >
           <StatusBadge icon={<Award className="text-amber-500" />} variant="zinc">
             {settings?.instituteName} &bull; {settings?.eventName}
           </StatusBadge>
           <HeaderToggle onToggle={toggleHide} isVisible={isVisible} />
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
          <div
            ref={footerRef}
            className={cn(
              "absolute bottom-16 left-0 right-0 px-20 flex justify-between items-end opacity-40 header-auto-hide bottom",
              footerVisible ? "visible" : "hidden"
            )}
          >
             <div className="text-left space-y-2">
                <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest">{settings.instituteName}</p>
                <div className="h-0.5 w-24 bg-emerald-500/30" />
             </div>
             <div className="text-center font-serif italic text-amber-100/30 text-2xl">"Bi taufiqillah wa najah"</div>
             <div className="text-right space-y-2">
                <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Akademik {settings.academicYear}</p>
                <div className="h-0.5 w-24 bg-emerald-500/30 ml-auto" />
             </div>
          </div>
        )}
      </div>
    </CinematicLayout>
  );
}
