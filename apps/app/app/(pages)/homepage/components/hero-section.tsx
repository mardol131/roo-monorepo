import Image from "next/image";
import Button from "../../../components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import EventFilters from "./event-filters";

type HeroItem = {
  id: string;
  title: string;
  linkText: string;
  linkHref: string;
};

interface HeroSectionProps {
  items?: HeroItem[];
  backgroundImage?: string;
  className?: string;
}

const defaultItems: HeroItem[] = [
  {
    id: "produkty",
    title: "Naše produkty",
    linkText: "Zjistit více",
    linkHref: "/produkty",
  },
  {
    id: "reseni",
    title: "Inovativní řešení",
    linkText: "Prozkoumat",
    linkHref: "/reseni",
  },
  {
    id: "sluzby",
    title: "Profesionální služby",
    linkText: "Kontaktovat",
    linkHref: "/kontakt",
  },
];

export default function HeroSection({}: HeroSectionProps) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-linear-0 from-white to-white/75 py-50 px-4 -mt-20">
      <div className="max-w-content w-full text-center">
        <Text variant="title2" as="h1" className="mb-6">
          Naplánujte celý event
        </Text>
        <Text variant="title2" color="primary" className="mb-8">
          Vše z jednoho místa
        </Text>
        <div className="max-w-200 mx-auto">
          <Text variant="subheading0" color="dark">
            S námi dokážete naplánovat celý event během pár minut. Od výběru
            místa, přes catering až po zábavu. Zajišťujeme komunikaci s
            dodavateli a koordinaci jejich služeb, abyste nemuseli řešit detaily
            sami.
          </Text>
        </div>
        <Button text="Přejít do katalogu" size="2xl" className="mt-10" />
      </div>
    </div>
  );
}
