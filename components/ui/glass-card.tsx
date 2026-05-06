"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: "emerald" | "gold" | "zinc" | "transparent";
}

export const GlassCard = ({ 
  children, 
  className, 
  variant = "zinc", 
  ...props 
}: GlassCardProps) => {
  const variants = {
    emerald: "bg-emerald-950/40 border-emerald-500/20 text-white",
    gold: "bg-amber-950/40 border-amber-500/20 text-white",
    zinc: "bg-zinc-900/50 border-white/10 text-white",
    transparent: "bg-white/5 border-white/5 text-white",
  };

  return (
    <motion.div
      className={cn(
        "relative rounded-[2.5rem] backdrop-blur-3xl border shadow-2xl overflow-hidden",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
