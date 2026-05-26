"use client";

import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { IntlLink } from "@/app/i18n/navigation";
import SectionHeading from "./section-heading";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type FaqItem = {
  question: string;
  answer: string;
};

type Props = {
  badge?: string;
  heading: string;
  subheading?: string;
  items: FaqItem[];
  cta?: { text: string; href: IntlLink };
};

function FaqRow({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <li
      className="border-b border-zinc-100 last:border-0"
      style={{
        transitionDelay: `${index * 60 + 150}ms`,
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <Text variant="h3" color="textDark">
          {item.question}
        </Text>
        <ChevronDown
          className="h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: open ? `${contentRef.current?.scrollHeight ?? 500}px` : "0px",
          opacity: open ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="pb-5">
          <Text variant="body" color="textLight" className="leading-relaxed">
            {item.answer}
          </Text>
        </div>
      </div>
    </li>
  );
}

export default function FaqSection({ badge, heading, subheading, items, cta }: Props) {
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
    <div ref={ref} className="w-full">
      <div
        className="transition-all duration-500"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
        }}
      >
        <SectionHeading badge={badge} heading={heading} subheading={subheading} />
      </div>

      <div
        className="rounded-3xl border border-zinc-100 bg-zinc-50 px-8 transition-all duration-500"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "100ms",
        }}
      >
        <ul>
          {items.map((item, i) => (
            <FaqRow key={i} item={item} index={i} />
          ))}
        </ul>
      </div>

      {cta && (
        <div className="flex justify-center mt-8">
          <Button text={cta.text} version="primary" size="lg" link={cta.href} />
        </div>
      )}
    </div>
  );
}
