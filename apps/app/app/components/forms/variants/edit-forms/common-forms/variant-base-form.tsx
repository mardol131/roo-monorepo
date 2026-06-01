"use client";

import { FormSection } from "@/app/[locale]/(user)/components/form-section";
import { TocSection } from "@/app/[locale]/(user)/components/form-toc";
import GalleryInput from "@/app/components/ui/atoms/inputs/images/gallery-input";
import ImageInput from "@/app/components/ui/atoms/inputs/images/image-input";
import Input from "@/app/components/ui/atoms/inputs/input";
import RepeaterField from "@/app/components/ui/atoms/inputs/repeater-field";
import { Textarea } from "@/app/components/ui/atoms/inputs/textarea";
import { uploadFileToCloud } from "@/app/functions/upload-file-to-cloud";
import { optionalMediaSchema } from "@/app/validation/schema/media-schema";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import z from "zod";

export const baseSchema = z.object({
  name: z.string().min(1, "Název je povinný"),
  shortDescription: z
    .string()
    .min(1, "Krátký popis je povinný")
    .max(50, "Max. 50 znaků"),
  description: z.string().optional(),
  images: z.object({
    coverImage: z.object(optionalMediaSchema),
    gallery: z.array(z.object(optionalMediaSchema)).default([]),
  }),
  includes: z.array(z.object({ item: z.string() })).default([]),
  excludes: z.array(z.object({ item: z.string() })).default([]),
});
export type BaseData = z.infer<typeof baseSchema>;

type Props = {
  form: UseFormReturn<BaseData>;
  isActive: boolean;
  texts: {
    basic: TocSection;
    images: TocSection;
    includesExcludes: TocSection;
  };
};

export function BaseForm({ form, isActive, texts }: Props) {
  const {
    fields: includesFields,
    append: appendInclude,
    remove: removeInclude,
  } = useFieldArray({ control: form.control, name: "includes" });

  const {
    fields: excludesFields,
    append: appendExclude,
    remove: removeExclude,
  } = useFieldArray({ control: form.control, name: "excludes" });

  return (
    <div className={isActive ? "flex flex-col gap-4" : "hidden"}>
      <FormSection
        id={texts.basic.id}
        icon={texts.basic.icon}
        title={texts.basic.title}
        surfaceColor="bg-variant-surface"
        color="text-variant"
        error={
          !!form.formState.errors.name ||
          !!form.formState.errors.shortDescription
        }
      >
        <Input
          label="Název"
          isRequired
          inputProps={{
            ...form.register("name"),
            placeholder: "Standardní balíček",
          }}
          error={form.formState.errors.name?.message}
        />
        <Input
          label="Krátký popis"
          isRequired
          inputProps={{
            ...form.register("shortDescription"),
            placeholder: "Stručný popis varianty (max. 50 znaků)",
          }}
          maxLength={50}
          error={form.formState.errors.shortDescription?.message}
        />
        <Textarea
          label="Detailní popis"
          inputProps={{
            ...form.register("description"),
            placeholder: "Podrobný popis varianty...",
            rows: 4,
          }}
        />
      </FormSection>
      <FormSection
        id={texts.includesExcludes.id}
        icon={texts.includesExcludes.icon}
        title={texts.includesExcludes.title}
        surfaceColor="bg-variant-surface"
        color="text-variant"
      >
        <RepeaterField
          label="Co je zahrnuto"
          fields={includesFields}
          onAppend={() => appendInclude({ item: "" })}
          onRemove={removeInclude}
          addButtonLabel="Přidat položku"
          renderItem={(_, i) => (
            <Input
              label="Položka"
              inputProps={{
                ...form.register(`includes.${i}.item`),
                placeholder: "např. Technika, Obsluha...",
              }}
            />
          )}
        />
        <RepeaterField
          label="Co není zahrnuto"
          fields={excludesFields}
          onAppend={() => appendExclude({ item: "" })}
          onRemove={removeExclude}
          addButtonLabel="Přidat položku"
          renderItem={(_, i) => (
            <Input
              label="Položka"
              inputProps={{
                ...form.register(`excludes.${i}.item`),
                placeholder: "např. Catering, Parkování...",
              }}
            />
          )}
        />
      </FormSection>
      <FormSection
        id={texts.images.id}
        icon={texts.images.icon}
        title={texts.images.title}
        subtitle="Podporované formáty: jpg, png, webp"
        surfaceColor="bg-variant-surface"
        color="text-variant"
        error={!!form.formState.errors.images?.coverImage}
      >
        <Controller
          control={form.control}
          name="images.coverImage"
          render={({ field }) => (
            <ImageInput
              label="Titulní obrázek"
              isRequired
              value={field.value}
              onChange={(f) => field.onChange(f ?? "")}
              onUpload={uploadFileToCloud}
              error={form.formState.errors.images?.coverImage?.message}
            />
          )}
        />
        <Controller
          control={form.control}
          name="images.gallery"
          render={({ field }) => (
            <GalleryInput
              label="Galerie"
              value={field.value ?? []}
              onChange={field.onChange}
              onUpload={uploadFileToCloud}
              maxImages={20}
            />
          )}
        />
      </FormSection>
    </div>
  );
}
