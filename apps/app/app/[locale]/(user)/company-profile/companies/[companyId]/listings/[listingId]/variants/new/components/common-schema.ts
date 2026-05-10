import {
  optionalMediaSchema,
  requiredMediaSchema,
} from "@/app/validation/schema/media-schema";
import { relationshipItemSchema } from "@/app/validation/schema/relationship-item-schema";
import z from "zod";
import {
  getOptionalPositiveNumber,
  getPositiveNumber,
} from "../../../../new/forms/common-schema";

export const createVariantCommonSchema = {
  name: z.string().min(1, "Název je povinný"),
  shortDescription: z
    .string()
    .min(1, "Krátký popis je povinný")
    .max(50, "Max. 50 znaků"),
  description: z.string().optional(),
  type: z.enum(["allYear", "seasonal"]),
  availability: z.enum(["allDay", "selectedHours"]),
  selectedHours: z
    .array(
      z.object({
        from: z.string().min(1, "Čas od je povinný"),
        to: z.string().min(1, "Čas do je povinný"),
      }),
    )
    .default([]),
  price: z.object({
    generalPrice: getPositiveNumber("Cena je povinná"),
    seasonalPrices: z
      .array(
        z.object({
          price: getPositiveNumber("Zadejte kladné číslo"),
          description: z.string().optional(),
          from: z.string("Datum je povinné").min(1, "Datum od je povinné"),
          to: z.string("Datum je povinné").min(1, "Datum do je povinné"),
        }),
      )
      .default([]),
  }),
  images: z.object({
    coverImage: z.object(optionalMediaSchema, "Titulní obrázek je povinný"),
    gallery: z.array(z.object(optionalMediaSchema)).default([]),
  }),
  eventTypes: z.array(relationshipItemSchema).default([]),
  includes: z.array(z.object({ item: z.string() })).default([]),
  excludes: z.array(z.object({ item: z.string() })).default([]),
  capacity: z.object({
    max: getPositiveNumber("Zadejte kladné číslo"),
    min: getOptionalPositiveNumber("Zadejte kladné číslo"),
  }),
};
