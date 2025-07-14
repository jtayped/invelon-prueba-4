import type { Movie } from "@/validators/movies";
import React from "react";
import MovieItem from "../item";
import { Film } from "lucide-react";

const MovieSection = ({ movies }: { movies: Movie[] }) => {
  return (
    <div className="space-y-4">
      <div className="mb-6 flex items-center gap-2">
        <Film className="text-primary h-6 w-6" />
        <h2 className="text-2xl font-bold">Movies ({movies.length})</h2>
      </div>
      <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {movies.map((m) => (
          <MovieItem key={m.id} movie={m} />
        ))}
      </ul>
    </div>
  );
};

export default MovieSection;
