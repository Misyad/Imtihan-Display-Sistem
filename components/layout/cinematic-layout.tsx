"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2 } from "lucide-react";

interface CinematicLayoutProps {
  children: React.ReactNode;
  bgVariant?: "default" | "split" | "obs";
}

export const CinematicLayout = ({ 
  children, 
  bgVariant = "default" 
}: CinematicLayoutProps) => {
  const [mounted, setMounted] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

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

  if (!mounted) return (
    <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center">
       <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
    </div>
  );

  return (
    <div className={cn(
      "fixed inset-0 bg-zinc-950 flex items-center justify-center overflow-hidden font-sans transition-all duration-700 select-none",
      !showCursor && "no-cursor",
      bgVariant === "obs" && "bg-transparent"
    )}>
      {/* Dynamic Backgrounds */}
      {bgVariant !== "obs" && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black" />
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full animate-[pulse_8s_infinite] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
          </div>
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.8)_100%)]" />
        </div>
      )}

      {/* Fullscreen Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: showCursor ? 1 : 0 }}
        onClick={toggleFullscreen}
        className="absolute top-8 right-8 z-[100] p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white/40 hover:text-white transition-all active:scale-95 pointer-events-auto"
      >
        <Maximize2 className="w-6 h-6" />
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
