import React from "react";
import Sidebar, { SidebarProps } from "../components/sidebar";
import ContentWrapper from "./content-wrapper";

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  const sidebar: SidebarProps = {
    mainMenuItems: [
      { label: "Přehled", href: "/user-profile", icon: "LayoutDashboard" },
      {
        label: "Nová událost",
        href: "/user-profile/my-events/new",
        icon: "Plus",
      },
      {
        label: "Události",
        href: "/user-profile/my-events",
        icon: "Calendar",
      },
      {
        label: "Poptávky",
        href: "/user-profile/inquiries",
        icon: "MessageSquare",
      },
      {
        label: "Zprávy",
        href: "/user-profile/messages",
        icon: "MessageCircle",
      },
      { label: "Oblíbené", href: "/user-profile/favorites", icon: "Heart" },
    ],
    subMenuItems: [
      {
        label: "Nastavení",
        href: "/user-profile/profile-settings",
        icon: "Settings",
      },
      {
        label: "Odhlásit",
        icon: "LogOut",
      },
    ],
  };

  return (
    <>
      <Sidebar {...sidebar} />
      <ContentWrapper>{children}</ContentWrapper>
    </>
  );
}
