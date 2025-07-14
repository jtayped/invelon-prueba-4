import api from "@/lib/auth";
import { ticketResponseSchema, type Ticket } from "@/validators/tickets";

export async function buyTicket(sessionId: number, seatIds: number[]) {
  await api.post(`/api/movies/sessions/${sessionId}/buy/`, {
    seatIds,
  });
}

export async function getTickets(): Promise<Ticket[] | undefined> {
  const res = await api.get("/api/tickets/my/");
  const parsed = ticketResponseSchema.array().parse(res.data);

  return parsed;
}

export async function getAllTickets(): Promise<Ticket[] | undefined> {
  const res = await api.get("/api/tickets/");
  const parsed = ticketResponseSchema.array().parse(res.data);

  return parsed;
}

export async function refundTicket(ticketId: number) {
  await api.delete(`/api/tickets/${ticketId}/`);
}
