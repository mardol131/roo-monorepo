"use client";

import { aggregateInquiryStatus, Inquiry } from "@roo/common";
import { useTranslations } from "next-intl";
import EntityComponentTag from "./entity-component-tag";

type Props = {
  userStatus: Inquiry["userStatus"];
  companyStatus: Inquiry["companyStatus"];
};

const color = ({ userStatus, companyStatus }: Props) => {
  const status = aggregateInquiryStatus({ userStatus, companyStatus });
  switch (status) {
    case "confirmed":
      return { bgColor: "bg-green-50", textColor: "text-green-500" };
    case "cancelled":
      return { bgColor: "bg-red-50", textColor: "text-red-500" };
    default:
      return { bgColor: "bg-zinc-50", textColor: "text-zinc-500" };
  }
};

const icon = ({ userStatus, companyStatus }: Props) => {
  const status = aggregateInquiryStatus({ userStatus, companyStatus });
  switch (status) {
    case "pending":
      return "CircleQuestionMark";
    case "cancelled":
      return "CircleMinus";
    default:
      return "CircleCheck";
  }
};

export default function InquiryStatusTag({ userStatus, companyStatus }: Props) {
  const t = useTranslations("inquiries.status");

  const { bgColor, textColor } = color({ userStatus, companyStatus });
  const status = aggregateInquiryStatus({ userStatus, companyStatus });

  return (
    <EntityComponentTag
      text={t(`${status}`)}
      bgColor={bgColor}
      textColor={textColor}
      icon={icon({ userStatus, companyStatus })}
    />
  );
}
