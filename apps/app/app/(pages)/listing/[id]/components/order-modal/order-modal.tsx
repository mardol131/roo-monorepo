"use client";

import React from "react";
import ModalLayout from "@/app/components/ui/molecules/modal-layout";
import { useOrderStore } from "@/app/store/order-store";
import OrderStepSidebar from "./order-step-sidebar";
import OrderStepSelectVariant from "./order-step-select-variant";
import OrderStepReviewVariant from "./order-step-review-variant";
import OrderStepCreateInquiry from "./order-step-create-inquiry";
import Button from "@/app/components/ui/atoms/button";

export default function OrderModal() {
  const {
    isOrderModalOpen,
    currentStep,
    closeOrderModal,
    goToNextStep,
    goToPreviousStep,
  } = useOrderStore();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <OrderStepSelectVariant />;
      case 2:
        return <OrderStepReviewVariant />;
      case 3:
        return <OrderStepCreateInquiry />;
      default:
        return <OrderStepSelectVariant />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Výběr varianty";
      case 2:
        return "Kontrola varianty";
      case 3:
        return "Vytvoření poptávky";
      default:
        return "Výběr varianty";
    }
  };

  return (
    <ModalLayout
      header={getStepTitle()}
      isOpen={isOrderModalOpen}
      onClose={closeOrderModal}
      maxWidth="max-w-7xl"
    >
      <div className="flex bg-white rounded-lg overflow-hidden h-160 border border-zinc-200">
        {/* Left Sidebar - Steps */}
        <OrderStepSidebar currentStep={currentStep} />

        {/* Right Content */}
        <div className="flex-1 overflow-y-scroll">
          <div className="p-5">{renderStepContent()}</div>
          <div className="flex justify-between sticky bottom-0 bg-white border-t border-zinc-100 p-3">
            <Button
              text="Zpět"
              version="secondary"
              onClick={goToPreviousStep}
            />
            <Button
              text="Pokračovat"
              version="primary"
              onClick={goToNextStep}
            />
          </div>
        </div>
      </div>
    </ModalLayout>
  );
}
