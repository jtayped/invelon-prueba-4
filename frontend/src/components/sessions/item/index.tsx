import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useSession } from "@/hooks/session";
import { deleteSession } from "@/lib/sessions";
import type { Session } from "@/validators/sessions";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, Pen, ShoppingCart, Trash } from "lucide-react";
import Link from "next/link";
import React from "react";

const SessionItem = ({ session }: { session: Session }) => {
  const queryClient = useQueryClient();

  const { user } = useSession();
  const isAdmin = user?.isAdmin;

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const isUpcoming = (isoString: string) => {
    return new Date(isoString) > new Date();
  };

  const time = formatTime(session.startsAt);
  const date = formatDate(session.startsAt);
  const upcoming = isUpcoming(session.startsAt);

  return (
    <Card className="transition-shadow duration-200 hover:shadow-md">
      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">{time}</CardTitle>
            <span className="rounded bg-green-50 px-2 py-1 text-sm font-semibold text-green-600">
              {session.price}€
            </span>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <Button variant={"ghost"} size={"icon"} asChild>
                <Link
                  href={`/admin/movie/edit/${session.movie}/session/edit/${session.id}`}
                >
                  <Pen />
                </Link>
              </Button>
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={async () => {
                  await deleteSession(session.id);
                  await queryClient.invalidateQueries({
                    queryKey: ["sessions"],
                  });
                }}
              >
                <Trash />
              </Button>
            </div>
          )}
        </div>
        <div className="text-muted-foreground flex items-center gap-1 text-sm">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
        </div>
        {upcoming && (
          <Button asChild size="sm" className="w-full">
            <Link href={user ? `/buy/${session.id}` : "/login"}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Buy Ticket
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionItem;
