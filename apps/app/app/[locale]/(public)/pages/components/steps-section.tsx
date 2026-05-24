"use client";

import Text from "@/app/components/ui/atoms/text";
import SectionHeading from "./section-heading";
import { useEffect, useRef, useState } from "react";

const ACCENTS = [
  "bg-rose-400",
  "bg-emerald-400",
  "bg-violet-400",
  "bg-amber-400",
];

const gridClass: Record<2 | 3 | 4, string> = {
  2: "rounded-3xl border border-zinc-100 overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-100",
  3: "rounded-3xl border border-zinc-100 overflow-hidden grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-100",
  4: "rounded-3xl border border-zinc-100 overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-100",
};

type Step = {
  title: string;
  description: string;
};

type Props = {
  badge?: string;
  heading: string;
  subheading?: string;
  steps: Step[];
  columns?: 2 | 3 | 4;
};

export default function StepsSection({
  badge,
  heading,
  subheading,
  steps,
  columns = 3,
}: Props) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
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
        />
      </div>

      <div className={gridClass[columns]}>
        {steps.map((step, i) => {
          const number = String(i + 1).padStart(2, "0");
          return (
            <div
              key={i}
              className="relative overflow-hidden px-8 py-8 bg-zinc-50 transition-all duration-500"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 120 + 150}ms`,
              }}
            >
              <span className="absolute top-2 right-4 text-8xl font-black text-zinc-100 select-none leading-none pointer-events-none tabular-nums">
                {number}
              </span>
              <div className="relative z-10 flex flex-col gap-4">
                <div
                  className={`w-8 h-1.5 rounded-full ${ACCENTS[i % ACCENTS.length]}`}
                />
                <div className="flex flex-col gap-1">
                  <Text
                    variant="display-2xl"
                    color="textDark"
                    className="tabular-nums"
                  >
                    {number}
                  </Text>
                  <Text variant="h3" color="textDark">
                    {step.title}
                  </Text>
                  <Text variant="body-sm" color="textLight">
                    {step.description}
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
