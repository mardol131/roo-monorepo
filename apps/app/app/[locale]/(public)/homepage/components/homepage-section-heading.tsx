"use client";

import Text, { TextProps } from "@/app/components/ui/atoms/text";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  heading: string;
  subheading: string;
  wrapperClassname?: string;
  headingColor?: TextProps["color"];
  subheadingColor?: TextProps["color"];
};

export default function HomepageSectionHeading({
  heading,
  subheading,
  wrapperClassname,
  headingColor = "textDark",
  subheadingColor = "textLight",
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
    <div
      className={`mb-8 transition-all duration-500 ${wrapperClassname}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
      ref={ref}
    >
      <Text variant="display-xl" color={headingColor} className="mb-2">
        {heading}
      </Text>
      <Text variant="body-lg" color={subheadingColor}>
        {subheading}
      </Text>
    </div>
  );
}
