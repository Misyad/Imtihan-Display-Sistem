"use client";

import * as React from "react";
import { Moon, Sun, Star } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export const THEME_OPTIONS = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "ceremonial", label: "Ceremonial", icon: Star },
] as const;

export type ThemeMode = (typeof THEME_OPTIONS)[number]["id"];

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const current = THEME_OPTIONS.find((t) => t.id === theme) ?? THEME_OPTIONS[0];
  const CurrentIcon = current.icon;

  const cycle = () => {
    const idx = THEME_OPTIONS.findIndex((t) => t.id === theme);
    const next = THEME_OPTIONS[(idx + 1) % THEME_OPTIONS.length];
    setTheme(next.id);
  };

  return (
    <button
      onClick={cycle}
      className={cn(
        "relative p-3 rounded-xl transition-all duration-300",
        "bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border",
        className
      )}
      aria-label={`Ganti theme. Saat ini: ${current.label}`}
      title={`Theme: ${current.label}`}
    >
      {!mounted ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        THEME_OPTIONS.map(({ id, icon: Icon }) => (
          <Icon
            key={id}
            className={cn(
              "h-[1.2rem] w-[1.2rem] transition-all duration-300",
              id === current.id
                ? "rotate-0 scale-100 opacity-100"
                : "rotate-90 scale-0 opacity-0 absolute"
            )}
          />
        ))
      )}
      {mounted && (
        <span
          className={cn(
            "absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full transition-colors duration-300",
            current.id === "ceremonial" ? "bg-gold-500" : "bg-primary"
          )}
        />
      )}
    </button>
  );
}
