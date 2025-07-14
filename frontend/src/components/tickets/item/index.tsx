import type { Ticket } from "@/validators/tickets";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Hash,
  Clock,
  DollarSign,
  Monitor,
  MapPin,
  Star,
  Timer,
  User,
} from "lucide-react";
import { formatDate, formatDuration, formatTime } from "@/lib/utils";
import { useSession } from "@/hooks/session";
import { Button } from "@/components/ui/button";
import { refundTicket } from "@/lib/tickets";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const TicketItem = ({ ticket }: { ticket: Ticket }) => {
  const queryClient = useQueryClient();

  const { user } = useSession();
  const isAdmin = user?.isAdmin;

  const refundMutation = useMutation({
    mutationFn: () => refundTicket(ticket.id),
    onSuccess() {
      void queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });

  const isUpcoming = new Date(ticket.session.startsAt) > new Date();

  return (
    <Card className={`w-full transition-all duration-200 hover:shadow-lg`}>
      {isAdmin && (
        <CardHeader className="flex justify-between">
          <Badge>
            <User />
            {ticket.user.username}
          </Badge>
          <div className="flex items-center gap-3">
            <Button
              variant={"ghost"}
              size={"sm"}
              onClick={() => refundMutation.mutate()}
            >
              <DollarSign />
              Refund
            </Button>
          </div>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Ticket #{ticket.id}
          </span>
          <Badge
            variant={isUpcoming ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            <DollarSign className="h-3 w-3" />
            {ticket.session.price}
          </Badge>
        </CardTitle>
        {/* Movie Information */}
        <div className="mt-3 space-y-2">
          <h3 className="text-lg leading-tight font-semibold">
            {ticket.movie.title}
          </h3>
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>{ticket.movie.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Timer className="h-4 w-4" />
              <span>{formatDuration(ticket.movie.durationMin)}</span>
            </div>
          </div>
        </div>

        {/* Session Details */}
        <div className="grid grid-cols-2 gap-4 border-t border-b py-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <span>{formatDate(ticket.session.startsAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="text-muted-foreground h-4 w-4" />
              <span>{formatTime(ticket.session.startsAt)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Monitor className="text-muted-foreground h-4 w-4" />
              <span>Screen {ticket.session.screen}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="text-muted-foreground h-4 w-4" />
              <span>Seat {ticket.seat.label}</span>
            </div>
          </div>
        </div>

        <div className="text-muted-foreground text-xs">
          Purchased: {formatDate(ticket.purchasedAt)}
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketItem;
