"use client";

import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { useRouter } from "@/app/i18n/navigation";
import { Check } from "lucide-react";
import * as lucideIcons from "lucide-react";
import { ReactNode } from "react";

interface Step {
  key: string;
  label: string;
  icon?: string;
}

interface Props {
  steps: Step[];
  currentStep: number;
  maxReachedStep: number;
  onStepClick: (step: number) => void;
  onBack: () => void;
  onNext: () => void;
  isLastStep: boolean;
  isSubmitting: boolean;
  children: ReactNode;
  preview: ReactNode;
}

function StepIcon({ iconName }: { iconName: string }) {
  const Icon = lucideIcons[iconName as keyof typeof lucideIcons] as
    | React.ComponentType<{ className?: string }>
    | undefined;
  if (!Icon) return null;
  return <Icon className="w-3.5 h-3.5" />;
}

export default function InquiryWizardLayout({
  steps,
  currentStep,
  maxReachedStep,
  onStepClick,
  onBack,
  onNext,
  isLastStep,
  isSubmitting,
  children,
  preview,
}: Props) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-50/60 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-2">
          {steps.map((step, i) => {
            const isCompleted = i < currentStep;
            const isCurrent = i === currentStep;
            const isReachable = i <= maxReachedStep && !isCurrent;
            // Count only non-icon steps up to and including this one
            const numberedIndex = steps
              .slice(0, i + 1)
              .filter((s) => !s.icon).length;

            return (
              <div key={step.key} className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!isReachable}
                  onClick={() => isReachable && onStepClick(i)}
                  className={`flex items-center gap-2.5 ${isReachable ? "cursor-pointer" : "cursor-default"}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                      isCompleted
                        ? "bg-primary text-white"
                        : isCurrent
                          ? "bg-primary text-white ring-2 ring-primary ring-offset-2"
                          : "bg-zinc-200 text-zinc-500"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    ) : step.icon ? (
                      <StepIcon iconName={step.icon} />
                    ) : (
                      numberedIndex
                    )}
                  </div>
                  <Text
                    variant="label"
                    className={`hidden sm:block transition-colors ${
                      isCurrent
                        ? "text-primary font-semibold"
                        : isReachable
                          ? "text-zinc-600 hover:text-primary"
                          : "text-zinc-400"
                    }`}
                  >
                    {step.label}
                  </Text>
                </button>
                {i < steps.length - 1 && (
                  <div
                    className={`h-px w-6 sm:w-10 transition-colors ${
                      isCompleted ? "bg-primary" : "bg-zinc-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 items-start py-5">
          {/* ── Left column: stepper + content + navigation ───────────────── */}
          <div className="flex flex-col gap-5">
            {/* Stepper */}

            {/* Step content */}
            <div>{children}</div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                text="Zpět na inzerát"
                version="plain"
                iconLeft="ArrowLeft"
                onClick={() => router.back()}
              />
              <div className="flex items-center gap-3">
                {currentStep > 0 && (
                  <Button
                    text="Zpět"
                    version="outlined"
                    iconLeft="ArrowLeft"
                    onClick={onBack}
                  />
                )}
                <Button
                  text={isLastStep ? "Odeslat poptávku" : "Další"}
                  version="primary"
                  iconRight={isLastStep ? "Send" : "ArrowRight"}
                  onClick={onNext}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* ── Right column: live preview ────────────────────────────────── */}
          <div className="hidden relative h-full lg:block">
            <div className="sticky top-24">{preview}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
