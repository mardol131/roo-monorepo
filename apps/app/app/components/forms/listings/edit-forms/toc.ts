import {
  TocGroup,
  TocSection,
} from "@/app/[locale]/(user)/components/form-toc";

export function useListingEditFormToc() {
  const LISTING_FORM_TOCS: {
    basic: TocSection;
    price: TocSection;
    images: TocSection;
    servicableArea: TocSection;
    eventTypes: TocSection;
    entertainmentTypes: TocSection;
    capacity: TocSection;
    audience: TocSection;
    logistics: TocSection;
    faq: TocSection;
    employees: TocSection;
    personnel: TocSection;
    activities: TocSection;
    services: TocSection;
    technologies: TocSection;
    necessities: TocSection;
    rules: TocSection;
    references: TocSection;
    location: TocSection;
    cuisines: TocSection;
    dishTypes: TocSection;
    dietaryOptions: TocSection;
    gastroRules: TocSection;
    foodPreparationStyles: TocSection;
    alcohol: TocSection;
    guests: TocSection;
    setupAndTearDown: TocSection;
    placeTypes: TocSection;
    amenities: TocSection;
    technology: TocSection;
    storage: TocSection;
    access: TocSection;
    parking: TocSection;
    breakfast: TocSection;
    catering: TocSection;
  } & { seasonalPrices: TocSection } = {
    basic: {
      id: "section-basic",
      title: "Základní informace",
      icon: "Building2",
    },
    setupAndTearDown: {
      id: "section-setupAndTearDown",
      title: "Příprava a úklid",
      icon: "Clock",
    },
    alcohol: {
      id: "section-alcohol",
      title: "Alkohol",
      icon: "Wine",
    },
    guests: {
      id: "section-guests",
      title: "Hosté",
      icon: "Users",
    },
    price: { id: "section-price", title: "Cena", icon: "Banknote" },
    images: {
      id: "section-images",
      title: "Obrázky",
      icon: "Image",
      subTitle: "Podporované formáty: jpg, png, webp",
    },
    servicableArea: {
      id: "section-servicableArea",
      title: "Místo působení",
      icon: "MapPin",
      subTitle:
        "Vyberte kraje, okresy a města, kde zábava působí. Pokud chcete vybrat nějaký okres, musí spadat do vybraného kraje. Pokud nějaké město, musí spadat do vybraného okresu.",
    },
    entertainmentTypes: {
      id: "section-entertainment-types",
      title: "Typy zábavy",
      icon: "Trophy",
    },
    eventTypes: {
      id: "section-event-types",
      title: "Typy akcí",
      icon: "Calendar",
    },
    capacity: { id: "section-capacity", title: "Kapacita", icon: "Users" },
    audience: { id: "section-audience", title: "Publikum", icon: "UserCheck" },
    logistics: { id: "section-logistics", title: "Logistika", icon: "Clock" },
    faq: { id: "section-faq", title: "FAQ", icon: "CircleHelp" },
    employees: { id: "section-employees", title: "Zaměstnanci", icon: "Users" },
    personnel: {
      id: "section-personnel",
      title: "Personál",
      icon: "UserCheck",
    },
    activities: {
      id: "section-activities",
      title: "Aktivity",
      icon: "Activity",
    },
    services: {
      id: "section-services",
      title: "Služby",
      icon: "Rainbow",
    },
    technologies: {
      id: "section-technologies",
      title: "Technológie",
      icon: "Computer",
    },
    necessities: {
      id: "section-necessities",
      title: "Provozní požadavky",
      icon: "Package",
    },
    rules: { id: "section-rules", title: "Pravidla", icon: "ScrollText" },
    references: {
      id: "section-references",
      title: "Reference",
      icon: "BookOpen",
    },
    location: {
      id: "section-location",
      title: "Základna",
      icon: "Home",
      subTitle:
        "Přesná adresa, ze které vyjíždíte. Slouží k výpočtu cestovního poplatku.",
    },

    cuisines: { id: "section-cuisines", title: "Kuchyně", icon: "ChefHat" },
    dishTypes: { id: "section-offer", title: "Typy pokrmů", icon: "Utensils" },
    dietaryOptions: {
      id: "section-extras",
      title: "Dietní možnosti",
      icon: "Star",
    },

    gastroRules: {
      id: "section-gastro-rules",
      title: "Pravidla pro jídlo a pití",
      icon: "Coffee",
    },
    foodPreparationStyles: {
      id: "section-food-preparation-styles",
      title: "Způsoby přípravy jídla",
      icon: "CookingPot",
    },
    placeTypes: {
      id: "section-place-types",
      title: "Typ místa",
      icon: "Building2",
    },
    amenities: { id: "section-amenities", title: "Vybavení", icon: "Package" },
    technology: {
      id: "section-technology",
      title: "Technologie",
      icon: "Monitor",
    },
    storage: { id: "section-storage", title: "Skladování", icon: "Warehouse" },
    access: {
      id: "section-access",
      title: "Přístup a zásobování",
      icon: "Truck",
    },
    parking: {
      id: "section-parking",
      title: "Parkování",
      icon: "ParkingSquare",
    },
    breakfast: { id: "section-breakfast", title: "Snídaně", icon: "Coffee" },
    catering: { id: "section-catering", title: "Catering", icon: "UtensilsCrossed" },
    seasonalPrices: {
      id: "section-seasonal-prices",
      title: "Sezonní ceny",
      icon: "CalendarDays",
    },
  };

  const BASE_TOC_GROUP: readonly TocGroup[] = [
    {
      label: "Základní",
      sections: [LISTING_FORM_TOCS.basic, LISTING_FORM_TOCS.images],
    },
    { label: "Kategorizace", sections: [LISTING_FORM_TOCS.eventTypes] },
  ];

  const FULL_PRICE_TOC_GROUP: readonly TocGroup[] = [
    {
      label: "Cena",
      sections: [LISTING_FORM_TOCS.price, LISTING_FORM_TOCS.seasonalPrices],
    },
  ];

  const SIMPLE_PRICE_TOC_GROUP: readonly TocGroup[] = [
    {
      label: "Cena",
      sections: [LISTING_FORM_TOCS.price, LISTING_FORM_TOCS.seasonalPrices],
    },
  ];

  const FULL_LOCALITY_GROUPS: readonly TocGroup[] = [
    {
      label: "Lokalita",
      sections: [LISTING_FORM_TOCS.servicableArea, LISTING_FORM_TOCS.location],
    },
  ];

  const SIMPLE_LOCALITY_GROUPS: readonly TocGroup[] = [
    {
      label: "Lokalita",
      sections: [LISTING_FORM_TOCS.location],
    },
  ];

  return {
    LISTING_FORM_TOCS,
    BASE_TOC_GROUP,
    FULL_PRICE_TOC_GROUP,
    SIMPLE_PRICE_TOC_GROUP,
    FULL_LOCALITY_GROUPS,
    SIMPLE_LOCALITY_GROUPS,
  };
}
