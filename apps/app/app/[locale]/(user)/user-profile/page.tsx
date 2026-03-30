import { Calendar, MessageSquare } from "lucide-react";
import PageHeading from "../components/page-heading";
import RowContainer from "../components/row-container";
import { getInquiries, MOCK_EVENTS, STATS } from "./_mock/mock-data";
import { EventRow } from "../components/collection-components/event-row";
import { InquiryRow } from "../components/collection-components/inquiry-row";
import { SummaryCard } from "./components/summary-card";

export default function UserProfilePage() {
  const events = MOCK_EVENTS.slice(0, 3);
  const inquiries = getInquiries().slice(0, 5);

  return (
    <main className="w-full">
      {/* Header */}
      <PageHeading
        heading="Přehled"
        description="Vítejte zpět! Zde je přehled vašich aktivit."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <SummaryCard
            key={label}
            label={label}
            value={value}
            icon={Icon}
            iconBg={color}
            iconColor=""
          />
        ))}
      </div>

      {/* Recent events */}
      <RowContainer
        icon={<Calendar className="w-4 h-4 text-rose-500" />}
        label="Nedávné události"
        rowComponents={events.map((event) => (
          <EventRow key={event.id} event={event} />
        ))}
        emptyHeading="Zatím žádné události"
        emptyText="Vytvořte první událost a začněte plánovat svou akci."
        className="mb-10"
      />

      {/* Recent inquiries */}

      <RowContainer
        icon={<MessageSquare className="w-4 h-4 text-rose-500" />}
        label="Nedávné poptávky"
        rowComponents={inquiries.map((inquiry) => (
          <InquiryRow
            key={inquiry.id}
            inquiry={inquiry}
            eventId={inquiry.event.id}
          />
        ))}
        emptyHeading="Zatím žádné poptávky"
        emptyText="Přejděte do katalogu a oslovte dodavatele pro svou akci."
      />
    </main>
  );
}
