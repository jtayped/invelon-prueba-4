import api from "@/lib/auth";
import {
  screenResponseSchema,
  type Screen,
  type ScreenCreate,
} from "@/validators/screens";
import z from "zod";

export async function createScreen(screen: ScreenCreate): Promise<Screen> {
  const res = await api.post("/api/screens/", screen);
  const parsed = screenResponseSchema.parse(res.data);

  return parsed;
}

export async function getScreens(): Promise<Screen[]> {
  const res = await api.get("/api/screens/");
  const parsed = screenResponseSchema.array().parse(res.data);

  return parsed;
}

export async function getScreen(screenId: number, sessionId: number) {
  try {
    const res = await api.get(
      `/api/screens/${screenId}/?session_id=${sessionId}`,
    );
    console.log(res.data);
    const parsed = screenResponseSchema
      .extend({
        seats: z
          .object({
            row: z.number(),
            number: z.number(),
            occupied: z.boolean(),
            id: z.number(),
          })
          .array(),
      })
      .parse(res.data);

    return parsed;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
