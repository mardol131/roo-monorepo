"use client";

import { aggregateInquiryStatus, Event, Inquiry } from "@roo/common";
import { useTranslations } from "next-intl";
import EntityComponentTag from "./entity-component-tag";

type Props = {
  eventStatus: Event["status"];
};

const color = ({ eventStatus }: Props) => {
  const status = eventStatus;
  switch (status) {
    case "planning":
      return { bgColor: "bg-zinc-100", textColor: "text-zinc-500" };
    case "deactivated":
      return { bgColor: "bg-danger-surface", textColor: "text-danger" };
    case "completed":
      return { bgColor: "bg-success-surface", textColor: "text-success" };
    default:
      return { bgColor: "bg-zinc-50", textColor: "text-zinc-500" };
  }
};

const icon = ({ eventStatus }: Props) => {
  const status = eventStatus;
  switch (status) {
    case "planning":
      return "CircleQuestionMark";
    case "deactivated":
      return "CircleMinus";
    default:
      return "CircleCheck";
  }
};

export default function EventStatusTag({ eventStatus }: Props) {
  const t = useTranslations("event.status");

  const { bgColor, textColor } = color({ eventStatus });

  return (
    <EntityComponentTag
      text={t(`${eventStatus}`)}
      bgColor={bgColor}
      textColor={textColor}
      icon={icon({ eventStatus })}
    />
  );
}
