"use client";

import { usePathname } from "@/app/i18n/navigation";
import React, { PropsWithChildren } from "react";

export default function ContentWrapper({ children }: PropsWithChildren) {
  const pathname = usePathname();

  const dontRestraintWidth =
    pathname.endsWith("/edit") || pathname.endsWith("/new");
  return (
    <div className="flex-1 flex justify-center">
      <div
        className={`w-full flex flex-col px-8 py-20 ${dontRestraintWidth ? "max-w-user-profile-content-form" : "max-w-user-profile-content"}`}
      >
        {children}
      </div>
    </div>
  );
}
