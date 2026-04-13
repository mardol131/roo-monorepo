"use client";

import EntityCard from "@/app/[locale]/(user)/components/entity-card";
import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import Text from "@/app/components/ui/atoms/text";
import { useListing, useUpdateListing } from "@/app/react-query/listings/hooks";
import { useSpacesByListing } from "@/app/react-query/spaces/hooks";
import { IntlLink, Link, useRouter } from "@/app/i18n/navigation";
import { Listing, Space } from "@roo/common";
import {
  AlertTriangle,
  Building2,
  CornerDownRight,
  icons,
  LayoutDashboard,
  Plus,
  TreePine,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

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

const ADD_CHILD_TYPE: Partial<Record<Space["type"], Space["type"]>> = {
  area: "building",
  building: "room",
};

const ADD_CHILD_LABEL: Partial<Record<Space["type"], string>> = {
  area: "Přidat budovu",
  building: "Přidat místnost",
};

type SpacesType = Space["type"];

const SPACES_TYPE_OPTIONS: {
  type: SpacesType;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    type: "area",
    label: "Areály",
    description: "Venkovní areály, zahrady nebo parkovací plochy jako základ.",
    icon: TreePine,
  },
  {
    type: "building",
    label: "Budovy",
    description: "Budovy s místnostmi uvnitř – hotel, konferenční centrum.",
    icon: Building2,
  },
  {
    type: "room",
    label: "Místnosti",
    description: "Jen jednotlivé místnosti bez nadřazené struktury.",
    icon: LayoutDashboard,
  },
];

function getParentId(space: Space): string | null {
  if (!space.parent) return null;
  if (typeof space.parent === "string") return space.parent;
  return space.parent.id;
}

const DEPTH_STYLES = [
  { iconColor: "text-listing", iconBg: "bg-listing-surface" },
  { iconColor: "text-zinc-500", iconBg: "bg-zinc-100" },
  { iconColor: "text-zinc-400", iconBg: "bg-zinc-50" },
];

function HollowSpaceCard({
  label,
  companyId,
  listingId,
  type,
  parentId,
}: {
  label: string;
  companyId: string;
  listingId: string;
  type: Space["type"];
  parentId?: string;
}) {
  const query: Record<string, string> = {};
  if (parentId) query.parentId = parentId;

  return (
    <Link
      href={{
        pathname:
          "/company-profile/companies/[companyId]/listings/[listingId]/spaces/new",
        params: {
          companyId,
          listingId,
        },
        query,
      }}
      className="w-full rounded-2xl border border-dashed border-zinc-300 bg-white hover:border-zinc-400 hover:bg-zinc-50 transition-all px-6 py-5 flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-500"
    >
      <Plus className="w-4 h-4" />
      <Text variant="label2" as="span">
        {label}
      </Text>
    </Link>
  );
}

