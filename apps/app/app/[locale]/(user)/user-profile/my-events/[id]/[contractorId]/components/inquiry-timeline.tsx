"use client";

import React from "react";
import Text from "@/app/components/ui/atoms/text";
import { Check, CheckCircle2, Clock, Send, XCircle } from "lucide-react";
import type { InquiryStatus } from "../types";

const STATUS_STEPS: {
  label: string;
  icon: React.ElementType;
}[] = [
  { label: "Odesláno", icon: Send },
  { label: "Čeká na odpověď", icon: Clock },
  { label: "Potvrzeno", icon: CheckCircle2 },
];

function getActiveStep(status: InquiryStatus): number {
  if (status === "confirmed" || status === "declined") return 2;
  if (status === "pending") return 1;
  return 0;
}

export default function InquiryTimeline({
  status,
}: {
  status: InquiryStatus;
}) {
  const activeStep = getActiveStep(status);

  if (status === "declined") {
    return (
      <div className="flex items-center w-full">
        {[
          { label: "Odesláno", icon: Send, done: true },
          { label: "Odmítnuto", icon: XCircle, done: false },
        ].map((step, i, arr) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${
                    step.done
                      ? "bg-emerald-500 border-emerald-500"
                      : "bg-white border-red-400"
                  }`}
                >
                  {step.done ? (
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  ) : (
                    <Icon className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <Text
                  variant="label4"
                  color="secondary"
                  className={!step.done ? "text-red-500 font-semibold" : ""}
                >
                  {step.label}
                </Text>
              </div>
              {i < arr.length - 1 && (
                <div className="h-0.5 flex-1 mb-5 bg-red-200" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center w-full">
      {STATUS_STEPS.map((step, i) => {
        const done = i < activeStep;
        const active = i === activeStep;
        const Icon = step.icon;
        return (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center gap-2 flex-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                  done
                    ? "bg-emerald-500 border-emerald-500"
                    : active
                      ? "bg-white border-rose-500"
                      : "bg-white border-zinc-200"
                }`}
              >
                {done ? (
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                ) : (
                  <Icon
                    className={`w-4 h-4 ${active ? "text-rose-500" : "text-zinc-300"}`}
                  />
                )}
              </div>
              <Text
                variant="label4"
                color={active ? "dark" : "secondary"}
                className={active ? "font-semibold" : ""}
              >
                {step.label}
              </Text>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mb-5 transition-colors ${
                  i < activeStep ? "bg-emerald-400" : "bg-zinc-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
