"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import FormToc, {
  TocGroup,
  TocSection,
} from "@/app/[locale]/(user)/components/form-toc";
import PageHeading from "@/app/[locale]/(user)/components/page-heading";
import Button from "@/app/components/ui/atoms/button";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import GalleryInput from "@/app/components/ui/atoms/inputs/images/gallery-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import RepeaterField from "@/app/components/ui/atoms/inputs/repeater-field";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import { useRouter } from "@/app/i18n/navigation";
import { useAmenities } from "@/app/react-query/filters/amenities/hooks";
import { useCreateSpace, useUpdateSpace } from "@/app/react-query/spaces/hooks";
import { useRules } from "@/app/react-query/specific/rules/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Space, uploadFileToCloud } from "@roo/common";
import {
  BedDouble,
  Building2,
  Image,
  LayoutDashboard,
  Maximize2,
  ScrollText,
  TreePine,
} from "lucide-react";
import type { Resolver } from "react-hook-form";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

// ── TOC ────────────────────────────────────────────────────────────────────────

const S: Record<string, TocSection> = {
  basics: {
    id: "section-basic",
    title: "Základní informace",
    icon: "LayoutDashboard",
  },
  images: {
    id: "section-images",
    title: "Obrázky",
    icon: "Image",
  },
  capacity: {
    id: "section-capacity",
    title: "Kapacita a plocha",
    icon: "Maximize2",
    subTitle: "Kolik lidí může prostor pojmout a jaká je jeho velikost.",
  },
  accommodation: {
    id: "section-accommodation",
    title: "Ubytování",
    icon: "BedDouble",
    subTitle:
      "Nabízí prostor možnost ubytování? Pokud ano, jaká je kapacita ubytování a jaké typy pokojů jsou k dispozici?",
  },
  rules: {
    id: "section-rules",
    title: "Pravidla prostoru",
    icon: "ScrollText",
    subTitle:
      "Jaká pravidla platí pro využívání prostoru? Například zákaz kouření, povolení domácích mazlíčků, atd.",
  },
};

const SPACE_FORM_GROUPS: readonly TocGroup[] = [
  {
    label: "Prostor",
    sections: [S.basics, S.images, S.capacity, S.accommodation, S.rules],
  },
];

// ── Constants ─────────────────────────────────────────────────────────────────

const TYPE_LABEL: Record<Space["type"], string> = {
  building: "Budova",
  room: "Místnost",
  area: "Areál",
};

const TYPE_ICON: Record<Space["type"], React.ElementType> = {
  area: TreePine,
  building: Building2,
  room: LayoutDashboard,
};

// ── Schema ─────────────────────────────────────────────────────────────────────

const optionalPositiveInt = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : val),
  z.coerce
    .number()
    .positive("Musí být kladné číslo")
    .int("Zadejte celé číslo")
    .optional(),
);

const optionalPositiveNumber = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : val),
  z.coerce.number().positive("Musí být kladné číslo").optional(),
);

const schema = z.object({
  name: z.string().min(1, "Název je povinný"),
  description: z.string().optional(),
  capacity: optionalPositiveInt,
  area: optionalPositiveNumber,
  images: z.array(z.string()).default([]),
  hasAccommodation: z.boolean().default(false),
  accommodationCapacity: optionalPositiveInt,
  rooms: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Název je povinný"),
        capacity: z.preprocess(
          (v) => (v === "" || v === undefined || v === null ? undefined : v),
          z.coerce.number().positive("Musí být kladné").int(),
        ),
        countOfRoomsOfThisType: z.preprocess(
          (v) => (v === "" || v === undefined || v === null ? undefined : v),
          z.coerce.number().positive("Musí být kladné").int(),
        ),
        amenityIds: z.array(z.string()).default([]),
      }),
    )
    .default([]),
  spaceRuleIds: z.array(z.string()).default([]),
});

type FormInputs = z.infer<typeof schema>;

// ── Props ──────────────────────────────────────────────────────────────────────

type CreateProps = {
  mode: "create";
  spaceType: Space["type"];
  parentId?: string;
  parentSpaceName?: string;
  listingId: string;
  companyId: string;
};

type EditProps = {
  mode: "edit";
  spaceId: string;
  spaceType: Space["type"];
  listingId: string;
  companyId: string;
  defaultValues: FormInputs;
};

type SpaceFormProps = CreateProps | EditProps;

// ── Component ──────────────────────────────────────────────────────────────────

