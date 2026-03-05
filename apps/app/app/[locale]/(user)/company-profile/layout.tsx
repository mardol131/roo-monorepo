import React from "react";
import Sidebar from "../components/sidebar";
import { getPathname } from "@/app/i18n/navigation";

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  return (
    <>
      <div className="flex-1 flex justify-center">
        <div className="max-w-user-profile-content w-full flex flex-col px-8 py-20">
          {children}
        </div>
      </div>
    </>
  );
}
