"use client";

import {
  useUpdateUserNotification,
  useUpdateUserNotifications,
  useUserNotifications,
} from "@/app/react-query/user-notifications/hooks";
import { useNotificationsStore } from "@/app/store/notifications-store";
import { UserNotification } from "@roo/common";
import {
  Bell,
  CalendarDays,
  Eye,
  Info,
  MessageSquare,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { userNotificationKeys } from "@/app/react-query/query-keys";
import Text from "../../atoms/text";
import ModalLayout from "../modal-layout";
import { format } from "date-fns";

const notificationTypeConfig: Record<
  UserNotification["type"],
  { icon: React.ReactNode; bgClass: string; iconClass: string }
> = {
  general: {
    icon: <Info className="w-4 h-4" />,
    bgClass: "bg-blue-100",
    iconClass: "text-blue-600",
  },
  inquiry: {
    icon: <MessageSquare className="w-4 h-4" />,
    bgClass: "bg-inquiry-surface",
    iconClass: "text-inquiry",
  },
  event: {
    icon: <CalendarDays className="w-4 h-4" />,
    bgClass: "bg-event-surface",
    iconClass: "text-event",
  },
  system: {
    icon: <Settings className="w-4 h-4" />,
    bgClass: "bg-zinc-100",
    iconClass: "text-zinc-600",
  },
};

const PAGE_SIZE = 5;

type Props = {
  onClose?: () => void;
};

export function NotificationsModal({ onClose }: Props) {
  const notificationsStore = useNotificationsStore();

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useUserNotifications({ limit: PAGE_SIZE });
  const { mutateAsync: updateUserNotifications } = useUpdateUserNotifications();
  const { mutate: markOneSeen } = useUpdateUserNotification();

  const notifications = data?.pages.flatMap((p) => p.docs ?? []) ?? [];
  const unreadCount = notifications.filter((n) => !n.seen).length;

  const queryClient = useQueryClient();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const closeHandler = useCallback(() => {
    onClose?.();
    notificationsStore.close();
    queryClient.resetQueries({ queryKey: userNotificationKeys.all() });
  }, [onClose, notificationsStore, queryClient]);

  return (
    <ModalLayout
      header={
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-zinc-100 shrink-0">
            <Bell className="w-4.5 h-4.5 text-zinc-600" />
          </div>
          <div className="flex-1">
            <Text variant="h4" color="textDark">
              Oznámení
            </Text>
            <Text variant="label" color="secondary">
              {unreadCount > 0 ? `${unreadCount} nepřečtených` : "Vše přečteno"}
            </Text>
          </div>
          <button
            onClick={() =>
              updateUserNotifications({
                query: { seen: { not_equals: true } },
                data: { seen: true },
              })
            }
            title="Označit vše jako přečtené"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 bg-zinc-100 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      }
      isOpen={notificationsStore.isOpen}
      onClose={closeHandler}
      maxWidth="max-w-200"
    >
      {isLoading ? (
        <div className="flex flex-col divide-y divide-zinc-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="py-3 flex flex-col gap-2">
              <div className="h-3.5 w-2/5 rounded-md bg-zinc-100 animate-pulse" />
              <div className="h-3 w-4/5 rounded-md bg-zinc-100 animate-pulse" />
              <div className="h-3 w-1/4 rounded-md bg-zinc-100 animate-pulse" />
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-10 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
            <Bell className="w-5 h-5 text-zinc-400" />
          </div>
          <Text variant="body-sm" color="textLight">
            Žádná oznámení
          </Text>
        </div>
      ) : (
        <div className="flex flex-col gap-0">
          <ul className="divide-y divide-zinc-100">
            {notifications.map((n) => {
              const typeConfig = notificationTypeConfig[n.type];

              return (
                <li
                  key={n.id}
                  className={`py-3 first:py-0 first:pb-3 ${!n.seen ? "bg-zinc-50 -mx-6 px-6" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${typeConfig.bgClass} ${typeConfig.iconClass}`}
                    >
                      {typeConfig.icon}
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {!n.seen && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        )}
                        <Text
                          variant="label-lg"
                          color="textDark"
                          as="span"
                          className="font-semibold"
                        >
                          {n.heading}
                        </Text>
                      </div>
                      <Text variant="body-sm" color="textDark">
                        {n.text}
                      </Text>
                      <div className="flex items-center gap-3">
                        <Text variant="caption" color="textLight">
                          {format(new Date(n.createdAt), "d. M. yyyy H:mm")}
                        </Text>
                        {n.link && (
                          <Link
                            href={n.link}
                            onClick={closeHandler}
                            className="text-xs font-medium text-primary hover:underline"
                          >
                            Zobrazit
                          </Link>
                        )}
                      </div>
                    </div>
                    {!n.seen && (
                      <button
                        onClick={() =>
                          markOneSeen({ id: n.id, data: { seen: true } })
                        }
                        title="Označit jako přečtené"
                        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <div ref={sentinelRef} className="py-2 flex justify-center">
            {isFetchingNextPage && (
              <div className="w-5 h-5 rounded-full border-2 border-zinc-200 border-t-zinc-500 animate-spin" />
            )}
          </div>
        </div>
      )}
    </ModalLayout>
  );
}
