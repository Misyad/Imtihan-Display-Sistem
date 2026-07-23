import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Terjadi Kesalahan",
  message,
  onRetry,
  retryText = "Coba Lagi",
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl border border-destructive/20 bg-destructive/5 text-foreground max-w-md mx-auto">
      <AlertCircle className="h-10 w-10 text-destructive mb-3" />
      <h3 className="font-semibold text-lg text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-destructive text-destructive-foreground px-4 py-2 text-xs font-semibold hover:bg-destructive/90 transition-colors focus:outline-none focus:ring-2 focus:ring-destructive/20 cursor-pointer"
        >
          <RefreshCw className="h-3 w-3" />
          {retryText}
        </button>
      )}
    </div>
  );
};
