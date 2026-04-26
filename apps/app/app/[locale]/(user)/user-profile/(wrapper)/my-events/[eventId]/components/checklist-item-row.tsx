import Text from "@/app/components/ui/atoms/text";
import type { Event } from "@roo/common";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

type ChecklistItem = NonNullable<Event["checklist"]>[number];

type Props = {
  item: ChecklistItem;
  onToggle: () => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export default function ChecklistItemRow({ item, onToggle, onDelete, disabled }: Props) {
  const completed = !!item.completed;

  return (
    <div
      onClick={onToggle}
      className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50 transition-colors"
    >
      <div className="shrink-0 transition-transform duration-200 hover:scale-110">
        {completed ? (
          <MdCheckBox className={`w-6 h-6 text-success`} />
        ) : (
          <MdCheckBoxOutlineBlank
            className={`w-6 h-6 text-zinc-300 hover:text-zinc-400`}
          />
        )}
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Text
          variant="label-lg"
          color={completed ? "secondary" : "textDark"}
          className={`font-medium truncate ${completed ? "line-through" : ""}`}
        >
          {item.label}
        </Text>

        {(item.description || item.dueDate) && (
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            {item.description && (
              <span className="text-xs text-zinc-400">{item.description}</span>
            )}
            {item.dueDate && (
              <span className="flex items-center gap-1 text-xs text-zinc-400">
                {format(new Date(item.dueDate), "d. M. yyyy HH:mm", {
                  locale: cs,
                })}
              </span>
            )}
          </div>
        )}
      </div>

      {onDelete && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          disabled={disabled}
          className="shrink-0 text-zinc-300 hover:text-danger transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
