import { off } from "process";
import { create } from "zustand";
import { Offer } from "../(pages)/listing/[id]/components/offer-item";
import { offers } from "../(pages)/listing/[id]/page";

type EventVariant = "new-event" | "existing-event" | null;

type EventData = {
  eventId?: string;
  name?: string;
  date?: {
    start: Date;
    end: Date;
  };
  location?: string;
  peopleCount?: {
    adult: number;
    child: number;
    ztp: number;
    pets: boolean;
  };
};

interface OrderStore {
  isOrderModalOpen: boolean;
  currentOfferIndex: number;
  currentImageIndex: number;
  currentStep: number;
  offers: Offer[];
  eventVariant: EventVariant;
  eventData: EventData;
  setCurrentOfferIndex: (index: number) => void;
  setCurrentImageIndex: (index: number) => void;
  setCurrentStep: (step: number) => void;
  setEventVariant: (variant: EventVariant) => void;
  setEventData: (eventData: EventData) => void;
  goToPreviousOffer: () => void;
  goToNextOffer: () => void;
  goToPreviousImage: () => void;
  goToNextImage: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  openOrderModal: (offerId?: string, step?: number) => void;
  closeOrderModal: () => void;
  resetIndices: () => void;
  clearEventData: () => void;
}

export const useOrderStore = create<OrderStore>((set, get) => {
  return {
    isOrderModalOpen: false,
    currentOfferIndex: 0,
    currentImageIndex: 0,
    currentStep: 1,
    offers: offers,
    eventData: {},
    eventVariant: null,
    clearEventData: () => set({ eventData: {} }),
    setCurrentOfferIndex: (index: number) =>
      set({ currentOfferIndex: index, currentImageIndex: 0 }),
    setCurrentImageIndex: (index: number) => set({ currentImageIndex: index }),
    setCurrentStep: (step: number) => set({ currentStep: step }),
    setEventData: (eventData: EventData) => set({ eventData }),
    setEventVariant: (variant: EventVariant) => set({ eventVariant: variant }),
    goToPreviousOffer: () => {
      const state = get();
      const newIndex =
        state.currentOfferIndex === 0
          ? state.offers.length - 1
          : state.currentOfferIndex - 1;
      set({ currentOfferIndex: newIndex, currentImageIndex: 0 });
    },
    goToNextOffer: () => {
      const state = get();
      const newIndex =
        state.currentOfferIndex === state.offers.length - 1
          ? 0
          : state.currentOfferIndex + 1;
      set({ currentOfferIndex: newIndex, currentImageIndex: 0 });
    },
    goToPreviousImage: () => {
      const state = get();
      const offer = state.offers[state.currentOfferIndex];
      const newIndex =
        state.currentImageIndex === 0
          ? offer.images.length - 1
          : state.currentImageIndex - 1;
      set({ currentImageIndex: newIndex });
    },
    goToNextImage: () => {
      const state = get();
      const offer = state.offers[state.currentOfferIndex];
      const newIndex =
        state.currentImageIndex === offer.images.length - 1
          ? 0
          : state.currentImageIndex + 1;
      set({ currentImageIndex: newIndex });
    },
    goToNextStep: () => {
      const state = get();
      if (state.currentStep < 3) {
        set({ currentStep: state.currentStep + 1 });
      }
    },
    goToPreviousStep: () => {
      const state = get();
      if (state.currentStep > 1) {
        set({ currentStep: state.currentStep - 1 });
      }
    },
    openOrderModal: (offerId?: string, step?: number) => {
      const offerIndex = offerId
        ? offers.findIndex((o) => o.id === offerId)
        : 0;

      set({
        currentOfferIndex: offerIndex >= 0 ? offerIndex : 0,
        currentImageIndex: 0,
        currentStep: step || 1,
        isOrderModalOpen: true,
      });
    },
    closeOrderModal: () => set({ isOrderModalOpen: false }),
    resetIndices: () =>
      set({
        currentOfferIndex: 0,
        currentImageIndex: 0,
        currentStep: 1,
        isOrderModalOpen: false,
      }),
  };
});
