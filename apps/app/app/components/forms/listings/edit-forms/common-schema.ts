import {
  optionalMediaSchema,
  requiredMediaSchema,
} from "@/app/validation/schema/media-schema";
import z from "zod";
import { relationshipItemSchema } from "@/app/validation/schema/relationship-item-schema";
import {
  getNonNegativeNumber,
  getOptionalPositiveNumber,
  getPositiveNumber,
} from "@/app/validation/schema/utils";
import { Listing, ListingEntertainmentDetail, PricingUnits } from "@roo/common";

const pricingUnits: PricingUnits[] = [
  "per_hour",
  "per_person",
  "per_day",
  "lump_sum",
];

export const pricingUnitSchema = z.enum(pricingUnits, "Vyberte jednotku ceny");

export const seasonalPricesSchema = z
  .array(
    z.object({
      amount: getPositiveNumber("Zadejte částku"),
      adjustmentType: z.enum(["surcharge", "discount"], "Vyberte typ úpravy"),
      valueType: z.enum(["absolute", "percentage"], "Vyberte typ hodnoty"),
      title: z.string("Popis je povinný").min(1, "Popis je povinný"),
      from: z
        .string("Zadejte počáteční datum")
        .min(1, "Zadejte počáteční datum"),
      to: z.string("Zadejte koncové datum").min(1, "Zadejte koncové datum"),
    }),
  )
  .default([]);

export const priceWithTravelFeeSchema = z
  .object({
    base: getPositiveNumber("Zadejte cenu od"),
    pricingUnit: pricingUnitSchema,
    seasonalPrices: seasonalPricesSchema,
    travelFeeEnabled: z.boolean().default(false),
    travelFeePerKm: getOptionalPositiveNumber("Cena za km musí být kladná"),
    travelFeeStartsAtKm: getNonNegativeNumber("Vzdálenost musí být nezáporná"),
    travelFeeType: z.enum(["one_way", "round_trip"]).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.travelFeeEnabled) {
      if (data.travelFeePerKm === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "Cena za km je povinná",
          path: ["travelFeePerKm"],
        });
      }
      if (data.travelFeeStartsAtKm === undefined) {
        ctx.addIssue({
          code: "custom",
          message:
            "Vzdálenost je povinná. Zadejte 0, pokud se cestovné účtuje od prvního km.",
          path: ["travelFeeStartsAtKm"],
        });
      }
      if (data.travelFeeType === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "Typ cestovného je povinný",
          path: ["travelFeeType"],
        });
      }
    }
  });

export const priceWithoutTravelFeeSchema = z.object({
  base: getPositiveNumber("Zadejte cenu od"),
  seasonalPrices: seasonalPricesSchema,
  pricingUnit: pricingUnitSchema,
});

export const eventTypeSelectionSchema = z
  .object({
    servesAll: z.boolean().default(false),
    types: z.array(relationshipItemSchema).default([]),
  })
  .superRefine((data, ctx) => {
    if (!data.servesAll && data.types.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Vyberte alespoň jeden typ akce",
        path: ["types"],
      });
    }
  });

export const servicableAreaSchema = z
  .object({
    wholeCountry: z.boolean().default(false),
    regions: z.array(relationshipItemSchema).default([]),
    districts: z.array(relationshipItemSchema).default([]),
    cities: z.array(relationshipItemSchema).default([]),
  })
  .superRefine((data, ctx) => {
    if (!data.wholeCountry && data.regions.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Vyberte alespoň jeden kraj",
        path: ["regions"],
      });
    }
  }) satisfies z.ZodType<{ [K in keyof Listing["servicableArea"]]: unknown }>;

export const fullLocationSchema = z.object({
  address: z.string().min(1, "Adresa je povinná"),
  city: z.object(
    { id: z.string().min(1, "Město je povinné"), name: z.string() },
    "Vyberte město",
  ),
  coordinates: z.object(
    { latitude: z.number(), longitude: z.number() },
    "Vyberte přesnou polohu",
  ),
}) satisfies z.ZodType<
  { [K in keyof Pick<Listing["location"], "address" | "city">]: unknown } & {
    coordinates: { [K in "latitude" | "longitude"]: unknown };
  }
>;

