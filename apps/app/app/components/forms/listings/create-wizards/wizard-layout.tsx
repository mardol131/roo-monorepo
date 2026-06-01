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
}: Props) {
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
                    isCompleted
                      ? "bg-listing text-white"
                      : isCurrent
                        ? "bg-listing text-white ring-2 ring-listing ring-offset-2"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? "✓" : i + 1}
                </div>
                <Text
                  variant="label"
                  className={`hidden sm:block transition-colors ${
                    isCurrent
                      ? "text-listing"
                      : isReachable
                        ? "text-gray-600 hover:text-listing"
                        : "text-gray-400"
                  }`}
                >
                  {label}
                </Text>
              </button>
              {i < steps.length - 1 && (
                <div
                  className={`h-px w-6 sm:w-10 transition-colors ${isCompleted ? "bg-listing" : "bg-gray-200"}`}
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
            version="listingFull"
            iconRight={isLastStep ? undefined : "ArrowRight"}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
