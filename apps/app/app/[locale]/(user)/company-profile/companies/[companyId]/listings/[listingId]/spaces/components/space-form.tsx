"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import FormToc, {
  TocGroup,
  TocSection,
} from "@/app/[locale]/(user)/components/form-toc";
import Button from "@/app/components/ui/atoms/button";
import Checkbox from "@/app/components/ui/atoms/inputs/checkbox";
import GalleryInput from "@/app/components/ui/atoms/inputs/images/gallery-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import RepeaterField from "@/app/components/ui/atoms/inputs/repeater-field";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import { useRouter } from "@/app/i18n/navigation";
import { useAmenities } from "@/app/react-query/filters/amenities/hooks";
import {
  useCreateSpace,
  useSpace,
  useUpdateSpace,
} from "@/app/react-query/spaces/hooks";
import { useRules } from "@/app/react-query/specific/rules/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Space, undefinedToNull } from "@roo/common";
import { uploadFileToCloud } from "@/app/functions/upload-file-to-cloud";

import { Building2, LayoutDashboard, TreePine } from "lucide-react";
import type { Resolver } from "react-hook-form";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  optionalMediaSchema,
  requiredMediaSchema,
} from "@/app/validation/schema/media-schema";
import CheckboxGroup from "@/app/components/ui/atoms/inputs/checkbox-group";
import { relationshipItemSchema } from "@/app/validation/schema/relationship-item-schema";
import {
  getOptionalPositiveNumber,
  getPositiveNumber,
} from "@/app/validation/schema/utils";
import { CreateSpaceInput } from "@/app/react-query/spaces/fetch";
import { priceWithoutTravelFeeSchema } from "@/app/components/forms/listings/edit-forms/common-schema";
import PriceInput from "@/app/components/ui/atoms/inputs/price-input";
import SeasonalPricesInput from "@/app/components/ui/atoms/inputs/seasonal-prices-input";
import { CompletionWidget } from "@/app/[locale]/(user)/components/completion-widget";
import { getFullSpaceCompletion } from "@/app/functions/utils/spaces";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";

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
  price: {
    id: "section-price",
    title: "Základní cena",
    icon: "Banknote",
  },
  seasonalPrices: {
    id: "section-seasonal-prices",
    title: "Sezónní ceny",
    icon: "CalendarRange",
  },
  rules: {
    id: "section-rules",
    title: "Pravidla prostoru",
    icon: "ScrollText",
    subTitle:
      "Jaká pravidla platí pro využívání prostoru? Například zákaz kouření, povolení domácích mazlíčků, atd.",
  },
};

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

