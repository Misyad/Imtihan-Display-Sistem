"use client";

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "imtihan-navbar-visible";
const TOGGLE_EVENT = "navbar-visibility-change";

export function useNavbarToggle() {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setIsVisible(stored === "true");
    }

    const handleCustomEvent = (e: CustomEvent<boolean>) => {
      setIsVisible(e.detail);
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue !== null) {
        setIsVisible(e.newValue === "true");
      }
    };

    window.addEventListener(TOGGLE_EVENT, handleCustomEvent as EventListener);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener(TOGGLE_EVENT, handleCustomEvent as EventListener);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);

  const toggle = useCallback(() => {
    setIsVisible((prev) => {
      const newValue = !prev;
      localStorage.setItem(STORAGE_KEY, String(newValue));
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent(TOGGLE_EVENT, { detail: newValue }));
      }, 0);
      return newValue;
    });
  }, []);

  const show = useCallback(() => {
    setIsVisible(true);
    localStorage.setItem(STORAGE_KEY, "true");
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent(TOGGLE_EVENT, { detail: true }));
    }, 0);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, "false");
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent(TOGGLE_EVENT, { detail: false }));
    }, 0);
  }, []);

  return { isVisible, toggle, show, hide, mounted };
}
