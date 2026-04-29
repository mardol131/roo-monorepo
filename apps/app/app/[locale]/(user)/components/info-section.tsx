import React from "react";
import { DetailRow } from "./detail-row";
import { BoolBadge } from "./bool-badge";
import Text from "@/app/components/ui/atoms/text";
import { TagList } from "./tag";

type BooleanInfoItem = {
  type: "boolean";
  label: string;
  value?: boolean | null | undefined;
};

type TextInfoItem = {
  type: "text";
  label: string;
  value?: string | null | undefined;
};

type TagListInfoItem = {
  type: "tagList";
  label: string;
  items?: (string | { name: string })[];
};

type InfoItem = BooleanInfoItem | TextInfoItem | TagListInfoItem;

type Props = {
  items: InfoItem[];
};

export default function InfoSection({ items }: Props) {
  return (
    <div>
      {items.map((item, index) => {
        if (
          "value" in item &&
          (item.value === null || item.value === undefined)
        ) {
          return null;
        }
        if (item.type === "boolean") {
          return (
            <DetailRow key={index} label={item.label}>
              <BoolBadge value={item.value} />
            </DetailRow>
          );
        } else if (item.type === "text") {
          return (
            <DetailRow key={index} label={item.label}>
              <Text variant="body-sm" color="textDark">
                {item.value}
              </Text>
            </DetailRow>
          );
        } else if (item.type === "tagList") {
          return (
            <DetailRow key={index} label={item.label}>
              <TagList items={item.items} />
            </DetailRow>
          );
        }
      })}
    </div>
  );
}
