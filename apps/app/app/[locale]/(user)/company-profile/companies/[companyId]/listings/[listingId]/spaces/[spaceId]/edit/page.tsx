"use client";

import { useSpace } from "@/app/react-query/spaces/hooks";
import { useParams } from "next/navigation";
import { SpaceForm } from "../../components/space-form";

export default function EditSpacePage() {
  const { listingId, companyId, spaceId } = useParams<{
    companyId: string;
    listingId: string;
    spaceId: string;
  }>();

  const { data: space, isLoading } = useSpace(spaceId);

  if (isLoading || !space) return null;

  return (
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
        images: (space.images ?? []).map((img) => img.image ?? "").filter(Boolean),
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
  );
}
