"use client";

import {
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Text from "../atoms/text";
import { createEvents } from "@/app/functions/create-events";

export type ToastTypes = "info" | "success" | "error" | "warning";

type Props = {
  message: string;
  isOpen: boolean;
  type: ToastTypes;
};

function Toast({ message, isOpen, type }: Props) {
  const icon = useMemo(() => {
    if (type === "info") {
      return <InfoIcon className="text-blue-500" />;
    } else if (type === "error") {
      return <CircleXIcon className="text-danger" />;
    } else if (type === "warning") {
      return <TriangleAlertIcon className="text-warning" />;
    }
    return <CircleCheckIcon className="text-success" />;
  }, [type]);

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 transition-all duration-300 ease-out ${
        isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="flex items-center gap-2 p-5 rounded-lg border bg-white border-zinc-200 shadow-lg">
        {icon}
        <Text variant="h4">{message}</Text>
      </div>
    </div>
  );
}

type GlobalToastOpenPayload = {
  id?: string;
  type: ToastTypes;
  message: string;
  duration?: number;
};

type GlobalToastEvents = {
  id?: string;
  open: GlobalToastOpenPayload;
};

export const globalToastEvents = createEvents<GlobalToastEvents>();

export function GlobalToast() {
  const [queue, setQueue] = useState<GlobalToastOpenPayload[]>([]);
  const [currentItemToProcess, setCurrentItemToProcess] = useState<
    GlobalToastOpenPayload | undefined
  >(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelCurrent = useCallback(() => {
    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);

    setIsOpen(false);
    setCurrentItemToProcess(undefined);
  }, []);

  useEffect(() => {
    if (currentItemToProcess || queue.length === 0) return;

    const nextToast = queue[0];
    setCurrentItemToProcess(nextToast);
    setIsOpen(false);

    showTimeoutRef.current = setTimeout(() => setIsOpen(true), 10);

    hideTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      clearTimeoutRef.current = setTimeout(() => {
        setCurrentItemToProcess(undefined);
        setQueue((prev) => prev.slice(1));
      }, 300);
    }, nextToast?.duration || 3000);
  }, [queue, currentItemToProcess]);

  const handler = useCallback(
    (data: GlobalToastOpenPayload) => {
      if (data.id && currentItemToProcess?.id === data.id) {
        cancelCurrent();
      }

      setQueue((prev) => {
        if (data.id)
          return [...prev.filter((item) => item.id !== data.id), data];
        return [...prev, data];
      });
    },
    [currentItemToProcess, cancelCurrent],
  );

  globalToastEvents.useListener({ event: "open", handler });

  if (!currentItemToProcess) return null;

  return (
    <Toast
      isOpen={isOpen}
      type={currentItemToProcess.type}
      message={currentItemToProcess.message}
    />
  );
}
