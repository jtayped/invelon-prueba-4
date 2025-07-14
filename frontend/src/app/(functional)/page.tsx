"use client";
import MovieSection from "@/components/movies/section";
import { getMovies } from "@/lib/movies";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const {
    data: movies,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movies"],
    queryFn: getMovies,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>There has been an error loading the movies!</p>;

  return <MovieSection movies={movies ?? []} />;
}
