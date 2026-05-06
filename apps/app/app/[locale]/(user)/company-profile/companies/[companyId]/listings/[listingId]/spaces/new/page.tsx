"use client";

import { useSpace } from "@/app/react-query/spaces/hooks";
import { Space } from "@roo/common";
import { useParams, useSearchParams } from "next/navigation";
import { SpaceForm } from "../components/space-form";
import PageHeading from "@/app/[locale]/(user)/components/page-heading";

const TYPE_LABEL: Record<Space["type"], string> = {
  building: "Budova",
  room: "Místnost",
  area: "Areál",
};

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
    <main className="w-full pb-100">
      <PageHeading
        heading={`Nový prostor – ${TYPE_LABEL[spaceType]}`}
        description={`Upravit prostor – ${TYPE_LABEL[spaceType]}`}
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
        mode="create"
        spaceType={spaceType}
        parentId={parentId}
        parentSpaceName={parentSpace?.name}
        listingId={listingId}
        companyId={companyId}
      />
    </main>
  );
}
