import { Company, Listing, Variant } from "@roo/common";

export const USER = {
  name: "Jan Novák",
  email: "jan.novak@email.cz",
  initials: "JN",
};

export const COMPANIES: Company[] = [
  {
    id: "1",
    name: "Novák Events s.r.o.",
    ico: "12345678",
    description:
      "Kompletní zajištění cateringu a eventových prostor pro soukromé i firemní akce.",
    email: "info@novakevents.cz",
    phone: "+420 731 123 456",
    website: "https://novakevents.cz",
    city: { id: "loc-1", label: "Praha" },
  },
  {
    id: "2",
    name: "DJ Studio Praha",
    ico: "87654321",
    description: "Profesionální DJ služby na svatby, večírky a firemní akce.",
    email: "booking@djstudiopraha.cz",
    phone: "+420 602 987 654",
    website: "https://djstudiopraha.cz",
    city: { id: "loc-1", label: "Praha" },
  },
  {
    id: "3",
    name: "Foto & Video Novák",
    ico: "11223344",
    description:
      "Fotografické a videografické služby pro svatby a firemní portrétní focení.",
    email: "martin@fotovideanovak.cz",
    phone: "+420 776 456 789",
    city: { id: "loc-2", label: "Brno" },
  },
];

export const LISTINGS: Listing[] = [
  {
    id: "101",
    name: "Gastro catering",
    description:
      "Komplexní cateringové služby pro firemní akce, svatby a soukromé oslavy.",
    city: { id: "loc-1", label: "Praha" },
    priceFrom: 12000,
    priceDuration: "za akci",
    variantsCount: 3,
    rating: 4.8,
    reviewsCount: 24,
  },
  {
    id: "102",
    name: "Místo pro akce",
    description:
      "Pronájem exkluzivního prostoru pro firemní i soukromé události až pro 200 osob.",
    city: { id: "loc-1", label: "Praha" },
    priceFrom: 45000,
    priceDuration: "za den",
    variantsCount: 2,
    rating: 4.6,
    reviewsCount: 11,
  },
];

export const MOCK_VARIANTS: Variant[] = [
  {
    id: "1",
    title: "Základní balíček",
    description: "Ideální pro menší akce a rodinné oslavy.",
    price: 4900,
    duration: "4 hodiny",
    includes: ["Základní vybavení", "Obsluha", "Doprava"],
    excludes: ["Catering", "Dekorace"],
    idealFor: ["Rodinné oslavy", "Narozeniny"],
    images: [],
    availableDate: "1. 5. 2026",
  },
  {
    id: "2",
    title: "Prémiový balíček",
    description: "Kompletní zajištění pro středně velké firemní akce.",
    price: 9900,
    duration: "8 hodin",
    includes: ["Prémiové vybavení", "Obsluha", "Doprava", "Technická podpora"],
    excludes: ["Catering"],
    idealFor: ["Firemní akce", "Konference"],
    images: [],
  },
  {
    id: "3",
    title: "VIP balíček",
    description: "Všechno v jednom pro velké galavečery a svatby.",
    price: 19900,
    duration: "12 hodin",
    includes: ["VIP vybavení", "Obsluha", "Doprava", "Catering", "Dekorace"],
    excludes: [],
    idealFor: ["Svatby", "Galavečery", "Velké firemní akce"],
    images: [],
  },
];
