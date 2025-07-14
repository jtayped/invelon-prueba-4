import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Monitor } from "lucide-react";
import type { Session } from "@/validators/sessions";
import { getScreen } from "@/lib/screens";
import { buyTicket } from "@/lib/tickets";
import { useRouter } from "next/navigation";

type SeatStatus = "available" | "selected" | "occupied";

type Seat = {
  id: number;
  row: number;
  number: number;
  status: SeatStatus;
};

const SeatsField: React.FC<{ session: Session }> = ({ session }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: screen,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["screen", session.id],
    queryFn: () => getScreen(session.screen, session.id),
  });

  const [seats, setSeats] = useState<Seat[]>([]);

  useEffect(() => {
    if (!screen) return;

    const mapped: Seat[] = screen.seats.map((s) => ({
      id: s.id,
      row: s.row,
      number: s.number,
      status: s.occupied ? "occupied" : "available",
    }));

    setSeats(mapped);
  }, [screen]);

  const {
    mutate: buySeats,
    isPending: isBuying,
    isError: buyError,
    error: buyErrorObj,
  } = useMutation({
    mutationFn: ({
      sessionId,
      seatIds,
    }: {
      sessionId: number;
      seatIds: number[];
    }) => buyTicket(sessionId, seatIds),
    onSuccess: (_data, vars) => {
      // mark selected as occupied immediately
      setSeats((prev) =>
        prev.map((s) =>
          vars.seatIds.includes(s.id) ? { ...s, status: "occupied" } : s,
        ),
      );
      // refetch the screen to ensure consistency
      void queryClient.invalidateQueries({ queryKey: ["screen", session.id] });

      router.push("/tickets");
    },
  });

  // 4) safe early returns
  if (isLoading) return <p>Loading screen layout…</p>;
  if (isError) return <p>Error loading screen: {error?.message}</p>;
  if (!screen) return <p>No screen data.</p>;
  if (seats.length === 0) return <p>Preparing seats…</p>;

  // toggle selected ↔ available
  const toggleSeat = (row: number, number: number) =>
    setSeats((prev) =>
      prev.map((s) =>
        s.row === row && s.number === number && s.status !== "occupied"
          ? {
              ...s,
              status: s.status === "available" ? "selected" : "available",
            }
          : s,
      ),
    );

  const getSeatClass = (status: SeatStatus) => {
    switch (status) {
      case "available":
        return "bg-green-100 hover:bg-green-200 border-green-300 text-green-800";
      case "selected":
        return "bg-blue-500 hover:bg-blue-600 border-blue-600 text-white";
      case "occupied":
        return "bg-red-100 border-red-300 text-red-800 cursor-not-allowed opacity-50";
    }
  };

  const labelForRow = (n: number) => String.fromCharCode(65 + n - 1);

  const selected = seats.filter((s) => s.status === "selected");
  const ticketPrice = parseFloat(session.price);
  const total = selected.length * ticketPrice;

  return (
    <div className="space-y-6">
      <ScrollArea className="w-full pb-4">
        {/* Screen indicator */}
        <div className="flex flex-col items-center space-y-2">
          <div className="h-2 w-3/4 rounded-full bg-gray-300" />
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Monitor className="h-4 w-4" />
            <span>Screen</span>
          </div>
        </div>

        {/* Seat grid */}
        <div className="mt-4 flex justify-center px-4">
          <div className="space-y-2">
            {Array.from({ length: screen.rows }, (_, i) => {
              const rowNum = i + 1;
              const rowSeats = seats.filter((s) => s.row === rowNum);
              return (
                <div key={rowNum} className="flex items-center gap-2">
                  <div className="text-muted-foreground w-8 shrink-0 text-center text-sm font-medium">
                    {labelForRow(rowNum)}
                  </div>
                  <div className="flex gap-1">
                    {rowSeats.map((seat) => (
                      <Button
                        key={seat.id}
                        variant="outline"
                        size="sm"
                        className={`h-8 w-8 shrink-0 p-0 text-xs font-medium ${getSeatClass(
                          seat.status,
                        )}`}
                        onClick={() => toggleSeat(seat.row, seat.number)}
                        disabled={seat.status === "occupied"}
                      >
                        {seat.number}
                      </Button>
                    ))}
                  </div>
                  <div className="text-muted-foreground w-8 shrink-0 text-center text-sm font-medium">
                    {labelForRow(rowNum)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border border-green-300 bg-green-100" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border border-blue-600 bg-blue-500" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border border-red-300 bg-red-100 opacity-50" />
          <span>Occupied</span>
        </div>
      </div>

      {/* Summary */}
      {/* Summary & Buy button */}
      {selected.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Confirm Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {selected.map((s) => (
                  <Badge key={`sel-${s.id}`} variant="secondary">
                    {labelForRow(s.row)}
                    {s.number}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="font-medium">
                  Total ({selected.length} seats):
                </span>
                <span className="text-lg font-bold">${total}</span>
              </div>
              <div className="flex justify-end pt-4">
                <Button
                  onClick={() =>
                    buySeats({
                      sessionId: session.id,
                      seatIds: selected.map((s) => s.id),
                    })
                  }
                  disabled={isBuying}
                >
                  {isBuying ? "Purchasing…" : "Buy Tickets"}
                </Button>
              </div>
              {buyError && (
                <p className="mt-2 text-red-600">
                  Error purchasing: {buyErrorObj?.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SeatsField;
