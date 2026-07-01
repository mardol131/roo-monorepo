"use client";

import Loader from "@/app/[locale]/(user)/components/loader";
import Button from "@/app/components/ui/atoms/button";
import Input from "@/app/components/ui/atoms/inputs/input";
import GalleryInput from "@/app/components/ui/atoms/inputs/images/gallery-input";
import SectionOrderInput, {
  SectionOrderItem,
  buildSectionOrderItems,
  sectionOrderItemsToPayload,
} from "@/app/components/ui/atoms/inputs/section-order-input";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import Text from "@/app/components/ui/atoms/text";
import { uploadFileToCloud } from "@/app/functions/upload-file-to-cloud";
import {
  useListing,
  useListingDetail,
  useUpdateListing,
  useUpdateListingDetail,
} from "@/app/react-query/listings/hooks";
import {
  FixedSectionKey,
  getIdFromRelationshipField,
  Listing,
  ListingEntertainmentDetail,
  ListingGastroDetail,
  ListingVenueDetail,
  MediaSchema,
} from "@roo/common";
import { ChevronDown, ChevronUp, Trash2, X } from "lucide-react";
import { useParams } from "next/navigation";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import { globalToastEvents } from "@/app/components/ui/molecules/global-toast";
import { getPathname } from "@/app/i18n/navigation";

type CustomSectionBlock = NonNullable<
  ListingVenueDetail["customSections"]
>[number];
type CustomSectionBlockType = CustomSectionBlock["blockType"];

type CustomSectionState = {
  payloadId?: string | null;
  blockName: string;
  blockType: CustomSectionBlockType;
  title: string;
  text: string;
  images: MediaSchema[];
};

type CardFormValues = {
  title: string;
  text: string;
  images: MediaSchema[];
};

const blockTypeMaxImages: Record<CustomSectionBlockType, number> = {
  gallery1: 1,
  gallery2: 2,
  gallery4: 4,
  gallery5: 5,
};

const blockTypeLabel: Record<CustomSectionBlockType, string> = {
  gallery1: "1 obrázek + text",
  gallery2: "2 obrázky + text",
  gallery4: "4 obrázky (2×2) + text",
  gallery5: "5 obrázků (hero) + text",
};

function pluralImages(n: number): string {
  if (n === 1) return "obrázek";
  if (n <= 4) return "obrázky";
  return "obrázků";
}

function BlockPreview({ type }: { type: CustomSectionBlockType }) {
  const box = "bg-zinc-200 rounded";
  if (type === "gallery1") {
    return (
      <div className="flex flex-col gap-1.5 p-3">
        <div className={`${box} w-full aspect-video`} />
        <div className={`${box} h-2 w-3/4`} />
        <div className={`${box} h-2 w-1/2`} />
      </div>
    );
  }
  if (type === "gallery2") {
    return (
      <div className="flex flex-col gap-1.5 p-3">
        <div className="grid grid-cols-2 gap-1">
          <div className={`${box} aspect-video`} />
          <div className={`${box} aspect-video`} />
        </div>
        <div className={`${box} h-2 w-3/4`} />
        <div className={`${box} h-2 w-1/2`} />
      </div>
    );
  }
  if (type === "gallery4") {
    return (
      <div className="flex flex-col gap-1.5 p-3">
        <div className="grid grid-cols-2 gap-1">
          <div className={`${box} aspect-video`} />
          <div className={`${box} aspect-video`} />
          <div className={`${box} aspect-video`} />
          <div className={`${box} aspect-video`} />
        </div>
        <div className={`${box} h-2 w-3/4`} />
        <div className={`${box} h-2 w-1/2`} />
      </div>
    );
  }
  // gallery5 — hero grid: 1 large left + 2×2 right
  return (
    <div className="flex flex-col gap-1.5 p-3">
      <div className="flex gap-1">
        <div className={`${box} flex-2 aspect-video`} />
        <div className="flex-1 grid grid-cols-2 gap-1">
          <div className={`${box}`} />
          <div className={`${box}`} />
          <div className={`${box}`} />
          <div className={`${box}`} />
        </div>
      </div>
      <div className={`${box} h-2 w-3/4`} />
      <div className={`${box} h-2 w-1/2`} />
    </div>
  );
}

