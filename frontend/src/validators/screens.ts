import { z } from "zod";

export const screenCreateSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be at most 50 characters" }),
  rows: z
    .number({ required_error: "Number of rows is required" })
    .int()
    .min(1, { message: "There must be at least 1 row" }),
  seatsPerRow: z
    .number({ required_error: "Seats per row is required" })
    .int()
    .min(1, { message: "There must be at least 1 seat per row" }),
});

export type ScreenCreate = z.infer<typeof screenCreateSchema>;

export const screenResponseSchema = screenCreateSchema.extend({
  id: z.number().int(),
});
export type Screen = z.infer<typeof screenResponseSchema>;
