"use client";

import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import { useParams } from "next/navigation";
import OrderStepCreateInquiry from "./order-steps/order-step-create-inquiry";
import OrderStepReviewVariant from "./order-steps/order-step-review-variant";
import OrderStepSelectEvent from "./order-steps/order-step-select-event";
import OrderStepSelectVariant from "./order-steps/order-step-select-variant";
import OrderStepSidebar from "./order-step-sidebar";

type Props = {};

export default function Booking({}: Props) {
  const params = useParams();
  const listingId = params?.id as string;
  const { currentStep, currentOfferIndex } = useOrderStore();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <OrderStepSelectEvent />;
      case 2:
        return <OrderStepSelectVariant />;
      case 3:
        return <OrderStepReviewVariant />;
      case 4:
        return <OrderStepCreateInquiry />;
      default:
        return <OrderStepSelectEvent />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Výběr eventu";
      case 2:
        return "Výběr varianty";
      case 3:
        return "Kontrola varianty";
      case 4:
        return "Vytvoření poptávky";
      default:
        return "Výběr eventu";
    }
  };

  const getLabelTitle = () => {
    switch (currentStep) {
      case 1:
        return "Vyberte event";
      case 2:
        return "Vyberte variantu";
      case 3:
        return "Zkontrolujte variantu";
      case 4:
        return "Vytvořte poptávku";
      default:
        return "Vyberte event";
    }
  };

  const getDescription = () => {
    switch (currentStep) {
      case 1:
        return "Zvolte, zda chcete přidat dodavatele do existujícího eventu nebo vytvořit nový";
      case 2:
        return "Vyberte variantu služby, která vám nejvíce vyhovuje";
      case 3:
        return "Zkontrolujte si zvolenou variantu před vytvořením poptávky";
      case 4:
        return "Vyplňte potřebné údaje pro vytvoření poptávky";
      default:
        return "Zvolte, zda chcete přidat dodavatele do existujícího eventu nebo vytvořit nový";
    }
  };

  return (
    <div className="flex flex-col gap-10 items-center justify-start w-full px-6 min-h-screen py-8">
      <div className="w-full max-w-content">
        {/* Page Header */}
        <div className="mb-8">
          <Text variant="heading1" color="dark" className="font-bold mb-2">
            Objednávka služby
          </Text>
          <Text variant="subheading0" color="primary">
            {getStepTitle()}
          </Text>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-[300px_1fr] gap-15 bg-white">
          {/* Left Sidebar - Steps */}
          <div>
            <div className="sticky top-30">
              <OrderStepSidebar currentStep={currentStep} />
            </div>
          </div>

          {/* Right Content */}
          <div className="">
            <div className="flex items-center justify-between mb-4">
              <div className="pb-4 border-b border-zinc-200">
                <Text variant="heading5" color="dark" className="font-bold">
                  {getLabelTitle()}
                </Text>
                <Text variant="body3" color="secondary" className="mt-1">
                  {getDescription()}
                </Text>
              </div>
            </div>
            <div className="">{renderStepContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
