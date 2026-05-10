import {
  optionalMediaSchema,
  requiredMediaSchema,
} from "@/app/validation/schema/media-schema";
import { relationshipItemSchema } from "@/app/validation/schema/relationship-item-schema";
import z from "zod";

export const getPositiveNumber = (errorMessage: string) => {
  return z.preprocess(
    (val) =>
      val === "" || val === undefined || val === null ? undefined : val,
    z.coerce.number(errorMessage).positive(errorMessage),
  );
};

export const getOptionalPositiveNumber = (errorMessage: string) =>
  z.preprocess(
    (val) =>
      val === "" || val === undefined || val === null ? undefined : val,
    z.coerce.number(errorMessage).positive(errorMessage).optional(),
  );

export const commonListingFieldsSchema = {
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
    .array(relationshipItemSchema, "Vyberte typ akce")
    .min(1, "Vyberte alespoň jeden typ akce"),
};

export const gastroAndEntertainmentCommonFieldsSchema = {
  location: z.object({
    regions: z
      .array(relationshipItemSchema, "Vyberte kraj")
      .min(1, "Vyberte alespoň jeden kraj"),
    districts: z.array(relationshipItemSchema).default([]),
    cities: z.array(relationshipItemSchema).default([]),
    address: z.string().optional(),
  }),
  capacity: getPositiveNumber("Kapacita musí být kladná"),
  minimumCapacity: getOptionalPositiveNumber(
    "Minimální kapacita musí být kladná",
  ),
};
