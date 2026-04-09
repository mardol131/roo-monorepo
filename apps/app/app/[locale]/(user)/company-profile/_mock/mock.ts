import {
  Company,
  VenueListing,
  VenueVariant,
  User,
  GastroListing,
  EntertainmentListing,
} from "@roo/common";

export const USER: User = {
  id: "user-1",
  updatedAt: "2025-01-01T00:00:00.000Z",
  createdAt: "2025-01-01T00:00:00.000Z",
  firstName: "Jan",
  lastName: "Novák",
  email: "jan.novak@email.cz",
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
    owner: "user-1",
    updatedAt: "2025-01-01T00:00:00.000Z",
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "DJ Studio Praha",
    ico: "87654321",
    description: "Profesionální DJ služby na svatby, večírky a firemní akce.",
    email: "booking@djstudiopraha.cz",
    phone: "+420 602 987 654",
    website: "https://djstudiopraha.cz",
    owner: "user-1",
    updatedAt: "2025-01-01T00:00:00.000Z",
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Foto & Video Novák",
    ico: "11223344",
    description:
      "Fotografické a videografické služby pro svatby a firemní portrétní focení.",
    email: "martin@fotovideanovak.cz",
    phone: "+420 776 456 789",
    owner: "user-1",
    updatedAt: "2025-01-01T00:00:00.000Z",
    createdAt: "2025-01-01T00:00:00.000Z",
  },
];

export const LISTINGS: (VenueListing | GastroListing | EntertainmentListing)[] =
  [
    {
      id: "101",
      name: "Gastro catering",
      slug: "gastro-catering",
      company: "1",
      description:
        "Komplexní cateringové služby pro firemní akce, svatby a soukromé oslavy.",
      location: {
        address: "Václavské náměstí 1",
        city: "loc-1",
      },
      status: "active",
      price: { generalPrice: 4900 },
      capacity: 200,
      area: 500,
      images: { coverImage: "img-101" },
      updatedAt: "2025-01-01T00:00:00.000Z",
      createdAt: "2025-01-01T00:00:00.000Z",
    },
    {
      id: "102",
      name: "Místo pro akce",
      slug: "misto-pro-akce",
      company: "1",
      description:
        "Pronájem exkluzivního prostoru pro firemní i soukromé události až pro 200 osob.",
      location: {
        address: "Náměstí Míru 5",
        city: "loc-1",
      },
      status: "draft",
      price: { generalPrice: 9900 },
      capacity: 200,
      area: 800,
      images: { coverImage: "img-102" },
      updatedAt: "2025-01-01T00:00:00.000Z",
      createdAt: "2025-01-01T00:00:00.000Z",
    },
  ];

export const MOCK_VARIANTS: VenueVariant[] = [
  {
    id: "1",
    name: "Základní balíček",
    shortDescription: "Ideální pro menší akce a rodinné oslavy.",
    availability: "selectedHours",
    selectedHours: { from: "00:00", to: "04:00" },
    price: { generalPrice: 4900 },
    includes: [
      { item: "Základní vybavení", id: "inc-1" },
      { item: "Obsluha", id: "inc-2" },
      { item: "Doprava", id: "inc-3" },
    ],
    excludes: [
      { item: "Catering", id: "exc-1" },
      { item: "Dekorace", id: "exc-2" },
    ],

    images: { mainImage: "img-var-1" },
    updatedAt: "2025-01-01T00:00:00.000Z",
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Prémiový balíček",
    shortDescription: "Kompletní zajištění pro středně velké firemní akce.",
    availability: "selectedHours",
    selectedHours: { from: "00:00", to: "08:00" },
    price: { generalPrice: 9900 },
    includes: [
      { item: "Prémiové vybavení", id: "inc-1" },
      { item: "Obsluha", id: "inc-2" },
      { item: "Doprava", id: "inc-3" },
      { item: "Technická podpora", id: "inc-4" },
    ],
    excludes: [{ item: "Catering", id: "exc-1" }],
    images: { mainImage: "img-var-2" },
    updatedAt: "2025-01-01T00:00:00.000Z",
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    name: "VIP balíček",
    shortDescription: "Všechno v jednom pro velké galavečery a svatby.",
    availability: "allDay",
    price: { generalPrice: 19900 },
    includes: [
      { item: "VIP vybavení", id: "inc-1" },
      { item: "Obsluha", id: "inc-2" },
      { item: "Doprava", id: "inc-3" },
      { item: "Catering", id: "inc-4" },
      { item: "Dekorace", id: "inc-5" },
    ],
    images: { mainImage: "img-var-3" },
    updatedAt: "2025-01-01T00:00:00.000Z",
    createdAt: "2025-01-01T00:00:00.000Z",
  },
];
