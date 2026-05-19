"use client";

import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import OrderStepSelectEvent from "./components/order-steps/event-selection/order-step-select-event";
import OrderStepSelectVariant from "./components/order-steps/variant-selection/order-step-select-variant";
import OrderStepFinalReview from "./components/order-steps/final-review/order-step-final-review";
import OrderStepSuccess from "./components/order-steps/success/order-step-success";
import OrderStepFillCustomRequest from "./components/order-steps/custom-request/order-step-fill-custom-request";
import { useListing } from "@/app/react-query/listings/hooks";
import { useParams } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import Button from "@/app/components/ui/atoms/button";
import { useRouter } from "@/app/i18n/navigation";

export default function Page() {
  const { isOrderStepActivated, setCurrentStep, inquiryMode } = useOrderStore();
  const router = useRouter();

  const step2Active = isOrderStepActivated(2);
  const step3Active = isOrderStepActivated(3);
  const isSuccess = isOrderStepActivated(4);
  const showCustomForm = step2Active && inquiryMode === "custom";

  return (
    <div className="min-h-screen bg-zinc-50/60 pb-50">
      {/* Header */}
      <div className="max-w-3xl mx-auto pt-8 pr-3 flex items-center justify-between gap-3">
        <Button
          text="Zpět na inzerát"
          version="plain"
          onClick={() => router.back()}
          iconLeft="ArrowLeft"
        />
        <Text variant="h4" color="textDark" className="font-semibold truncate">
          Vytvoření poptávky
        </Text>
      </div>

      {/* Step cards */}
      <div className="px-6 py-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {isSuccess ? (
            <StepCard>
              <OrderStepSuccess />
            </StepCard>
          ) : (
            <>
              <StepCard>
                <OrderStepSelectEvent />
              </StepCard>

              {step2Active ? (
                <StepCard>
                  <OrderStepSelectVariant />
                </StepCard>
              ) : (
                <LockedCard label="Nejprve vyberte nebo vytvořte událost" />
              )}

              {showCustomForm && (
                <StepCard>
                  <OrderStepFillCustomRequest />
                </StepCard>
              )}

              {step3Active ? (
                <StepCard>
                  <OrderStepFinalReview
                    onSuccess={() => {
                      setCurrentStep(4);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                </StepCard>
              ) : step2Active && !showCustomForm ? (
                <LockedCard label="Nejprve vyberte variantu nebo vyplňte vlastní poptávku" />
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StepCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="p-6">{children}</div>
    </div>
  );
}

function LockedCard({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-5 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
        <Lock className="w-4 h-4 text-zinc-400" />
      </div>
      <Text variant="label" color="secondary">
        {label}
      </Text>
    </div>
  );
}
