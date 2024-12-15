import { create } from "zustand";

interface NavigationState {
  isMenuCollapsed: boolean;
  toggleMenu: () => void;
  setMenuCollapsed: (collapsed: boolean) => void;
}

export const useMenuNavigation = create<NavigationState>((set) => ({
  isMenuCollapsed: true,
  toggleMenu: () =>
    set((state) => ({ isMenuCollapsed: !state.isMenuCollapsed })),
  setMenuCollapsed: (collapsed) => set({ isMenuCollapsed: collapsed }),
}));
