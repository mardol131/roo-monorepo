"use client";

import Button, { ButtonProps } from "@/app/components/ui/atoms/button";
import { useRouter } from "@/app/i18n/navigation";
import { LucideIcons } from "@roo/common";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import * as lucideIcons from "lucide-react";

export type TocSection = {
  id: string;
  title: string;
  subTitle?: string;
  icon: LucideIcons;
};

export type TocGroup = {
  label: string;
  sections: readonly TocSection[];
};

export default function FormToc({
  groups,
  sticky = true,
  textColor = "text-listing",
  surfaceColor = "bg-listing-surface",
  dotColor = "bg-listing",
  buttonVersion = "primary",
  buttonText = "Přejít na uložení",
}: {
  groups: readonly TocGroup[];
  sticky?: boolean;
  textColor?: string;
  surfaceColor?: string;
  dotColor?: string;
  buttonVersion?: ButtonProps["version"];
  buttonText?: string;
}) {
  const [visibleIds, setVisibleIds] = useState<Set<string>>(
    () => new Set([groups[0]?.sections[0]?.id ?? ""]),
  );
  const [openGroups, setOpenGroups] = useState<Set<number>>(() => new Set([0]));
  const observerRef = useRef<IntersectionObserver | null>(null);
  const router = useRouter();

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

    groups.forEach((group) =>
      group.sections.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observerRef.current!.observe(el);
      }),
    );

    return () => observerRef.current?.disconnect();
  }, [groups]);

  // Auto-open/close groups based on which sections are visible
  useEffect(() => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      groups.forEach((group, idx) => {
        if (group.sections.some((s) => visibleIds.has(s.id))) {
          next.add(idx);
        } else {
          next.delete(idx);
        }
      });
      return next;
    });
  }, [visibleIds, groups]);

  const handleClick = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const toggleGroup = (idx: number) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  return (
    <div>
      {" "}
      <nav
        className={`${sticky ? "sticky top-6" : ""} flex flex-col gap-0.5 w-52 shrink-0  max-lg:block`}
      >
        <span
          className={`px-3 py-1.5 text-xs border-b border-zinc-500/20 font-medium uppercase tracking-wide ${textColor}`}
        >
          Sekce formuláře
        </span>
        {groups.map((group, idx) => {
          const isOpen = openGroups.has(idx);
          const hasActive = group.sections.some((s) => visibleIds.has(s.id));

          return (
            <div key={idx}>
              <button
                type="button"
                onClick={() => toggleGroup(idx)}
                className={`flex items-center gap-2 w-full px-3  py-3 rounded-lg hover:bg-zinc-50 transition-colors`}
              >
                <span
                  className={`text-[12px] font-medium leading-tight tracking-wide flex-1 text-left transition-colors ${
                    hasActive ? textColor : "text-zinc-500"
                  }`}
                >
                  {group.label}
                </span>
                <ChevronDown
                  className={`w-3 h-3 text-zinc-500 shrink-0 transition-transform duration-150 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-0.5 pb-1">
                    {group.sections.map((section) => {
                      const isActive = visibleIds.has(section.id);
                      const Icon = lucideIcons[
                        section.icon
                      ] as React.ElementType;

                      return (
                        <button
                          key={section.id}
                          type="button"
                          onClick={() => handleClick(section.id)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150 w-full group ${
                            isActive
                              ? surfaceColor
                              : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                              isActive
                                ? surfaceColor
                                : "bg-zinc-100 group-hover:bg-zinc-200"
                            }`}
                          >
                            {Icon && (
                              <Icon
                                className={`w-3.5 h-3.5 ${isActive ? textColor : "text-zinc-400"}`}
                              />
                            )}
                          </div>
                          <span
                            className={`text-xs font-medium leading-tight ${
                              isActive ? textColor : ""
                            }`}
                          >
                            {section.title}
                          </span>
                          {isActive && (
                            <div
                              className={`ml-auto w-1 h-1 rounded-full ${dotColor} shrink-0`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div className="flex flex-col gap-2 mt-4">
          <Button
            htmlType="submit"
            text={buttonText}
            version={buttonVersion}
            className="w-full"
          />
          <Button
            text="Zrušit"
            version="plain"
            className="w-full"
            onClick={() => router.back()}
          />
        </div>
      </nav>
    </div>
  );
}
