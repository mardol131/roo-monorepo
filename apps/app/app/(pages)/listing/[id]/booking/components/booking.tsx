"use client";

import Text from "@/app/components/ui/atoms/text";
import { useOrderStore } from "@/app/store/order-store";
import { useParams } from "next/navigation";
import OrderStepSelectEvent from "./order-steps/event-selection/order-step-select-event";
import OrderStepReviewVariant from "./order-steps/final-review/order-step-review-variant";
import OrderStepSelectVariant from "./order-steps/variant-selection/order-step-select-variant";
import { Event, EventData } from "@roo/common";

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
            <OrderStepSelectEvent existingEvents={mockEventsWithIds} />
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

// Mock data - TODO: Nahradit skutečnými event daty z databáze
export const mockEventsWithIds: Array<Event> = [
  {
    id: "1",
    data: {
      name: "Svatba Jana a Petry",
      icon: "Calendar",
      date: {
        start: new Date("2024-09-15"),
        end: new Date("2024-09-15"),
      },
      location: {
        id: "loc1",
        name: "Praha",
      },
      guests: {
        adults: 50,
        children: 10,
        ztp: false,
        pets: false,
      },
    },
  },
];
