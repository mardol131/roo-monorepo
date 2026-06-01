import React from "react";
import Image from "next/image";
import Text from "@/app/components/ui/atoms/text";
import { IntlLink, Link } from "@/app/i18n/navigation";
import HomepageSectionHeader from "./homepage-section-header";
import HomepageSectionHeading from "./homepage-section-heading";

type Props = {
  title: string;
  subtitle: string;
};

type Bubble = {
  id: number;
  title: string;
  subtitle: string;
  backgroundImage: string;
  link: IntlLink;
};

const bubbles: Bubble[] = [
  {
    id: 1,
    title: "Hudební festivaly",
    subtitle: "Nejlepší hudební festivaly v okolí",
    backgroundImage:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80",
    link: {
      pathname: "/catalog/entertainment",
    },
  },
  {
    id: 2,
    title: "Divadelní představení",
    subtitle: "Nejlepší divadelní představení pro váš event",
    backgroundImage:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    link: {
      pathname: "/catalog/entertainment",
    },
  },
  {
    id: 3,
    title: "Stand-up comedy",
    subtitle: "Nejlepší stand-up comedy show pro zábavu vašich hostů",
    backgroundImage:
      "https://images.unsplash.com/photo-1470229722913-7f419344ca51?auto=format&fit=crop&w=600&q=80",
    link: {
      pathname: "/catalog/entertainment",
    },
  },
  {
    id: 4,
    title: "Sportovní akce",
    subtitle: "Nejlepší sportovní akce pro aktivní zábavu vašich hostů",
    backgroundImage:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
    link: {
      pathname: "/catalog/entertainment",
    },
  },
];

export default function BubbleMasonrySection({ title, subtitle }: Props) {
  return (
    <div className="w-full py-4">
      <HomepageSectionHeading heading={title} subheading={subtitle} />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
        <MasonryCard
          bubble={bubbles[0]}
          className="col-span-3 max-md:col-span-5"
        />
        <MasonryCard
          bubble={bubbles[1]}
          className="col-span-2 max-md:col-span-5"
        />
        <MasonryCard
          bubble={bubbles[2]}
          className="col-span-2 max-md:col-span-5"
        />
        <MasonryCard
          bubble={bubbles[3]}
          className="col-span-3 max-md:col-span-5"
        />
      </div>
    </div>
  );
}

function MasonryCard({
  bubble,
  className,
}: {
  bubble: (typeof bubbles)[number];
  className?: string;
}) {
  return (
    <Link
      href={bubble.link}
      className={`group relative h-100 rounded-3xl overflow-hidden ${className}`}
    >
      <div>
        <Image
          src={bubble.backgroundImage}
          alt={bubble.title}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
        <div className="absolute inset-0 flex flex-col items-start justify-end p-8">
          <Text variant="display-xl" color="white">
            {bubble.title}
          </Text>
          <Text variant="body-lg" color="white" className="opacity-85 mt-1">
            {bubble.subtitle}
          </Text>
        </div>
      </div>
    </Link>
  );
}
