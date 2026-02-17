import LandingSectionWrapper from "@/app/components/ui/sections/landing-section-wrapper";
import HeroSection from "./components/hero-section";
import Catalog from "./components/catalog";
import Image from "next/image";
import Text from "@/app/components/ui/atoms/text";
import ListingTypeBanner from "./components/listing-type-banner";
import Banner from "@/app/components/ui/molecules/banner";
import CardsSection from "./components/cards-section";
import BubbleMasonrySection from "./components/bubble-masonry-section";

type Props = {};

export default function page({}: Props) {
  return (
    <div className="min-h-screen flex flex-col gap-20 mb-30">
      <div
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          objectFit: "cover",
        }}
        className="-mt-20 -mb-30"
      >
        <HeroSection />
      </div>
      <LandingSectionWrapper>
        <div className="grid grid-cols-3 max-md:flex flex-col gap-10">
          <ListingTypeBanner
            imageUrl="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"
            title="Místa"
            text="Objevuj zajímavá místa a lokace pro své zážitky"
            link="/mista"
          />
          <ListingTypeBanner
            imageUrl="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"
            title="Gastro"
            text="Objevuj nejlepší gastronomické zážitky ve tvém okolí"
            link="/gastro"
          />
          <ListingTypeBanner
            imageUrl="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"
            title="Zábava"
            text="Najdi zábavné aktivity a události pro volný čas"
            link="/zabava"
          />
        </div>
      </LandingSectionWrapper>
      <LandingSectionWrapper>
        <div className="flex flex-col gap-5">
          <CardsSection />
          <CardsSection />
          <CardsSection />
          <BubbleMasonrySection />
          <CardsSection />
          <CardsSection />
          <CardsSection />
        </div>
      </LandingSectionWrapper>
      <LandingSectionWrapper>
        <Banner
          image="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"
          title="Speciální nabídka"
          text="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor dolorum sapiente natus voluptatibus sed temporibus soluta consequuntur quibusdam ex aut officia, accusamus reiciendis doloremque quae autem nam impedit excepturi possimus."
          buttonText="Zjistit více"
          link="/special-offers"
        />
      </LandingSectionWrapper>
    </div>
  );
}
