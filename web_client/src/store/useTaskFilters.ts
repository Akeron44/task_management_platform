import { create } from "zustand";
import { FilterValues } from "../layout/AppLayout/components/FilterModal/FilterModal";
import { SortValues } from "../layout/AppLayout/components/SortModal/SortModal";

interface TaskFiltersState {
  filters: FilterValues;
  setFilters: (filters: FilterValues) => void;

  sortConfig: SortValues;
  setSortConfig: (sortConfig: SortValues) => void;

  resetFilters: () => void;
  resetSort: () => void;
  resetAll: () => void;

  currentPage: "myTasks" | "dashboard";
  setCurrentPage: (page: "myTasks" | "dashboard") => void;
}

const initialFilters: FilterValues = {
  priority: [],
  status: [],
  dueDate: null,
};

const initialSortConfig: SortValues = {
  field: "none",
  order: "asc",
};

export const useTaskFilters = create<TaskFiltersState>((set) => ({
  filters: initialFilters,
  setFilters: (filters) => set({ filters }),

  sortConfig: initialSortConfig,
  setSortConfig: (sortConfig) => set({ sortConfig }),

  currentPage: "myTasks",
  setCurrentPage: (page) => set({ currentPage: page }),

  resetFilters: () => set({ filters: initialFilters }),
  resetSort: () => set({ sortConfig: initialSortConfig }),
  resetAll: () =>
    set({
      filters: initialFilters,
      sortConfig: initialSortConfig,
    }),
}));
