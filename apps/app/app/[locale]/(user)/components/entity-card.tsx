import Text from "@/app/components/ui/atoms/text";
import { Link, IntlLink } from "@/app/i18n/navigation";
import { ChevronRight, icons } from "lucide-react";
import { ReactNode } from "react";

type Item =
  | {
      icon: keyof typeof icons;
      content?: string | null;
    }
  | undefined;

type Props = {
  icon: keyof typeof icons;
  iconColor: string;
  iconBackgroundColor: string;
  label: string;
  items: Item[];
  link?: IntlLink;
  labelComponent?: ReactNode;
  rightComponent?: ReactNode;
  onClick?: () => void;
  hideLinkIcon?: boolean;
};

export default function EntityCard({
  icon,
  iconColor,
  iconBackgroundColor,
  label,
  items,
  link,
  labelComponent,
  rightComponent,
  hideLinkIcon = false,
  onClick,
}: Props) {
  const Icon = icons[icon];

  const content = (
    <div
      className="group bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all px-6 py-5 flex items-center gap-5"
      onClick={onClick}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBackgroundColor}`}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5">
          <Text
            variant="label-lg"
            color="textDark"
            className="font-semibold truncate"
          >
            {label}
          </Text>
          {labelComponent}
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {items
            .filter((item) => item !== undefined)
            .map((item, i) => {
              const ItemIcon = icons[item.icon];
              return (
                <span
                  key={i}
                  className="flex items-center gap-1.5 text-xs text-zinc-500"
                >
                  <ItemIcon className="w-3.5 h-3.5" />
                  {item.content}
                </span>
              );
            })}
        </div>
      </div>

      {rightComponent}
      {!hideLinkIcon && (
        <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors shrink-0" />
      )}
    </div>
  );

  if (link) {
    return (
      <Link href={link} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
