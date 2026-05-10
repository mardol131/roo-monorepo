import z from "zod";

export const relationshipItemSchema = z.object({
  id: z.string(),
  name: z.string(),
});
