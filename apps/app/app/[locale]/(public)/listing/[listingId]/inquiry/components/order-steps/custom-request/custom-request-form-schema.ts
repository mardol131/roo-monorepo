import z from "zod";

export const customRequestFormSchema = z
  .object({
    note: z.string().min(10, "Popis musí mít alespoň 10 znaků"),
    requirements: z.array(z.object({ text: z.string() })),
    isOneTimeService: z.boolean(),
    serviceTime: z.object({
      arrivalTime: z.string().optional(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.isOneTimeService) {
      if (!data.serviceTime.arrivalTime) {
        ctx.addIssue({
          code: "custom",
          message: "Vyplňte čas příjezdu",
          path: ["serviceTime", "arrivalTime"],
        });
      }
    } else {
      if (!data.serviceTime.startTime) {
        ctx.addIssue({
          code: "custom",
          message: "Vyplňte čas od",
          path: ["serviceTime", "startTime"],
        });
      }
      if (!data.serviceTime.endTime) {
        ctx.addIssue({
          code: "custom",
          message: "Vyplňte čas do",
          path: ["serviceTime", "endTime"],
        });
      }
    }
  });

export type CustomRequestFormData = z.infer<typeof customRequestFormSchema>;
