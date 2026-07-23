"use client";

import React, { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { useQuestionStore } from "@/lib/store";

export const ConnectionStatus: React.FC = () => {
  const isConnected = useQuestionStore((state) => state.isConnected);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-6 w-24 rounded-full border border-transparent bg-transparent" />;
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-border/45 bg-background/50 px-3 py-1 text-xs backdrop-blur-sm select-none">
      {isConnected ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Wifi className="h-3 w-3 text-emerald-500" />
          <span className="font-medium text-emerald-600 dark:text-emerald-400">Terhubung</span>
        </>
      ) : (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-destructive/75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
          </span>
          <WifiOff className="h-3 w-3 text-destructive" />
          <span className="font-medium text-destructive">Terputus</span>
        </>
      )}
    </div>
  );
};
