import Text from "@/app/components/ui/atoms/text";
import { MessageCircle } from "lucide-react";

export function EmptyState({
  text,
  subtext,
}: {
  text: string;
  subtext: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center mb-4">
        <MessageCircle className="w-6 h-6 text-zinc-400" />
      </div>
      <Text variant="label-lg" color="textDark" className="font-semibold mb-1">
        {text}
      </Text>
      <Text variant="caption" color="secondary" className="max-w-xs">
        {subtext}
      </Text>
    </div>
  );
}
