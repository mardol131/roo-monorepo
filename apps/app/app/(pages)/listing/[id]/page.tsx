import Text from "@/app/components/ui/atoms/text";
import Image from "next/image";
import React from "react";
import HeroImageSection from "./components/hero-image-section";
import Button from "@/app/components/ui/atoms/button";
import { FaQuestion, FaStar } from "react-icons/fa";
import OrderBox from "./components/order-box";
import DescriptionSection from "./components/description-section";
import ItemsSection, { Item } from "./components/items-section";
import BusinessProfile from "./components/business-profile";
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

export default function page({}: Props) {
  return (
    <div className="flex justify-center w-full px-6">
      <div className="w-full flex flex-col max-w-listing-page min-h-screen">
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
              <BusinessProfile
                name="Pronájem bytů s.r.o."
                avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
                listingsCount={24}
              />
            </SectionWrapper>
            <SectionWrapper>Zde bude sekce</SectionWrapper>
          </div>
          <div>
            <OrderBox />
          </div>
        </div>
      </div>
    </div>
  );
}
