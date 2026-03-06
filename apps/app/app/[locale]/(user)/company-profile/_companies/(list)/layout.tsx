import React from "react";
import Sidebar, { SidebarProps } from "../../../components/sidebar";
import {
  Calendar,
  Heart,
  LayoutDashboard,
  MessageCircle,
  MessageSquare,
} from "lucide-react";

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  const sidebar: SidebarProps = {
    user: {
      email: "muj email",
      name: "dsadsa",
    },
    mainMenuItems: [
      { label: "Přehled", href: "/user-profile", icon: LayoutDashboard },
      {
        label: "Moje události",
        href: "/user-profile/my-events",
        icon: Calendar,
      },
      {
        label: "Poptávky",
        href: "/user-profile/inquiries",
        icon: MessageSquare,
      },
      { label: "Zprávy", href: "/user-profile/messages", icon: MessageCircle },
      { label: "Oblíbené", href: "/user-profile/favorites", icon: Heart },
    ],
  };
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
