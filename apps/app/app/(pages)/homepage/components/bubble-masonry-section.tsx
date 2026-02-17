import React from "react";
import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";

type Props = {};

const bubbles = [
  {
    id: 1,
    title: "Hudební festivaly",
    backgroundImage:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80",
    link: "/events?category=music",
  },
  {
    id: 2,
    title: "Divadelní představení",
    backgroundImage:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    link: "/events?category=theater",
  },
  {
    id: 3,
    title: "Stand-up comedy",
    backgroundImage:
      "https://images.unsplash.com/photo-1470229722913-7f419344ca51?auto=format&fit=crop&w=600&q=80",
    link: "/events?category=comedy",
  },
  {
    id: 4,
    title: "Sportovní akce",
    backgroundImage:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
    link: "/events?category=sports",
  },
];

export default function BubbleMasonrySection({}: Props) {
  return (
    <div className="w-full py-16">
      <div className="mb-12">
        <Text variant="heading3" className="mb-3">
          Kategorie zážitků
        </Text>
        <Text variant="body1" className="text-zinc-600">
          Procházej akce podle svých zájmů
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div
          className={`group relative h-80 col-span-3 max-md:col-span-5 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow`}
          style={{
            backgroundImage: `url(${bubbles[0].backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <MasonryContent title={bubbles[0].title} link={bubbles[0].link} />
        </div>
        <div
          className={`group relative h-80 col-span-2 max-md:col-span-5 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow`}
          style={{
            backgroundImage: `url(${bubbles[1].backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <MasonryContent title={bubbles[1].title} link={bubbles[1].link} />
        </div>
        <div
          className={`group relative h-80 col-span-2 max-md:col-span-5 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow`}
          style={{
            backgroundImage: `url(${bubbles[2].backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay */}
          <MasonryContent title={bubbles[2].title} link={bubbles[2].link} />
        </div>{" "}
        <div
          className={`group relative h-80 col-span-3 max-md:col-span-5 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow`}
          style={{
            backgroundImage: `url(${bubbles[3].backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <MasonryContent title={bubbles[3].title} link={bubbles[3].link} />
        </div>
      </div>
    </div>
  );
}

function MasonryContent({ title, link }: { title: string; link: string }) {
  return (
    <>
      <div className="inset-0 bg-black/40 hover:bg-black/20 transition-all ease-in-out flex flex-col items-start justify-end w-full h-full gap-6 p-6">
        <Text
          variant="heading3"
          className="text-white text-center drop-shadow-lg"
        >
          {title}
        </Text>
        <Button text="Zjistit více" version="primary" link={link} size="lg" />
      </div>
    </>
  );
}
