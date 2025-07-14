import api from "@/lib/auth";
import {
  sessionResponseSchema,
  type Session,
  type SessionCreate,
  type SessionUpdate,
} from "@/validators/sessions";

export async function getSessions(movieId: number): Promise<Session[] | null> {
  try {
    const res = await api.get(`/api/movies/sessions?movie=${movieId}`);
    const parsed = sessionResponseSchema.array().parse(res.data);

    return parsed;
  } catch (error) {
    console.error(error);
  }

  return null;
}

export async function getSession(
  sessionId: number,
): Promise<Session | undefined> {
  try {
    const res = await api.get(`/api/movies/sessions/${sessionId}`);
    const parsed = sessionResponseSchema.parse(res.data);

    return parsed;
  } catch (error) {
    console.error(error);
  }
}

export async function createSession(
  session: SessionCreate,
): Promise<Session | undefined> {
  try {
    const res = await api.post("/api/movies/sessions/", session);
    const parsed = sessionResponseSchema.parse(res.data);
    return parsed;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function editSession(
  session: SessionUpdate,
): Promise<Session | undefined> {
  const res = await api.put(`/api/movies/sessions/${session.id}/`, session);
  const parsed = sessionResponseSchema.parse(res.data);
  return parsed;
}

export async function deleteSession(sessionId: number) {
  await api.delete(`/api/movies/sessions/${sessionId}/`);
}
