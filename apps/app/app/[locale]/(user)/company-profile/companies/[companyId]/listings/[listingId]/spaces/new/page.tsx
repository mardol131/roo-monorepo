"use client";

import { useSpace } from "@/app/react-query/spaces/hooks";
import { Space } from "@roo/common";
import { useParams, useSearchParams } from "next/navigation";
import { SpaceForm } from "../components/space-form";

export default function NewSpacePage() {
  const { listingId, companyId } = useParams<{
    companyId: string;
    listingId: string;
  }>();
  const searchParams = useSearchParams();

  const rawType = searchParams.get("type") as Space["type"] | null;
  const parentId = searchParams.get("parentId") ?? undefined;
  const spaceType: Space["type"] = rawType ?? "room";

  const { data: parentSpace } = useSpace(parentId ?? "");

  return (
    <SpaceForm
      mode="create"
      spaceType={spaceType}
      parentId={parentId}
      parentSpaceName={parentSpace?.name}
      listingId={listingId}
      companyId={companyId}
    />
  );
}
