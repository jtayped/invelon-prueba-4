import type { userDetailResponseSchema } from "@/validators/auth";
import type z from "zod";

export type User = z.infer<typeof userDetailResponseSchema>;
