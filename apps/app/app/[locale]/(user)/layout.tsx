import React from "react";
import Sidebar, { SidebarProps } from "./components/sidebar";
import { IntlPathname } from "@/app/i18n/navigation";
import { LucideIcons } from "@/app/components/ui/atoms/inputs/icon-select";
import { Calendar, LayoutDashboard } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  return (
    <div>
      <div className="flex min-h-screen bg-zinc-50">{children}</div>
    </div>
  );
}
