import { z } from "zod";
import {
  employeesSchema,
  faqSchema,
  guestsSchema,
  referencesSchema,
} from "../common-schema";
import { priceableItemSchema } from "@/app/validation/schema/priceable-schema";
import { relationshipItemSchema } from "@/app/validation/schema/relationship-item-schema";
import { ListingVenueDetail } from "@roo/common";

export const recommendedSchema = z
  .object({
    guests: guestsSchema,
    area: z.coerce
      .number({ message: "Zadejte číslo" })
      .positive("Plocha musí být kladná"),
    spacesType: z.enum(
      ["area", "building", "room"] as const,
      "Vyberte typ prostoru",
    ),
    canBeBookedAsWhole: z.boolean().default(false),
    hasAccommodation: z.boolean().default(false),
    accommodationCapacity: z.coerce.number().nullable().optional(),
    placeTypes: z.array(relationshipItemSchema).default([]),
    faq: faqSchema,
    employees: employeesSchema,
  })
  .superRefine((data, ctx) => {
    if (data.hasAccommodation && !data.accommodationCapacity) {
      ctx.addIssue({
        code: "custom",
        message: "Ubytovací kapacita je povinná",
        path: ["accommodationCapacity"],
      });
    }
  });

const priceableItemBaseObject: Record<
  keyof ListingVenueDetail["options"],
  z.ZodType<z.infer<typeof priceableItemSchema>[]>
> = {
  activities: z.array(priceableItemSchema).default([]),
  amenities: z.array(priceableItemSchema).default([]),
  services: z.array(priceableItemSchema).default([]),
  personnel: z.array(priceableItemSchema).default([]),
  technologies: z.array(priceableItemSchema).default([]),
};

export const priceableSchema = z.object(priceableItemBaseObject);

const additionalFiltersSchema: Record<
  Exclude<keyof ListingVenueDetail["filters"], "eventTypes" | "allEventTypes">,
  z.ZodType<z.infer<typeof relationshipItemSchema>[]>
> = {
  necessities: z.array(relationshipItemSchema).default([]),
  venueRules: z.array(relationshipItemSchema).default([]),
  placeTypes: z.array(relationshipItemSchema).default([]),
};

export const supplementarySchema = z.object({
  ...additionalFiltersSchema,
  storage: z
    .array(
      z.object({
        name: z.string().min(1, "Název je povinný"),
        area: z.coerce.number({ message: "Zadejte číslo" }).positive(),
      }),
    )
    .default([]),
  access: z
    .object({
      vehicleTypes: z.array(z.string()).default([]),
      loadingRamp: z.boolean().default(false),
      loadingElevator: z.boolean().default(false),
      serviceAccess: z.boolean().default(false),
      serviceArea: z.boolean().default(false),
    })
    .optional(),
  parking: z
    .object({
      hasParking: z.boolean().default(false),
      parkingCapacity: z.coerce.number().nullable().optional(),
      parkingIsIncludedInPrice: z.boolean().default(false),
      parkingPrice: z.coerce.number().nullable().optional(),
      parkingPriceUnit: z.enum(["space", "event"]).nullable().optional(),
    })
    .optional(),
  breakfast: z
    .object({
      included: z.boolean().default(false),
      allowAccommodationWithoutBreakfast: z.boolean().default(false),
      allowMoreBreakfastsThanAccommodation: z.boolean().default(false),
      breakfastIsIncludedInPrice: z.boolean().default(false),
      price: z.coerce.number().nullable().optional(),
      pricePer: z.enum(["person", "booking"]).nullable().optional(),
      timeFrom: z.string().nullable().optional(),
      timeTo: z.string().nullable().optional(),
    })
    .optional(),
  catering: z
    .object({
      hasCatering: z.boolean().default(false),
      cateringIsIncludedInPrice: z.boolean().default(false),
      price: z.coerce.number().nullable().optional(),
      pricingUnit: z.enum(["per_person", "per_hour", "lump_sum"]).default("lump_sum"),
      cuisines: z.array(priceableItemSchema).default([]),
      foodPreparationStyles: z.array(priceableItemSchema).default([]),
    })
    .superRefine((data, ctx) => {
      if (data.hasCatering && !data.cateringIsIncludedInPrice) {
        if (!data.price || data.price <= 0) {
          ctx.addIssue({
            code: "custom",
            message: "Zadejte základní cenu cateringu",
            path: ["price"],
          });
        }
        if (data.cuisines.length === 0) {
          ctx.addIssue({
            code: "custom",
            message: "Vyberte alespoň jeden typ kuchyně",
            path: ["cuisines"],
          });
        }
        if (data.foodPreparationStyles.length === 0) {
          ctx.addIssue({
            code: "custom",
            message: "Vyberte alespoň jeden způsob přípravy",
            path: ["foodPreparationStyles"],
          });
        }
      }
    })
    .optional(),
  references: referencesSchema,
});

export type RecommendedData = z.infer<typeof recommendedSchema>;
export type PriceableData = z.infer<typeof priceableSchema>;
export type SupplementaryData = z.infer<typeof supplementarySchema>;
