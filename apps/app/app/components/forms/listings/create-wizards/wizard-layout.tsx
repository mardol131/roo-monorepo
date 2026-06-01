"use client";

import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";

type Props = {
  steps: string[];
  currentStep: number;
  maxReachedStep: number;
  onStepClick: (step: number) => void;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
  isLastStep: boolean;
  isSubmitting: boolean;
  children: React.ReactNode;
  colorScheme?: "listing" | "variant";
};

export default function WizardLayout({
  steps,
  currentStep,
  maxReachedStep,
  onStepClick,
  onBack,
  onNext,
  onCancel,
  isLastStep,
  isSubmitting,
  children,
  colorScheme = "listing",
}: Props) {
  const isVariant = colorScheme === "variant";
  const completedCircle = isVariant ? "bg-variant text-white" : "bg-listing text-white";
  const currentCircle = isVariant
    ? "bg-variant text-white ring-2 ring-variant ring-offset-2"
    : "bg-listing text-white ring-2 ring-listing ring-offset-2";
  const currentLabel = isVariant ? "text-variant" : "text-listing";
  const reachableLabel = isVariant ? "text-gray-600 hover:text-variant" : "text-gray-600 hover:text-listing";
  const completedLine = isVariant ? "bg-variant" : "bg-listing";
  const btnVersion = isVariant ? "variantFull" as const : "listingFull" as const;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        {steps.map((label, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;
          const isReachable = i <= maxReachedStep && !isCurrent;

          return (
            <div key={i} className="flex items-center gap-2">
              <button
                type="button"
                disabled={!isReachable}
                onClick={() => isReachable && onStepClick(i)}
                className={`flex items-center gap-3 ${isReachable ? "cursor-pointer" : "cursor-default"}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    isCompleted ? completedCircle : isCurrent ? currentCircle : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? "✓" : i + 1}
                </div>
                <Text
                  variant="label"
                  className={`hidden sm:block transition-colors ${
                    isCurrent ? currentLabel : isReachable ? reachableLabel : "text-gray-400"
                  }`}
                >
                  {label}
                </Text>
              </button>
              {i < steps.length - 1 && (
                <div
                  className={`h-px w-6 sm:w-10 transition-colors ${isCompleted ? completedLine : "bg-gray-200"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col w-full gap-5">{children}</div>

      <div className="flex justify-between pt-2">
        <Button
          htmlType="button"
          text="Zrušit"
          onClick={onCancel}
          version="plain"
        />
        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button
              htmlType="button"
              text="Zpět"
              onClick={onBack}
              version="plain"
              iconLeft="ArrowLeft"
            />
          )}
          <Button
            htmlType="button"
            text={isLastStep ? "Vytvořit" : "Další"}
            onClick={onNext}
            version={btnVersion}
            iconRight={isLastStep ? undefined : "ArrowRight"}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
