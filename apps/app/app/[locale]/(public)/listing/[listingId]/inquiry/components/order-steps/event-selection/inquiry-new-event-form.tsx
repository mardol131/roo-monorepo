"use client";

import NewEventForm from "@/app/components/forms/new-event-form";
import { useOrderStore } from "@/app/store/order-store";

export default function InquiryNewEventForm() {
  const { setEventData, setEventVariant } = useOrderStore();

  return (
    <div className="mt-5">
      <NewEventForm
        hideToc
        onSuccess={(event) => {
          setEventData(event);
          setEventVariant("existing-event");
        }}
        onCancel={() => setEventVariant(null)}
        type="create-compact"
        bgSurfaceColor="bg-primary-surface"
        bgColor="bg-primary"
        textColor="text-primary"
        borderColor="border-primary"
        buttonColor="primary"
      />
    </div>
  );
}