const schema = z
  .object({
    name: z.string().min(1, "Název je povinný"),
    description: z.string().optional(),
    capacity: getOptionalPositiveNumber("Kapacita musí být kladná"),
    area: getOptionalPositiveNumber("Plocha musí být kladná"),
    images: z.object(
      {
        coverImage: z.object(requiredMediaSchema, "Titulní obrázek je povinný"),
        gallery: z
          .array(
            z.object(requiredMediaSchema, "Přidejte alespoň čtyři obrázky"),
            "Přidejte alespoň čtyři obrázky",
          )
          .max(20, "Galerie může obsahovat maximálně 20 obrázků")
          .optional(),
      },
      "Obrázky jsou povinné",
    ),
    hasAccommodation: z.boolean().default(false),
    accommodationCapacity: getOptionalPositiveNumber(
      "Kapacita ubytování musí být kladná",
    ),
    price: priceWithoutTravelFeeSchema,
    accommodationRooms: z
      .array(
        z.object({
          id: z.string(),
          name: z.string().min(1, "Název je povinný"),
          capacity: getPositiveNumber("Kapacita musí být kladná"),
          countOfRoomsOfThisType: getPositiveNumber(
            "Počet pokojů tohoto typu musí být kladný",
          ),
          amenityIds: z.array(relationshipItemSchema).default([]),
        }),
      )
      .default([]),
    spaceRuleIds: z.array(relationshipItemSchema).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.hasAccommodation) {
      if (!data.accommodationCapacity) {
        ctx.addIssue({
          code: "custom",
          message:
            "Kapacita ubytování je povinná, pokud prostor nabízí ubytování",
          path: ["accommodationCapacity"],
        });
      }
    }
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

  const SPACE_FORM_GROUPS: readonly TocGroup[] = [
    {
      label: "Prostor",
      sections: [
        S.basics,
        S.price,
        S.images,
        S.seasonalPrices,
        S.capacity,
        ...(spaceType !== "room" ? [S.accommodation] : []),
        S.rules,
      ],
    },
  ];
  const { mutate: createSpace } = useCreateSpace(listingId);
  const { mutate: updateSpace } = useUpdateSpace(
    props.mode === "edit" ? props.spaceId : "",
    listingId,
  );

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
            images: {
              coverImage: {},
              gallery: [],
            },
            hasAccommodation: false,
            accommodationRooms: [],
            spaceRuleIds: [],
          },
  });

  const { data: amenities } = useAmenities({ limit: 15 });
  const { data: rules } = useRules({ limit: 15 });
  const { data: space } = useSpace(props.mode === "edit" ? props.spaceId : "");

  const {
    fields: roomFields,
    append: appendRoom,
    remove: removeRoom,
  } = useFieldArray({ control, name: "accommodationRooms" });

  const hasAccommodation = watch("hasAccommodation");

  function navigateToSpaces() {
    router.push({
      pathname:
        "/company-profile/companies/[companyId]/listings/[listingId]/spaces",
      params: { companyId, listingId },
    });
  }

  function onSubmit(data: FormInputs) {
    const payload: CreateSpaceInput = {
      name: data.name,
      type: spaceType,
      listing: listingId,
      description: data.description,
      capacity: data.capacity,
      area: data.area,
      images: data.images,
      price: data.price,
      hasAccommodation: data.hasAccommodation,
      accommodationCapacity: data.accommodationCapacity,
      accommodationRooms: data.accommodationRooms.map(
        ({ name, capacity, countOfRoomsOfThisType, amenityIds }) => ({
          name,
          capacity,
          countOfRoomsOfThisType,
          amenities: amenityIds.map((item) => item.id),
        }),
      ),
      spaceRules: data.spaceRuleIds.map((item) => item.id),
    };

    const finalPayload = undefinedToNull(payload);

    if (props.mode === "create") {
      createSpace(
        { ...finalPayload, parent: props.parentId },
        { onSuccess: navigateToSpaces },
      );
    } else {
      updateSpace(finalPayload, { onSuccess: navigateToSpaces });
    }
  }

  const submitLabel =
    props.mode === "create"
      ? `Vytvořit ${TYPE_LABEL[spaceType].toLowerCase()}`
      : `Uložit změny`;

  console.log(errors);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6 mt-8">
      <div className="flex w-full flex-col gap-4">
        {space && (
          <CompletionWidget
            data={getFullSpaceCompletion(space)}
            title="Dokončení prostoru"
          />
        )}

        {/* ── 1. Základní informace ─────────────────────────────────────────── */}
        <FormSection
          id={S.basics.id}
          icon={S.basics.icon}
          title={S.basics.title}
          subtitle={S.basics.subTitle}
          surfaceColor="bg-space-surface"
          color="text-space"
          error={!!errors.name}
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

        {/* ── 2. Základní cena ──────────────────────────────────────────────── */}
        <FormSection
          id={S.price.id}
          icon={S.price.icon}
          title={S.price.title}
          subtitle={S.price.subTitle}
          surfaceColor="bg-space-surface"
          color="text-space"
          error={!!errors.price?.base || !!errors.price?.pricingUnit}
        >
          <Controller
            control={control}
            name="price.pricingUnit"
            render={({ field }) => (
              <PriceInput
                label="Základní cena"
                sublabel="Jednotková cena, podle které naceňujete akce."
                isRequired
                amountProps={register("price.base")}
                unitValue={field.value}
                onUnitChange={field.onChange}
                amountError={errors.price?.base?.message}
                unitError={errors.price?.pricingUnit?.message}
                options={["per_day", "per_hour"]}
              />
            )}
          />
        </FormSection>

        {/* ── 3. Obrázky ────────────────────────────────────────────────────── */}
        <FormSection
          id={S.images.id}
          icon={S.images.icon}
          title={S.images.title}
          subtitle={S.images.subTitle}
          color="text-listing"
          surfaceColor="bg-listing-surface"
          error={!!errors.images}
        >
          <Controller
            control={control}
            name="images.coverImage"
            render={({ field }) => (
              <ImageInput
                containerRef={field.ref}
                label="Titulní obrázek"
                value={field.value}
                onChange={(filename) => field.onChange(filename ?? "")}
                onUpload={uploadFileToCloud}
                error={errors.images?.coverImage?.filename?.message}
                isRequired
              />
            )}
          />

          <Controller
            control={control}
            name="images.gallery"
            render={({ field }) => (
              <GalleryInput
                containerRef={field.ref}
                label="Galerie"
                value={field.value}
                onChange={field.onChange}
                onUpload={uploadFileToCloud}
                maxImages={20}
                isRequired
                error={errors.images?.gallery?.message}
              />
            )}
          />
        </FormSection>

        {/* ── 4. Sezónní ceny ───────────────────────────────────────────────── */}
        <FormSection
          id={S.seasonalPrices.id}
          icon={S.seasonalPrices.icon}
          title={S.seasonalPrices.title}
          subtitle={S.seasonalPrices.subTitle}
          surfaceColor="bg-space-surface"
          color="text-space"
        >
          <SeasonalPricesInput
            control={control}
            register={register}
            errors={(errors?.price?.seasonalPrices as any) ?? []}
          />
        </FormSection>

        {/* ── 5. Kapacita a plocha ──────────────────────────────────────────── */}
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
        {spaceType !== "room" && (
          <FormSection
            id={S.accommodation.id}
            icon={S.accommodation.icon}
            title={S.accommodation.title}
            subtitle={S.accommodation.subTitle}
            surfaceColor="bg-space-surface"
            color="text-space"
            error={!!errors.accommodationCapacity?.message}
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
                          ...register(`accommodationRooms.${index}.name`),
                          placeholder: "Dvoulůžkový pokoj",
                        }}
                        error={
                          errors.accommodationRooms?.[index]?.name?.message
                        }
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Kapacita (lůžek)"
                          inputProps={{
                            ...register(`accommodationRooms.${index}.capacity`),
                            type: "number",
                            min: 1,
                            placeholder: "2",
                          }}
                          error={
                            errors.accommodationRooms?.[index]?.capacity
                              ?.message
                          }
                        />
                        <Input
                          label="Počet pokojů tohoto typu"
                          inputProps={{
                            ...register(
                              `accommodationRooms.${index}.countOfRoomsOfThisType`,
                            ),
                            type: "number",
                            min: 1,
                            placeholder: "5",
                          }}
                          error={
                            errors.accommodationRooms?.[index]
                              ?.countOfRoomsOfThisType?.message
                          }
                        />
                      </div>
                      <Controller
                        control={control}
                        name={`accommodationRooms.${index}.amenityIds`}
                        render={({ field }) => (
                          <CheckboxGroup
                            searchable
                            label="Vybavení pokoje"
                            items={amenities?.docs ?? []}
                            value={field.value}
                            onChange={field.onChange}
                            checkColor={"text-space"}
                          />
                        )}
                      />
                    </div>
                  )}
                />
              </>
            )}
          </FormSection>
        )}

        {/* ── 8. Pravidla ───────────────────────────────────────────────────── */}
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
              <CheckboxGroup
                searchable
                label="Pravidla prostoru"
                items={rules?.docs ?? []}
                value={field.value}
                onChange={field.onChange}
                checkColor={"text-space"}
              />
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
  );
}
