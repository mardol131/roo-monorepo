"use client";

import Loader from "@/app/[locale]/(user)/components/loader";
import Text from "@/app/components/ui/atoms/text";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { loginModalEvents } from "@/app/components/ui/molecules/modals/login-modal/login-modal";
import { useAuth } from "@/app/context/auth/auth-context";
import {
  useRoadmapItems,
  useVoteForRoadmapItem,
} from "@/app/react-query/roadmap-items/hooks";
import { RoadmapItem } from "@roo/common";
import { Clock, ThumbsUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Section = {
  status: NonNullable<RoadmapItem["status"]>;
  heading: string;
};

type Props = {
  sections: Section[];
  voteLabel: string;
  votedLabel: string;
  emptyLabel: string;
};

function RoadmapCard({
  item,
  voteLabel,
  votedLabel,
  voted,
  onCardClick,
}: {
  item: RoadmapItem;
  voteLabel: string;
  votedLabel: string;
  voted: boolean;
  onCardClick: (id: string) => void;
}) {
  const votingEnabled = item.status === "planned";

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-zinc-100 bg-zinc-50 px-6 py-6">
      <div className="flex flex-col gap-1.5 flex-1">
        <Text variant="h3" color="textDark">
          {item.name}
        </Text>
        {item.description && (
          <Text variant="body-sm" color="textLight">
            {item.description}
          </Text>
        )}
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <ThumbsUp className="h-3.5 w-3.5" />
          <span className="text-sm tabular-nums">{item.votes ?? 0}</span>
        </div>
        {votingEnabled && (
          <button
            onClick={() => onCardClick(item.id)}
            disabled={voted}
            className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              voted
                ? "bg-company-surface text-company cursor-default"
                : "bg-zinc-100 text-zinc-500 hover:bg-company-surface hover:text-company cursor-pointer"
            }`}
          >
            <span>{voted ? votedLabel : voteLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}

function SectionBlock({
  section,
  items,
  voteLabel,
  votedLabel,
  emptyLabel,
  voted,
  nextVoteLabel,
  onCardClick,
}: {
  section: Section;
  items: RoadmapItem[];
  voteLabel: string;
  votedLabel: string;
  emptyLabel: string;
  voted: boolean;
  nextVoteLabel?: string;
  onCardClick: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.05 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="w-full transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
      }}
    >
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <Text variant="display-xl" color="textDark">
          {section.heading}
        </Text>
        {nextVoteLabel && (
          <span className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-1.5 text-xs text-zinc-500">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {nextVoteLabel}
          </span>
        )}
      </div>
      {items.length === 0 ? (
        <div className="flex items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 py-12">
          <Text variant="body" color="textLight">
            {emptyLabel}
          </Text>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <RoadmapCard
              key={item.id}
              item={item}
              voteLabel={voteLabel}
              votedLabel={votedLabel}
              voted={voted}
              onCardClick={onCardClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function RoadmapContent({
  sections,
  voteLabel,
  votedLabel,
  emptyLabel,
}: Props) {
  const t = useTranslations("pages.roadmap");
  const { data, isLoading } = useRoadmapItems();
  const { mutateAsync: vote, isPending } = useVoteForRoadmapItem();
  const auth = useAuth();
  const { user } = auth;

  if (isLoading) return <Loader text="Stránka se načítá" />;

  const lastVoteDate = new Date(user?.lastRoadmapVoteAt ?? 0);
  const msUntilNextVote = 30 * 24 * 60 * 60 * 1000 - (Date.now() - lastVoteDate.getTime());
  const canVote = !user?.lastRoadmapVoteAt || msUntilNextVote <= 0;

  const nextVoteDate = new Date(lastVoteDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  const nextVoteLabel = user && !canVote
    ? t("nextVote", { date: format(nextVoteDate, "d. M. yyyy") })
    : undefined;

  const handleCardClick = async (id: string) => {
    if (!user) {
      loginModalEvents.emit("open", undefined);
      return;
    }
    if (!canVote || isPending) return;
    try {
      await vote(id);
      auth.refresh();
    } catch (error) {
      console.error("Hlasování se nezdařilo:", error);
    }
  };

  const items = data?.docs ?? [];

  return (
    <div className="flex flex-col gap-14 w-full">
      {sections.map((section) => (
        <SectionBlock
          key={section.status}
          section={section}
          items={items.filter((item) => item.status === section.status)}
          voteLabel={voteLabel}
          votedLabel={votedLabel}
          emptyLabel={emptyLabel}
          voted={!canVote}
          nextVoteLabel={section.status === "planned" ? nextVoteLabel : undefined}
          onCardClick={handleCardClick}
        />
      ))}
    </div>
  );
}
