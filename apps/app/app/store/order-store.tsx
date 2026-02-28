import { off } from "process";
import { create } from "zustand";
import { Offer } from "../(pages)/listing/[id]/components/offer-item";
import { offers } from "../(pages)/listing/[id]/page";
import { EventData } from "@roo/common";

type EventVariant = "new-event" | "existing-event" | null;

interface OrderStore {
  isOrderModalOpen: boolean;
  currentOfferIndex?: number;
  currentStep: number;
  offers: Offer[];
  eventVariant: EventVariant;
  eventData: (EventData & { id?: string }) | undefined;
  setCurrentOfferIndex: (index: number) => void;
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
    currentOfferIndex: undefined,
    currentStep: 1,
    offers: offers,
    eventData: undefined,
    eventVariant: null,
    clearEventData: () =>
      set({
        eventData: undefined,
      }),
    setCurrentOfferIndex: (index: number) => set({ currentOfferIndex: index }),
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
      const offerVariantSelected = state.currentOfferIndex !== undefined;

      switch (step) {
        case 1:
          return true; // Always active
        case 2:
          if (eventDataExists) {
            return true;
          }
          return false;
        case 3:
          if (eventDataExists && offerVariantSelected) {
            return true;
          }
          return false;
      }
      return false;
    },

    resetIndices: () =>
      set({
        currentOfferIndex: undefined,
        currentStep: 1,
        isOrderModalOpen: false,
      }),
  };
});
