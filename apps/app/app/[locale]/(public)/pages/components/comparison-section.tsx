"use client";

import Text from "@/app/components/ui/atoms/text";
import SectionHeading from "./section-heading";
import { Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ComparisonItem = {
  text: string;
};

type Props = {
  badge?: string;
  heading: string;
  subheading?: string;
  ourLabel?: string;
  theirLabel?: string;
  ours: ComparisonItem[];
  theirs: ComparisonItem[];
};

export default function ComparisonSection({
  badge,
  heading,
  subheading,
  ourLabel = "S Roo",
  theirLabel = "Bez Roo",
  ours,
  theirs,
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

      <div
        className="relative grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 transition-all duration-500"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transitionDelay: "150ms",
        }}
      >
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-white border border-zinc-200">
          <span className="text-[11px] font-bold text-zinc-400 leading-none">VS</span>
        </div>

        <div className="rounded-3xl border border-zinc-100 overflow-hidden bg-zinc-50">
          <div className="px-8 py-5 border-b border-zinc-100 flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={3} />
            </div>
            <Text variant="h3" color="textDark">
              {ourLabel}
            </Text>
          </div>
          <ul className="flex flex-col divide-y divide-zinc-100">
            {ours.map((item, i) => (
              <li key={i} className="flex items-start gap-3 px-8 py-4">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-3 w-3 text-emerald-600" strokeWidth={3} />
                </div>
                <Text variant="body" color="textDark">
                  {item.text}
                </Text>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-zinc-100 overflow-hidden bg-zinc-50">
          <div className="px-8 py-5 border-b border-zinc-100 flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200">
              <X className="h-3.5 w-3.5 text-zinc-400" strokeWidth={3} />
            </div>
            <Text variant="h3" color="textDark">
              {theirLabel}
            </Text>
          </div>
          <ul className="flex flex-col divide-y divide-zinc-100">
            {theirs.map((item, i) => (
              <li key={i} className="flex items-start gap-3 px-8 py-4">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-200">
                  <X className="h-3 w-3 text-zinc-400" strokeWidth={3} />
                </div>
                <Text variant="body" color="textLight">
                  {item.text}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
