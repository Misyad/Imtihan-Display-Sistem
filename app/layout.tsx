import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";



export const metadata: Metadata = {
  title: "Imtihan Display Sistem",
  description: "Modern Display System built with Next.js",
  icons: {
    icon: "/logo-favicon.png",
    apple: "/logo-icon.png",
  },
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
            <Navbar />
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

