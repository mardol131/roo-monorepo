import Text from "@/app/components/ui/atoms/text";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
  text: string;
  description?: string;
  date: string;
  onEditClick: () => void;
  onDeleteClick?: () => void;
  disabled?: boolean;
};

export default function NoteCard({
  text,
  description,
  date,
  onEditClick,
  onDeleteClick,
  disabled,
}: Props) {
  return (
    <div className="relative flex flex-col gap-2 bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
      <Text
        variant="label-lg"
        color="textDark"
        className="font-medium leading-snug"
      >
        {text}
      </Text>

      {description && (
        <Text
          variant="body-sm"
          color="secondary"
          className="leading-relaxed whitespace-pre-wrap"
        >
          {description}
        </Text>
      )}
      <div className="border-t border-zinc-100 flex justify-between items-center pt-2">
        <Text variant="caption" color="textLight">
          {format(new Date(date), "d. M. yyyy, HH:mm", { locale: cs })}
        </Text>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onEditClick}
            disabled={disabled}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:border-zinc-300 transition-colors disabled:opacity-50"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          {onDeleteClick && (
            <button
              type="button"
              onClick={onDeleteClick}
              disabled={disabled}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-zinc-200 text-zinc-400 hover:text-danger hover:border-danger/30 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
