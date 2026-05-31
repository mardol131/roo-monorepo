"use client";

import { useRef } from "react";
import Text from "@/app/components/ui/atoms/text";
import { useNotificationsStore } from "@/app/store/notifications-store";
import { useUnreadUserNotificationsCount } from "@/app/react-query/user-notifications/hooks";
import Button from "@/app/components/ui/atoms/button";

export default function NotificationButton() {
  const ref = useRef<HTMLDivElement>(null);
  const notificationsStore = useNotificationsStore();
  const { data: unreadCount = 0 } = useUnreadUserNotificationsCount();

  return (
    <div
      ref={ref}
      className="flex cursor-pointer"
      onClick={notificationsStore.open}
    >
      <Button text="Upozornění" size="xs" version="plain" iconLeft="Bell" />
      {unreadCount > 0 && (
        <div className=" w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
          <Text color="white" variant="caption">
            {unreadCount > 99 ? "99" : unreadCount}
          </Text>
        </div>
      )}
    </div>
  );
}
