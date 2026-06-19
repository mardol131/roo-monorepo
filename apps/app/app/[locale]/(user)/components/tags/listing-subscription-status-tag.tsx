"use client";

import React from "react";
import EntityComponentTag from "./entity-component-tag";
import { useTranslations } from "next-intl";
import { Listing } from "@roo/common";

type Props = {
  status: Listing["subscriptionStatus"];
};

const color = (status: Listing["subscriptionStatus"]) => {
  switch (status) {
    case "paid":
      return { bgColor: "bg-success-surface", textColor: "text-success" };
    case "unpaid":
      return { bgColor: "bg-zinc-100", textColor: "text-zinc-500" };
    case "cancelling":
      return { bgColor: "bg-warning-surface", textColor: "text-warning" };
    case "expired":
      return { bgColor: "bg-zinc-100", textColor: "text-zinc-500" };
  }
};

const icon = (status: Listing["subscriptionStatus"]) => {
  switch (status) {
    case "paid":
      return "CircleCheck";
    case "unpaid":
      return "CircleX";
    case "cancelling":
      return "CircleArrowDown";
    case "expired":
      return "CircleMinus";
  }
};

export default function ListingSubscriptionStatusTag({ status }: Props) {
  const t = useTranslations();

  const { bgColor, textColor } = color(status);

  return (
    <EntityComponentTag
      text={t(`global.listings.subscriptionStatus.${status}`)}
      bgColor={bgColor}
      textColor={textColor}
      icon={icon(status)}
    />
  );
}
