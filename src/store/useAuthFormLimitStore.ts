import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthFormLimitState {
  freezeUntil: number | null;
  setFreezeUntil: (time: number | null) => void;
  getFreezeRemaining: () => number;
}

export const useAuthFormLimitStore = create<AuthFormLimitState>()(
  persist(
    (set, get) => ({
      freezeUntil: null,

      setFreezeUntil: (time) => {
        set({ freezeUntil: time });
      },

      getFreezeRemaining: () => {
        const freezeUntil = get().freezeUntil;
        if (!freezeUntil) return 0;
        const remaining = Math.ceil((freezeUntil - Date.now()) / 1000);
        return remaining > 0 ? remaining : 0;
      },
    }),
    {
      name: "auth-limit-storage",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          if (typeof window !== "undefined") {
            localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") {
            localStorage.removeItem(name);
          }
        },
      })),
      skipHydration: true,
    }
  )
);
