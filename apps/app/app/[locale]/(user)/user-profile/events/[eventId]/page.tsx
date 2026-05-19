"use client";

import { ControlSection } from "@/app/[locale]/(user)/components/control-section";
import Loader from "@/app/[locale]/(user)/components/loader";
import EventStatusTag from "@/app/[locale]/(user)/components/tags/event-status-tag";
import { confirmActionModalEvents } from "@/app/components/ui/molecules/modals/confirm-action-modal";
import { useRouter } from "@/app/i18n/navigation";
import { useEvent, useUpdateEvent } from "@/app/react-query/events/hooks";
import { useInquiries } from "@/app/react-query/inquiries/hooks";
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
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import DashboardHeader from "../../../components/dashboard-header";
import EntityRow from "../../../components/entity-row";
import RowContainer from "../../../components/row-container";
import { SummaryCard } from "../../../components/summary-card";
import InquiryStatusTag from "../../../components/tags/inquiry-status-tag";
import EventChecklistSection from "./components/event-checklist-section";
import EventNotesSection from "./components/event-notes-section";
import EventLocationSection from "./components/event-location-section";
import Breadcrumbs from "../../../components/breadcrumbs";

// ── Page ───────────────────────────────────────────────────────────────────────

export default function page() {
  const { eventId } = useParams<{ eventId: string }>();

  const { data: event, isPending } = useEvent(eventId);
  const { mutate: updateEvent } = useUpdateEvent({});

  const router = useRouter();

  const t = useTranslations();

  const { data: inquiries } = useInquiries();

  if (isPending) return <Loader text="Načítání události..." />;
  if (!event) return router.back();

  const Icon =
    (lucideIcons[event.icon as keyof typeof lucideIcons] as LucideIcon) ??
    Calendar;

  const confirmed = inquiries?.docs?.filter(
    (i) => aggregateInquiryStatus(i.status) === "confirmed",
  );
  const pending = inquiries?.docs?.filter(
    (i) => aggregateInquiryStatus(i.status) === "pending",
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

  const shareInfoHandler = (
    type: "contactDetails" | "place" | "confirmedInquiries",
  ) => {
    if (type === "contactDetails") {
      updateEvent({
        id: eventId,
        data: {
          sharing: {
            contactDetails: true,
          },
        },
      });
    } else if (type === "place") {
      updateEvent({
        id: eventId,
        data: {
          sharing: {
            place: true,
          },
        },
      });
    } else if (type === "confirmedInquiries") {
      updateEvent({
        id: eventId,
        data: {
          sharing: {
            confirmedInquiries: true,
          },
        },
      });
    }
  };

  const cancelShareInfoHandler = (
    type: "contactDetails" | "place" | "confirmedInquiries",
  ) => {
    if (type === "contactDetails") {
      updateEvent({
        id: eventId,
        data: {
          sharing: {
            contactDetails: false,
          },
        },
      });
    } else if (type === "place") {
      updateEvent({
        id: eventId,
        data: {
          sharing: {
            place: false,
          },
        },
      });
    } else if (type === "confirmedInquiries") {
      updateEvent({
        id: eventId,
        data: {
          sharing: {
            confirmedInquiries: false,
          },
        },
      });
    }
  };

  const cancelEventHandler = () => {
    updateEvent({
      id: eventId,
      data: {
        status: "archived",
      },
    });
  };

  const finishEventHandler = () => {
    updateEvent({
      id: eventId,
      data: {
        status: "completed",
      },
    });
  };

  const confirmFinishEventHandler = () => {
    confirmActionModalEvents.emit("open", {
      title: "Dokončit událost",
      description:
        "Po dokončení události budou všechny související poptávky uzavřeny. Opravdu chcete dokončit tuto událost?",
      Icon: lucideIcons.CircleCheck,
      buttonText: "Dokončit událost",
      buttonVersion: "successFull",
      textColor: "text-success",
      whatIsGoingToHappenText: "Opravdu chcete dokončit tuto událost?",
      whatIsGoingToHappenTextColor: "success",
      whatIsGoingToHappenList: [
        "Zákazník obdrží oznámení o dokončení",
        "Všechny poptávky budou uzavřeny",
        "Tuto akci nelze vrátit zpět",
      ],
      borderColor: "border-success",
      bgColor: "bg-success-surface",
      onConfirmClick: async () => finishEventHandler(),
    });
  };

  const confirmCancelEventHandler = () => {
    confirmActionModalEvents.emit("open", {
      title: "Zrušit událost",
      description:
        "Všechny poptávky budou zrušeny a dodavatelé budou informováni, že událost byla zrušena.",
      Icon: lucideIcons.X,
      buttonText: "Zrušit událost",
      buttonVersion: "dangerFull",
      textColor: "text-danger",
      whatIsGoingToHappenText: "Opravdu chcete zrušit tuto událost?",
      whatIsGoingToHappenTextColor: "danger",
      whatIsGoingToHappenList: [
        "Zákazník obdrží oznámení o zrušení",
        "Všechny poptávky budou zrušeny",
        "Tuto akci nelze vrátit zpět",
      ],
      borderColor: "border-danger",
      bgColor: "bg-danger-surface",
      onConfirmClick: async () => {
        cancelEventHandler();
      },
    });
  };
  return (
    <main className="w-full">
      {/* Back + header */}
      <Breadcrumbs />
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
        button={{
          text: "Upravit událost",
          version: "eventFull",
          size: "sm",
          iconLeft: "Pen",
          link: {
            pathname: "/user-profile/events/[eventId]/edit",
            params: { eventId },
          },
        }}
      />

      <div className="flex flex-col gap-5">
        {/* Summary cards */}
        <EventLocationSection
          event={event}
          confirmedVenueInquiries={
            inquiries?.docs?.filter(
              (i) =>
                i.listingType === "venue" &&
                aggregateInquiryStatus(i.status) === "confirmed",
            ) ?? []
          }
          onSetVenue={(venueId) =>
            updateEvent({
              id: eventId,
              data: { location: { ...event.location, venue: venueId } },
            })
          }
        />
        <div className="grid grid-cols-3 gap-4">
          <SummaryCard
            label="Celkem poptávek"
            value={String(inquiries?.docs?.length || 0)}
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
        <ControlSection
          rows={[
            {
              kind: "switch",
              icon: "UserRound",
              iconColor: "text-blue-500",
              iconBgColor: "bg-blue-50",
              title: "Sdílet kontaktní údaje",
              text: "Dodavatelé uvidí vaše kontaktní údaje (jméno, email, telefon).",
              checked: event.sharing?.contactDetails ?? false,
              onEnable: () => shareInfoHandler("contactDetails"),
              onDisable: () => cancelShareInfoHandler("contactDetails"),
            },
            {
              kind: "switch",
              icon: "MapPin",
              iconColor: "text-violet-500",
              iconBgColor: "bg-violet-50",
              title: "Sdílet místo konání",
              text: "Dodavatelé uvidí přesnou adresu místa konání události.",
              checked: event.sharing?.place ?? false,
              onEnable: () => shareInfoHandler("place"),
              onDisable: () => cancelShareInfoHandler("place"),
            },
            {
              kind: "switch",
              icon: "MessageSquare",
              iconColor: "text-emerald-500",
              iconBgColor: "bg-emerald-50",
              title: "Sdílet potvrzené dodavatele",
              text: "Ostatní dodavatelé uvidí, kteří dodavatelé již mají potvrzenou poptávku.",
              checked: event.sharing?.confirmedInquiries ?? false,
              onEnable: () => shareInfoHandler("confirmedInquiries"),
              onDisable: () => cancelShareInfoHandler("confirmedInquiries"),
            },
            {
              icon: "CircleCheck",
              iconColor: "text-success",
              iconBgColor: "bg-success-surface",
              title: "Dokončit událost",
              text: "Po dokončení události budou všechny související poptávky uzavřeny.",
              button: {
                text: "Dokončit",
                version: "successFull",
                iconLeft: "CircleCheck",
                size: "sm",
                disabled:
                  event.status === "completed" ||
                  event.status === "archived" ||
                  event.status === "disabled",
                onClick: () => confirmFinishEventHandler(),
              },
            },
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
                disabled:
                  event.status === "completed" ||
                  event.status === "archived" ||
                  event.status === "disabled",
                onClick: () => confirmCancelEventHandler(),
              },
            },
          ]}
        />
        {/* Inquiries */}
        <RowContainer
          iconBgColor="bg-inquiry-surface"
          iconColor="text-inquiry"
          icon="MessageSquare"
          label="Poptávky dodavatelů"
          subLabel={`${inquiries?.docs?.length || 0} celkem, ${pending?.length || 0} čekají na odpověď`}
          headerRightComponent={
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
              {pending?.length || 0} čekají na odpověď
            </span>
          }
          rowComponents={
            inquiries && inquiries.docs?.length
              ? inquiries?.docs?.map((inquiry) => (
                  <EntityRow
                    key={inquiry.id}
                    label={
                      typeof inquiry.listing !== "string"
                        ? inquiry.listing.name
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
                      <InquiryStatusTag status={inquiry.status} />
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
              : []
          }
          emptyState={{
            text: "Zatím žádné poptávky",
            subtext: "Přejděte do katalogu a oslovte dodavatele pro svou akci.",
            button: {
              text: "Přejít do katalogu",
              link: {
                pathname: "/catalog",
              },
              size: "sm",
              version: "eventFull",
            },
          }}
        />
        <EventChecklistSection
          eventId={eventId}
          checklist={event.checklist ?? []}
        />
        <EventNotesSection eventId={eventId} notes={event.notes ?? []} />
      </div>
    </main>
  );
}
