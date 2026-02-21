"use client";

import React from "react";
import { Check, Settings, Search, FileText } from "lucide-react";
import Text from "@/app/components/ui/atoms/text";

interface OrderStepSidebarProps {
  currentStep: number;
}

const steps = [
  {
    id: 1,
    title: "Výběr varianty",
    description: "Vyberte si vhodnou nabídku",
    icon: Search,
  },
  {
    id: 2,
    title: "Kontrola varianty",
    description: "Zkontrolujte si vybranou variantu",
    icon: Settings,
  },
  {
    id: 3,
    title: "Vytvoření poptávky",
    description: "Vyplňte údaje pro poptávku",
    icon: FileText,
  },
];

export default function OrderStepSidebar({
  currentStep,
}: OrderStepSidebarProps) {
  return (
    <div className="w-80 h-full bg-zinc-50 rounded-l-lg border-r border-zinc-200 p-6 overflow-y-auto flex flex-col">
      <div className="flex flex-col gap-1 mb-8">
        <Text variant="heading5" color="dark" className="font-bold">
          Postup objednávky
        </Text>
        <Text variant="body3" color="secondary">
          Projděte si jednotlivé kroky
        </Text>
      </div>

      <div className="flex flex-col gap-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const IconComponent = step.icon;

          return (
            <div key={step.id} className="flex items-start gap-4">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    isCompleted
                      ? "bg-zinc-900 border-zinc-900 text-white"
                      : isActive
                        ? "bg-white border-zinc-900 text-zinc-900"
                        : "bg-white border-zinc-300 text-zinc-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <IconComponent className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-8 mt-2 transition-colors ${
                      isCompleted ? "bg-zinc-900" : "bg-zinc-300"
                    }`}
                  />
                )}
              </div>

              {/* Step content */}
              <div className="flex flex-col gap-1 pb-3">
                <Text
                  variant="label1"
                  color={isActive || isCompleted ? "dark" : "secondary"}
                  className={`font-medium ${isActive ? "font-semibold" : ""}`}
                >
                  {step.title}
                </Text>
                <Text
                  variant="label3"
                  color={isActive || isCompleted ? "secondary" : "secondary"}
                  className="text-sm"
                >
                  {step.description}
                </Text>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress indicator */}
      <div className="mt-8 pt-6 border-t border-zinc-300">
        <div className="flex items-center justify-between mb-2">
          <Text variant="label3" color="secondary">
            Postup
          </Text>
          <Text variant="label3" color="dark" className="font-medium">
            {currentStep} z {steps.length}
          </Text>
        </div>
        <div className="w-full bg-zinc-200 rounded-full h-2">
          <div
            className="bg-zinc-900 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
