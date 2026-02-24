"use client";

import React from "react";
import { Check, Settings, Search, FileText, Calendar } from "lucide-react";
import Text from "@/app/components/ui/atoms/text";
import Button from "@/app/components/ui/atoms/button";
import { useOrderStore } from "@/app/store/order-store";

interface OrderStepSidebarProps {
  currentStep: number;
}

const steps = [
  {
    id: 1,
    title: "Výběr události",
    icon: Calendar,
  },
  {
    id: 2,
    title: "Výběr varianty",
    icon: Search,
  },
  {
    id: 3,
    title: "Kontrola varianty",
    icon: Settings,
  },
  {
    id: 4,
    title: "Vytvoření poptávky",
    icon: FileText,
  },
];

export default function OrderStepSidebar({}: OrderStepSidebarProps) {
  const { goToNextStep, goToPreviousStep, currentStep } = useOrderStore();

  return (
    <div className="w-80 h-full  rounded-2xl border border-zinc-200 p-6 overflow-y-auto flex flex-col">
      <div className="flex flex-col gap-1 mb-8">
        <Text variant="heading5" color="dark" className="font-bold">
          Postup objednávky
        </Text>
        <Text variant="label1" color="secondary">
          Projděte si jednotlivé kroky
        </Text>
      </div>

      <div className="flex flex-col gap-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const IconComponent = step.icon;

          return (
            <>
              <div key={step.id} className="flex gap-4 items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    isCompleted
                      ? "bg-primary border-primary text-white"
                      : isActive
                        ? "bg-white border-primary text-primary"
                        : "bg-white border-zinc-300 text-zinc-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <IconComponent className="w-5 h-5" />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <Text
                    variant="label1"
                    color={isActive || isCompleted ? "dark" : "secondary"}
                    className={`font-medium ${isActive ? "font-semibold" : ""}`}
                  >
                    {step.title}
                  </Text>
                </div>
              </div>
            </>
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
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Button
          onClick={goToPreviousStep}
          version="outlined"
          text="Zpět"
          size="sm"
        />
        <Button
          onClick={goToNextStep}
          version="primary"
          text="Pokračovat"
          size="sm"
        />
      </div>
    </div>
  );
}
