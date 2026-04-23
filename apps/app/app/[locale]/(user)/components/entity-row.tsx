import Text from "@/app/components/ui/atoms/text";
import { Link, IntlLink } from "@/app/i18n/navigation";
import { ChevronRight, icons } from "lucide-react";
import { ReactNode } from "react";

type Item = {
  icon: keyof typeof icons;
  content: string;
};

type Props = {
  icon: keyof typeof icons;
  iconColor: string;
  iconBackgroundColor: string;
  label: string;
  items: Item[];
  link: IntlLink;
  rightComponent?: ReactNode;
  labelComponent?: ReactNode;
};

export default function EntityRow({
  icon,
  iconColor,
  iconBackgroundColor,
  label,
  items,
  link,
  rightComponent,
  labelComponent,
}: Props) {
  const Icon = icons[icon];

  return (
    <Link
      href={link}
      className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 transition-colors group"
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBackgroundColor}`}
      >
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex gap-3">
          <Text
            variant="label-lg"
            color="textDark"
            className="font-medium truncate"
          >
            {label}
          </Text>
          {labelComponent}
        </div>
        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
          {items.map((item, i) => {
            const ItemIcon = icons[item.icon];
            return (
              <span
                key={i}
                className="flex items-center gap-1 text-xs text-zinc-400"
              >
                <ItemIcon className="w-3 h-3" />
                {item.content}
              </span>
            );
          })}
        </div>
      </div>

      {rightComponent}

      <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0" />
    </Link>
  );
}
