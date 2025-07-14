import type { Movie } from "@/validators/movies";
import React from "react";
import MovieDetails from "./details";
import MovieHeader from "./header";
import MovieSessions from "./sessions";
import MovieAdminSection from "./admin";

const FilmsPageComponent = ({ movie }: { movie: Movie }) => {
  return (
    <div className="space-y-6">
      <MovieHeader movie={movie} />
      <MovieDetails movie={movie} />
      <MovieSessions movie={movie} />
      <MovieAdminSection movie={movie} />
    </div>
  );
};

export default FilmsPageComponent;
