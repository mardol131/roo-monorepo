import z from "zod";

export const requiredMediaSchema = {
  filename: z.string("Obrázek je povinný"),
  alt: z.string().optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  size: z.number().optional().nullable(),
  mimeType: z.string().optional().nullable(),
};

export const optionalMediaSchema = {
  filename: z.string().optional().nullable(),
  alt: z.string().optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  size: z.number().optional().nullable(),
  mimeType: z.string().optional().nullable(),
};
