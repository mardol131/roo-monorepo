"use client";

import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import { useParams } from "next/navigation";
import OrderStepSelectEvent from "./order-steps/event-selection/order-step-select-event";
import OrderStepReviewVariant from "./order-steps/final-review/order-step-review-variant";
import OrderStepSelectVariant from "./order-steps/variant-selection/order-step-select-variant";
import { Event, EventData } from "@roo/common";
import { MOCK_EVENTS } from "@/app/[locale]/(user)/user-profile/_mock/mock-data";

type Props = {};

export default function Booking({}: Props) {
  const params = useParams();
  const { isOrderStepActivated } = useOrderStore();

  return (
    <div className="flex flex-col gap-10 items-center justify-start w-full px-6 min-h-screen py-8">
      <div className="w-full max-w-listing-page">
        {/* Page Header */}
        <div className="mb-8">
          <Text variant="heading1" color="dark" className="font-bold mb-2">
            Poptávka dodavatele
          </Text>
        </div>

        <div className="flex flex-col gap-10">
          <div
            className={
              isOrderStepActivated(1) ? "" : "pointer-events-none opacity-30"
            }
          >
            <OrderStepSelectEvent existingEvents={MOCK_EVENTS} />
          </div>
          <div
            className={
              isOrderStepActivated(2) ? "" : "pointer-events-none opacity-30"
            }
          >
            <OrderStepSelectVariant />
          </div>
          <div className={isOrderStepActivated(3) ? "" : "hidden"}>
            <OrderStepReviewVariant />
          </div>
        </div>
      </div>
    </div>
  );
}
