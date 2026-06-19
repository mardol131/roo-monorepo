import { TocSection } from "@/app/[locale]/(user)/components/form-toc";

export function useVariantEditTocData() {
  const S = {
    basic: { id: "vs-basic", title: "Základní informace", icon: "Building2" },
    images: { id: "vs-images", title: "Obrázky", icon: "Image" },
    includesExcludes: {
      id: "vs-includes",
      title: "Zahrnuto / Nezahrnuto",
      icon: "ListChecks",
    },
    price: { id: "vs-price", title: "Základní cena", icon: "Banknote" },
    seasonalPrices: {
      id: "vs-seasonal-prices",
      title: "Sezónní ceny",
      icon: "CalendarRange",
    },
    capacity: { id: "vs-capacity", title: "Kapacita", icon: "Users" },
    spaces: { id: "vs-spaces", title: "Prostory", icon: "LayoutDashboard" },
    accommodation: {
      id: "vs-accommodation",
      title: "Ubytování",
      icon: "BedDouble",
    },
    breakfast: { id: "vs-breakfast", title: "Snídaně", icon: "Coffee" },
    extras: { id: "vg-extras", title: "Doplňky", icon: "Plus" },
    audience: { id: "ve-audience", title: "Publikum", icon: "Users" },
    performance: { id: "ve-performance", title: "Vystoupení", icon: "Mic" },
    duration: { id: "vs-duration", title: "Délka", icon: "Timer" },
  } satisfies Record<string, TocSection>;

  return S;
}
