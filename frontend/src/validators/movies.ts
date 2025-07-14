import { z } from "zod";

export const movieResponseSchema = z.object({
  id: z.number().int(),
  title: z.string().max(120),
  description: z.string(),
  durationMin: z.number().int().nonnegative(),
  rating: z.string().max(5),
  active: z.boolean(),
});

export type Movie = z.infer<typeof movieResponseSchema>;

export const movieEditSchema = z.object({
  id: z.number().int(),
  title: z.string().max(120),
  description: z.string(),
  durationMin: z.number().int().nonnegative(),
  rating: z.string().max(5),
  active: z.boolean(),
});

export const movieCreateSchema = movieEditSchema.omit({ id: true });

export type MovieEdit = z.infer<typeof movieEditSchema>;
export type MovieCreate = z.infer<typeof movieCreateSchema>;
