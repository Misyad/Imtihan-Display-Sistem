"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2 } from "lucide-react";
import { useTheme } from "next-themes";

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
  const { resolvedTheme } = useTheme();
  const isCeremonial = resolvedTheme === "ceremonial";

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
    <div className="fixed inset-0 bg-display-bg flex items-center justify-center">
       <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
    </div>
  );

  return (
    <div className={cn(
      "fixed inset-0 bg-display-bg flex items-center justify-center overflow-hidden font-sans transition-all duration-700 select-none",
      !showCursor && "no-cursor",
      bgVariant === "obs" && "bg-transparent"
    )}>
      {/* Dynamic Backgrounds */}
      {bgVariant !== "obs" && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black" />
          {/* Ceremonial: Islamic geometric pattern overlay */}
          {isCeremonial && (
            <div className="absolute inset-0 pattern-geometric pattern-density-high opacity-20 pointer-events-none" />
          )}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full animate-[pulse_8s_infinite] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
          </div>
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.8)_100%)]" />
          {/* Ceremonial: gold frame + corner ornaments */}
          {isCeremonial && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-3 border border-gold-500/40 rounded-[2rem]" />
              <div className="absolute inset-0 ornament-corner-tl" />
              <div className="absolute inset-0 ornament-corner-tr" />
              <div className="absolute inset-0 ornament-corner-bl" />
              <div className="absolute inset-0 ornament-corner-br" />
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: showCursor ? 1 : 0 }}
        onClick={toggleFullscreen}
        className="absolute top-8 right-8 z-[100] p-4 rounded-full bg-display-text/5 hover:bg-display-text/10 backdrop-blur-md border border-display-border text-display-muted hover:text-display-text transition-all active:scale-95 pointer-events-auto"
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
