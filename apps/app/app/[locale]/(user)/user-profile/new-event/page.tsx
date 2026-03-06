import Text from "@/app/components/ui/atoms/text";
import React from "react";
import NewEventForm from "./components/new-event-form";
import PageHeading from "../../components/page-heading";

export default function page() {
  return (
    <main className="w-full">
      {/* Header */}
      <PageHeading
        heading="Nová událost"
        description="Vytvořte novou událost a začněte s plánováním."
      />

      <NewEventForm />
    </main>
  );
}
