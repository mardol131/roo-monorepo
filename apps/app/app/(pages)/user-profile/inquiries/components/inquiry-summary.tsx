import React from "react";
import Text from "@/app/components/ui/atoms/text";
import { CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { SummaryCard } from "../../components/summary-card";

type Props = {
  total: number;
  pending: number;
  confirmed: number;
};

export default function InquirySummary({ total, pending, confirmed }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <SummaryCard
        label="Celkem poptávek"
        value={String(total)}
        icon={MessageSquare}
        iconBg="bg-blue-50"
        iconColor="text-blue-500"
      />
      <SummaryCard
        label="Čeká na odpověď"
        value={String(pending)}
        icon={Clock}
        iconBg="bg-amber-50"
        iconColor="text-amber-500"
      />
      <SummaryCard
        label="Potvrzeno"
        value={String(confirmed)}
        icon={CheckCircle2}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-500"
      />
    </div>
  );
}
