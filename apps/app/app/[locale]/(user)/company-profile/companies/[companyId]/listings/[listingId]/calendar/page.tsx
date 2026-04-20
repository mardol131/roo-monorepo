"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import {
  useCalendarEventsByListing,
  useCreateCalendarEvent,
  useDeleteCalendarEvent,
  useUpdateCalendarEvent,
} from "@/app/react-query/calendar-events/hooks";
import { CalendarEvent } from "@roo/common";
import { addWeeks, areIntervalsOverlapping, parseISO, startOfWeek, subWeeks } from "date-fns";
import { useParams } from "next/navigation";
import { useState } from "react";
import CalendarCreatePopover from "./components/calendar-create-popover";
import { CreateRequest } from "./components/calendar-day-column";
import CalendarEditPopover from "./components/calendar-edit-popover";
import CalendarTimetable from "./components/calendar-timetable";
import CalendarToolbar from "./components/calendar-toolbar";
import CalendarWeekView from "./components/calendar-week-view";

type PendingEdit = {
  event: CalendarEvent;
  x: number;
  y: number;
};

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

export default function CalendarPage() {
  const { listingId } = useParams<{ listingId: string }>();
  const { data: events = [] } = useCalendarEventsByListing(listingId);
  const { mutate: createEvent, isPending: isCreating } = useCreateCalendarEvent(listingId);
  const { mutate: updateEvent, isPending: isUpdating } = useUpdateCalendarEvent(listingId);
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteCalendarEvent(listingId);

  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [pendingCreate, setPendingCreate] = useState<CreateRequest | null>(null);
  const [pendingEdit, setPendingEdit] = useState<PendingEdit | null>(null);
  const [createError, setCreateError] = useState<string | undefined>();
  const [editError, setEditError] = useState<string | undefined>();

  function handleCreateRequest(req: CreateRequest) {
    setCreateError(undefined);
    setPendingCreate(req);
  }

  function handleCreateSubmit(name: string, status: CalendarEvent["status"]) {
    if (!pendingCreate) return;
    if (hasOverlap(pendingCreate.startsAt, pendingCreate.endsAt, events)) {
      setCreateError("Tento termín se překrývá s jinou událostí.");
      return;
    }
    createEvent(
      { listingId, name, startsAt: pendingCreate.startsAt, endsAt: pendingCreate.endsAt, allDay: false, status },
      { onSuccess: () => { setPendingCreate(null); setCreateError(undefined); } },
    );
  }

  function handleEditSave(name: string, status: CalendarEvent["status"]) {
    if (!pendingEdit) return;
    if (hasOverlap(parseISO(pendingEdit.event.startsAt), parseISO(pendingEdit.event.endsAt), events, pendingEdit.event.id)) {
      setEditError("Tento termín se překrývá s jinou událostí.");
      return;
    }
    updateEvent(
      { id: pendingEdit.event.id, name, status },
      { onSuccess: () => { setPendingEdit(null); setEditError(undefined); } },
    );
  }

  function handleEditDelete() {
    if (!pendingEdit) return;
    deleteEvent(pendingEdit.event.id, { onSuccess: () => { setPendingEdit(null); setEditError(undefined); } });
  }

  return (
    <main className="w-full">
      <PageHeading
        heading="Kalendář"
        description="Přehled rezervací, blokací a poptávek pro tuto službu."
      />

      <div className="mt-8">
        <CalendarToolbar
          weekStart={weekStart}
          onPrev={() => setWeekStart((w) => subWeeks(w, 1))}
          onNext={() => setWeekStart((w) => addWeeks(w, 1))}
          onToday={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
        />
        <CalendarWeekView
          weekStart={weekStart}
          onCreateRequest={handleCreateRequest}
          onEditRequest={(event, x, y) => { setEditError(undefined); setPendingEdit({ event, x, y }); }}
          isCreating={pendingCreate !== null}
        />
        <CalendarTimetable />
      </div>

      {pendingCreate && (
        <CalendarCreatePopover
          startsAt={pendingCreate.startsAt}
          endsAt={pendingCreate.endsAt}
          position={{ x: pendingCreate.x, y: pendingCreate.y }}
          onSubmit={handleCreateSubmit}
          onClose={() => { setPendingCreate(null); setCreateError(undefined); }}
          isPending={isCreating}
          error={createError}
        />
      )}

      {pendingEdit && (
        <CalendarEditPopover
          event={pendingEdit.event}
          position={{ x: pendingEdit.x, y: pendingEdit.y }}
          onSave={handleEditSave}
          onDelete={handleEditDelete}
          onClose={() => { setPendingEdit(null); setEditError(undefined); }}
          isPending={isUpdating || isDeleting}
          error={editError}
        />
      )}
    </main>
  );
}