const BLOCK_TYPES: CustomSectionBlockType[] = [
  "gallery1",
  "gallery2",
  "gallery4",
  "gallery5",
];

// Prodejní funnel: zaujmout nabídkou → fakta → sociální důkaz a důvěra →
// námitky → praktické info → firma. Vlastní (vizuální) sekce podporují
// pitch hned za popisem.
const RECOMMENDED_FUNNEL_ORDER: FixedSectionKey[] = [
  "description",
  "spaces",
  "basics",
  "detail",
  "references",
  "employees",
  "faq",
  "location",
  "company",
];

const CUSTOM_SECTIONS_AFTER: FixedSectionKey = "description";

function applyRecommendedOrder(items: SectionOrderItem[]): SectionOrderItem[] {
  const fixedByKey = new Map(
    items.flatMap((item) => (item.type === "fixed" ? [[item.key, item]] : [])),
  );
  const customItems = items.filter((item) => item.type === "custom");

  const result: SectionOrderItem[] = [];
  for (const key of RECOMMENDED_FUNNEL_ORDER) {
    const fixed = fixedByKey.get(key);
    if (fixed) result.push(fixed);
    if (key === CUSTOM_SECTIONS_AFTER) result.push(...customItems);
  }
  return result;
}

function BlockTypePicker({
  onSelect,
  onCancel,
}: {
  onSelect: (type: CustomSectionBlockType) => void;
  onCancel: () => void;
}) {
  return (
    <div className="border border-zinc-200 rounded-xl bg-white p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Text variant="label-lg" color="textDark">
          Vyberte rozložení sekce
        </Text>
        <button
          type="button"
          onClick={onCancel}
          className="text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {BLOCK_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            className="border border-zinc-200 rounded-lg hover:border-primary hover:bg-zinc-50 transition-colors text-left"
          >
            <BlockPreview type={type} />
            <div className="px-3 pb-3">
              <Text variant="caption" color="textLight">
                {blockTypeLabel[type]}
              </Text>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export type CardHandle = { validate: () => Promise<boolean> };

const CustomSectionCard = forwardRef<
  CardHandle,
  {
    section: CustomSectionState;
    onChange: (updated: CustomSectionState) => void;
    onDelete: (blockName: string) => void;
  }
>(function CustomSectionCard({ section, onChange, onDelete }, ref) {
  const [open, setOpen] = useState(!section.title);
  const required = blockTypeMaxImages[section.blockType];

  const {
    register,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<CardFormValues>({
    defaultValues: {
      title: section.title,
      text: section.text,
      images: section.images,
    },
    mode: "onTouched",
  });

  useImperativeHandle(ref, () => ({
    validate: () => trigger(),
  }));

  const { onChange: rhfTitleChange, ...titleRegister } = register("title", {
    required: "Zadejte název sekce",
  });

  const { onChange: rhfTextChange, ...textRegister } = register("text");

  register("images", {
    validate: (imgs) =>
      imgs.length >= required ||
      `Přidejte ${required} ${pluralImages(required)}`,
  });

  return (
    <div className="flex gap-3 items-center">
      <div className="border w-full border-zinc-200 rounded-xl overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-50 transition-colors"
        >
          <div className="flex flex-col gap-0.5">
            <Text variant="label-lg" color="textDark">
              {section.title || "Vlastní sekce"}
            </Text>
            <Text as="span" variant="caption" color="textLight">
              {blockTypeLabel[section.blockType]}
            </Text>
          </div>
          <div className="flex items-center gap-3">
            {open ? (
              <ChevronUp size={16} className="text-zinc-400" />
            ) : (
              <ChevronDown size={16} className="text-zinc-400" />
            )}
          </div>
        </button>

        {open && (
          <div className="px-5 pb-5 flex flex-col gap-5 border-t border-zinc-100 pt-5">
            <Input
              label="Název sekce"
              error={errors.title?.message}
              inputProps={{
                ...titleRegister,
                onChange: (e) => {
                  rhfTitleChange(e);
                  onChange({ ...section, title: e.target.value });
                },
              }}
            />
            <Textarea
              label="Text"
              error={errors.text?.message}
              inputProps={{
                ...textRegister,
                onChange: (e) => {
                  rhfTextChange(e);
                  onChange({ ...section, text: e.target.value });
                },
                rows: 4,
              }}
            />
            <GalleryInput
              label="Obrázky"
              isRequired
              value={section.images}
              onChange={(imgs) => {
                onChange({ ...section, images: imgs });
                setValue("images", imgs, { shouldValidate: true });
              }}
              onUpload={uploadFileToCloud}
              maxImages={required}
              error={errors.images?.message}
            />
          </div>
        )}
      </div>
      <Trash2
        onClick={(e) => {
          e.stopPropagation();
          onDelete(section.blockName);
        }}
        className="text-xs text-zinc-400 hover:text-danger transition-colors"
      />
    </div>
  );
});

function initCustomSections(
  detail: ListingVenueDetail | ListingGastroDetail | ListingEntertainmentDetail,
): CustomSectionState[] {
  return (detail.customSections ?? []).map((s) => ({
    payloadId: s.id,
    blockName: s.blockName ?? s.id ?? crypto.randomUUID(),
    blockType: s.blockType,
    title: s.title ?? "",
    text: s.text ?? "",
    images: s.images ?? [],
  }));
}

function initOrderItems(
  detail: ListingVenueDetail | ListingGastroDetail | ListingEntertainmentDetail,
  customSections: CustomSectionState[],
): SectionOrderItem[] {
  const customLabels = Object.fromEntries(
    customSections.map((s) => [s.blockName, s.title || "Vlastní sekce"]),
  );
  const rawOrder = (detail.sectionOrder ?? []).map((s) => ({
    key: s.key,
    id: s.id ?? null,
  }));
  return buildSectionOrderItems(rawOrder, customLabels);
}

export default function SectionsPage() {
  const { companyId, listingId } = useParams<{
    companyId: string;
    listingId: string;
  }>();
  const publicListingPath = getPathname({
    href: { pathname: "/listing/[listingId]", params: { listingId } },
    locale: "cs",
  });
  const { data: listing, isPending } = useListing(listingId);
  const { data: detail } = useListingDetail(
    `listing-${listing?.type || "gastro"}-details`,
    getIdFromRelationshipField(listing?.detail?.value ?? ""),
  );

  const { mutate: updateListingDetail, isPending: detailIsPending } =
    useUpdateListingDetail(`listing-${listing?.type || "gastro"}-details`);

  const [orderItems, setOrderItems] = useState<SectionOrderItem[]>([]);
  const [customSections, setCustomSections] = useState<CustomSectionState[]>(
    [],
  );
  const [saved, setSaved] = useState(false);
  const [isPickingType, setIsPickingType] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const cardRefs = useRef(new Map<string, CardHandle>());

  useEffect(() => {
    if (!detail) return;
    const sections = initCustomSections(detail);
    setCustomSections(sections);
    const items = initOrderItems(detail, sections);
    setOrderItems(
      detail.type === "venue"
        ? items
        : items.filter(
            (item) => !(item.type === "fixed" && item.key === "spaces"),
          ),
    );
  }, [detail]);

  if (!detail || detailIsPending || !listing || isPending) return <Loader />;

  if (isPending) return <Loader text="Načítám sekce..." />;
  if (!listing) return null;

  const handleAddCustomSection = (blockType: CustomSectionBlockType) => {
    const blockName = crypto.randomUUID();
    setCustomSections((prev) => [
      ...prev,
      { blockName, blockType, title: "", text: "", images: [] },
    ]);
    setOrderItems((prev) => [
      ...prev,
      { type: "custom", id: blockName, label: "Vlastní sekce" },
    ]);
    setIsPickingType(false);
  };

  const handleRemoveCustomSection = (blockName: string) => {
    cardRefs.current.delete(blockName);
    setCustomSections((prev) => prev.filter((s) => s.blockName !== blockName));
    setOrderItems((prev) =>
      prev.filter((item) => !(item.type === "custom" && item.id === blockName)),
    );
  };

  // deleting a custom item in the order list must also drop its section card,
  // otherwise the save re-appends the orphaned section at the end
  const handleOrderItemsChange = (items: SectionOrderItem[]) => {
    setOrderItems(items);
    const remainingCustomIds = new Set(
      items.flatMap((item) => (item.type === "custom" ? [item.id] : [])),
    );
    setCustomSections((prev) =>
      prev.filter((s) => {
        if (remainingCustomIds.has(s.blockName)) return true;
        cardRefs.current.delete(s.blockName);
        return false;
      }),
    );
  };

  const handleUpdateCustomSection = (updated: CustomSectionState) => {
    setCustomSections((prev) =>
      prev.map((s) => (s.blockName === updated.blockName ? updated : s)),
    );
    setOrderItems((prev) =>
      prev.map((item) =>
        item.type === "custom" && item.id === updated.blockName
          ? { ...item, label: updated.title || "Vlastní sekce" }
          : item,
      ),
    );
  };

  const handleSave = async () => {
    globalToastEvents.emit("open", {
      type: "success",
      message: "Úspěšně uloženo",
      duration: 1000,
    });
    const results = await Promise.all(
      [...cardRefs.current.values()].map((r) => r.validate()),
    );
    if (results.some((ok) => !ok)) return;

    updateListingDetail(
      {
        id: detail?.id,
        data: {
          sectionOrder: sectionOrderItemsToPayload(orderItems),
          customSections: customSections.map((s) => ({
            ...(s.payloadId ? { id: s.payloadId } : {}),
            blockName: s.blockName,
            blockType: s.blockType,
            title: s.title,
            text: s.text || null,
            images: s.images.flatMap((img) =>
              img.filename ? [{ ...img, filename: img.filename }] : [],
            ),
          })),
        },
      },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        },
      },
    );
  };

  return (
    <main className="w-full">
      <PageHeading
        heading="Správa sekcí"
        description="Přetáhněte sekce pro změnu pořadí"
      />

      <div className="flex flex-col gap-6 mt-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Text variant="h4" color="textDark">
              Pořadí sekcí
            </Text>
            <Button
              text="Seřadit doporučeně"
              version="plain"
              size="sm"
              iconLeft="Sparkles"
              onClick={() => setOrderItems(applyRecommendedOrder(orderItems))}
            />
          </div>
          <Text variant="body-sm" color="textLight">
            Přetáhněte sekce do požadovaného pořadí. Pevné sekce nelze smazat,
            pouze přemístit. Doporučené řazení seřadí sekce podle osvědčeného
            prodejního postupu — změnu je potřeba uložit.
          </Text>
          <SectionOrderInput
            value={orderItems}
            onChange={handleOrderItemsChange}
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Text variant="h4" color="textDark">
              Vlastní sekce
            </Text>
            {!isPickingType && (
              <Button
                text="Přidat sekci"
                version="listingFull"
                size="sm"
                iconLeft="Plus"
                onClick={() => setIsPickingType(true)}
              />
            )}
          </div>

          {isPickingType && (
            <BlockTypePicker
              onSelect={handleAddCustomSection}
              onCancel={() => setIsPickingType(false)}
            />
          )}

          {!isPickingType && customSections.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 border border-dashed border-zinc-200 rounded-xl">
              <Text variant="body-sm" color="textLight">
                Žádné vlastní sekce
              </Text>
            </div>
          )}

          {customSections.map((section) => (
            <CustomSectionCard
              key={section.blockName}
              ref={(r) => {
                if (r) cardRefs.current.set(section.blockName, r);
                else cardRefs.current.delete(section.blockName);
              }}
              section={section}
              onChange={handleUpdateCustomSection}
              onDelete={handleRemoveCustomSection}
            />
          ))}
        </div>

        <div className="flex w-full justify-end gap-3 pt-2">
          <Button
            text={saved ? "Uloženo" : "Uložit změny"}
            version={saved ? "successFull" : "listingFull"}
            size="md"
            iconLeft={saved ? "Check" : "Save"}
            onClick={handleSave}
            disabled={detailIsPending}
          />
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <div className="flex items-center justify-between">
            <Text variant="h4" color="textDark">
              Náhled inzerátu
            </Text>
            <button
              type="button"
              onClick={() => setIframeKey((k) => k + 1)}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <RefreshCw size={14} />
              <Text variant="caption" color="secondary">
                Obnovit
              </Text>
            </button>
          </div>
          <div
            className="rounded-xl overflow-hidden border border-zinc-200 w-full"
            style={{ height: 700 }}
          >
            <iframe
              key={iframeKey}
              src={`${window.location.origin}${publicListingPath}`}
              className="w-full h-full"
              title="Náhled inzerátu"
              style={{ zoom: 0.5 }}
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
