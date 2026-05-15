"use client";

import { Inquiry, type LucideIcons } from "@roo/common";
import { useTranslations } from "next-intl";
import EntityComponentTag from "./entity-component-tag";

type Props = {
  status: Inquiry["status"];
};

type DetailedStatus =
  | "pending"
  | "company_confirmed"
  | "confirmed"
  | "cancelled";

function getDetailedStatus(status: Inquiry["status"]): DetailedStatus {
  const { user, company } = status;
  if (user === "cancelled" || company === "cancelled") return "cancelled";
  if (user === "confirmed" && company === "confirmed") return "confirmed";
  if (company === "confirmed") return "company_confirmed";
  return "pending";
}

const STATUS_STYLES: Record<
  DetailedStatus,
  { bgColor: string; textColor: string; icon: LucideIcons }
> = {
  pending: {
    bgColor: "bg-warning-surface",
    textColor: "text-warning",
    icon: "CircleQuestionMark",
  },
  company_confirmed: {
    bgColor: "bg-warning-surface",
    textColor: "text-warning",
    icon: "CircleCheck",
  },
  confirmed: {
    bgColor: "bg-green-50",
    textColor: "text-green-500",
    icon: "CircleCheck",
  },
  cancelled: {
    bgColor: "bg-red-50",
    textColor: "text-red-500",
    icon: "CircleMinus",
  },
};

export default function InquiryStatusTag({ status }: Props) {
  const t = useTranslations("inquiries.status_actions");
  const detailedStatus = getDetailedStatus(status);
  const { bgColor, textColor, icon } = STATUS_STYLES[detailedStatus];

  return (
    <EntityComponentTag
      text={t(detailedStatus)}
      bgColor={bgColor}
      textColor={textColor}
      icon={icon}
    />
  );
}