export const listingImagesSchema = z.object({
  coverImage: z.object(requiredMediaSchema, "Titulní obrázek je povinný"),
  logo: z.object(optionalMediaSchema).optional(),
  gallery: z
    .array(
      z.object(requiredMediaSchema, "Přidejte alespoň čtyři obrázky"),
      "Přidejte alespoň čtyři obrázky",
    )
    .min(4, "Přidejte alespoň čtyři obrázky"),
}) satisfies z.ZodType<
  Pick<Listing["images"], "coverImage" | "gallery" | "logo">
>;

export const reqiredArrayRelationshipItems = z
  .array(relationshipItemSchema)
  .min(1, "Vyberte alespoň jeden typ akce");

export const guestsSchema = z.object({
  min: getOptionalPositiveNumber("Zadejte minimální kapacitu"),
  max: getOptionalPositiveNumber("Zadejte maximální kapacitu"),
  ztp: z.boolean().default(true),
  pets: z.boolean().default(true),
}) satisfies z.ZodType<Listing["guests"]>;

export const employeesSchema = z
  .array(
    z.object({
      name: z.string().min(1, "Jméno je povinné"),
      role: z.string().min(1, "Role je povinná"),
      description: z.string().optional(),
      image: z.object(optionalMediaSchema),
    }),
  )
  .default([]) satisfies z.ZodType<ListingEntertainmentDetail["employees"]>;

export const faqSchema = z
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
  .default([]) satisfies z.ZodType<ListingEntertainmentDetail["faq"]>;

export const referencesSchema = z
  .array(
    z.object({
      image: z.object(optionalMediaSchema),
      eventName: z.string().min(1, "Název akce je povinný"),
      description: z.string().optional(),
      clientName: z.string().optional(),
      eventType: relationshipItemSchema.optional(),
    }),
  )
  .default([]) satisfies z.ZodType<
  {
    [K in keyof NonNullable<
      ListingEntertainmentDetail["references"]
    >[number]]: unknown;
  }[]
>;

export const baseSchema = z.object({
  name: z.string().min(1, "Název je povinný"),
  subType: z.string().min(1, "Vyberte typ zábavy"),
  shortDescription: z.string().min(1, "Krátký popis je povinný"),
  description: z.string().nullable().optional(),
  images: listingImagesSchema,
  eventTypeSelection: eventTypeSelectionSchema,
}) satisfies z.ZodType<{
  [K in keyof Pick<Listing, "name" | "subType" | "images">]: unknown;
}>;

export const simpleBaseSchema = z.object({
  name: z.string().min(1, "Název je povinný"),
  shortDescription: z.string().min(1, "Krátký popis je povinný"),
  description: z.string().nullable().optional(),
  images: listingImagesSchema,
  eventTypeSelection: eventTypeSelectionSchema,
}) satisfies z.ZodType<{
  [K in keyof Pick<Listing, "name" | "images">]: unknown;
}>;

export const fullPriceSchema = z.object({
  minimumPricePerEvent: getPositiveNumber(
    "Zadejte minimální cenu, za kterou přijímáte poptávku",
  ),
  price: priceWithTravelFeeSchema,
}) satisfies z.ZodType<{
  [K in
    | keyof Pick<Listing, "minimumPricePerEvent">
    | keyof Pick<ListingEntertainmentDetail, "price">]: unknown;
}>;

export const simplePriceSchema = z.object({
  minimumPricePerEvent: getPositiveNumber(
    "Zadejte minimální cenu, za kterou přijímáte poptávku",
  ),
  price: priceWithoutTravelFeeSchema,
}) satisfies z.ZodType<{
  [K in
    | keyof Pick<Listing, "minimumPricePerEvent">
    | keyof Pick<ListingEntertainmentDetail, "price">]: unknown;
}>;

export const fullLocalitySchema = z.object({
  servicableArea: servicableAreaSchema,
  location: fullLocationSchema,
});

export const simpleLocalitySchema = z.object({
  location: fullLocationSchema,
});

export type FullLocalityData = z.infer<typeof fullLocalitySchema>;
export type SimpleLocalityData = z.infer<typeof simpleLocalitySchema>;
export type BaseData = z.infer<typeof baseSchema>;
export type SimpleBaseData = z.infer<typeof simpleBaseSchema>;
export type FullPriceData = z.infer<typeof fullPriceSchema>;
export type SimplePriceData = z.infer<typeof simplePriceSchema>;
