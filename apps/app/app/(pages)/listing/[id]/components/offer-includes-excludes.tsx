import Text from "@/app/components/ui/atoms/text";
import React from "react";

type Props = {};

export function OfferIncludesExcludes({
  title,
  items,
  icon,
  colorClass,
}: {
  title: string;
  items: string[];
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  colorClass: string;
}) {
  const IconComponent = icon;
  return (
    <div className="flex flex-col gap-4 border-zinc-300 rounded-2xl">
      <Text variant="label1" color="dark" className="font-semibold">
        {title}
      </Text>
      <div className="flex flex-col gap-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <IconComponent
              className={`w-4 h-4 ${colorClass} flex-shrink-0 mt-0.5`}
            />
            <Text variant="label2" color="dark" className="leading-tight">
              {item}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
