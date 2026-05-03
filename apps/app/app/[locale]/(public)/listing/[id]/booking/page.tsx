"use client";
import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import OrderStepSelectEvent from "./components/order-steps/event-selection/order-step-select-event";
import OrderStepSelectVariant from "./components/order-steps/variant-selection/order-step-select-variant";
import OrderStepReviewVariant from "./components/order-steps/final-review/order-step-review-variant";
import { useEvents } from "@/app/react-query/events/hooks";

type Props = {};

export default function Booking({}: Props) {
  const { isOrderStepActivated } = useOrderStore();
  const { data: events } = useEvents();

  return (
    <div className="flex flex-col gap-10 items-center justify-start w-full px-6 min-h-screen py-8">
      <div className="w-full max-w-listing-page">
        {/* Page Header */}
        <div className="mb-8">
          <Text variant="h1" color="textDark" className="font-bold mb-2">
            Poptávka dodavatele
          </Text>
        </div>

        <div className="flex flex-col gap-10">
          <div
            className={
              isOrderStepActivated(1) ? "" : "pointer-events-none opacity-30"
            }
          >
            <OrderStepSelectEvent existingEvents={events?.docs} />
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
