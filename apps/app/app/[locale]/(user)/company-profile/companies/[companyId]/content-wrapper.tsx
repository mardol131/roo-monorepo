"use client";

import { usePathname } from "@/app/i18n/navigation";
import React, { PropsWithChildren } from "react";

export default function ContentWrapper({ children }: PropsWithChildren) {
  const pathname = usePathname();

  const dontRestraintWidth =
    pathname.endsWith("/edit") ||
    pathname.endsWith("/new") ||
    pathname.endsWith("/calendar");
  return (
    <div className="flex-1 flex justify-center">
      <div
        className={`${dontRestraintWidth ? "max-w-user-profile-content-form" : "max-w-user-profile-content"} w-full flex flex-col px-8 py-20`}
      >
        {children}
      </div>
    </div>
  );
}
