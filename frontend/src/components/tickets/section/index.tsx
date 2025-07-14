import type { Ticket } from "@/validators/tickets";
import React from "react";
import TicketItem from "../item";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const TicketSection = ({ tickets }: { tickets: Ticket[] }) => {
  // Group tickets by upcoming vs past shows
  const now = new Date();
  const upcomingTickets = tickets.filter(
    (t) => new Date(t.session.startsAt) > now,
  );
  const pastTickets = tickets.filter(
    (t) => new Date(t.session.startsAt) <= now,
  );

  return (
    <div className="space-y-6">
      {tickets.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No tickets found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {upcomingTickets.length > 0 && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Calendar className="h-5 w-5" />
                Upcoming Shows ({upcomingTickets.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingTickets.map((t) => (
                  <TicketItem key={t.id} ticket={t} />
                ))}
              </div>
            </div>
          )}

          {pastTickets.length > 0 && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Calendar className="h-5 w-5" />
                Past Shows ({pastTickets.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pastTickets.map((t) => (
                  <TicketItem key={t.id} ticket={t} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketSection;
