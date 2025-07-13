import { z } from "zod";

export const registerResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
});

export const tokenObtainPairResponseSchema = z.object({
  refresh: z.string(),
  access: z.string(),
});

export const tokenRefreshResponseSchema = z.object({
  access: z.string(),
});

export const userDetailResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  isAdmin: z.boolean(),
});
