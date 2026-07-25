"use client";

import { useEffect, useRef, useState } from "react";

interface UseAutoHideHeaderOptions {
  idleTimeout?: number;
  showOnTopProximity?: boolean;
  showOnBottomProximity?: boolean;
  proximityThreshold?: number;
  bottomProximityThreshold?: number;
  disabled?: boolean;
  disableHoverProtection?: boolean;
}

export function useAutoHideHeader<T extends HTMLElement = HTMLDivElement>(options: UseAutoHideHeaderOptions = {}) {
  const {
    idleTimeout = 1500,
    showOnTopProximity = true,
    showOnBottomProximity = false,
    proximityThreshold = 100,
    bottomProximityThreshold = 100,
    disabled = false,
    disableHoverProtection = false,
  } = options;

  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<T>(null!);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (disabled) {
      setIsVisible(true);
      return;
    }

    const resetTimer = () => {
      setIsVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (disableHoverProtection || !isHovered) {
        timeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, idleTimeout);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const isTop = showOnTopProximity && e.clientY <= proximityThreshold;
      const isBottom = showOnBottomProximity && e.clientY >= window.innerHeight - bottomProximityThreshold;

      if (isTop || isBottom) {
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
      if (!disableHoverProtection) {
        setIsVisible(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }
    };

    resetTimer();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("scroll", resetTimer);
    window.addEventListener("touchstart", resetTimer);

    if (!disableHoverProtection) {
      const el = ref.current;
      if (el) {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("touchstart", resetTimer);

      if (!disableHoverProtection) {
        const el = ref.current;
        if (el) {
          el.removeEventListener("mouseenter", handleMouseEnter);
          el.removeEventListener("mouseleave", handleMouseLeave);
        }
      }
    };
  }, [idleTimeout, showOnTopProximity, showOnBottomProximity, proximityThreshold, bottomProximityThreshold, disabled, disableHoverProtection, isHovered]);

  return { isVisible, ref };
}
