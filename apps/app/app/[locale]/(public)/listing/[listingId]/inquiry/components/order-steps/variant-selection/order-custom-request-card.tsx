"use client";

import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import { Check, PenLine } from "lucide-react";

export default function OrderCustomRequestCard() {
  const { inquiryMode, setInquiryMode } = useOrderStore();
  const isSelected = inquiryMode === "custom";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setInquiryMode("custom")}
      onKeyDown={(e) => e.key === "Enter" && setInquiryMode("custom")}
      className={`group relative flex items-center gap-4 text-left rounded-2xl border-2 transition-all cursor-pointer px-5 py-4 ${
        isSelected
          ? "border-primary shadow-md bg-white"
          : "border-dashed border-zinc-300 bg-white hover:border-zinc-400 hover:shadow-sm"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
          isSelected ? "bg-primary" : "bg-zinc-100"
        }`}
      >
        {isSelected ? (
          <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
        ) : (
          <PenLine className="w-4 h-4 text-zinc-500" />
        )}
      </div>
      <div className="flex-1 flex-col flex min-w-0">
        <Text variant="label-lg" color="textDark" className="font-semibold">
          Vlastní poptávka
        </Text>
        <Text variant="caption" color="secondary">
          Popište, co potřebujete — dodavatel vám připraví nabídku na míru
        </Text>
      </div>
    </div>
  );
}
