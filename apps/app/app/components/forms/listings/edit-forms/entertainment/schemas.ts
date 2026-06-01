import { getOptionalPositiveNumber } from "@/app/validation/schema/utils";
import { z } from "zod";
import {
  employeesSchema,
  faqSchema,
  fullLocationSchema,
  guestsSchema,
  listingImagesSchema,
  priceWithTravelFeeSchema,
  referencesSchema,
  reqiredArrayRelationshipItems,
  servicableAreaSchema,
} from "../common-schema";
import { priceableItemSchema } from "@/app/validation/schema/priceable-schema";
import { Listing, ListingEntertainmentDetail } from "@roo/common";
import { relationshipItemSchema } from "@/app/validation/schema/relationship-item-schema";

export const recommendedSchema = z.object({
  guests: guestsSchema,
  audience: z.array(z.enum(["adults", "kids", "seniors"] as const)).default([]),
  setupAndTearDown: z.object({
    setupTime: getOptionalPositiveNumber("Doba přípravy musí být kladná"),
    tearDownTime: getOptionalPositiveNumber("Doba úklidu musí být kladná"),
  }),
  faq: faqSchema,
  employees: employeesSchema,
}) satisfies z.ZodType<
  Pick<Listing, "shortDescription" | "description"> &
    Pick<
      ListingEntertainmentDetail,
      "audience" | "setupAndTearDown" | "faq" | "employees"
    >
>;

const priceableItemBaseObject: Record<
  keyof ListingEntertainmentDetail["options"],
  z.ZodType<z.infer<typeof priceableItemSchema>[]>
> = {
  technologies: z.array(priceableItemSchema).default([]),
  services: z.array(priceableItemSchema).default([]),
};

export const priceableSchema = z.object(priceableItemBaseObject);

const additionalFiltersSchema: Record<
  Exclude<
    keyof ListingEntertainmentDetail["filters"],
    "eventTypes" | "allEventTypes"
  >,
  z.ZodType<z.infer<typeof relationshipItemSchema>[]>
> = {
  necessities: z.array(relationshipItemSchema).default([]),
  musicGenres: z.array(relationshipItemSchema).default([]),
  entertainmentRules: z.array(relationshipItemSchema).default([]),
};

export const supplementarySchema = z.object({
  ...additionalFiltersSchema,
  references: referencesSchema,
});

export type RecommendedData = z.infer<typeof recommendedSchema>;
export type PriceableData = z.infer<typeof priceableSchema>;
export type SupplementaryData = z.infer<typeof supplementarySchema>;
