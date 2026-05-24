"use client";

import SectionHeading from "./section-heading";
import { LucideIcons } from "@roo/common";
import { type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as lucideIcons from "lucide-react";
import Text from "@/app/components/ui/atoms/text";

const gridClass: Record<2 | 3, string> = {
  2: "rounded-3xl border border-zinc-100 overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-100",
  3: "rounded-3xl border border-zinc-100 overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 divide-zinc-100",
};

type Feature = {
  icon: LucideIcons;
  title: string;
  description: string;
};

type Props = {
  badge?: string;
  heading: string;
  subheading?: string;
  features: Feature[];
  columns?: 2 | 3;
};

export default function FeaturesSection({
  badge,
  heading,
  subheading,
  features,
  columns = 3,
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
        <SectionHeading badge={badge} heading={heading} subheading={subheading} />
      </div>

      <div className={gridClass[columns]}>
        {features.map((feature, i) => {
          const Icon = lucideIcons[feature.icon] as LucideIcon;
          return (
            <div
              key={i}
              className="relative overflow-hidden px-8 py-8 bg-zinc-50 transition-all duration-500 border-zinc-100"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${(i % columns) * 100 + 150}ms`,
              }}
            >
              <Icon className="absolute -bottom-4 -right-4 h-28 w-28 text-company opacity-[0.06] pointer-events-none" />
              <div className="relative z-10 flex flex-col gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-company-surface">
                  <Icon className="h-7 w-7 text-company" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Text variant="h3" color="textDark">
                    {feature.title}
                  </Text>
                  <Text variant="body-sm" color="textLight">
                    {feature.description}
                  </Text>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
