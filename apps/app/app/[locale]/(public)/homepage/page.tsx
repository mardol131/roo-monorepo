import { HomepageSectionWrapper } from "@/app/components/ui/sections/landing-section-wrapper";
import HeroSection from "./components/hero-section";
import ListingTypeBanner from "./components/listing-type-banner";
import Banner from "@/app/components/ui/molecules/banner";
import CardsSection, { CardItem } from "./components/cards-section";
import BubbleMasonrySection from "./components/bubble-masonry-section";
import HowItWorksSection from "./components/how-it-works-section";
import FilterTagsSection from "./components/filter-tags-section";
import StatsSection from "./components/stats-section";
import { getTranslations } from "next-intl/server";

type Props = {};

const mockVenue: CardItem[] = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80",
    title: "Kongresové centrum Praha",
    price: 15000,
    id: "1",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=80",
    title: "Venkovní areál Černošice",
    price: 8500,
    id: "2",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=400&q=80",
    title: "Historický sál Brno",
    price: 12000,
    id: "3",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=400&q=80",
    title: "Loftový prostor Holešovice",
    price: 9800,
    id: "4",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
    title: "Moderní konferenční sál",
    price: 7200,
    id: "5",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80",
    title: "Zahradní vila s terasou",
    price: 11500,
    id: "6",
  },
];

const mockGastro: CardItem[] = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80",
    title: "Novák Catering Praha",
    price: 4900,
    id: "7",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80",
    title: "Labužník s.r.o.",
    price: 3500,
    id: "8",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=400&q=80",
    title: "Fine Dining Events",
    price: 6200,
    id: "9",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    title: "Street Food Catering",
    price: 2800,
    id: "10",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1530062845289-9109b2c9c868?auto=format&fit=crop&w=400&q=80",
    title: "Pivní festival servis",
    price: 3200,
    id: "11",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3b19?auto=format&fit=crop&w=400&q=80",
    title: "Sushi & Asian Catering",
    price: 5500,
    id: "12",
  },
];

const mockEntertainment: CardItem[] = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1470229722913-7f419344ca51?auto=format&fit=crop&w=400&q=80",
    title: "DJ Studio Praha",
    price: 7900,
    id: "13",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1501612780289-11201ef255cb?auto=format&fit=crop&w=400&q=80",
    title: "Live Band Brno",
    price: 12000,
    id: "14",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80",
    title: "Taneční show company",
    price: 9500,
    id: "15",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=400&q=80",
    title: "Jazz Quartet",
    price: 8400,
    id: "16",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=400&q=80",
    title: "Stand-up comedy show",
    price: 6800,
    id: "17",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80",
    title: "Klasický kvartet",
    price: 11000,
    id: "18",
  },
];

export async function generateMetadata() {
  const t = await getTranslations("pages.homepage.metadata");
  return {
    title: t("title"), // výsledek: "Název stránky | AppName"
  };
}

export default function page({}: Props) {
  return (
    <div className="min-h-screen flex flex-col gap-20 mb-30">
      <div
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        className="-mb-30"
      >
        <HeroSection />
      </div>
      <HomepageSectionWrapper>
        <div className="grid grid-cols-3 max-md:flex flex-col gap-6">
          <ListingTypeBanner
            imageUrl="https://images.unsplash.com/photo-1519167758481-83f550bb49b3"
            title="Místa"
            text="Sály, areály a prostory pro každou akci"
            link={{ pathname: "/catalog/venue" }}
          />
          <ListingTypeBanner
            imageUrl="https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
            title="Gastro"
            text="Catering a gastronomické zážitky na míru"
            link={{ pathname: "/catalog/gastro" }}
          />
          <ListingTypeBanner
            imageUrl="https://images.unsplash.com/photo-1470229722913-7f419344ca51"
            title="Zábava"
            text="Hudba, show a entertainment pro hosty"
            link={{ pathname: "/catalog/entertainment" }}
          />
        </div>
      </HomepageSectionWrapper>
      <HomepageSectionWrapper>
        <StatsSection />
      </HomepageSectionWrapper>
      <HomepageSectionWrapper>
        <HowItWorksSection />
      </HomepageSectionWrapper>
      <HomepageSectionWrapper>
        <div className="flex flex-col gap-14">
          <CardsSection
            title="Populární místa"
            subtitle="Sály a prostory nejčastěji vybírané pořadateli"
            listings={mockVenue}
          />
          <CardsSection
            title="Gastro a catering"
            subtitle="Dodavatelé jídla a pití pro vaši akci"
            listings={mockGastro}
          />
          <CardsSection
            title="Zábava a entertainment"
            subtitle="Hudební a zábavní produkce pro každý event"
            listings={mockEntertainment}
          />
          <BubbleMasonrySection
            title="Kategorie zážitků"
            subtitle="Procházej akce podle svých zájmů"
          />
        </div>
      </HomepageSectionWrapper>{" "}
      <HomepageSectionWrapper>
        <FilterTagsSection />
      </HomepageSectionWrapper>
      <HomepageSectionWrapper>
        <Banner
          image="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
          title="Speciální nabídka"
          text="Naplánujte celý event z jednoho místa. Místo, catering i zábava — vše jednoduše a rychle."
          buttonText="Zjistit více"
          link="/catalog"
        />
      </HomepageSectionWrapper>
    </div>
  );
}
