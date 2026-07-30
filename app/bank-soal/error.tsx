'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BankSoalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Bank Soal Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-10 w-10 animate-pulse" />
      </div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
        Gagal Memuat Bank Soal
      </h1>
      <p className="mx-auto mb-8 max-w-md text-muted-foreground">
        Terjadi kesalahan saat memuat halaman Bank Soal. Silakan coba muat ulang halaman.
      </p>
      {error.digest && (
        <code className="mb-8 block rounded bg-muted px-2.5 py-1.5 text-xs text-muted-foreground font-mono">
          Error ID: {error.digest}
        </code>
      )}
      <div className="flex flex-col gap-3 sm:flex-row justify-center">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Coba Lagi
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-border/20 cursor-pointer"
        >
          <Home className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
