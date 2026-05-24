"use client";

import Text from "@/app/components/ui/atoms/text";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type AudienceCard = {
  label: string;
  heading: string;
  price: string;
  description: string;
  anchorId: string;
};

type Props = {
  organizer: AudienceCard;
  supplier: AudienceCard;
};

function Card({
  card,
  visible,
  delay,
  accent,
}: {
  card: AudienceCard;
  visible: boolean;
  delay: number;
  accent: "emerald" | "company";
}) {
  const handleClick = () => {
    const el = document.getElementById(card.anchorId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      onClick={handleClick}
      className="group text-left w-full rounded-3xl border border-zinc-100 bg-zinc-50 px-8 py-8 flex flex-col gap-6 hover:border-zinc-200 hover:bg-white transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionDuration: "500ms",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <Text variant="label" color="textLight" className="uppercase tracking-widest text-xs">
            {card.label}
          </Text>
          <Text variant="display-2xl" color="textDark">
            {card.heading}
          </Text>
        </div>
        <div
          className={`shrink-0 mt-1 flex h-10 w-10 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:translate-y-1 ${
            accent === "company" ? "bg-company-surface" : "bg-emerald-100"
          }`}
        >
          <ArrowDown
            className={`h-5 w-5 ${accent === "company" ? "text-company" : "text-emerald-600"}`}
          />
        </div>
      </div>

      <div
        className={`inline-flex w-fit items-end gap-1.5 rounded-2xl px-5 py-3 ${
          accent === "company" ? "bg-company-surface" : "bg-emerald-100"
        }`}
      >
        <span
          className={`text-4xl font-black leading-none tabular-nums ${
            accent === "company" ? "text-company" : "text-emerald-700"
          }`}
        >
          {card.price}
        </span>
      </div>

      <Text variant="body" color="textLight">
        {card.description}
      </Text>
    </button>
  );
}

export default function AudienceCardsSection({ organizer, supplier }: Props) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card card={organizer} visible={visible} delay={0} accent="emerald" />
      <Card card={supplier} visible={visible} delay={150} accent="company" />
    </div>
  );
}
