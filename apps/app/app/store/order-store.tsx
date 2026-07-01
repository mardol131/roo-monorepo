import { create } from "zustand";
import { Event } from "@roo/common";

type EventVariant = "new-event" | "existing-event" | null;
export type InquiryMode = "variant" | "custom" | null;
export type PricingUnit = "per_day" | "per_person" | "per_hour" | "lump_sum";

export interface CustomRequest {
  note: string;
  requirements: { text: string }[];
}

export interface ServiceTime {
  startTime?: string;
  endTime?: string;
  arrivalTime?: string;
}

export type SelectedAddon = {
  optionId: string;
  name: string;
  pricingUnit: PricingUnit;
  unitPrice: number;
  quantity: number;
};

export type SelectedSpace = {
  spaceId: string;
  name: string;
  price: number;
  pricingUnit: PricingUnit;
};

// Fields that are persisted to localStorage
export interface OrderDraft {
  listingId: string;
  eventVariant: EventVariant;
  eventData?: Event;
  inquiryMode: InquiryMode;
  currentVariantId?: string;
  customRequest?: CustomRequest;
  selectedAddons: SelectedAddon[];
  selectedSpaces: SelectedSpace[];
  accommodation: { guests: number } | null;
  breakfast: { guests: number } | null;
  parking: { spots: number } | null;
  wantsCatering: boolean;
  serviceTime: ServiceTime | null;
  newEventFormValues?: Record<string, unknown>;
  // Wizard step the user was on (distinct from the store's own `currentStep`,
  // which drives an unrelated pre-inquiry CTA flow on the listing page).
  wizardStep?: number;
}

interface OrderStore {
  isOrderModalOpen: boolean;
  listingId?: string;
  currentVariantId?: string;
  currentStep: number;
  eventVariant: EventVariant;
  eventData: Event | undefined;
  inquiryMode: InquiryMode;
  customRequest?: CustomRequest;
  selectedAddons: SelectedAddon[];
  selectedSpaces: SelectedSpace[];
  accommodation: { guests: number } | null;
  breakfast: { guests: number } | null;
  parking: { spots: number } | null;
  wantsCatering: boolean;
  serviceTime: ServiceTime | null;
  setListingId: (id: string) => void;
  setCurrentVariantId: (variantId: string) => void;
  setInquiryMode: (mode: InquiryMode) => void;
  setCurrentStep: (step: number) => void;
  setEventVariant: (variant: EventVariant) => void;
  setEventData: (eventData: Event) => void;
  setCustomRequest: (req: CustomRequest | undefined) => void;
  toggleAddon: (addon: SelectedAddon) => void;
  setAddonQuantity: (optionId: string, quantity: number) => void;
  toggleSpace: (space: SelectedSpace, descendantIdsToRemove?: string[]) => void;
  setAccommodation: (v: { guests: number } | null) => void;
  setBreakfast: (v: { guests: number } | null) => void;
  setParking: (v: { spots: number } | null) => void;
  setWantsCatering: (v: boolean) => void;
  setServiceTime: (v: ServiceTime | null) => void;
  restoreDraft: (draft: OrderDraft) => void;
  isOrderStepActivated: (step: number) => boolean;
  resetIndices: () => void;
  clearEventData: () => void;
}

export const useOrderStore = create<OrderStore>((set, get) => {
  return {
    isOrderModalOpen: false,
    listingId: undefined,
    currentVariantId: undefined,
    currentStep: 1,
    eventData: undefined,
    eventVariant: null,
    inquiryMode: null,
    selectedAddons: [],
    selectedSpaces: [],
    accommodation: null,
    breakfast: null,
    parking: null,
    wantsCatering: false,
    serviceTime: null,
    clearEventData: () => set({ eventData: undefined }),
    setListingId: (id) => set({ listingId: id }),
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
    toggleAddon: (addon) =>
      set((state) => ({
        selectedAddons: state.selectedAddons.some((a) => a.optionId === addon.optionId)
          ? state.selectedAddons.filter((a) => a.optionId !== addon.optionId)
          : [...state.selectedAddons, addon],
      })),
    setAddonQuantity: (optionId, quantity) =>
      set((state) => ({
        selectedAddons: state.selectedAddons.map((a) =>
          a.optionId === optionId ? { ...a, quantity } : a,
        ),
      })),
    toggleSpace: (space, descendantIdsToRemove = []) =>
      set((state) => {
        const isCurrentlySelected = state.selectedSpaces.some(
          (s) => s.spaceId === space.spaceId,
        );
        if (isCurrentlySelected) {
          return {
            selectedSpaces: state.selectedSpaces.filter(
              (s) => s.spaceId !== space.spaceId,
            ),
          };
        }
        // Selecting a space that has descendants means its price now covers
        // them, so any of those descendants that were selected get dropped.
        return {
          selectedSpaces: [
            ...state.selectedSpaces.filter(
              (s) => !descendantIdsToRemove.includes(s.spaceId),
            ),
            space,
          ],
        };
      }),
    setAccommodation: (v) => set({ accommodation: v }),
    setBreakfast: (v) => set({ breakfast: v }),
    setParking: (v) => set({ parking: v }),
    setWantsCatering: (v) => set({ wantsCatering: v }),
    setServiceTime: (v) => set({ serviceTime: v }),
    setEventVariant: (variant: EventVariant) => {
      set({ eventVariant: variant });
      if (variant !== "existing-event") {
        set({ eventData: undefined });
      }
    },

    restoreDraft: (draft) =>
      set({
        listingId: draft.listingId,
        eventVariant: draft.eventVariant,
        eventData: draft.eventData,
        inquiryMode: draft.inquiryMode,
        currentVariantId: draft.currentVariantId,
        customRequest: draft.customRequest,
        selectedAddons: draft.selectedAddons,
        selectedSpaces: draft.selectedSpaces,
        accommodation: draft.accommodation,
        breakfast: draft.breakfast,
        parking: draft.parking,
        wantsCatering: draft.wantsCatering,
        serviceTime: draft.serviceTime,
      }),

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
          if (state.inquiryMode === "variant" && state.currentVariantId !== undefined)
            return true;
          if (state.inquiryMode === "custom" && !!state.customRequest?.note) {
            const st = state.serviceTime;
            return !!(st?.arrivalTime || (st?.startTime && st?.endTime));
          }
          return false;
        case 4:
          return state.currentStep === 4;
      }
      return false;
    },

    resetIndices: () =>
      set({
        listingId: undefined,
        currentVariantId: undefined,
        currentStep: 1,
        isOrderModalOpen: false,
        inquiryMode: null,
        customRequest: undefined,
        selectedAddons: [],
        selectedSpaces: [],
        accommodation: null,
        breakfast: null,
        parking: null,
        wantsCatering: false,
        serviceTime: null,
        eventData: undefined,
        eventVariant: null,
      }),
  };
});
