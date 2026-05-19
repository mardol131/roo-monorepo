"use client";

import { useEffect, useRef, useState } from "react";
import Text from "@/app/components/ui/atoms/text";
const STATS = [
  {
    accent: "bg-rose-400",
    value: "1 200+",
    label: "registrovaných dodavatelů",
    sublabel: "Místa, catering i zábava na jednom místě",
  },
  {
    accent: "bg-emerald-400",
    value: "8 400+",
    label: "úspěšně zorganizovaných akcí",
    sublabel: "Od firemních večírků po velké festivaly",
  },
  {
    accent: "bg-violet-400",
    value: "94 %",
    label: "spokojených pořadatelů",
    sublabel: "Hodnocení od skutečných zákazníků",
  },
];

export default function StatsSection() {
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
      <div className="rounded-3xl border border-zinc-100 overflow-hidden grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-100">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="relative overflow-hidden px-8 py-8 bg-zinc-50 transition-all duration-600"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transitionDelay: `${i * 120 + 150}ms`,
            }}
          >
            <span className="absolute top-2 right-4 text-8xl font-black text-zinc-100 select-none leading-none pointer-events-none tabular-nums">
              {stat.value}
            </span>
            <div className="relative z-10 flex flex-col gap-4">
              <div className={`w-8 h-1.5 rounded-full ${stat.accent}`} />
              <div className="flex flex-col gap-1">
                <Text variant="display-2xl" color="textDark" className="tabular-nums">
                  {stat.value}
                </Text>
                <Text variant="h3" color="textDark">
                  {stat.label}
                </Text>
                <Text variant="body-sm" color="textLight">
                  {stat.sublabel}
                </Text>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
