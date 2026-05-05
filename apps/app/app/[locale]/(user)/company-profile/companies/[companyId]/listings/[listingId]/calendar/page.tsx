"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import {
  useCalendarEventsByListing,
  useCreateCalendarEvent,
  useDeleteCalendarEvent,
  useUpdateCalendarEvent,
} from "@/app/react-query/calendar-events/hooks";
import { CalendarEvent } from "@roo/common";
import {
  addWeeks,
  areIntervalsOverlapping,
  parseISO,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { useParams } from "next/navigation";
import { useState } from "react";
import { CreateRequest } from "./components/calendar-day-column";
import CalendarEventModal, {
  EventFormData,
} from "./components/calendar-event-modal";
import CalendarTimetable from "./components/calendar-timetable";
import CalendarToolbar from "./components/calendar-toolbar";
import CalendarWeekView from "./components/calendar-week-view";

// ── Types ─────────────────────────────────────────────────────────────────────

type ModalState =
  | { mode: "create"; startsAt?: Date; endsAt?: Date }
  | { mode: "edit"; event: CalendarEvent };

// ── Helpers ───────────────────────────────────────────────────────────────────

function hasOverlap(
  startsAt: Date,
  endsAt: Date,
  events: CalendarEvent[],
  excludeId?: string,
): boolean {
  return events.some((e) => {
    if (e.allDay) return false;
    if (excludeId && e.id === excludeId) return false;
    return areIntervalsOverlapping(
      { start: startsAt, end: endsAt },
      { start: parseISO(e.startsAt), end: parseISO(e.endsAt) },
    );
  });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const { listingId } = useParams<{ listingId: string }>();
  const { data: eventsData } = useCalendarEventsByListing(listingId);
  const events: CalendarEvent[] = eventsData?.docs ?? [];
  const { mutate: createEvent, isPending: isCreating } =
    useCreateCalendarEvent(listingId);
  const { mutate: updateEvent, isPending: isUpdating } =
    useUpdateCalendarEvent(listingId);
  const { mutate: deleteEvent, isPending: isDeleting } =
    useDeleteCalendarEvent(listingId);

  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [modal, setModal] = useState<ModalState | null>(null);
  const [modalError, setModalError] = useState<string | undefined>();

  function openCreate(req?: CreateRequest) {
    setModalError(undefined);
    setModal(
      req
        ? { mode: "create", startsAt: req.startsAt, endsAt: req.endsAt }
        : { mode: "create" },
    );
  }

  function closeModal() {
    setModal(null);
    setModalError(undefined);
  }

  function handleSubmit(data: EventFormData) {
    if (!modal) return;

    const startsAt = data.startsAt ? parseISO(data.startsAt) : new Date();
    const endsAt = data.endsAt ? parseISO(data.endsAt) : new Date();
    const excludeId = modal.mode === "edit" ? modal.event.id : undefined;

    if (hasOverlap(startsAt, endsAt, events, excludeId)) {
      setModalError("Tento termín se překrývá s jinou událostí.");
      return;
    }

    if (modal.mode === "create") {
      createEvent(
        {
          listing: listingId,
          source: "manual",
          allDay: false,
          ...data,
        },
        { onSuccess: closeModal },
      );
    } else {
      updateEvent(
        { id: modal.event.id, ...data },
        { onSuccess: closeModal },
      );
    }
  }

  function handleDelete() {
    if (modal?.mode !== "edit") return;
    deleteEvent(modal.event.id, { onSuccess: closeModal });
  }

  const isPending = isCreating || isUpdating || isDeleting;

  return (
    <main className="w-full">
      <PageHeading
        heading="Kalendář"
        description="Přehled rezervací, blokací a poptávek pro tuto službu."
        button={{
          text: "Vytvořit událost",
          version: "calendar",
          size: "sm",
          onClick: () => openCreate(),
        }}
      />

      <div className="mt-8">
        <CalendarToolbar
          weekStart={weekStart}
          onPrev={() => setWeekStart((w) => subWeeks(w, 1))}
          onNext={() => setWeekStart((w) => addWeeks(w, 1))}
          onToday={() =>
            setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
          }
        />
        <CalendarWeekView
          weekStart={weekStart}
          onCreateRequest={openCreate}
          onEditRequest={(event) => {
            setModalError(undefined);
            setModal({ mode: "edit", event });
          }}
          isCreating={modal?.mode === "create"}
        />
        <CalendarTimetable
          onEditRequest={(event) => {
            setModalError(undefined);
            setModal({ mode: "edit", event });
          }}
        />
      </div>

      <CalendarEventModal
        key={
          modal
            ? modal.mode === "edit"
              ? modal.event.id
              : `create-${modal.startsAt?.toISOString() ?? "new"}`
            : "closed"
        }
        isOpen={modal !== null}
        mode={modal?.mode ?? "create"}
        event={modal?.mode === "edit" ? modal.event : undefined}
        initialStartsAt={modal?.mode === "create" ? modal.startsAt : undefined}
        initialEndsAt={modal?.mode === "create" ? modal.endsAt : undefined}
        listingId={listingId}
        onSubmit={handleSubmit}
        onDelete={modal?.mode === "edit" ? handleDelete : undefined}
        onClose={closeModal}
        isPending={isPending}
        error={modalError}
      />
    </main>
  );
}
