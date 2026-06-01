import { PRICING_UNITS_ARRAY } from "@roo/common";
import z from "zod";

export const priceableItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  pricingUnit: z.enum(PRICING_UNITS_ARRAY),
  unitPrice: z.number("Zadejte cenu").min(0, "Cena musí být kladná"),
  quantity: z.number("Zadejte počet").int().min(1, "Počet musí být alespoň 1"),
});
