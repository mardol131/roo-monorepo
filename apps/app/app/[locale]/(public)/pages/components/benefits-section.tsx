"use client";

import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { IntlLink } from "@/app/i18n/navigation";
import SectionHeading from "./section-heading";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Benefit = {
  image: string;
  title: string;
  description: string;
};

type Props = {
  badge?: string;
  heading: string;
  subheading?: string;
  benefits: [Benefit, Benefit, Benefit];
  cta?: { text: string; href: IntlLink };
};

export default function BenefitsSection({
  badge,
  heading,
  subheading,
  benefits,
  cta,
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

      <div className="flex flex-col gap-16">
        {benefits.map((benefit, i) => {
          const imageRight = i % 2 === 0;
          return (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center transition-all duration-500"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 120 + 150}ms`,
              }}
            >
              <div className={`flex flex-col gap-4 ${imageRight ? "" : "md:order-2"}`}>
                <Text variant="display-lg" color="textDark">
                  {benefit.title}
                </Text>
                <Text variant="body-lg" color="textLight">
                  {benefit.description}
                </Text>
              </div>

              <div className={`rounded-3xl overflow-hidden border border-zinc-100 bg-zinc-50 aspect-video ${imageRight ? "md:order-2" : "md:order-1"}`}>
                <Image
                  src={benefit.image}
                  alt={benefit.title}
                  width={800}
                  height={450}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>

      {cta && (
        <div className="flex justify-center mt-8">
          <Button text={cta.text} version="primary" size="lg" link={cta.href} />
        </div>
      )}
    </div>
  );
}
