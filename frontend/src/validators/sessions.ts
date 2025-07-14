import { z } from "zod";

export const sessionResponseSchema = z.object({
  id: z.number().int(),
  price: z.string(),
  movie: z.number().int(),
  startsAt: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: "Invalid ISO date string",
  }),
  screen: z.number().int().nonnegative(),
});

export type Session = z.infer<typeof sessionResponseSchema>;

export const sessionUpdateSchema = z.object({
  id: z.number().int(),
  movie: z.number().int(),
  price: z.number().positive(),
  startsAt: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: "Invalid ISO date string",
  }),
  screen: z.number().int().nonnegative(),
});

export const sessionCreateSchema = sessionUpdateSchema.omit({ id: true });

export type SessionUpdate = z.infer<typeof sessionUpdateSchema>;
export type SessionCreate = z.infer<typeof sessionCreateSchema>;
