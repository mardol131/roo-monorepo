import Text from "@/app/components/ui/atoms/text";
import { confirmActionModalEvents } from "@/app/components/ui/molecules/modals/confirm-action-modal";
import { Link, IntlLink } from "@/app/i18n/navigation";
import { LucideIcons } from "@roo/common";
import { de } from "date-fns/locale";
import * as lucideIcons from "lucide-react";
import { Fragment, ReactNode } from "react";

type Item =
  | {
      icon: LucideIcons;
      content?: string | null;
    }
  | undefined;

type Props = {
  icon: LucideIcons;
  rightIcon?: LucideIcons;
  iconColor: string;
  iconBackgroundColor: string;
  label: string;
  items: Item[];
  link?: IntlLink;
  target?: React.HTMLAttributeAnchorTarget;
  labelComponent?: ReactNode | ReactNode[];
  rightComponent?: ReactNode;
  onClick?: () => void;
  hideRightIcon?: boolean;
  deleteEntityHandler?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  plain?: boolean;
};

export default function EntityCard({
  icon,
  rightIcon,
  iconColor,
  iconBackgroundColor,
  label,
  items,
  link,
  target,
  labelComponent,
  rightComponent,
  hideRightIcon = false,
  onClick,
  deleteEntityHandler,
  plain = false,
}: Props) {
  const Icon = lucideIcons[icon] as React.ElementType;
  const RightIcon = rightIcon
    ? (lucideIcons[rightIcon] as React.ElementType)
    : null;

  const content = (
    <div
      className={`group w-full bg-white rounded-2xl ${plain ? "p-1 hover:bg-zinc-50" : "border-zinc-200 border hover:border-zinc-300 px-6 py-5 hover:shadow-sm"}  transition-all flex items-center gap-5`}
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
          {Array.isArray(labelComponent)
            ? labelComponent.map((component, index) => (
                <Fragment key={index}>{component}</Fragment>
              ))
            : labelComponent}
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {items
            .filter((item) => item !== undefined)
            .map((item, i) => {
              const ItemIcon = lucideIcons[item.icon] as React.ElementType;
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
      {!hideRightIcon &&
        (RightIcon ? (
          <RightIcon className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors shrink-0" />
        ) : (
          <lucideIcons.ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors shrink-0" />
        ))}
    </div>
  );

  if (link) {
    return (
      <div className="flex gap-4">
        <Link href={link} target={target} className="block w-full">
          {content}
        </Link>
        {deleteEntityHandler && (
          <button
            type="button"
            className="cursor-pointer"
            onClick={deleteEntityHandler}
          >
            <lucideIcons.Trash2 className="w-5 h-5 text-zinc-400 hover:text-danger smooth" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {content}
      {deleteEntityHandler && (
        <button
          type="button"
          className="cursor-pointer"
          onClick={deleteEntityHandler}
        >
          <lucideIcons.Trash2 className="w-5 h-5 text-zinc-400 hover:text-danger smooth" />
        </button>
      )}
    </div>
  );
}
