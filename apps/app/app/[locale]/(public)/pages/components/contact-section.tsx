"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, MapPin, Clock, ExternalLink } from "lucide-react";
import Text from "@/app/components/ui/atoms/text";
import SectionHeading from "./section-heading";
import Link from "next/link";

type ContactItem = {
  icon: "mail" | "location" | "hours";
  label: string;
  value: string;
  note?: string;
  href?: string;
};

type Props = {
  badge?: string;
  heading: string;
  subheading?: string;
  items: ContactItem[];
};

const icons = {
  mail: Mail,
  location: MapPin,
  hours: Clock,
};

export default function ContactSection({
  badge,
  heading,
  subheading,
  items,
}: Props) {
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
        <SectionHeading
          badge={badge}
          heading={heading}
          subheading={subheading}
          align="left"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => {
          const Icon = icons[item.icon];
          const inner = (
            <div className="flex flex-col gap-4 h-full">
              <div className="w-10 h-10 rounded-2xl bg-company-surface flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-company" />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <Text variant="label-lg" color="textLight">
                  {item.label}
                </Text>
                <Text variant="h3" color="textDark" className="break-all">
                  {item.value}
                </Text>
                {item.note && (
                  <Text variant="body-sm" color="textLight" className="mt-1">
                    {item.note}
                  </Text>
                )}
              </div>
              {item.href && (
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-company text-sm font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Napsat</span>
                </Link>
              )}
            </div>
          );

          return (
            <div
              key={i}
              className="transition-all duration-500"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 80 + 150}ms`,
              }}
            >
              <div className="rounded-3xl border border-zinc-100 bg-zinc-50 p-8 h-full">
                {inner}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
