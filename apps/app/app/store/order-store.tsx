import { create } from "zustand";
import { Event } from "@roo/common";

type EventVariant = "new-event" | "existing-event" | null;
export type InquiryMode = "variant" | "custom" | null;

export interface CustomRequest {
  note: string;
  requirements: { text: string }[];
}

interface OrderStore {
  isOrderModalOpen: boolean;
  currentVariantId?: string;
  currentStep: number;
  eventVariant: EventVariant;
  eventData: Event | undefined;
  inquiryMode: InquiryMode;
  customRequest?: CustomRequest;
  setCurrentVariantId: (variantId: string) => void;
  setInquiryMode: (mode: InquiryMode) => void;
  setCurrentStep: (step: number) => void;
  setEventVariant: (variant: EventVariant) => void;
  setEventData: (eventData: Event) => void;
  setCustomRequest: (req: CustomRequest | undefined) => void;
  isOrderStepActivated: (step: number) => boolean;
  resetIndices: () => void;
  clearEventData: () => void;
}

export const useOrderStore = create<OrderStore>((set, get) => {
  return {
    isOrderModalOpen: false,
    currentVariantId: undefined,
    currentStep: 1,
    eventData: undefined,
    eventVariant: null,
    inquiryMode: null,
    clearEventData: () => set({ eventData: undefined }),
    setCurrentVariantId: (variantId: string) =>
      set({
        currentVariantId: variantId,
        inquiryMode: "variant",
        customRequest: undefined,
      }),
    setInquiryMode: (mode) =>
      set(
        mode === "custom"
          ? { inquiryMode: "custom", currentVariantId: undefined }
          : { inquiryMode: mode },
      ),
    setCurrentStep: (step: number) => set({ currentStep: step }),
    setEventData: (eventData: Event) => set({ eventData }),
    setCustomRequest: (req) => set({ customRequest: req }),
    setEventVariant: (variant: EventVariant) => {
      set({ eventVariant: variant });
      if (variant !== "existing-event") {
        set({ eventData: undefined });
      }
    },

    isOrderStepActivated: (step: number) => {
      const state = get();

      const eventDataExists =
        state.eventData?.name &&
        state.eventData?.date &&
        state.eventData?.location &&
        state.eventData?.guests;

      switch (step) {
        case 1:
          return true;
        case 2:
          return !!eventDataExists;
        case 3:
          if (!eventDataExists) return false;
          if (
            state.inquiryMode === "variant" &&
            state.currentVariantId !== undefined
          )
            return true;
          if (state.inquiryMode === "custom" && !!state.customRequest?.note)
            return true;
          return false;
        case 4:
          return state.currentStep === 4;
      }
      return false;
    },

    resetIndices: () =>
      set({
        currentVariantId: undefined,
        currentStep: 1,
        isOrderModalOpen: false,
        inquiryMode: null,
        customRequest: undefined,
        eventData: undefined,
        eventVariant: null,
      }),
  };
});
