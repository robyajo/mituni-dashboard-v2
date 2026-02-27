"use client";

import { useState, useEffect, useCallback } from "react";

interface FreezeData {
  freezeUntil: number | null;
  attempts: number;
}

export function useFreeze(
  key: string,
  maxAttempts: number = 5,
  durationSeconds: number = 300,
) {
  const [isFrozen, setIsFrozen] = useState(false);
  const [freezeUntil, setFreezeUntilState] = useState<number | null>(null);

  // Helper to get storage key
  const storageKey = `freeze-${key}`;

  const checkStatus = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const data: FreezeData = JSON.parse(stored);

        if (data.freezeUntil && data.freezeUntil > Date.now()) {
          setFreezeUntilState(data.freezeUntil);
          setIsFrozen(true);
        } else {
          // Expired or not frozen
          if (isFrozen) setIsFrozen(false);
          if (freezeUntil) setFreezeUntilState(null);
        }
      }
    } catch (e) {
      console.error("Error parsing freeze data", e);
    }
  }, [storageKey, isFrozen, freezeUntil]);

  // Initial check and interval
  useEffect(() => {
    checkStatus();

    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  const setFreezeUntil = (timestamp: number | null) => {
    setFreezeUntilState(timestamp);
    if (timestamp) {
      setIsFrozen(true);
      const data: FreezeData = {
        freezeUntil: timestamp,
        attempts: maxAttempts, // Assume max attempts reached if freezing manually
      };
      localStorage.setItem(storageKey, JSON.stringify(data));
    } else {
      setIsFrozen(false);
      localStorage.removeItem(storageKey);
    }
  };

  return { isFrozen, setFreezeUntil };
}
