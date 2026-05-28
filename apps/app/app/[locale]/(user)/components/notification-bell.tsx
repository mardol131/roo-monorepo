"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { UserNotification } from "@roo/common";
import Link from "next/link";
import Text from "@/app/components/ui/atoms/text";

type Props = {
  notifications: UserNotification[];
};

export default function NotificationBell({ notifications }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.seen).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center w-7 h-7 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700 transition-colors"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] px-0.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-9 w-80 bg-white border border-zinc-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-100">
            <Text variant="label-lg" color="textDark">Oznámení</Text>
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <Text variant="body-sm" color="textLight">Žádná oznámení</Text>
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto divide-y divide-zinc-100">
              {notifications.map((n) => {
                const content = (
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      {!n.seen && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      )}
                      <Text variant="label-lg" color="textDark" as="span">{n.heading}</Text>
                    </div>
                    <Text variant="body-sm" color="textLight" className="pl-3.5">{n.text}</Text>
                    <Text variant="caption" color="textLight" className="pl-3.5">
                      {new Date(n.createdAt).toLocaleDateString("cs-CZ", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </div>
                );

                return (
                  <li key={n.id} className={`px-4 py-3 ${!n.seen ? "bg-zinc-50" : ""}`}>
                    {n.link ? (
                      <Link href={n.link} className="block hover:opacity-80 transition-opacity">
                        {content}
                      </Link>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
