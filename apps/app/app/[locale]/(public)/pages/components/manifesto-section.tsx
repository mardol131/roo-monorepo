"use client";

import { useEffect, useRef, useState } from "react";
import Text from "@/app/components/ui/atoms/text";

type Props = {
  quote: string;
  author?: string;
};

export default function ManifestoSection({ quote, author }: Props) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="w-full py-8 flex flex-col items-center text-center gap-6 transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      <div className="w-12 h-0.5 bg-company rounded-full" />
      <Text
        variant="display-xl"
        color="textDark"
        className="max-w-3xl leading-snug"
      >
        {quote}
      </Text>
      {author && (
        <Text variant="label-lg" color="textLight">
          {author}
        </Text>
      )}
      <div className="w-12 h-0.5 bg-company rounded-full" />
    </div>
  );
}
