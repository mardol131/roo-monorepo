import Image from "next/image";
import Button from "../../../components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";

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

export default function HeroSection({
  items = defaultItems,
  backgroundImage = "/text.jpg",
  className = "",
}: HeroSectionProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16">
      {/* Hlavní heading sekce */}
      <div className="text-center max-w-4xl mx-auto mb-30">
        <Text variant="heading1" className="mb-6">
          Budujeme budoucnost
        </Text>
        <Text variant="heading1" color="primary" className="mb-8">
          s inovativními řešeními
        </Text>
        <Text variant="subheading" className="max-w-2xl mx-auto">
          Přinášíme špičkové technologie a služby, které transformují způsob,
          jakým firmy pracují. Objevte naše produkty a řešení navržená pro vaši
          budoucnost.
        </Text>
      </div>

      {/* Hero karty */}
      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-content w-full ${className}`.trim()}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="relative group overflow-hidden rounded-xl min-h-150"
          >
            {/* Background image */}
            <Image
              src={backgroundImage}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />

            {/* Tmavý overlay */}
            <div className="absolute inset-0 bg-black/50 transition-colors duration-300 group-hover:bg-black/40" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
              <Text variant="heading3" color="light" className="mb-6">
                {item.title}
              </Text>
              <Button
                version="outlined"
                text={item.linkText}
                link={item.linkHref}
                className="border-white text-white hover:bg-white hover:text-black transition-colors"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
