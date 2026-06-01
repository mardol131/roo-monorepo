import { priceableItemSchema } from "@/app/validation/schema/priceable-schema";
import { relationshipItemSchema } from "@/app/validation/schema/relationship-item-schema";
import { getOptionalPositiveNumber } from "@/app/validation/schema/utils";
import { Listing, ListingGastroDetail } from "@roo/common";
import { z } from "zod";
import {
  employeesSchema,
  faqSchema,
  guestsSchema,
  referencesSchema,
} from "../common-schema";

export const recommendedSchema = z.object({
  guests: guestsSchema,
  setupAndTearDown: z.object({
    setupTime: getOptionalPositiveNumber("Doba přípravy musí být kladná"),
    tearDownTime: getOptionalPositiveNumber("Doba úklidu musí být kladná"),
  }),
  alcohol: z.object({
    servesAlcohol: z.boolean().default(false),
    pricingUnit: z.enum(["per_person", "per_event"]).default("per_person"),
  }),
  faq: faqSchema,
  employees: employeesSchema,
}) satisfies z.ZodType<
  Pick<Listing, "shortDescription" | "description"> &
    Pick<ListingGastroDetail, "kidsMenu" | "alcohol" | "faq" | "employees">
>;

const priceableItemBaseObject: Record<
  keyof ListingGastroDetail["options"],
  z.ZodType<z.infer<typeof priceableItemSchema>[]>
> = {
  cuisines: z.array(priceableItemSchema).default([]),
  personnel: z.array(priceableItemSchema).default([]),
  services: z.array(priceableItemSchema).default([]),
  foodPreparationStyles: z.array(priceableItemSchema).default([]),
};

export const priceableSchema = z.object(priceableItemBaseObject);

const additionalFiltersSchema: Record<
  Exclude<keyof ListingGastroDetail["filters"], "eventTypes" | "allEventTypes">,
  z.ZodType<z.infer<typeof relationshipItemSchema>[]>
> = {
  necessities: z.array(relationshipItemSchema).default([]),
  gastroRules: z.array(relationshipItemSchema).default([]),
  dishTypes: z.array(relationshipItemSchema).default([]),
  dietaryOptions: z.array(relationshipItemSchema).default([]),
};

export const supplementarySchema = z.object({
  ...additionalFiltersSchema,
  references: referencesSchema,
});

export type RecommendedData = z.infer<typeof recommendedSchema>;
export type PriceableData = z.infer<typeof priceableSchema>;
export type SupplementaryData = z.infer<typeof supplementarySchema>;
