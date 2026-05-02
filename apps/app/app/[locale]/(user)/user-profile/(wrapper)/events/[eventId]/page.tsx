"use client";

import { EVENT_STATUS } from "@/app/data/event";
import {
  aggregateInquiryStatus,
  formatEventAddress,
  formatGuestsString,
  getIdFromRelationshipField,
} from "@roo/common";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import type { LucideIcon } from "lucide-react";
import * as lucideIcons from "lucide-react";
import {
  ArrowLeft,
  Banknote,
  Calendar,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getInquiries, MOCK_EVENT } from "../../../../../../_mock/mock";
import DashboardHeader from "../../../../components/dashboard-header";
import EntityRow from "../../../../components/entity-row";
import RowContainer from "../../../../components/row-container";
import { SummaryCard } from "../../../../components/summary-card";
import InquiryStatusTag from "../../../../components/tags/inquiry-status-tag";
import { useEvent } from "@/app/react-query/events/hooks";
import { useParams } from "next/navigation";
import Loader from "@/app/[locale]/(user)/components/loader";
import { useRouter } from "@/app/i18n/navigation";
import EventStatusTag from "@/app/[locale]/(user)/components/tags/event-status-tag";
import { useTranslations } from "next-intl";
import { useInquiries } from "@/app/react-query/inquiries/hooks";
import EventNotesSection from "./components/event-notes-section";
import EventChecklistSection from "./components/event-checklist-section";
import { ControlSection } from "@/app/[locale]/(user)/components/control-section";
import { confirmActionModalEvents } from "@/app/components/ui/molecules/modals/confirm-action-modal";

// ── Page ───────────────────────────────────────────────────────────────────────

export default function page() {
  const { eventId } = useParams<{ eventId: string }>();

  const { data: event, isPending } = useEvent(eventId);

  const router = useRouter();

  const t = useTranslations();

  const { data: inquiries } = useInquiries();

  if (isPending) return <Loader text="Načítání události..." />;
  if (!event) return router.back();

  const Icon =
    (lucideIcons[event.icon as keyof typeof lucideIcons] as LucideIcon) ??
    Calendar;

  const confirmed = inquiries?.filter(
    (i) => aggregateInquiryStatus(i) === "confirmed",
  );
  const pending = inquiries?.filter(
    (i) => aggregateInquiryStatus(i) === "pending",
  );
  const totalCost = confirmed
    ? confirmed
        .reduce(
          (sum, i) =>
            sum + (i.pricing.agreedPrice || i.pricing.quotedPrice || 0),
          0,
        )
        .toLocaleString("cs-CZ")
    : "0";

  return (
    <main className="w-full">
      {/* Back + header */}
      <Link
        href="/user-profile/events"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Zpět na události
      </Link>
      <DashboardHeader
        iconBg="bg-event-surface"
        iconColor="text-event"
        icon={Icon}
        name={event.name}
        nameSideComponent={<EventStatusTag eventStatus={event.status} />}
        infoItems={[
          { icon: "MapPin", text: formatEventAddress(event) },
          {
            icon: "Calendar",
            text: `${format(event.date.start, "d. M. yyyy", {
              locale: cs,
            })} ${format(event.date.start, "HH:mm", {
              locale: cs,
            })} – ${format(event.date.end, "HH:mm", { locale: cs })}`,
          },
          {
            icon: "Users",
            text: formatGuestsString({ ...event.guests }),
          },
        ]}
      />

      <div className="flex flex-col gap-5">
        {" "}
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <SummaryCard
            label="Celkem poptávek"
            value={String(inquiries?.length || 0)}
            icon={MessageSquare}
            iconBg="bg-blue-50"
            iconColor="text-blue-500"
          />
          <SummaryCard
            label="Potvrzeno"
            value={String(confirmed?.length || 0)}
            icon={CheckCircle2}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-500"
          />
          <SummaryCard
            label="Odhadované náklady"
            value={`${totalCost} Kč`}
            icon={Banknote}
            iconBg="bg-rose-50"
            iconColor="text-rose-500"
            note="pouze potvrzené"
          />
        </div>
        {/* Inquiries */}
        <RowContainer
          iconBgColor="bg-inquiry-surface"
          iconColor="text-inquiry"
          icon="MessageSquare"
          label="Poptávky dodavatelů"
          subLabel={`${inquiries?.length || 0} celkem, ${pending?.length || 0} čekají na odpověď`}
          headerRightComponent={
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
              {pending?.length || 0} čekají na odpověď
            </span>
          }
          rowComponents={
            !inquiries
              ? []
              : inquiries?.map((inquiry) => (
                  <EntityRow
                    key={inquiry.id}
                    label={
                      typeof inquiry.listing.value !== "string"
                        ? inquiry.listing.value.name
                        : "Poptávka"
                    }
                    icon="MessageSquare"
                    iconBackgroundColor="bg-inquiry-surface"
                    iconColor="text-inquiry"
                    items={[
                      {
                        content: t(`listings.type.${inquiry.listingType}`),
                        icon: "Box",
                      },
                      {
                        content: inquiry.pricing.quotedPrice
                          ? `${inquiry.pricing.quotedPrice.toLocaleString("cs-CZ")} Kč`
                          : "Neoceněno",
                        icon: "Banknote",
                      },
                    ]}
                    rightComponent={
                      <InquiryStatusTag
                        userStatus={inquiry.status.user}
                        companyStatus={inquiry.status.company}
                      />
                    }
                    link={{
                      pathname: "/user-profile/events/[eventId]/[inquiryId]",
                      params: {
                        eventId: getIdFromRelationshipField(inquiry.event),
                        inquiryId: inquiry.id,
                      },
                    }}
                  />
                ))
          }
          emptyState={{
            text: "Zatím žádné poptávky",
            subtext: "Přejděte do katalogu a oslovte dodavatele pro svou akci.",
          }}
        />
        <EventChecklistSection
          eventId={eventId}
          checklist={event.checklist ?? []}
        />
        <EventNotesSection eventId={eventId} notes={event.notes ?? []} />
        <ControlSection
          rows={[
            {
              icon: "CircleMinus",
              iconColor: "text-danger",
              iconBgColor: "bg-danger-surface",
              title: "Zrušit událost",
              text: "Po zrušení události budou všechny související informace odstraněny.",
              button: {
                text: "Zrušit",
                version: "dangerFull",
                iconLeft: "CircleMinus",
                size: "sm",
                disabled: event.status === "deactivated",
                onClick: () =>
                  confirmActionModalEvents.emit("open", {
                    title: "Zrušit událost",
                    description:
                      "Všechny poptávky budou zrušeny a dodavatelé budou informováni, že událost byla zrušena.",
                    Icon: lucideIcons.X,
                    buttonText: "Zrušit událost",
                    buttonVersion: "dangerFull",
                    textColor: "text-danger",
                    whatIsGoingToHappenText:
                      "Opravdu chcete zrušit tuto událost?",
                    whatIsGoingToHappenTextColor: "danger",
                    whatIsGoingToHappenList: [
                      "Zákazník obdrží oznámení o zrušení",
                      "Všechny poptávky budou zrušeny",
                      "Tuto akci nelze vrátit zpět",
                    ],
                    borderColor: "border-danger",
                    bgColor: "bg-danger-surface",
                    onConfirmClick: async () => {
                      // TODO: reject inquiry mutation
                    },
                  }),
              },
            },
          ]}
        />
      </div>
    </main>
  );
}
