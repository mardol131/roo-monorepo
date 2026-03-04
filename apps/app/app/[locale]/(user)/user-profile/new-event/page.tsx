import Text from "@/app/components/ui/atoms/text";
import React from "react";
import NewEventForm from "./components/new-event-form";

export default function page() {
  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <Text variant="heading4" color="dark" className="font-bold">
            Nová událost
          </Text>
          <Text variant="label2" color="secondary" className="mt-1">
            Vyplňte informace o vaší události.
          </Text>
        </div>

        <NewEventForm />
      </div>
    </main>
  );
}
