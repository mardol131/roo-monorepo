"use client";

import React from "react";
import Text from "@/app/components/ui/atoms/text";
import { Check, Clock, HandshakeIcon, Send, UserCheck, XCircle } from "lucide-react";
import { Inquiry } from "@roo/common";

type StepState = "done" | "active" | "dimmed" | "cancelled";

type Step = {
  label: string;
  icon: React.ElementType;
  state: StepState;
};

export default function InquiryTimeline({
  userStatus,
  companyStatus,
}: {
  userStatus: Inquiry["userStatus"];
  companyStatus: Inquiry["companyStatus"];
}) {
  const isCancelled =
    userStatus === "cancelled" || companyStatus === "cancelled";
  const bothConfirmed =
    userStatus === "confirmed" && companyStatus === "confirmed";

  const cancelledLabel = isCancelled
    ? userStatus === "cancelled"
      ? "Zrušeno zákazníkem"
      : "Zrušeno firmou"
    : "Zrušeno";

  const steps: Step[] = [
    {
      label: "Přijato",
      icon: Send,
      state: "done",
    },
    {
      label: "V jednání",
      icon: Clock,
      state: isCancelled ? "dimmed" : bothConfirmed ? "done" : "active",
    },
    {
      label: "Přijato zákazníkem",
      icon: UserCheck,
      state:
        userStatus === "confirmed"
          ? "done"
          : isCancelled
            ? "dimmed"
            : "active",
    },
    {
      label: "Přijato firmou",
      icon: HandshakeIcon,
      state:
        companyStatus === "confirmed"
          ? "done"
          : isCancelled
            ? "dimmed"
            : "active",
    },
    {
      label: cancelledLabel,
      icon: XCircle,
      state: isCancelled ? "cancelled" : "dimmed",
    },
  ];

  const getConnectorColor = (fromIndex: number) => {
    // Connector leading to the cancelled step
    if (fromIndex === steps.length - 2) {
      return isCancelled ? "bg-red-300" : "bg-zinc-200";
    }
    return steps[fromIndex].state === "done" ? "bg-emerald-400" : "bg-zinc-200";
  };

  return (
    <div className="flex items-start w-full">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isDone = step.state === "done";
        const isActive = step.state === "active";
        const isCancelledStep = step.state === "cancelled";

        return (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-2 flex-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isDone
                    ? "bg-emerald-500 border-emerald-500"
                    : isActive
                      ? "bg-white border-amber-400"
                      : isCancelledStep
                        ? "bg-white border-red-400"
                        : "bg-white border-zinc-200"
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                ) : (
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? "text-amber-400"
                        : isCancelledStep
                          ? "text-red-400"
                          : "text-zinc-300"
                    }`}
                  />
                )}
              </div>
              <Text
                variant="caption"
                color={
                  isCancelledStep
                    ? "danger"
                    : isDone || isActive
                      ? "textDark"
                      : "secondary"
                }
                className={`text-center ${isActive || isCancelledStep ? "font-semibold" : ""}`}
              >
                {step.label}
              </Text>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mt-4.5 transition-colors ${getConnectorColor(i)}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
