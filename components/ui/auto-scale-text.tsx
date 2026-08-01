"use client";

import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AutoScaleTextProps {
  children: React.ReactNode;
  className?: string;
  maxSize?: number;
  minSize?: number;
  align?: "center" | "left";
}

export function AutoScaleText({
  children,
  className,
  maxSize = 128,
  minSize = 14,
  align = "center",
}: AutoScaleTextProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(maxSize);

  const fit = useCallback(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    let lo = minSize;
    let hi = maxSize;

    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      inner.style.fontSize = `${mid}px`;
      const fits =
        wrap.scrollHeight <= wrap.clientHeight + 2 &&
        wrap.scrollWidth <= wrap.clientWidth + 2;
      if (fits) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }

    inner.style.fontSize = `${lo}px`;
    setFontSize(lo);
  }, [maxSize, minSize]);

  useLayoutEffect(() => {
    fit();

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => fit());
    }

    const ro = new ResizeObserver(() => fit());
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [fit]);

  return (
    <div ref={wrapRef} className="relative w-full h-full overflow-hidden">
      <div
        ref={innerRef}
        className={cn(
          "absolute inset-0 flex items-center justify-center whitespace-pre-line break-words",
          align === "left" ? "text-left justify-start" : "text-center",
          className
        )}
        style={{ fontSize }}
      >
        {children}
      </div>
    </div>
  );
}
