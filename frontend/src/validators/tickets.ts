import { z } from "zod";
import { sessionResponseSchema } from "./sessions";
import { movieResponseSchema } from "./movies";
import { userDetailResponseSchema } from "./auth";

export const ticketResponseSchema = z.object({
  id: z.number().int(),
  session: sessionResponseSchema,
  movie: movieResponseSchema,
  seat: z.object({
    label: z.string(),
    row: z.number().int(),
    number: z.number().int(),
  }),
  purchasedAt: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: "Invalid ISO date string",
  }),
  user: userDetailResponseSchema,
});

export type Ticket = z.infer<typeof ticketResponseSchema>;
