"use client";

import { useSpace } from "@/app/react-query/spaces/hooks";
import { useParams } from "next/navigation";
import { SpaceForm } from "../../components/space-form";
import { Space } from "@roo/common";
import PageHeading from "@/app/[locale]/(user)/components/page-heading";

const TYPE_LABEL: Record<Space["type"], string> = {
  building: "Budova",
  room: "Místnost",
  area: "Areál",
};

export default function page() {
  const { listingId, companyId, spaceId } = useParams<{
    companyId: string;
    listingId: string;
    spaceId: string;
  }>();

  const { data: space, isLoading } = useSpace(spaceId);

  if (isLoading || !space) return null;

  return (
    <main className="w-full pb-100">
      <PageHeading
        heading={`Nový prostor – ${TYPE_LABEL[space.type]}`}
        description={`Upravit prostor – ${TYPE_LABEL[space.type]}`}
        button={{
          text: "Zpět",
          version: "plain",
          size: "sm",
          iconLeft: "ArrowLeft",
          link: {
            pathname:
              "/company-profile/companies/[companyId]/listings/[listingId]/spaces",
            params: { companyId, listingId },
          },
        }}
      />

      <SpaceForm
        mode="edit"
        spaceId={spaceId}
        spaceType={space.type}
        listingId={listingId}
        companyId={companyId}
        defaultValues={{
          name: space.name,
          description: space.description ?? undefined,
          capacity: space.capacity ?? undefined,
          area: space.area ?? undefined,
          images: (space.images ?? [])
            .map((img) => img.image ?? "")
            .filter(Boolean),
          hasAccommodation: space.hasAccommodation ?? false,
          accommodationCapacity: space.accommodationCapacity ?? undefined,
          rooms: (space.rooms ?? []).map((r) => ({
            id: r.id ?? crypto.randomUUID(),
            name: r.name,
            capacity: r.capacity,
            countOfRoomsOfThisType: r.countOfRoomsOfThisType,
            amenityIds: (r.amenities ?? []).map((a) =>
              typeof a === "string" ? a : a.id,
            ),
          })),
          spaceRuleIds: (space.spaceRules ?? []).map((rule) =>
            typeof rule === "string" ? rule : rule.id,
          ),
        }}
      />
    </main>
  );
}
