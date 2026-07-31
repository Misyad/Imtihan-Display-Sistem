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
    emerald: "bg-display-bg-elevated/40 border-display-border-emerald text-display-text",
    gold: "bg-display-bg-elevated/40 border-display-border-gold text-display-text",
    zinc: "bg-display-bg-elevated/50 border-display-border text-display-text",
    transparent: "bg-display-text/5 border-display-border text-display-text",
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
