import { off } from "process";
import { create } from "zustand";
import { EventData, Variant } from "@roo/common";
import { variants } from "../[locale]/(public)/listing/[id]/page";

type EventVariant = "new-event" | "existing-event" | null;

interface OrderStore {
  isOrderModalOpen: boolean;
  currentVariantIndex?: number;
  currentStep: number;
  variants: Variant[];
  eventVariant: EventVariant;
  eventData: (EventData & { id?: string }) | undefined;
  setCurrentVariantIndex: (index: number) => void;
  setCurrentStep: (step: number) => void;
  setEventVariant: (variant: EventVariant) => void;
  setEventData: (eventData: EventData & { id?: string }) => void;
  isOrderStepActivated: (step: number) => boolean;
  resetIndices: () => void;
  clearEventData: () => void;
}

export const useOrderStore = create<OrderStore>((set, get) => {
  return {
    isOrderModalOpen: false,
    currentVariantIndex: undefined,
    currentStep: 1,
    variants: variants,
    eventData: undefined,
    eventVariant: null,
    clearEventData: () =>
      set({
        eventData: undefined,
      }),
    setCurrentVariantIndex: (index: number) =>
      set({ currentVariantIndex: index }),
    setCurrentStep: (step: number) => set({ currentStep: step }),
    setEventData: (eventData: EventData & { id?: string }) =>
      set({ eventData }),
    setEventVariant: (variant: EventVariant) => {
      set({ eventVariant: variant });
      set({ eventData: undefined });
    },

    isOrderStepActivated: (step: number) => {
      const state = get();

      const eventDataExists =
        state.eventData?.name &&
        state.eventData?.date &&
        state.eventData?.location &&
        state.eventData?.guests;
      const variantSelected = state.currentVariantIndex !== undefined;

      switch (step) {
        case 1:
          return true; // Always active
        case 2:
          if (eventDataExists) {
            return true;
          }
          return false;
        case 3:
          if (eventDataExists && variantSelected) {
            return true;
          }
          return false;
      }
      return false;
    },

    resetIndices: () =>
      set({
        currentVariantIndex: undefined,
        currentStep: 1,
        isOrderModalOpen: false,
      }),
  };
});
