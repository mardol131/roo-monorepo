import React from "react";
import { DetailRow } from "./detail-row";
import { BoolBadge } from "./bool-badge";
import Text from "@/app/components/ui/atoms/text";
import { TagList } from "./tag";

type BooleanInfoItem = {
  type: "boolean";
  label: string;
  value: boolean | null | undefined;
};

type TextInfoItem = {
  type: "text";
  label: string;
  value: string;
};

type TagListInfoItem = {
  type: "tagList";
  label: string;
  items: (string | { name: string })[];
};

type InfoItem = BooleanInfoItem | TextInfoItem | TagListInfoItem;

type Props = {
  items: InfoItem[];
};

export default function InfoSection({ items }: Props) {
  return (
    <div>
      {items.map((item, index) => {
        switch (item.type) {
          case "boolean":
            return (
              <DetailRow key={index} label={item.label}>
                <BoolBadge value={item.value} />
              </DetailRow>
            );

          case "text":
            return (
              <DetailRow key={index} label={item.label}>
                <Text variant="body-sm" color="textDark">
                  {item.value}
                </Text>
              </DetailRow>
            );

          case "tagList":
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
