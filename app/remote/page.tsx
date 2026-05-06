"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Eye, 
  EyeOff, 
  SkipForward, 
  SkipBack, 
  MonitorOff, 
  Hash,
  Vibrate,
  Smartphone
} from "lucide-react";
import { useQuestionStore } from "@/lib/store";

export default function RemotePage() {
  const { 
    activeQuestion, 
    showAnswer,
    setActiveQuestion, 
    toggleAnswer,
    resetQuestion
  } = useQuestionStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lock scroll for mobile feel
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleVibrate = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50); // 50ms vibration
    }
  };

  const handleAction = (fn: () => void) => {
    handleVibrate();
    fn();
  };

  const handleNext = () => {
    if (activeQuestion && activeQuestion < 200) {
      setActiveQuestion(activeQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (activeQuestion && activeQuestion > 1) {
      setActiveQuestion(activeQuestion - 1);
    }
  };

  const handleJump = () => {
    handleVibrate();
    const num = window.prompt("Nomor Soal:");
    if (num && !isNaN(parseInt(num))) {
      setActiveQuestion(parseInt(num));
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 bg-zinc-950 text-white flex flex-col p-6 safe-area-inset">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
            <Smartphone className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h2 className="font-bold text-sm uppercase tracking-widest text-emerald-500">Smart Remote</h2>
            <p className="text-[10px] text-zinc-500 font-medium tracking-widest">IMTIHAN SYSTEM</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Status</p>
          <div className="flex items-center gap-2 justify-end">
            <div className="w-2 h-2 rounded-full bg-emerald-50 animate-pulse" />
            <span className="text-xs font-black tracking-tighter">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Main Display Info */}
      <div className="flex-1 flex flex-col items-center justify-center mb-8">
        <div className="w-full aspect-video rounded-[2.5rem] bg-zinc-900 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl">
          {/* Subtle Glow */}
          <div className={cn(
             "absolute inset-0 transition-opacity duration-1000",
             showAnswer ? "bg-amber-500/10 opacity-100" : "opacity-0"
          )} />
          
          <p className="text-xs font-bold text-zinc-600 uppercase tracking-[0.3em] mb-4">Current Screen</p>
          
          {activeQuestion ? (
            <div className="text-center">
              <h1 className="text-8xl font-black tracking-tighter text-white">
                {activeQuestion.toString().padStart(2, '0')}
              </h1>
              {showAnswer && (
                <div className="mt-4 px-4 py-1 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-widest">
                  ANSWER REVEALED
                </div>
              )}
            </div>
          ) : (
            <MonitorOff className="w-16 h-16 text-zinc-800" />
          )}
        </div>
      </div>

      {/* Control Buttons Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button 
          onClick={() => handleAction(toggleAnswer)}
          disabled={!activeQuestion}
          className={cn(
            "h-32 rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all active:scale-95 shadow-xl",
            showAnswer 
              ? "bg-amber-400 text-amber-950 shadow-amber-400/20" 
              : "bg-zinc-800 text-white border border-white/5",
            !activeQuestion && "opacity-20 grayscale"
          )}
        >
          {showAnswer ? <EyeOff className="w-8 h-8" /> : <Eye className="w-8 h-8" />}
          <span className="text-xs font-black uppercase tracking-[0.2em]">{showAnswer ? "Hide" : "Show"} Answer</span>
        </button>

        <button 
          onClick={() => handleAction(handleJump)}
          className="h-32 rounded-[2rem] bg-zinc-800 border border-white/5 text-white flex flex-col items-center justify-center gap-3 transition-all active:scale-95 shadow-xl"
        >
          <Hash className="w-8 h-8" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">Jump To</span>
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button 
          onClick={() => handleAction(handlePrev)}
          disabled={!activeQuestion || activeQuestion <= 1}
          className="h-24 rounded-[2rem] bg-zinc-900 border border-white/5 text-white flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-20"
        >
          <SkipBack className="w-6 h-6" />
          <span className="text-xs font-black uppercase tracking-widest">Prev</span>
        </button>

        <button 
          onClick={() => handleAction(handleNext)}
          disabled={!activeQuestion || activeQuestion >= 200}
          className="h-24 rounded-[2rem] bg-emerald-600 text-white flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-20 shadow-xl shadow-emerald-600/20"
        >
          <span className="text-xs font-black uppercase tracking-widest">Next</span>
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Action */}
      <button 
        onClick={() => handleAction(resetQuestion)}
        className="w-full py-6 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center gap-3 transition-all active:scale-95 mb-4"
      >
        <MonitorOff className="w-5 h-5" />
        <span className="text-xs font-black uppercase tracking-[0.2em]">Black Screen</span>
      </button>

      {/* Feedback Hint */}
      <div className="flex items-center justify-center gap-2 text-zinc-700">
        <Vibrate className="w-3 h-3" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Haptic Feedback Enabled</span>
      </div>
    </div>
  );
}
