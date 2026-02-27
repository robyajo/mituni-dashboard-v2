import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface DashboardFilterState {
  range: string;
  startDate?: Date;
  endDate?: Date;
  status: string;

  // Actions
  setRange: (range: string) => void;
  setDateRange: (start: Date | undefined, end: Date | undefined) => void;
  setStatus: (status: string) => void;
  resetFilter: () => void;
}

export const useDashboardFilterStore = create<DashboardFilterState>()(
  persist(
    (set) => ({
      range: "hari",
      status: "semua",
      startDate: undefined,
      endDate: undefined,

      setRange: (range) => set({ range }),
      setDateRange: (startDate, endDate) => set({ startDate, endDate }),
      setStatus: (status) => set({ status }),
      resetFilter: () =>
        set({
          range: "hari",
          status: "semua",
          startDate: undefined,
          endDate: undefined,
        }),
    }),
    {
      name: "dashboard-filter-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.startDate && typeof state.startDate === "string") {
            state.startDate = new Date(state.startDate);
          }
          if (state.endDate && typeof state.endDate === "string") {
            state.endDate = new Date(state.endDate);
          }
        }
      },
    },
  ),
);
