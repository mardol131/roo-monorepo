"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Text from "@/app/components/ui/atoms/text";
import SectionHeading from "./section-heading";

type Step = {
  title: string;
  description: string;
  image: string;
};

type Props = {
  badge?: string;
  heading: string;
  subheading?: string;
  steps: Step[];
};

export default function ScrollStepsSection({ badge, heading, subheading, steps }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = stepRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveStep(i); },
        { rootMargin: "-35% 0px -50% 0px", threshold: 0 },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [steps.length]);

  const progressPercent =
    steps.length > 1 ? (activeStep / (steps.length - 1)) * 100 : 100;

  return (
    <div className="w-full">
      <SectionHeading badge={badge} heading={heading} subheading={subheading} />

      <div className="flex gap-16 items-start">
        {/* Sticky progress sidebar */}
        <aside className="hidden lg:flex sticky top-32 w-56 shrink-0 flex-col">
          <div className="relative flex flex-col gap-10">
            {/* Background line */}
            <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-zinc-100" />
            {/* Filled line */}
            <div
              className="absolute left-[5px] top-2 w-0.5 bg-company transition-all duration-500 ease-out"
              style={{
                height: `calc(${progressPercent}% * ((100% - 16px) / 100))`,
              }}
            />

            {steps.map((step, i) => (
              <div key={i} className="relative flex gap-4 items-start">
                <div
                  className={`w-3 h-3 rounded-full border-2 shrink-0 mt-0.5 z-10 transition-all duration-300 ${
                    i <= activeStep
                      ? "bg-company border-company scale-110"
                      : "bg-white border-zinc-200"
                  }`}
                />
                <div className="flex flex-col gap-0.5">
                  <span
                    className={`text-xs tabular-nums font-medium transition-colors duration-300 ${
                      i <= activeStep ? "text-company" : "text-zinc-300"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-sm font-medium leading-snug transition-colors duration-300 ${
                      i === activeStep ? "text-zinc-900" : "text-zinc-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Scrollable step content */}
        <div className="flex-1 flex flex-col gap-20 min-w-0">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={(el) => { stepRefs.current[i] = el; }}
              className="flex flex-col gap-6"
            >
              <div className="rounded-3xl overflow-hidden border border-zinc-100 aspect-video">
                <Image
                  src={step.image}
                  alt={step.title}
                  width={900}
                  height={506}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-5 items-start">
                <span className="text-5xl font-black text-zinc-100 tabular-nums leading-none shrink-0 select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2 pt-1">
                  <Text variant="h2" color="textDark">{step.title}</Text>
                  <Text variant="body-lg" color="textLight">{step.description}</Text>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
