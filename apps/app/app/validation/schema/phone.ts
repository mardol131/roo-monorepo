import zod from "zod";

export const phoneSchema = zod.object({
  countryCode: zod.enum(["420"] as const, {
    error: "Vyberte kód země",
  }),
  number: zod
    .string()
    .regex(/^\d{9}$/, "Zadejte platné telefonní číslo (9 číslic)"),
});
