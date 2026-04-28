import { COUNTRY_CODES } from "@roo/common";
import zod from "zod";

export const phoneSchema = zod.object({
  countryCode: zod.enum(COUNTRY_CODES, {
    error: "Vyberte kód země",
  }),
  number: zod
    .string()
    .regex(/^\d{9}$/, "Zadejte platné telefonní číslo (9 číslic)"),
});
