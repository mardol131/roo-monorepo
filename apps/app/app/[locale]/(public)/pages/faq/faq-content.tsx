"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Text from "@/app/components/ui/atoms/text";

type Question = { question: string; answer: string };
type Group = { key: string; title: string; questions: Question[] };

function FaqRow({ item, index }: { item: Question; index: number }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <li className="border-b border-zinc-100 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <Text variant="h3" color="textDark">
          {item.question}
        </Text>
        <ChevronDown
          className="h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: open
            ? `${contentRef.current?.scrollHeight ?? 500}px`
            : "0px",
          opacity: open ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="pb-5">
          <Text variant="body" color="textLight" className="leading-relaxed">
            {item.answer}
          </Text>
        </div>
      </div>
    </li>
  );
}

export default function FaqContent({ groups }: { groups: Group[] }) {
  const [activeKey, setActiveKey] = useState<string>(groups[0]?.key ?? "");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveKey(entry.target.id);
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    for (const key of groups.map((g) => g.key)) {
      const el = sectionRefs.current[key];
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [groups]);

  function scrollTo(key: string) {
    const el = sectionRefs.current[key];
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  return (
    <div className="flex gap-12 items-start">
      {/* Sticky rejstřík */}
      <aside className="hidden lg:block w-56 shrink-0 sticky top-28">
        <nav className="flex flex-col gap-1">
          {groups.map((group) => (
            <button
              key={group.key}
              onClick={() => scrollTo(group.key)}
              className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                activeKey === group.key
                  ? "bg-company-surface text-company font-medium"
                  : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              <Text
                variant="label"
                color={activeKey === group.key ? "primary" : "textLight"}
              >
                {group.title}
              </Text>
            </button>
          ))}
        </nav>
      </aside>

      {/* Obsah */}
      <div className="flex-1 flex flex-col gap-12 min-w-0">
        {groups.map((group) => (
          <section
            key={group.key}
            id={group.key}
            ref={(el) => {
              sectionRefs.current[group.key] = el;
            }}
          >
            <Text variant="display-lg" color="textDark" className="mb-6">
              {group.title}
            </Text>
            <div className="rounded-3xl border border-zinc-100 bg-zinc-50 px-8">
              <ul>
                {group.questions.map((q, i) => (
                  <FaqRow key={i} item={q} index={i} />
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
