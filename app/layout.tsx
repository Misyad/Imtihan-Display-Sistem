import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ConnectionStatus } from "@/components/ui/connection-status";



export const metadata: Metadata = {
  title: "Imtihan Display Sistem",
  description: "Modern Display System built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{
        "--font-geist-sans": "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
        "--font-geist-mono": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
      } as React.CSSProperties}
    >
      <body
        className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">I</span>
                  </div>
                  <span className="font-bold text-xl hidden sm:inline-block tracking-tight">Imtihan Display</span>
                </div>
                <div className="flex items-center gap-4">
                  <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <a href="/" className="transition-colors hover:text-primary">Dashboard</a>
                    <a href="/interactive" className="transition-colors hover:text-primary">Interactive Board</a>
                    <a href="/operator" className="transition-colors hover:text-primary">Operator</a>
                    <a href="/papan-soal" className="transition-colors hover:text-primary">Papan Soal</a>
                    <a href="/display" className="transition-colors hover:text-primary">Display</a>
                    <a href="/obs" className="transition-colors hover:text-primary">OBS Overlay</a>
                    <a href="/obs-split" className="transition-colors hover:text-primary">OBS Split</a>
                    <a href="/settings" className="transition-colors hover:text-primary">Settings</a>
                  </nav>
                  <ConnectionStatus />
                  <ThemeToggle />
                </div>
              </div>
            </header>
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t border-border/40 bg-background/95 py-6 md:py-0">
              <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Built by <a href="#" className="font-medium underline underline-offset-4">Hasan Pakis</a>. The source code is available on <a href="#" className="font-medium underline underline-offset-4">GitHub</a>.
                </p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

