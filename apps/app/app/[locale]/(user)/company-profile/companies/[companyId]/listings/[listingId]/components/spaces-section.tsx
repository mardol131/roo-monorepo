"use client";

import { DashboardSection } from "@/app/[locale]/(user)/components/dashboard-section";
import EntityCard from "@/app/[locale]/(user)/components/entity-card";
import { EmptyState } from "@/app/[locale]/(user)/components/empty-state";
import Button from "@/app/components/ui/atoms/button";
import { useSpacesByListing } from "@/app/react-query/spaces/hooks";
import { Space } from "@roo/common";
import { CornerDownRight, icons } from "lucide-react";

const TYPE_ICON: Record<Space["type"], keyof typeof icons> = {
  building: "Building2",
  room: "LayoutDashboard",
  area: "TreePine",
};

const TYPE_LABEL: Record<Space["type"], string> = {
  building: "Budova",
  room: "Místnost",
  area: "Areál",
};

function getParentId(space: Space): string | null {
  if (!space.parent) return null;
  if (typeof space.parent === "string") return space.parent;
  return space.parent.id;
}

function SpaceTreeNode({
  space,
  allSpaces,
  companyId,
  listingId,
  depth = 0,
}: {
  space: Space;
  allSpaces: Space[];
  companyId: string;
  listingId: string;
  depth?: number;
}) {
  const children = allSpaces.filter((s) => getParentId(s) === space.id);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        {depth > 0 && (
          <CornerDownRight size={16} className="text-zinc-400 w-6 h-6 shrink-0" />
        )}
        <div className="w-full">
          <EntityCard
            icon={TYPE_ICON[space.type]}
            iconColor="text-space"
            iconBackgroundColor="bg-space-surface"
            label={space.name}
            link={{
              pathname:
                "/company-profile/companies/[companyId]/listings/[listingId]/spaces/[spaceId]/edit",
              params: { companyId, listingId, spaceId: space.id },
            }}
            items={[
              { icon: "Tag", content: TYPE_LABEL[space.type] },
              space.capacity != null
                ? { icon: "Users", content: `${space.capacity} os.` }
                : undefined,
              space.area != null
                ? { icon: "Maximize2", content: `${space.area} m²` }
                : undefined,
            ]}
          />
        </div>
      </div>
      {children.length > 0 && (
        <div className="ml-9 flex flex-col gap-2">
          {children.map((child) => (
            <SpaceTreeNode
              key={child.id}
              space={child}
              allSpaces={allSpaces}
              companyId={companyId}
              listingId={listingId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function SpacesSection({
  listingId,
  companyId,
}: {
  listingId: string;
  companyId: string;
}) {
  const { data: spaces } = useSpacesByListing(listingId);
  const allSpaces = spaces?.docs ?? [];
  const roots = allSpaces.filter((s) => !getParentId(s));

  return (
    <DashboardSection
      title="Prostory"
      icon="LayoutDashboard"
      iconBg="bg-space-surface"
      iconColor="text-space"
      headerRightComponent={
        <Button
          text="Spravovat"
          version="plain"
          size="xs"
          link={{
            pathname:
              "/company-profile/companies/[companyId]/listings/[listingId]/spaces",
            params: { companyId, listingId },
          }}
        />
      }
    >
      {roots.length > 0 ? (
        <div className="flex flex-col gap-4">
          {roots.map((root) => (
            <SpaceTreeNode
              key={root.id}
              space={root}
              allSpaces={allSpaces}
              companyId={companyId}
              listingId={listingId}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          text="Žádné prostory"
          subtext="Pro tuto službu zatím nejsou nastaveny žádné prostory."
          icon="LayoutDashboard"
          button={{
            text: "Přidat prostory",
            version: "spaceFull",
            size: "sm",
            iconLeft: "Plus",
            link: {
              pathname:
                "/company-profile/companies/[companyId]/listings/[listingId]/spaces",
              params: { companyId, listingId },
            },
          }}
        />
      )}
    </DashboardSection>
  );
}
