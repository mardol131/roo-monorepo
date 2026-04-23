import Text from "@/app/components/ui/atoms/text";
import { ElementType } from "react";

type Props = {
  heading: string;
  items: string[];
  icon: ElementType;
  iconColor: string;
  iconBgColor: string;
};

export function ItemListCard({
  heading,
  items,
  icon: Icon,
  iconColor,
  iconBgColor,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5">
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBgColor}`}
        >
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        </div>
        <Text variant="h4" color="textDark">
          {heading}
        </Text>
      </div>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <Icon className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
            <Text variant="body-sm" color="textDark">
              {item}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  );
}
