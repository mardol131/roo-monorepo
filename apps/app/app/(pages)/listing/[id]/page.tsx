import {
  AlertCircle,
  Briefcase,
  Flame,
  Refrigerator,
  Tv,
  UtensilsCrossed,
  Wifi,
  Wind,
} from "lucide-react";
import BusinessProfile from "./components/business-profile";
import DescriptionSection from "./components/description-section";
import FAQSection, { FAQ } from "./components/faq-section";
import HeroImageSection from "./components/hero-image-section";
import ItemsSection, { Item } from "./components/items-section";
import { Offer } from "./components/offer-item";
import OffersSection from "./components/offers-section";
import OrderBox from "./components/order-box";
import ReviewsSection, { Review } from "./components/reviews-section";
import SectionWrapper from "./components/section-wrapper";

type Props = {};

const amenities: Item[] = [
  {
    id: "kitchen",
    label: "Kuchyně",
    icon: <UtensilsCrossed className="w-6 h-6" />,
  },
  {
    id: "wifi",
    label: "Wifi",
    icon: <Wifi className="w-6 h-6" />,
  },
  {
    id: "workspace",
    label: "Vyhrazený prostor pro práci",
    icon: <Briefcase className="w-6 h-6" />,
  },

  {
    id: "tv",
    label: "TV",
    icon: <Tv className="w-6 h-6" />,
  },

  {
    id: "fireplace",
    label: "Vnitřní krb",
    icon: <Flame className="w-6 h-6" />,
  },
  {
    id: "hairdryer",
    label: "Fén",
    icon: <Wind className="w-6 h-6" />,
  },
  {
    id: "fridge",
    label: "Lednice",
    icon: <Refrigerator className="w-6 h-6" />,
  },
  {
    id: "detector",
    label: "Detektor oxidu uhelnatého",
    icon: <AlertCircle className="w-6 h-6" />,
  },
];

const reviews: Review[] = [
  {
    id: "1",
    author: "Jana Novotná",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop",
    rating: 5,
    text: "Úžasné místo! Velmi příjemný host, všechno bylo čisté a pohodlné. Rozhodně se vrátím.",
    date: "13. února 2025",
  },
  {
    id: "2",
    author: "Petr Svoboda",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop",
    rating: 4,
    text: "Velmi dobrá lokalita, dobrá komunikace. Malou chybou byla sprcha, která by potřebovala údržbu.",
    date: "10. února 2025",
  },
  {
    id: "3",
    author: "Marie Černá",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop",
    rating: 5,
    text: "Perfektní byt na práci i k odpočinku. Všechny vybavení funguje bezproblémově.",
    date: "5. února 2025",
  },
  {
    id: "4",
    author: "David Kučera",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop",
    rating: 4,
    text: "Dobrý poměr ceny a kvality. Byt je v dobré kondici, trochu hlučnější lokalita.",
    date: "1. února 2025",
  },
  {
    id: "5",
    author: "Eva Horváthová",
    avatar:
      "https://images.unsplash.com/photo-1517721552296-c52646db42da?w=48&h=48&fit=crop",
    rating: 5,
    text: "Hostitel je velmi milý a vstřícný. Všechno bylo dokonalé!",
    date: "28. ledna 2025",
  },
];

const faqs: FAQ[] = [
  {
    question: "Jaké jsou doby nabídky zaměstnavatelství?",
    answer:
      "Ubytování dostupné od 15:00 v den příjezdu a odjezd do 11:00 v den odjezdu. Branu nástupní časy si můžete domluvit přímo s pronajímatelem.",
  },
  {
    question: "Je povoleno přizvat hosty?",
    answer:
      "Ano, můžete pozvat své přátele během dne. Noční hosté nejsou povoleni bez předchozího souhlasu pronajímatele. Prosíme, informujte nás o množství hostů při příjezdu.",
  },
  {
    question: "Jsou domácí mazlíčci povoleni?",
    answer:
      "Ano, domácí mazlíčci jsou povoleni. Prosíme však, aby byli chováni mimo ložnice a aby nevěšeli na nábytek. V případě poškození může být uplatnit poplatek.",
  },
  {
    question: "Jaký je postup při zrušení rezervace?",
    answer:
      "Zrušení lze provést do 7 dnů před příjezdem s plnou refundací. Zrušení do 3 dnů se penalizuje 50% ceny. Zrušení později než 48 hodin před příjezdem není refundováno.",
  },
  {
    question: "Je pronájem vhodný pro delší pobyty?",
    answer:
      "Ano, nabízíme atraktivní sazby pro pobyty delší než 30 dní. Pro více informací se prosím obraťte přímo na pronajímatele nebo si vytvořte osobní nabídku.",
  },
  {
    question: "Co je zahrnuto v ceně?",
    answer:
      "V ceně je zahrnuto vybavení, WiFi, topení, klimatizace a eau. Energie se počítají měsíčně. Parkování v garáži za příplatek 50 Kč za noc.",
  },
];

