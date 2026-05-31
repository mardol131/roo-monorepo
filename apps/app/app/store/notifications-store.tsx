import { create } from "zustand";

interface NotificationsStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