export function SpaceForm(props: SpaceFormProps) {
  const { spaceType, listingId, companyId } = props;
  const router = useRouter();

  const { mutate: createSpace } = useCreateSpace(listingId);
  const { mutate: updateSpace } = useUpdateSpace(
    props.mode === "edit" ? props.spaceId : "",
    listingId,
  );

  const TypeIcon = TYPE_ICON[spaceType];

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(schema) as unknown as Resolver<FormInputs>,
    defaultValues:
      props.mode === "edit"
        ? props.defaultValues
        : {
            images: [],
            hasAccommodation: false,
            rooms: [],
            spaceRuleIds: [],
          },
  });

  const { data: amenities } = useAmenities({ limit: 15 });
  const { data: rules } = useRules({ limit: 15 });

  const {
    fields: roomFields,
    append: appendRoom,
    remove: removeRoom,
  } = useFieldArray({ control, name: "rooms" });

  const hasAccommodation = watch("hasAccommodation");

  function navigateToSpaces() {
    router.push({
      pathname:
        "/company-profile/companies/[companyId]/listings/[listingId]/spaces",
      params: { companyId, listingId },
    });
  }

  function onSubmit(data: FormInputs) {
    const payload = {
      name: data.name,
      type: spaceType,
      listing: listingId,
      description: data.description,
      capacity: data.capacity,
      area: data.area,
      images: data.images.map((image) => ({ image })),
      hasAccommodation: data.hasAccommodation,
      accommodationCapacity: data.accommodationCapacity,
      rooms: data.rooms.map(
        ({ name, capacity, countOfRoomsOfThisType, amenityIds }) => ({
          name,
          capacity,
          countOfRoomsOfThisType,
          amenities: amenityIds,
        }),
      ),
      spaceRules: data.spaceRuleIds,
    };

    if (props.mode === "create") {
      createSpace(
        { ...payload, parent: props.parentId },
        { onSuccess: navigateToSpaces },
      );
    } else {
      updateSpace(payload, { onSuccess: navigateToSpaces });
    }
  }

  const submitLabel =
    props.mode === "create"
      ? `Vytvořit ${TYPE_LABEL[spaceType].toLowerCase()}`
      : `Uložit změny`;

  const heading =
    props.mode === "create"
      ? `Nový prostor – ${TYPE_LABEL[spaceType]}`
      : `Upravit prostor – ${TYPE_LABEL[spaceType]}`;

  const description =
    props.mode === "create"
      ? props.parentSpaceName
        ? `Bude vytvořen v rámci: ${props.parentSpaceName}`
        : "Vytvoření nového prostoru pro tuto službu."
      : "Úprava existujícího prostoru.";

  return (
    <main className="w-full pb-100">
      <PageHeading heading={heading} description={description} />

      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6 mt-8">
        <div className="flex w-full flex-col gap-4">
          {/* ── 1. Základní informace ─────────────────────────────────────────── */}
          <FormSection
            id={S.basics.id}
            icon={S.basics.icon}
            title={S.basics.title}
            subtitle={S.basics.subTitle}
            surfaceColor="bg-space-surface"
            color="text-space"
          >
            <Input
              label="Název"
              isRequired
              inputProps={{
                ...register("name"),
                placeholder: TYPE_LABEL[spaceType],
              }}
              error={errors.name?.message}
            />
            <Textarea
              label="Popis"
              inputProps={{
                ...register("description"),
                placeholder: "Krátký popis prostoru...",
                rows: 4,
              }}
              error={errors.description?.message}
            />
          </FormSection>

          {/* ── 2. Obrázky ────────────────────────────────────────────────────── */}
          <FormSection
            id={S.images.id}
            icon={S.images.icon}
            title={S.images.title}
            subtitle={S.images.subTitle}
            surfaceColor="bg-space-surface"
            color="text-space"
          >
            <Controller
              control={control}
              name="images"
              render={({ field }) => (
                <GalleryInput
                  label="Galerie"
                  value={field.value}
                  onChange={field.onChange}
                  onUpload={uploadFileToCloud}
                  maxImages={20}
                  error={errors.images?.message}
                />
              )}
            />
          </FormSection>

          {/* ── 3. Kapacita a plocha ──────────────────────────────────────────── */}
          <FormSection
            id={S.capacity.id}
            icon={S.capacity.icon}
            title={S.capacity.title}
            subtitle={S.capacity.subTitle}
            surfaceColor="bg-space-surface"
            color="text-space"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Kapacita (osob)"
                inputProps={{
                  ...register("capacity"),
                  type: "number",
                  min: 1,
                  placeholder: "100",
                }}
                error={errors.capacity?.message}
              />
              <Input
                label="Plocha (m²)"
                inputProps={{
                  ...register("area"),
                  type: "number",
                  min: 1,
                  placeholder: "200",
                }}
                error={errors.area?.message}
              />
            </div>
          </FormSection>

          {/* ── 4. Ubytování ──────────────────────────────────────────────────── */}
          <FormSection
            id={S.accommodation.id}
            icon={S.accommodation.icon}
            title={S.accommodation.title}
            subtitle={S.accommodation.subTitle}
            surfaceColor="bg-space-surface"
            color="text-space"
          >
            <Controller
              control={control}
              name="hasAccommodation"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                  label="Prostor nabízí ubytování"
                  checkColor="text-space"
                />
              )}
            />

            {hasAccommodation && (
              <>
                <Input
                  label="Kapacita ubytování (počet lůžek)"
                  inputProps={{
                    ...register("accommodationCapacity"),
                    type: "number",
                    min: 1,
                    placeholder: "20",
                  }}
                  error={errors.accommodationCapacity?.message}
                />

                <RepeaterField
                  label="Typy pokojů"
                  fields={roomFields as Record<string, unknown>[]}
                  onAppend={() =>
                    appendRoom({
                      id: crypto.randomUUID(),
                      name: "",
                      capacity: 2,
                      countOfRoomsOfThisType: 1,
                      amenityIds: [],
                    })
                  }
                  onRemove={removeRoom}
                  addButtonLabel="Přidat typ pokoje"
                  renderItem={(_, index) => (
                    <div className="flex flex-col gap-3">
                      <Input
                        label="Název typu pokoje"
                        isRequired
                        inputProps={{
                          ...register(`rooms.${index}.name`),
                          placeholder: "Dvoulůžkový pokoj",
                        }}
                        error={errors.rooms?.[index]?.name?.message}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Kapacita (lůžek)"
                          inputProps={{
                            ...register(`rooms.${index}.capacity`),
                            type: "number",
                            min: 1,
                            placeholder: "2",
                          }}
                          error={errors.rooms?.[index]?.capacity?.message}
                        />
                        <Input
                          label="Počet pokojů tohoto typu"
                          inputProps={{
                            ...register(
                              `rooms.${index}.countOfRoomsOfThisType`,
                            ),
                            type: "number",
                            min: 1,
                            placeholder: "5",
                          }}
                          error={
                            errors.rooms?.[index]?.countOfRoomsOfThisType
                              ?.message
                          }
                        />
                      </div>
                      <Controller
                        control={control}
                        name={`rooms.${index}.amenityIds`}
                        render={({ field }) => (
                          <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                              Vybavení pokoje
                            </span>
                            <div className="grid grid-cols-3 gap-1.5">
                              {amenities?.docs?.map((amenity) => (
                                <Checkbox
                                  key={amenity.id}
                                  size="sm"
                                  checked={field.value.includes(amenity.id)}
                                  onChange={() => {
                                    const current = field.value ?? [];
                                    field.onChange(
                                      current.includes(amenity.id)
                                        ? current.filter(
                                            (id) => id !== amenity.id,
                                          )
                                        : [...current, amenity.id],
                                    );
                                  }}
                                  label={amenity.name}
                                  checkColor="text-space"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  )}
                />
              </>
            )}
          </FormSection>

          {/* ── 5. Pravidla ───────────────────────────────────────────────────── */}
          <FormSection
            id={S.rules.id}
            icon={S.rules.icon}
            title={S.rules.title}
            subtitle={S.rules.subTitle}
            surfaceColor="bg-space-surface"
            color="text-space"
          >
            <Controller
              control={control}
              name="spaceRuleIds"
              render={({ field }) => (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {rules?.docs?.map((rule) => (
                    <Checkbox
                      key={rule.id}
                      checked={field.value.includes(rule.id)}
                      onChange={() => {
                        const current = field.value ?? [];
                        field.onChange(
                          current.includes(rule.id)
                            ? current.filter((id) => id !== rule.id)
                            : [...current, rule.id],
                        );
                      }}
                      label={rule.name}
                      checkColor="text-space"
                    />
                  ))}
                </div>
              )}
            />
          </FormSection>

          {/* ── Submit ───────────────────────────────────────────────────────── */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              htmlType="button"
              text="Zrušit"
              onClick={navigateToSpaces}
              version="plain"
            />
            <Button text={submitLabel} version="spaceFull" htmlType="submit" />
          </div>
        </div>
        <FormToc
          groups={SPACE_FORM_GROUPS}
          textColor="text-space"
          surfaceColor="bg-space-surface"
          dotColor="bg-space"
          buttonVersion="spaceFull"
          buttonText={submitLabel}
        />
      </form>
    </main>
  );
}
