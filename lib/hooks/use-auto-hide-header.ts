"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "imtihan-header-auto-hide";

function getStoredPreference(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored !== null ? stored === "true" : true;
}

function setStoredPreference(enabled: boolean) {
  localStorage.setItem(STORAGE_KEY, String(enabled));
}

interface UseAutoHideHeaderOptions {
  idleTimeout?: number;
  showOnTopProximity?: boolean;
  showOnBottomProximity?: boolean;
  proximityThreshold?: number;
  bottomProximityThreshold?: number;
  disabled?: boolean;
}

export function useAutoHideHeader<T extends HTMLElement = HTMLDivElement>(options: UseAutoHideHeaderOptions = {}) {
  const {
    idleTimeout = 1500,
    showOnTopProximity = true,
    showOnBottomProximity = false,
    proximityThreshold = 100,
    bottomProximityThreshold = 100,
    disabled = false,
  } = options;

  const [autoHideEnabled, setAutoHideEnabled] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const manuallyHiddenRef = useRef(false);
  const isVisibleRef = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ref = useRef<T>(null!);

  useEffect(() => {
    setAutoHideEnabled(getStoredPreference());
  }, []);

  const isFullyDisabled = disabled || !autoHideEnabled;

  useEffect(() => {
    if (isFullyDisabled) {
      setIsVisible(true);
      return;
    }

    const resetTimer = () => {
      setIsVisible(true);
      isVisibleRef.current = true;
      manuallyHiddenRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const startHideTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        isVisibleRef.current = false;
      }, idleTimeout);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const isTop = showOnTopProximity && e.clientY <= proximityThreshold;
      const isBottom = showOnBottomProximity && e.clientY >= window.innerHeight - bottomProximityThreshold;

      if (isTop || isBottom) {
        resetTimer();
        return;
      }

      if (manuallyHiddenRef.current) return;

      if (!isVisibleRef.current) {
        setIsVisible(true);
        isVisibleRef.current = true;
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        isVisibleRef.current = false;
      }, idleTimeout);
    };

    const handleMouseEnter = () => {
      resetTimer();
    };

    const handleMouseLeave = () => {
      startHideTimer();
    };

    resetTimer();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("touchstart", resetTimer);

    const el = ref.current;
    if (el) {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("touchstart", resetTimer);

      if (el) {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [idleTimeout, showOnTopProximity, showOnBottomProximity, proximityThreshold, bottomProximityThreshold, isFullyDisabled]);

  const toggleHide = () => {
    if (isVisibleRef.current) {
      setIsVisible(false);
      isVisibleRef.current = false;
      manuallyHiddenRef.current = true;
    } else {
      setIsVisible(true);
      isVisibleRef.current = true;
      manuallyHiddenRef.current = false;
    }
  };

  const toggleAutoHide = () => {
    const newVal = !autoHideEnabled;
    setAutoHideEnabled(newVal);
    setStoredPreference(newVal);
    if (newVal) {
      setIsVisible(true);
      isVisibleRef.current = true;
      manuallyHiddenRef.current = false;
    }
  };

  return { isVisible, ref, toggleHide, autoHideEnabled, toggleAutoHide };
}
