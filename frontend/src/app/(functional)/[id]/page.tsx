"use client";
import FilmsPageComponent from "@/components/movies/page";
import { getMovie } from "@/lib/movies";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";

const FilmPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: movie,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movie"],
    queryFn: () => getMovie(parseInt(id)),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>There has been an error finding the movie.</p>;
  if (!movie) return <p>Movie not found :(</p>;

  return <FilmsPageComponent movie={movie} />;
};

export default FilmPage;
