import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
import type { Movie } from "@/validators/movies";
import { Clock, Film, PersonStanding } from "lucide-react";
import React from "react";

const MovieHeader = ({ movie }: { movie: Movie }) => {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Film className="text-primary h-6 w-6" />
          <h1 className="text-3xl font-bold tracking-tight">{movie.title}</h1>
        </div>
        <div className="text-muted-foreground flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{formatDuration(movie.durationMin)}</span>
          </div>
          <div className="flex items-center gap-1">
            <PersonStanding />
            <span className="text-sm font-medium">{movie.rating}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Badge variant={movie.active ? "default" : "secondary"}>
          {movie.active ? "Available" : "Unavailable"}
        </Badge>
      </div>
    </div>
  );
};

export default MovieHeader;
