"use client";

import { aggregateInquiryStatus, Inquiry } from "@roo/common";
import { useTranslations } from "next-intl";
import EntityComponentTag from "./entity-component-tag";

type Props = {
  status: Inquiry["status"];
};

const color = ({ status }: Props) => {
  const { user: userStatus, company: compnyStatus } = status;

  const aggregatedStatus = aggregateInquiryStatus(status);
  switch (aggregatedStatus) {
    case "confirmed":
      return { bgColor: "bg-green-50", textColor: "text-green-500" };
    case "cancelled":
      return { bgColor: "bg-red-50", textColor: "text-red-500" };
    default:
      return { bgColor: "bg-zinc-50", textColor: "text-zinc-500" };
  }
};

const icon = ({ status }: Props) => {
  const aggregatedStatus = aggregateInquiryStatus(status);
  switch (aggregatedStatus) {
    case "pending":
      return "CircleQuestionMark";
    case "cancelled":
      return "CircleMinus";
    default:
      return "CircleCheck";
  }
};

export default function InquiryStatusTag({ status }: Props) {
  const t = useTranslations("inquiries.status");

  const { bgColor, textColor } = color({ status });
  const aggregatedStatus = aggregateInquiryStatus(status);

  return (
    <EntityComponentTag
      text={t(`${aggregatedStatus}`)}
      bgColor={bgColor}
      textColor={textColor}
      icon={icon({ status })}
    />
  );
}
