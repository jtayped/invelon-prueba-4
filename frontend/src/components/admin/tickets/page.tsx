"use client";
import TicketSection from "@/components/tickets/section";
import { getAllTickets } from "@/lib/tickets";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const AdminTicketsPageComponent = () => {
  const {
    data: tickets,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: getAllTickets,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error.message}</p>;
  if (!tickets) return <p>Tickets not found...</p>;

  return <TicketSection tickets={tickets} />;
};

export default AdminTicketsPageComponent;
