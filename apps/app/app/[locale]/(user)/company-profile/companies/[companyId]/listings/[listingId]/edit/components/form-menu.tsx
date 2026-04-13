"use client";

import React, { useEffect, useRef, useState } from "react";
import { VENUE_FORM_SECTIONS } from "./edit-venue-listing-form";

type Section = (typeof VENUE_FORM_SECTIONS)[number];

export default function FormMenu() {
  const [visibleIds, setVisibleIds] = useState<Set<string>>(
    () => new Set([VENUE_FORM_SECTIONS[0].id]),
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sectionIds = VENUE_FORM_SECTIONS.map((s) => s.id);

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
      { rootMargin: "-10% 0px -10% 0px", threshold: 0 },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="flex flex-col gap-0.5">
      {VENUE_FORM_SECTIONS.map((section: Section) => {
        const isActive = visibleIds.has(section.id);
        const Icon = section.icon;

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => handleClick(section.id)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150 w-full group ${
              isActive
                ? "bg-rose-50 text-rose-600"
                : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                isActive ? "bg-rose-100" : "bg-zinc-100 group-hover:bg-zinc-200"
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${isActive ? "text-rose-500" : "text-zinc-400"}`}
              />
            </div>
            <span
              className={`text-xs font-medium leading-tight ${isActive ? "text-rose-600" : ""}`}
            >
              {section.title}
            </span>
            {isActive && (
              <div className="ml-auto w-1 h-1 rounded-full bg-rose-500 shrink-0" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
