"use client";
import { getTickets } from "@/lib/tickets";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import TicketSection from "../section";
import { useSession } from "@/hooks/session";

const MyTicketsPageComponent = () => {
  const { user, loading } = useSession();

  const {
    data: tickets,
    isLoading,
    isError,
    error,
  } = useQuery({ queryKey: ["tickets"], queryFn: () => getTickets() });

  if (!user && !loading) {
    window.location.href = "/login";
    return;
  }

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;
  if (!tickets) return <p>Tickets not found</p>;

  return <TicketSection tickets={tickets} />;
};

export default MyTicketsPageComponent;
