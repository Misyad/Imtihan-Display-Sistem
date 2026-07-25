"use client";

import { useEffect, useRef, useState } from "react";

interface UseAutoHideHeaderOptions {
  idleTimeout?: number;
  showOnTopProximity?: boolean;
  proximityThreshold?: number;
  disabled?: boolean;
}

export function useAutoHideHeader<T extends HTMLElement = HTMLDivElement>(options: UseAutoHideHeaderOptions = {}) {
  const {
    idleTimeout = 1500,
    showOnTopProximity = true,
    proximityThreshold = 100,
    disabled = false,
  } = options;

  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const headerRef = useRef<T>(null!);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (disabled) {
      setIsVisible(true);
      return;
    }

    const resetTimer = () => {
      setIsVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (!isHovered) {
        timeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, idleTimeout);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (showOnTopProximity && e.clientY <= proximityThreshold) {
        setIsVisible(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        return;
      }
      resetTimer();
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      setIsVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setIsVisible(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    resetTimer();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("scroll", resetTimer);
    window.addEventListener("touchstart", resetTimer);

    const header = headerRef.current;
    if (header) {
      header.addEventListener("mouseenter", handleMouseEnter);
      header.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("touchstart", resetTimer);

      if (header) {
        header.removeEventListener("mouseenter", handleMouseEnter);
        header.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [idleTimeout, showOnTopProximity, proximityThreshold, disabled, isHovered]);

  return { isVisible, headerRef };
}