function SpaceTree({
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
  const { iconColor, iconBg } =
    DEPTH_STYLES[Math.min(depth, DEPTH_STYLES.length - 1)];

  const childType = ADD_CHILD_TYPE[space.type];
  const childLabel = ADD_CHILD_LABEL[space.type];

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          {depth > 0 && (
            <CornerDownRight size={16} className="text-zinc-400 w-6 h-6" />
          )}
          <div className="w-full">
            <EntityCard
              icon={TYPE_ICON[space.type]}
              iconColor={iconColor}
              iconBackgroundColor={iconBg}
              label={space.name}
              link={{
                pathname:
                  "/company-profile/companies/[companyId]/listings/[listingId]/spaces/[spaceId]",
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
        {childType && childLabel && (
          <div className="ml-10 flex flex-col gap-2">
            {children.map((child) => (
              <SpaceTree
                key={child.id}
                space={child}
                allSpaces={allSpaces}
                companyId={companyId}
                listingId={listingId}
                depth={depth + 1}
              />
            ))}
            <div className="flex items-center gap-3">
              <CornerDownRight size={16} className="text-zinc-300 w-6 h-6" />
              <div className="w-full">
                <HollowSpaceCard
                  label={childLabel}
                  companyId={companyId}
                  listingId={listingId}
                  type={childType}
                  parentId={space.id}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SpacesPage() {
  const { listingId, companyId } = useParams<{
    companyId: string;
    listingId: string;
  }>();

  const { data: spaces = [] } = useSpacesByListing(listingId);
  const { data: listing } = useListing(listingId);
  const { mutate: updateListing } = useUpdateListing(listingId, companyId);

  const venueDetails =
    listing?.details[0].blockType === "venue" ? listing.details[0] : undefined;
  const spacesType = venueDetails?.spacesType;

  const [pendingType, setPendingType] = useState<SpacesType | null>(null);
  const [confirmValue, setConfirmValue] = useState("");

  const roots = spaces.filter(
    (s) => !getParentId(s) && spacesType != null && s.type === spacesType,
  );

  function handleTypeClick(type: SpacesType) {
    if (type === spacesType) return;
    setPendingType(type);
    setConfirmValue("");
  }

  function handleConfirm() {
    if (!venueDetails || !pendingType || confirmValue !== "ano") return;
    updateListing(
      {
        details: [
          { ...venueDetails, spacesType: pendingType },
        ] as Listing["details"],
      },
      {
        onSuccess: () => {
          setPendingType(null);
          setConfirmValue("");
        },
      },
    );
  }

  function handleCancel() {
    setPendingType(null);
    setConfirmValue("");
  }

  return (
    <main className="w-full">
      <PageHeading
        heading="Prostory služby"
        description="Zde můžete spravovat prostory, které nabízíte v rámci této služby."
        button={
          spacesType
            ? {
                text: `Přidat ${TYPE_LABEL[spacesType].toLowerCase()}`,
                version: "listingFull",
                iconLeft: "Plus",
                size: "sm",
              }
            : undefined
        }
      />

      {/* Typ prostorů */}
      <div className="mt-8 mb-6 p-6 bg-white rounded-2xl border border-zinc-200">
        <div className="mb-4">
          <Text variant="label1" color="dark" className="font-semibold">
            Typ prostorů
          </Text>
          <Text variant="label2" color="light" as="p" className="mt-0.5">
            Určuje základní strukturu prostorů vaší služby. Budovy mohou
            obsahovat místnosti, areály pak budovy.
          </Text>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SPACES_TYPE_OPTIONS.map(
            ({ type, label, description, icon: Icon }) => {
              const isSelected = spacesType === type;
              const isPending = pendingType === type;
              return (
                <button
                  key={type}
                  onClick={() => handleTypeClick(type)}
                  className={`flex flex-col items-start gap-2.5 p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-listing bg-listing-surface"
                      : isPending
                        ? "border-amber-400 bg-amber-50"
                        : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${isSelected ? "bg-listing/10" : isPending ? "bg-amber-100" : "bg-zinc-100"}`}
                  >
                    <Icon
                      className={`w-4 h-4 ${isSelected ? "text-listing" : isPending ? "text-amber-600" : "text-zinc-500"}`}
                    />
                  </div>
                  <div>
                    <Text
                      variant="label1"
                      className={`font-semibold ${isSelected ? "text-listing" : isPending ? "text-amber-700" : ""}`}
                    >
                      {label}
                    </Text>
                    <Text
                      variant="label2"
                      color="light"
                      as="p"
                      className="mt-0.5 leading-snug"
                    >
                      {description}
                    </Text>
                  </div>
                </button>
              );
            },
          )}
        </div>

        {pendingType && (
          <div className="mt-4 p-4 rounded-xl border border-amber-300 bg-amber-50 flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <Text variant="label1" className="font-semibold text-amber-800">
                  Změna typu prostorů
                </Text>
                <Text
                  variant="label2"
                  color="light"
                  as="p"
                  className="mt-0.5 text-amber-700"
                >
                  Změna typu změní strukturu prostorů. Bude nutné znovu nastavit
                  prostory v jednotlivých variantách. Pokud chcete i přesto
                  pokračovat, napište do pole <strong>souhlasím</strong> a
                  klikněte na potvrdit.
                </Text>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={confirmValue}
                onChange={(e) => setConfirmValue(e.target.value)}
                placeholder="souhlasím"
                className="w-32 px-3 py-1.5 text-sm border border-amber-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent placeholder:text-zinc-300"
              />
              <button
                onClick={handleConfirm}
                disabled={confirmValue !== "souhlasím"}
                className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Potvrdit změnu
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-1.5 text-sm font-semibold rounded-lg text-zinc-500 hover:text-zinc-800 transition-colors"
              >
                Zrušit
              </button>
            </div>
          </div>
        )}
      </div>

      {spacesType && (
        <div className="flex flex-col gap-3 mt-6">
          {roots.map((root) => (
            <SpaceTree
              key={root.id}
              space={root}
              allSpaces={spaces}
              companyId={companyId}
              listingId={listingId}
            />
          ))}
          <HollowSpaceCard
            label={`Přidat ${TYPE_LABEL[spacesType].toLowerCase()}`}
            companyId={companyId}
            listingId={listingId}
            type={spacesType}
          />
        </div>
      )}
    </main>
  );
}
