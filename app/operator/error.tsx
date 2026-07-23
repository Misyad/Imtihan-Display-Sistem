"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";
import { logger } from "@/lib/logger";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function OperatorError({ error, reset }: ErrorProps) {
  useEffect(() => {
    logger.error("Operator page boundary caught an error", { digest: error.digest }, error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-border/40 bg-card p-8 text-center shadow-lg">
        <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="mb-2 text-xl font-bold tracking-tight text-foreground">
          Gagal Memuat Dashboard Operator
        </h1>
        <p className="mx-auto mb-6 max-w-sm text-sm text-muted-foreground">
          Terjadi kesalahan saat memproses data operator atau koneksi real-time terputus. Silakan coba atur ulang komponen ini.
        </p>
        {error.digest && (
          <code className="mb-6 block rounded bg-muted px-2 py-1 text-xs text-muted-foreground font-mono">
            Digest: {error.digest}
          </code>
        )}
        <div className="flex flex-col gap-3 sm:flex-row justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Muat Ulang Dashboard
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus:outline-none cursor-pointer"
          >
            <LayoutDashboard className="h-4 w-4" />
            Halaman Utama
          </a>
        </div>
      </div>
    </div>
  );
}
