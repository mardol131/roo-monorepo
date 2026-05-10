import {
  optionalMediaSchema,
  requiredMediaSchema,
} from "@/app/validation/schema/media-schema";
import z from "zod";
import {
  getOptionalPositiveNumber,
  getPositiveNumber,
} from "../../../new/forms/common-schema";
import { relationshipItemSchema } from "@/app/validation/schema/relationship-item-schema";

export const commonEditListingFieldsSchema = {
  name: z.string().min(1, "Název je povinný"),
  images: z.object({
    coverImage: z.object(requiredMediaSchema, "Titulní obrázek je povinný"),
    logo: z.object(optionalMediaSchema),
    gallery: z
      .array(z.object(requiredMediaSchema))
      .min(4, "Přidejte alespoň čtyři obrázky"),
  }),
  price: z.object({
    startsAt: getPositiveNumber("Zadejte cenu od"),
  }),
  eventTypes: z
    .array(relationshipItemSchema)
    .min(1, "Vyberte alespoň jeden typ akce"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  capacity: getPositiveNumber("Zadejte kapacitu"),
  minimumCapacity: getOptionalPositiveNumber("Zadejte minimální kapacitu"),
  employees: z
    .array(
      z.object({
        name: z.string().min(1, "Jméno je povinné"),
        role: z.string().min(1, "Role je povinná"),
        description: z.string().optional(),
        image: z.object(optionalMediaSchema),
      }),
    )
    .default([]),
  faq: z
    .array(
      z.object({
        active: z.boolean().default(true),
        question: z.string().min(1, "Otázka je povinná"),
        answer: z.string().min(1, "Odpověď je povinná"),
        groupedBy: z
          .enum(["general", "booking", "cancellation", "payment", "other"])
          .default("general"),
      }),
    )
    .default([]),
  references: z
    .array(
      z.object({
        image: z.object(optionalMediaSchema),
        eventName: z.string().min(1, "Název akce je povinný"),
        description: z.string().optional(),
        clientName: z.string().optional(),
        eventType: relationshipItemSchema.optional(),
      }),
    )
    .default([]),
  personnel: z.array(relationshipItemSchema).default([]),
  necessities: z.array(relationshipItemSchema).default([]),
  rules: z.array(relationshipItemSchema).default([]),
};
