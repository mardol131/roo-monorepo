"use client";

import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import OrderStepSelectEvent from "./components/order-steps/event-selection/order-step-select-event";
import OrderStepSelectVariant from "./components/order-steps/variant-selection/order-step-select-variant";
import OrderStepFinalReview from "./components/order-steps/final-review/order-step-final-review";
import OrderStepSuccess from "./components/order-steps/success/order-step-success";
import OrderStepFillCustomRequest from "./components/order-steps/custom-request/order-step-fill-custom-request";
import { useParams } from "next/navigation";
import { Info, Lock } from "lucide-react";
import Button from "@/app/components/ui/atoms/button";
import { useRouter } from "@/app/i18n/navigation";
import { useVariantsByListing } from "@/app/react-query/variants/hooks";
import { useEffect } from "react";
import { AlertSection } from "@/app/components/ui/molecules/alert-section";

export default function Page() {
  const { isOrderStepActivated, setCurrentStep, inquiryMode, setInquiryMode } = useOrderStore();
  const router = useRouter();
  const params = useParams<{ listingId: string }>();
  const { data: variants } = useVariantsByListing(params.listingId);

  const hasNoVariants = variants !== undefined && (variants.docs?.length ?? 0) === 0;

  const step2Active = isOrderStepActivated(2);
  const step3Active = isOrderStepActivated(3);
  const isSuccess = isOrderStepActivated(4);
  const showCustomForm = step2Active && inquiryMode === "custom";

  useEffect(() => {
    if (step2Active && hasNoVariants && inquiryMode === null) {
      setInquiryMode("custom");
    }
  }, [step2Active, hasNoVariants, inquiryMode, setInquiryMode]);

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

              {!hasNoVariants && (
                step2Active ? (
                  <StepCard>
                    <OrderStepSelectVariant />
                  </StepCard>
                ) : (
                  <LockedCard label="Nejprve vyberte nebo vytvořte událost" />
                )
              )}

              {hasNoVariants && step2Active && (
                <AlertSection
                  icon={Info}
                  iconBg="bg-blue-100"
                  iconColor="text-blue-500"
                  borderColor="border-blue-200"
                  bgColor="bg-blue-50"
                  title="Inzerát nemá připravené varianty"
                  text="Dodavatel zatím nenabízí žádné předpřipravené varianty. Vytvořte vlastní poptávku a popište své požadavky."
                />
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
