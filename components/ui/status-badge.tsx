"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatusBadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "emerald" | "amber" | "rose" | "zinc";
  className?: string;
}

export const StatusBadge = ({ 
  children, 
  icon, 
  variant = "zinc", 
  className 
}: StatusBadgeProps) => {
  const variants = {
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    rose: "bg-rose-500/10 border-rose-500/30 text-rose-400",
    zinc: "bg-white/5 border-white/10 text-zinc-400",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-2 px-6 py-2 rounded-full border backdrop-blur-md text-xs font-bold uppercase tracking-[0.3em]",
        variants[variant],
        className
      )}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </motion.div>
  );
};
