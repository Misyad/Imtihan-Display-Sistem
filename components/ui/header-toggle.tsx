"use client";

import React from "react";
import { Minus } from "lucide-react";

interface HeaderToggleProps {
  onToggle: () => void;
  isVisible: boolean;
}

export function HeaderToggle({ onToggle, isVisible }: HeaderToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md opacity-30 hover:opacity-100 hover:bg-white/10 transition-all z-50 cursor-pointer"
      title={isVisible ? "Sembunyikan header" : "Tampilkan header"}
    >
      <Minus className="w-4 h-4 text-current" />
    </button>
  );
}
