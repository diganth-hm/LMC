import { create } from 'zustand';

interface UiState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  dateRange: 'Last 30 Days',
  setDateRange: (dateRange) => set({ dateRange }),
  selectedCity: 'All Cities',
  setSelectedCity: (selectedCity) => set({ selectedCity }),
}));
