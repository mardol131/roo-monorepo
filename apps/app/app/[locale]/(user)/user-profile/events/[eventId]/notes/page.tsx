"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import Loader from "@/app/[locale]/(user)/components/loader";
import Text from "@/app/components/ui/atoms/text";
import { useEvent, useUpdateEventNotes } from "@/app/react-query/events/hooks";
import type { Event } from "@roo/common";
import { useParams } from "next/navigation";
import { useState } from "react";
import NoteCard from "../components/note-card";
import NoteModal from "../components/note-modal";

type Note = NonNullable<Event["notes"]>[number];

export default function NotesPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: event, isPending } = useEvent(eventId);
  const { mutate, isPending: isSaving } = useUpdateEventNotes(eventId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  if (isPending) return <Loader />;

  const allNotes: Note[] = event?.notes ?? [];
  const notes: Note[] = [...allNotes]
    .filter((n) => n.status === "active")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  function closeModal() {
    setIsModalOpen(false);
    setEditingNote(null);
  }

  function handleModalSubmit(data: { title: string; description?: string }) {
    if (editingNote) {
      mutate(
        allNotes.map((n) => (n.id === editingNote.id ? { ...n, ...data } : n)),
        { onSuccess: closeModal },
      );
    } else {
      mutate(
        [
          ...allNotes,
          {
            title: data.title,
            description: data.description,
            createdAt: new Date().toISOString(),
            status: "active",
          },
        ],
        { onSuccess: closeModal },
      );
    }
  }

  function remove(noteId: string) {
    mutate(
      allNotes.map((n) => (n.id === noteId ? { ...n, status: "archived" } : n)),
    );
  }

  return (
    <main className="w-full">
      <PageHeading
        heading="Poznámky"
        description="Spravujte poznámky k vaší události."
        button={{
          text: "Přidat poznámku",
          iconLeft: "Plus",
          version: "eventFull",
          size: "sm",
          onClick: () => setIsModalOpen(true),
        }}
      />

      <NoteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        initialValues={editingNote ?? undefined}
        isLoading={isSaving}
      />

      {notes.length === 0 && (
        <Text variant="body-sm" color="textLight" className="py-4">
          Žádné poznámky
        </Text>
      )}

      <div className="flex flex-col gap-4">
        {notes.map((n, i) => (
          <NoteCard
            key={n.id ?? i}
            text={n.title}
            description={n.description ?? undefined}
            date={n.createdAt}
            onEditClick={() => {
              setEditingNote(n);
              setIsModalOpen(true);
            }}
            onDeleteClick={n.id ? () => remove(n.id!) : undefined}
            disabled={isSaving}
          />
        ))}
      </div>
    </main>
  );
}
