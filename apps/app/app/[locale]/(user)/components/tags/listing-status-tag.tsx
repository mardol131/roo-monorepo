"use client";

import React from "react";
import EntityComponentTag from "./entity-component-tag";
import { useTranslations } from "next-intl";
import { CheckCircle, CircleDashed } from "lucide-react";
import { Listing } from "@roo/common";

type Props = {
  status: Listing["status"];
};

const color = (status: Listing["status"]) => {
  switch (status) {
    case "active":
      return { bgColor: "bg-success-surface", textColor: "text-success" };
    case "archived":
      return { bgColor: "bg-danger-surface", textColor: "text-danger" };
    default:
      return { bgColor: "bg-zinc-50", textColor: "text-zinc-500" };
  }
};

const icon = (status: Listing["status"]) => {
  switch (status) {
    case "active":
      return "CircleCheck";
    case "archived":
      return "CircleMinus";
    default:
      return "CircleDashed";
  }
};

export default function ListingStatusTag({ status }: Props) {
  const t = useTranslations();

  const { bgColor, textColor } = color(status);

  return (
    <EntityComponentTag
      text={t(`global.listings.status.${status}`)}
      bgColor={bgColor}
      textColor={textColor}
      icon={icon(status)}
    />
  );
}
