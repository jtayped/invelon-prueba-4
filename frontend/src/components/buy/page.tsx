"use client";
import React from "react";
import BuyForm from "./form";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/lib/sessions";
import { useSession } from "@/hooks/session";

const BuyPageComponent = ({ sessionId }: { sessionId: number }) => {
  const { user, loading } = useSession();

  const {
    data: session,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["session"],
    queryFn: () => getSession(sessionId),
  });

  if (!user && !loading) {
    window.location.href = "/login";
  }

  if (isLoading) return <p>Loading...</p>;
  if (!session || isError)
    return <p>There has been an error finding the session</p>;

  return <BuyForm session={session} />;
};

export default BuyPageComponent;
