import SessionSection from "@/components/sessions/section";
import { getSessions } from "@/lib/sessions";
import type { Movie } from "@/validators/movies";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const MovieSessions = ({ movie }: { movie: Movie }) => {
  const {
    data: sessions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => getSessions(movie.id),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError || !sessions)
    return <p>There has been an error finding the sessions.</p>;

  return <SessionSection sessions={sessions} />;
};

export default MovieSessions;
