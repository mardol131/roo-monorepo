"use client";

import DashboardSectionHeader from "@/app/[locale]/(user)/components/dashboard-section-header";
import InfoSection from "@/app/[locale]/(user)/components/info-section";
import { Event } from "@roo/common";

type Props = {
  event: Event;
};

export default function EventLocationSection({ event }: Props) {
  const loc = event.location;

  const districtName =
    typeof loc.district === "object" ? loc.district.name : null;
  const cityName =
    loc.city && typeof loc.city === "object" ? loc.city.name : null;
  const spaceTypeName =
    loc.spaceType && typeof loc.spaceType === "object"
      ? loc.spaceType.name
      : null;

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
      <DashboardSectionHeader
        heading="Místo konání"
        icon="MapPin"
        iconBgColor="bg-violet-50"
        iconColor="text-violet-500"
      />
      <div className="p-5">
        <InfoSection
          items={[
            { type: "text", label: "Okres", value: districtName },
            { type: "text", label: "Město", value: cityName },
            ...(loc.address
              ? [{ type: "text", label: "Adresa", value: loc.address } as const]
              : []),
            { type: "text", label: "Typ prostoru", value: spaceTypeName },
            ...(loc.description
              ? [
                  {
                    type: "text",
                    label: "Popis místa konání",
                    value: loc.description,
                  } as const,
                ]
              : []),
          ]}
        />
      </div>
    </div>
  );
}
