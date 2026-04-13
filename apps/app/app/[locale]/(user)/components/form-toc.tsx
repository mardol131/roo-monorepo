"use client";

import React, { useEffect, useRef, useState } from "react";

export type TocSection = {
  id: string;
  title: string;
  icon: React.ElementType;
};

export default function FormToc({
  sections,
}: {
  sections: readonly TocSection[];
}) {
  const [visibleIds, setVisibleIds] = useState<Set<string>>(
    () => new Set([sections[0]?.id ?? ""]),
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        setVisibleIds((prev) => {
          const next = new Set(prev);
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              next.add(entry.target.id);
            } else {
              next.delete(entry.target.id);
            }
          });
          return next;
        });
      },
      { rootMargin: "-5% 0px -10% 0px", threshold: 0 },
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [sections]);

  const handleClick = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="sticky top-6 flex flex-col gap-0.5">
      {sections.map((section) => {
        const isActive = visibleIds.has(section.id);
        const Icon = section.icon;

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => handleClick(section.id)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150 w-full group ${
              isActive
                ? "bg-listing-surface"
                : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                isActive
                  ? "bg-listing-surface"
                  : "bg-zinc-100 group-hover:bg-zinc-200"
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${isActive ? "text-listing" : "text-zinc-400"}`}
              />
            </div>
            <span
              className={`text-xs font-medium leading-tight ${
                isActive ? "text-listing" : ""
              }`}
            >
              {section.title}
            </span>
            {isActive && (
              <div className="ml-auto w-1 h-1 rounded-full bg-listing shrink-0" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
