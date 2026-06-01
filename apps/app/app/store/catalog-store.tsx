import { create } from "zustand";

interface CatalogStore {
  filtersModalOpen: boolean;
  mapSegmentActive: boolean;
  setFiltersModalOpen: (open: boolean) => void;
  setMapSegmentActive: (active: boolean) => void;
}

export const useCatalogStore = create<CatalogStore>((set) => ({
  filtersModalOpen: false,
  mapSegmentActive: false,
  setFiltersModalOpen: (open) => set({ filtersModalOpen: open }),
  setMapSegmentActive: (active) => set({ mapSegmentActive: active }),
}));