export const offers: Offer[] = [
  {
    id: "1",
    title: "Pronájem Mlýnice",
    description:
      "Pronajímáme si exkluzivně celý areál Mlýna Davídkova, skvostně situovaný v srdci přírody nedaleko Prahy.",
    price: 45000,
    duration: "za den",
    images: [
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1543269865-cbdf26cecbb2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
    ],
    includes: [
      "Pronájem místnosti s balkonem 20 m²",
      "Pronájem hlavní místnosti 32 m² s přístupem do zahrady",
      "Personál v areálu",
      "Parkování zdarma",
    ],
    excludes: [
      "Stravování (mimo 0,5 m)",
      "Lístkování není součástí",
      "Vlastní alkohol není povolen",
    ],
    idealFor: [
      "Branda",
      "Narozeniny",
      "Firemní akce",
      "Svatba",
      "Teambulding",
      "Petr",
      "svetr",
    ],
    availableDate: "10.9.2025",
  },
  {
    id: "2",
    title: "Pronájem prostor - Mini balíček",
    description:
      "Menší prostor ideální pro intimate akce a soukromé setkání s přáteli a rodinou.",
    price: 15000,
    duration: "za den",
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1527576539890-dfa540c45b6d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=600&fit=crop",
    ],
    includes: [
      "Prostory pro až 30 osob",
      "Základní vybavení - stoly, židle",
      "Přístup k sociálním zařízením",
      "WiFi",
    ],
    excludes: [
      "Katering není zahrnut",
      "Pronájem techniky na vrub",
      "Ubytování není zahrnuto",
    ],
    idealFor: ["Narozeniny", "Oslava", "Schůzka"],
    availableDate: "15.9.2025",
  },
  {
    id: "3",
    title: "Pronájem prostor - Premium balíček",
    description:
      "Kompletní pronájem s technickým vybavením a možností catering v našem vlastním bistru.",
    price: 35000,
    duration: "za den",
    images: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1478655096635-cccbcbcbccc?w=800&h=600&fit=crop",
    ],
    includes: [
      "Všechny prostory v objektu",
      "Projektor a zvukový systém",
      "Příprava prostorů",
      "Konzultace s event managerem",
      "Možnost catering",
    ],
    excludes: ["Ubytování mimo areál", "Vlastní dekorace nejsou povoleny"],
    idealFor: ["Korporátní akce", "Konference", "Školení", "Firemní akce"],
    availableDate: "22.9.2025",
  },
];

export default function page({}: Props) {
  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full flex flex-col max-w-listing-page pb-20">
        <HeroImageSection />
        <div className="grid grid-cols-[1fr_400px] gap-6 mt-10">
          <div className="min-h-screen flex flex-col w-full gap-15">
            <SectionWrapper>
              <DescriptionSection />
            </SectionWrapper>
            <SectionWrapper>
              <ItemsSection
                title="Co toto ubytování nabízí"
                items={amenities}
                displayCount={6}
                buttonText={`Ukázat všech ${amenities.length} položek vybavení`}
                columns={2}
              />
            </SectionWrapper>
            <SectionWrapper>
              <ItemsSection
                title="Co toto ubytování nabízí"
                items={amenities}
                displayCount={6}
                buttonText={`Ukázat všech ${amenities.length} položek vybavení`}
                columns={2}
              />
            </SectionWrapper>
            <SectionWrapper>
              <ItemsSection
                title="Co toto ubytování nabízí"
                items={amenities}
                displayCount={6}
                buttonText={`Ukázat všech ${amenities.length} položek vybavení`}
                columns={2}
              />
            </SectionWrapper>
            <SectionWrapper>
              <BusinessProfile
                name="Pronájem bytů s.r.o."
                avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
                listingsCount={24}
              />
            </SectionWrapper>
            <SectionWrapper>
              <ReviewsSection reviews={reviews} displayCount={3} />
            </SectionWrapper>
            <SectionWrapper>
              <FAQSection faqs={faqs} />
            </SectionWrapper>
          </div>
          <div>
            <OrderBox />
          </div>
        </div>
        <div className="mt-10">
          <OffersSection offers={offers} />
        </div>
      </div>
    </div>
  );
}
