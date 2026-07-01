"use client";

import { useSpacesByListing } from "@/app/react-query/spaces/hooks";
import { useParams } from "next/navigation";
import SectionWrapper from "./section-wrapper";
import SpaceItem from "./space-item";

export default function SpacesSection() {
  const { listingId } = useParams<{ listingId: string }>();
  const { data: spacesData } = useSpacesByListing(listingId);

  const spaces = (spacesData?.docs ?? []).filter((s) => s.status === "active");
  if (spaces.length === 0) return null;

  return (
    <SectionWrapper title="Naše prostory">
      <div className="grid grid-cols-1 gap-6">
        {spaces.map((space) => (
          <SpaceItem key={space.id} space={space} />
        ))}
      </div>
    </SectionWrapper>
  );
}
