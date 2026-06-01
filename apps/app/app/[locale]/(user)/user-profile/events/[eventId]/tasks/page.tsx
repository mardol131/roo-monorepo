"use client";

import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import Loader from "@/app/[locale]/(user)/components/loader";
import TabFilter from "@/app/[locale]/(user)/components/tab-filter";
import Text from "@/app/components/ui/atoms/text";
import { useEvent, useUpdateChecklist } from "@/app/react-query/events/hooks";
import type { Event } from "@roo/common";
import { ChevronDown } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import ChecklistItemRow from "../components/checklist-item-row";
import TaskModal from "../components/task-modal";

type ChecklistItem = NonNullable<Event["checklist"]>[number];
type FilterTab = "all" | "with-due" | "without-due" | "priority";

const priorityOrder = { high: 0, medium: 1, low: 2 };

const TABS: { label: string; value: FilterTab }[] = [
  { label: "Podle termínu", value: "all" },
  { label: "S termínem", value: "with-due" },
  { label: "Bez termínu", value: "without-due" },
  { label: "Priorita", value: "priority" },
];

function applyFilter(items: ChecklistItem[], tab: FilterTab): ChecklistItem[] {
  switch (tab) {
    case "with-due":
      return [...items.filter((i) => !!i.dueDate)].sort(
        (a, b) =>
          new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime(),
      );
    case "without-due":
      return items.filter((i) => !i.dueDate);
    case "priority":
      return [...items].sort(
        (a, b) =>
          (priorityOrder[a.priority ?? "medium"] ?? 1) -
          (priorityOrder[b.priority ?? "medium"] ?? 1),
      );
    case "all":
    default:
      return [...items].sort((a, b) => {
        if (a.dueDate && b.dueDate)
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
      });
  }
}

export default function TasksPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: event, isPending } = useEvent(eventId);
  const { mutate, isPending: isSaving } = useUpdateChecklist(eventId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [completedOpen, setCompletedOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  if (isPending) return <Loader />;

  const allChecklist: ChecklistItem[] = event?.checklist ?? [];
  const checklist = allChecklist.filter((i) => i.status === "active");
  const pendingRaw = checklist.filter((i) => !i.completed);
  const pending = applyFilter(pendingRaw, activeTab);
  const completed = checklist.filter((i) => i.completed);

  function toggle(item: ChecklistItem) {
    mutate(
      allChecklist.map((i) =>
        i.id === item.id ? { ...i, completed: !i.completed } : i,
      ),
    );
  }

  function remove(item: ChecklistItem) {
    mutate(
      allChecklist.map((i) =>
        i.id === item.id ? { ...i, status: "archived" } : i,
      ),
    );
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingItem(null);
  }

  function handleModalSubmit(data: Omit<ChecklistItem, "id">) {
    if (editingItem) {
      mutate(
        allChecklist.map((i) =>
          i.id === editingItem.id ? { ...i, ...data } : i,
        ),
        { onSuccess: closeModal },
      );
    } else {
      mutate([...allChecklist, { ...data, status: "active" }], {
        onSuccess: closeModal,
      });
    }
  }

  return (
    <main className="w-full">
      <PageHeading
        heading="Úkoly"
        description="Spravujte úkoly související s vaší událostí."
        button={{
          text: "Přidat úkol",
          iconLeft: "Plus",
          version: "eventFull",
          size: "sm",
          onClick: () => setIsModalOpen(true),
        }}
      />

      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        initialValues={editingItem ?? undefined}
        isLoading={isSaving}
      />

      <TabFilter
        tabs={TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="mb-4"
      />

      {/* Pending */}
      <div className="flex flex-col pb-5">
        {pending.map((item, i) => (
          <ChecklistItemRow
            key={item.id ?? i}
            item={item}
            onToggle={() => toggle(item)}
            onEdit={() => {
              setEditingItem(item);
              setIsModalOpen(true);
            }}
            onDelete={() => remove(item)}
            disabled={isSaving}
          />
        ))}
        {pending.length === 0 && (
          <Text variant="body-sm" color="textLight" className="py-4">
            Žádné úkoly
          </Text>
        )}
      </div>

      {/* Completed */}
      {completed.length > 0 && (
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => setCompletedOpen((o) => !o)}
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-150 transition-colors text-left w-full"
          >
            <Text variant="label-sm" color="textDark">
              Splněno ({completed.length})
            </Text>
            <ChevronDown
              className={`w-4 h-4 text-zinc-500 transition-transform ${completedOpen ? "rotate-180" : ""}`}
            />
          </button>
          {completedOpen && (
            <div className=" mt-4">
              {completed.map((item, i) => (
                <ChecklistItemRow
                  key={item.id ?? i}
                  item={item}
                  onToggle={() => toggle(item)}
                  onDelete={() => remove(item)}
                  disabled={isSaving}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
