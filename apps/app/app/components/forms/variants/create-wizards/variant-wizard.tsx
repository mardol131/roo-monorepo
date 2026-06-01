"use client";

import { useRouter } from "@/app/i18n/navigation";
import { useFilterOptions } from "@/app/react-query/filters/aggregated-filters/hooks";
import { useListing } from "@/app/react-query/listings/hooks";
import { CreateVariantPayload } from "@/app/react-query/variants/fetch";
import { useCreateVariant } from "@/app/react-query/variants/hooks";
import { optionalMediaSchema } from "@/app/validation/schema/media-schema";
import {
  getOptionalPositiveNumber,
  getPositiveNumber,
} from "@/app/validation/schema/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideIcons } from "@roo/common";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import z from "zod";
import WizardLayout from "../../listings/create-wizards/wizard-layout";
import { priceWithoutTravelFeeSchema } from "../../listings/edit-forms/common-schema";
import {
  VariantBasicInfoStep,
  VariantImagesStep,
  VariantPriceStep,
} from "./common";

// ── Schema ────────────────────────────────────────────────────────────────────

const wizardSchema = z.object({
  name: z.string().min(1, "Název je povinný"),
  shortDescription: z
    .string()
    .min(1, "Krátký popis je povinný")
    .max(50, "Max. 50 znaků"),
  description: z.string().optional(),

  price: priceWithoutTravelFeeSchema,
  images: z.object({
    coverImage: z.object(optionalMediaSchema, "Titulní obrázek je povinný"),
    gallery: z.array(z.object(optionalMediaSchema)).default([]),
  }),
  capacity: z.object({
    max: getOptionalPositiveNumber("Zadejte maximální kapacitu"),
    min: getOptionalPositiveNumber("Zadejte kladné číslo"),
  }),
});
type WizardFormInputs = z.infer<typeof wizardSchema>;

// ── Steps ─────────────────────────────────────────────────────────────────────

const STEPS = ["Základní info", "Cena", "Fotky"];

const STEP_FIELDS: (keyof WizardFormInputs | string)[][] = [
  ["name", "shortDescription", "description", "capacity.max", "capacity.min"],
  ["price.base", "price.pricingUnit", "price.seasonalPrices"],
  ["images.coverImage", "images.gallery"],
];

// ── Payload builders ──────────────────────────────────────────────────────────

function buildPayload(
  data: WizardFormInputs,
  listingId: string,
  blockType: "venue" | "gastro" | "entertainment",
): CreateVariantPayload {
  const base: Omit<CreateVariantPayload, "details"> = {
    listing: listingId,
    name: data.name,
    shortDescription: data.shortDescription,
    description: data.description ?? null,
    // capacity is top-level in Variant, not inside detail blocks
    capacity: {
      max: data.capacity.max ?? null,
      min: data.capacity.min ?? null,
    },

    price: data.price,
    images: data.images,
  };

  if (blockType === "venue") {
    return {
      ...base,
      details: [
        {
          blockType: "venue",
          accommodation: {},
          breakfast: {},
        },
      ],
    };
  }

  if (blockType === "gastro") {
    return {
      ...base,
      details: [
        {
          blockType: "gastro",
        },
      ],
    };
  }

  return {
    ...base,
    details: [
      {
        blockType: "entertainment",
        audience: [],
        performance: {},
      },
    ],
  };
}

// ── Icon map ──────────────────────────────────────────────────────────────────

const BLOCK_ICON: Record<"venue" | "gastro" | "entertainment", LucideIcons> = {
  venue: "Building2",
  gastro: "UtensilsCrossed",
  entertainment: "Music",
};

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  blockType: "venue" | "gastro" | "entertainment";
  listingId: string;
  companyId: string;
  onCancel: () => void;
};

export default function VariantCreateWizard({
  blockType,
  listingId,
  companyId,
  onCancel,
}: Props) {
  const router = useRouter();

  const { mutateAsync: createVariant } = useCreateVariant();

  const [step, setStep] = useState(0);
  const [maxReachedStep, setMaxReachedStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<WizardFormInputs>({
    resolver: zodResolver(wizardSchema) as Resolver<WizardFormInputs>,
    mode: "onChange",
  });

  async function handleNext() {
    const valid = await trigger(
      STEP_FIELDS[step] as Parameters<typeof trigger>[0],
    );
    if (!valid) return false;
    const next = step + 1;
    setStep(next);
    setMaxReachedStep((m) => Math.max(m, next));
    return true;
  }

  async function onSubmit(data: WizardFormInputs) {
    setIsSubmitting(true);
    try {
      await createVariant(buildPayload(data, listingId, blockType));
      router.push({
        pathname:
          "/company-profile/companies/[companyId]/listings/[listingId]/variants",
        params: { companyId, listingId },
      });
    } catch {
      alert("Nepodařilo se vytvořit variantu, zkuste to prosím znovu.");
      setIsSubmitting(false);
    }
  }

  console.log("Errors:", errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <WizardLayout
        steps={STEPS}
        currentStep={step}
        maxReachedStep={maxReachedStep}
        onStepClick={setStep}
        onBack={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setStep((s) => s - 1);
        }}
        onNext={async () => {
          if (step === STEPS.length - 1) {
            handleSubmit(onSubmit)();
          } else {
            const res = await handleNext();
            if (res) window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        onCancel={onCancel}
        isLastStep={step === STEPS.length - 1}
        isSubmitting={isSubmitting}
        colorScheme="variant"
      >
        {step === 0 && (
          <VariantBasicInfoStep
            control={control}
            register={register}
            errors={errors}
            icon={BLOCK_ICON[blockType]}
          />
        )}
        {step === 1 && (
          <VariantPriceStep
            control={control}
            register={register}
            errors={errors}
          />
        )}

        {step === 2 && <VariantImagesStep control={control} errors={errors} />}
      </WizardLayout>
    </form>
  );
}
