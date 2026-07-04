import React from "react";
import { useQuestionStore } from "@/lib/store";
import { Wifi, WifiOff, RefreshCw, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConnectionStatus() {
  const { connectionStatus, clientCount, reconnectSocket } = useQuestionStore();

  const statusConfig = {
    connected: {
      icon: Wifi,
      label: "Connected",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      pulse: true
    },
    disconnected: {
      icon: WifiOff,
      label: "Disconnected",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
      pulse: false
    },
    reconnecting: {
      icon: RefreshCw,
      label: "Reconnecting",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      pulse: true
    },
    error: {
      icon: WifiOff,
      label: "Error",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
      pulse: false
    }
  };

  const config = statusConfig[connectionStatus];
  const Icon = config.icon;

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-2 rounded-xl border transition-all",
      config.bg,
      config.border
    )}>
      <div className="relative">
        <Icon className={cn("w-4 h-4", config.color, connectionStatus === 'reconnecting' && "animate-spin")} />
        {config.pulse && (
          <div className={cn("absolute inset-0 rounded-full animate-ping", config.color)} style={{ opacity: 0.3 }} />
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <span className={cn("text-xs font-bold uppercase tracking-wider", config.color)}>
          {config.label}
        </span>
        
        {connectionStatus === 'connected' && clientCount > 0 && (
          <>
            <div className="w-px h-3 bg-white/20" />
            <div className="flex items-center gap-1.5 text-emerald-500">
              <Users className="w-3 h-3" />
              <span className="text-xs font-bold">{clientCount}</span>
            </div>
          </>
        )}
      </div>

      {(connectionStatus === 'disconnected' || connectionStatus === 'error') && (
        <button
          onClick={reconnectSocket}
          className="ml-2 text-xs font-bold text-white/70 hover:text-white transition-colors px-2 py-1 rounded bg-white/5 hover:bg-white/10"
        >
          Retry
        </button>
      )}
    </div>
  );
}
