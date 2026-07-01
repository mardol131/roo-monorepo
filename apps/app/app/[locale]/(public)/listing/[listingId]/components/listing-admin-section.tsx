"use client";

import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import Button from "@/app/components/ui/atoms/button";
import Text from "@/app/components/ui/atoms/text";
import { Company, Listing, User } from "@roo/common";
import { MessageSquare, Pencil, Settings } from "lucide-react";

interface Props {
  listing: Listing;
  companyId: string;
}

export default function ListingAdminSection({ listing, companyId }: Props) {
  const listingId = listing.id;

  const rows = [
    {
      icon: <Pencil className="w-4 h-4 text-indigo-500" />,
      iconBg: "bg-indigo-50",
      title: "Upravit inzerát",
      text: "Změňte obsah, fotky nebo parametry inzerátu",
      button: {
        text: "Upravit",
        version: "listing" as const,
        size: "sm" as const,
        iconLeft: "Pencil" as const,
        linkTarget: "_blank" as const,
        link: {
          pathname:
            "/company-profile/companies/[companyId]/listings/[listingId]/edit" as const,
          params: { companyId, listingId },
        },
      },
    },
    {
      icon: <MessageSquare className="w-4 h-4 text-violet-500" />,
      iconBg: "bg-violet-50",
      title: "Poptávky",
      text: "Prohlédněte si příchozí poptávky k tomuto inzerátu",
      button: {
        text: "Zobrazit",
        version: "listing" as const,
        size: "sm" as const,
        iconLeft: "MessageSquare" as const,
        linkTarget: "_blank" as const,
        link: {
          pathname:
            "/company-profile/companies/[companyId]/listings/[listingId]/inquiries" as const,
          params: { companyId, listingId },
        },
      },
    },
    {
      icon: <Settings className="w-4 h-4 text-zinc-500" />,
      iconBg: "bg-zinc-100",
      title: "Správa inzerátu",
      text: "Nastavení, stav a další možnosti inzerátu",
      button: {
        text: "Správa",
        version: "listingFull" as const,
        size: "sm" as const,
        iconLeft: "Settings" as const,
        linkTarget: "_blank" as const,
        link: {
          pathname:
            "/company-profile/companies/[companyId]/listings/[listingId]" as const,
          params: { companyId, listingId },
        },
      },
    },
  ];

  return (
    <DashboardSection
      title="Tento inzerát je váš nebo firmy, ve které jste členem."
      icon="Settings"
      iconBg="bg-indigo-50"
      iconColor="text-indigo-500"
    >
      <div className="flex flex-col divide-y divide-zinc-100">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${row.iconBg}`}
              >
                {row.icon}
              </div>
              <div className="flex flex-col">
                <Text variant="label-lg" color="textDark">
                  {row.title}
                </Text>
                <Text variant="caption" color="secondary" className="mt-0.5">
                  {row.text}
                </Text>
              </div>
            </div>
            <Button {...row.button} className="ml-4 shrink-0" />
          </div>
        ))}
      </div>
    </DashboardSection>
  );
}
