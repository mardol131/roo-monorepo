"use client";

import EntityCard from "@/app/[locale]/(user)/components/entity-card";
import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import Text from "@/app/components/ui/atoms/text";
import { useListing, useUpdateListing } from "@/app/react-query/listings/hooks";
import {
  useDeleteSpace,
  useSpacesByListing,
  useUpdateSpace,
} from "@/app/react-query/spaces/hooks";
import { IntlLink, Link, useRouter } from "@/app/i18n/navigation";
import { Listing, Space } from "@roo/common";
import {
  AlertTriangle,
  Building2,
  CornerDownRight,
  Delete,
  icons,
  LayoutDashboard,
  Plus,
  Trash2,
  TreePine,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import Button from "@/app/components/ui/atoms/button";
import Input from "@/app/components/ui/atoms/inputs/input";
import { confirmActionModalEvents } from "@/app/components/ui/molecules/modals/confirm-action-modal";

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
  { iconColor: "text-space", iconBg: "bg-space-surface" },
  { iconColor: "text-space", iconBg: "bg-space-surface" },
  { iconColor: "text-space", iconBg: "bg-space-surface" },
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
  query.type = type;

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
      <Text variant="label" as="span">
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

  const { mutate: updateSpace } = useUpdateSpace(space.id, listingId);

  async function handleDeleteConfirm() {
    updateSpace({ status: "archived" });
  }

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          {depth > 0 && (
            <CornerDownRight size={16} className="text-zinc-400 w-6 h-6" />
          )}
          <div className="w-full flex items-center gap-3">
            <div className="w-full">
              <EntityCard
                icon={TYPE_ICON[space.type]}
                iconColor={iconColor}
                iconBackgroundColor={iconBg}
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
                deleteEntityHandler={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  confirmActionModalEvents.emit("open", {
                    title: "Smazat prostor",
                    description:
                      "Tato akce je nevratná a trvale odstraní tento prostor z platformy.",
                    Icon: Trash2,
                    buttonText: "Smazat prostor",
                    buttonVersion: "dangerFull",
                    confirmPhrase: space.name,
                    whatIsGoingToHappenText:
                      "Opravdu chcete smazat tento prostor?",
                    whatIsGoingToHappenTextColor: "danger",
                    whatIsGoingToHappenList: [
                      "Prostor zmizí z katalogu a nebude dohledatelný",
                      "Prostory, které jsou v hierarchii pod tímto prostorem, budou smazány.",
                      "Prostor bude odstraněn ze všech variant služby, které ho obsahují",
                    ],
                    bgColor: "bg-danger-surface",
                    onConfirmClick: handleDeleteConfirm,
                  });
                }}
              />
            </div>
          </div>
        </div>
        {childType && childLabel && (
          <div className="ml-16 flex flex-col gap-2">
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

const CONFIRMATION_TEXT = "souhlasím";

export default function SpacesPage() {
  const { listingId, companyId } = useParams<{
    companyId: string;
    listingId: string;
  }>();

  const { data: spaces } = useSpacesByListing(listingId);
  const { data: listing } = useListing(listingId);
  const { mutate: updateListing, error } = useUpdateListing(
    listingId,
    companyId,
  );

  const venueDetails =
    listing?.details[0].blockType === "venue" ? listing.details[0] : undefined;
  const spacesType = venueDetails?.spacesType;

  const [pendingType, setPendingType] = useState<SpacesType | null>(null);
  const [confirmValue, setConfirmValue] = useState("");

  const roots = spaces?.docs?.filter(
    (s) => !getParentId(s) && spacesType != null && s.type === spacesType,
  );

  function handleTypeClick(type: SpacesType) {
    if (type === spacesType) return;
    setPendingType(type);
    setConfirmValue("");
  }

  function handleConfirm() {
    if (!venueDetails || !pendingType || confirmValue !== CONFIRMATION_TEXT)
      return;
    updateListing(
      {
        details: [{ ...venueDetails, spacesType: pendingType }],
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
                version: "spaceFull",
                iconLeft: "Plus",
                size: "sm",
                link: {
                  pathname:
                    "/company-profile/companies/[companyId]/listings/[listingId]/spaces/new",
                  params: { companyId, listingId },
                  query: spacesType ? { type: spacesType } : undefined,
                },
              }
            : undefined
        }
      />

      {/* Typ prostorů */}
      <div className="mt-8 mb-6 p-6 bg-white rounded-2xl border border-zinc-200">
        <div className="mb-4">
          <Text variant="label-lg" color="textDark" className="font-semibold">
            Typ prostorů
          </Text>
          <Text variant="label" color="textLight" as="p" className="mt-0.5">
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
                      ? "border-space bg-space-surface"
                      : isPending
                        ? "border-danger bg-danger-surface"
                        : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${isSelected ? "bg-space/10" : isPending ? "bg-danger/10" : "bg-zinc-100"}`}
                  >
                    <Icon
                      className={`w-4 h-4 ${isSelected ? "text-space" : isPending ? "text-danger" : "text-zinc-500"}`}
                    />
                  </div>
                  <div>
                    <Text
                      variant="label-lg"
                      className={`font-semibold ${isSelected ? "text-space" : isPending ? "text-danger" : ""}`}
                    >
                      {label}
                    </Text>
                    <Text
                      variant="label"
                      color="textLight"
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
          <div className="mt-4 p-4 rounded-xl border border-danger bg-danger-surface flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <div>
                <div className="flex items-center gap-3">
                  <Text
                    variant="label-lg"
                    className="font-semibold text-danger"
                  >
                    Pozor
                  </Text>{" "}
                  <AlertTriangle className="w-4 h-4 text-danger mt-0.5 shrink-0" />
                </div>
                <Text
                  variant="label"
                  color="textDark"
                  as="p"
                  className="mt-0.5 text-danger"
                >
                  Změna typu změní strukturu prostorů. Bude nutné znovu nastavit
                  prostory v jednotlivých variantách. Pokud chcete i přesto
                  pokračovat, napište do pole{" "}
                  <strong>{CONFIRMATION_TEXT}</strong> a klikněte na potvrdit.
                </Text>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <Input
                  inputProps={{
                    value: confirmValue,
                    onChange: (e) => setConfirmValue(e.target.value),
                    placeholder: CONFIRMATION_TEXT,
                  }}
                />
              </div>

              <Button
                text="Potvrdit změnu"
                onClick={handleConfirm}
                disabled={confirmValue !== CONFIRMATION_TEXT}
                size="sm"
                rounding="md"
              />

              <Button
                text="Zrušit"
                version="plain"
                onClick={handleCancel}
                size="sm"
              />
            </div>
          </div>
        )}
      </div>

      {spacesType && (
        <div className="flex flex-col gap-3 mt-6">
          <HollowSpaceCard
            label={`Přidat ${TYPE_LABEL[spacesType].toLowerCase()}`}
            companyId={companyId}
            listingId={listingId}
            type={spacesType}
          />
          {roots &&
            roots.map((root) => (
              <div key={root.id} className="my-5 border-t border-space/20 py-5">
                <SpaceTree
                  key={root.id}
                  space={root}
                  allSpaces={spaces?.docs ?? []}
                  companyId={companyId}
                  listingId={listingId}
                />
              </div>
            ))}
        </div>
      )}
    </main>
  );
}
