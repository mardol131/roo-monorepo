"use client";

import { useEffect, useRef, useState } from "react";
import Text from "@/app/components/ui/atoms/text";
import HomepageSectionHeading from "./homepage-section-heading";
import { HomepageSectionWrapper } from "@/app/components/ui/sections/landing-section-wrapper";

const STEPS = [
  {
    number: "01",
    accent: "bg-rose-400",
    title: "Najdi dodavatele",
    description:
      "Prohledej katalog míst, cateringu a zábavy. Filtruj podle lokace, kapacity nebo typu akce.",
  },
  {
    number: "02",
    accent: "bg-emerald-400",
    title: "Sestav event",
    description:
      "Přidej vybrané dodavatele do svého eventu. Místo, jídlo i program — vše pohromadě.",
  },
  {
    number: "03",
    accent: "bg-violet-400",
    title: "Koordinuj z jednoho místa",
    description:
      "Komunikuj s dodavateli, sleduj stav objednávek a řiď celý event bez zbytečných e-mailů.",
  },
];

export default function HowItWorksSection() {
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
    <div ref={ref} className="w-full py-10">
      <HomepageSectionHeading
        heading="Jak to funguje"
        subheading="Od nápadu k hotovému eventu za pár minut."
        wrapperClassname="text-center"
        headingColor="white"
        subheadingColor="textLight"
      />
      <div className="rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-15">
        {STEPS.map((step, i) => (
          <div
            key={step.number}
            className="relative overflow-hidden py-8 transition-all duration-600"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transitionDelay: `${i * 120 + 150}ms`,
            }}
          >
            <span className="absolute top-2 right-4 text-8xl font-black text-text-light/10 select-none leading-none pointer-events-none tabular-nums">
              {step.number}
            </span>
            <div className="relative z-10 flex flex-col gap-4">
              <div className={`w-8 h-1.5 rounded-full ${step.accent}`} />
              <div className="flex flex-col gap-1">
                <Text
                  variant="display-2xl"
                  color="white"
                  className="tabular-nums"
                >
                  {step.number}
                </Text>
                <Text variant="h3" color="white">
                  {step.title}
                </Text>
                <Text variant="body-sm" color="textLight">
                  {step.description}
                </Text>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
