"use client";

import React from "react";
import { Minus, Plus, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavbarToggle } from "@/lib/hooks/use-navbar-toggle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ConnectionStatus } from "@/components/ui/connection-status";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/interactive", label: "Interactive Board" },
  { href: "/operator", label: "Operator" },
  { href: "/papan-soal", label: "Papan Soal" },
  { href: "/display", label: "Display" },
  { href: "/obs", label: "OBS Overlay" },
  { href: "/obs-split", label: "OBS Split" },
  { href: "/settings", label: "Settings" },
];

export function Navbar() {
  const { isVisible, toggle, mounted } = useNavbarToggle();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isVisible) {
      setMobileMenuOpen(false);
    }
  }, [isVisible]);

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActivePath = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  if (!mounted) {
    return (
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
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="transition-colors hover:text-primary">
                  {link.label}
                </a>
              ))}
            </nav>
            <ConnectionStatus />
            <ThemeToggle />
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <button
        onClick={toggle}
        className="fixed top-4 right-4 z-[100] w-10 h-10 rounded-lg bg-primary/90 hover:bg-primary text-primary-foreground flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
        title={isVisible ? "Sembunyikan navbar" : "Tampilkan navbar"}
      >
        {isVisible ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>

      <div
        className={cn(
          "relative z-50 transition-all duration-300",
          isVisible ? "overflow-visible" : "h-0 overflow-hidden"
        )}
      >
        <header className="sticky top-0 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 -ml-2 rounded-lg hover:bg-accent transition-colors"
                aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">I</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline-block tracking-tight">Imtihan Display</span>
            </div>
            <div className="flex items-center gap-4 pr-12">
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "transition-colors hover:text-primary",
                      isActivePath(link.href) && "text-primary font-semibold"
                    )}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <ConnectionStatus />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-out",
            mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <nav className="border-t border-border/40 bg-background">
            <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                    isActivePath(link.href)
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-accent"
                  )}
                >
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      isActivePath(link.href) ? "bg-primary" : "bg-transparent"
                    )}
                  />
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
