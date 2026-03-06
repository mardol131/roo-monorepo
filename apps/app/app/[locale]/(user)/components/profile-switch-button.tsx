"use client";

import { Link, usePathname } from "@/app/i18n/navigation";
import { Building2, User } from "lucide-react";
import React from "react";

type Props = {};

export default function ProfileSwitchButton({}: Props) {
  const pathname = usePathname();

  return (
    <div className=" py-2 border-b border-zinc-100 flex flex-col w-full gap-1">
      <Link
        href="/user-profile"
        className={`flex-1 flex flex-col items-center gap-1 px-1 py-2.5 rounded-xl transition-all ${
          pathname.startsWith("/user-profile")
            ? "bg-rose-50 text-rose-600"
            : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
        }`}
      >
        <User
          className={`w-5 h-5 shrink-0 ${pathname.startsWith("/user-profile") ? "text-rose-500" : "text-zinc-400"}`}
        />
        <span className="text-[10px] font-medium leading-tight text-center">
          Osobní
        </span>
      </Link>
      <Link
        href="/company-profile"
        className={`flex-1 flex flex-col items-center gap-1 px-1 py-2.5 rounded-xl transition-all ${
          pathname.startsWith("/company-profile")
            ? "bg-rose-50 text-rose-600"
            : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
        }`}
      >
        <Building2
          className={`w-5 h-5 shrink-0 ${pathname.startsWith("/company-profile") ? "text-rose-500" : "text-zinc-400"}`}
        />
        <span className="text-[10px] font-medium leading-tight text-center">
          Firemní
        </span>
      </Link>
    </div>
  );
}
