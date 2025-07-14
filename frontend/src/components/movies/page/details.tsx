import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";
import type { Movie } from "@/validators/movies";
import { PersonStanding } from "lucide-react";
import React from "react";

const MovieDetails = ({ movie }: { movie: Movie }) => {
  return (
    <Card>
      <CardContent className="space-y-6">
        {/* Description */}
        <div>
          <h3 className="mb-3 text-lg font-semibold">Description</h3>
          <p className="text-muted-foreground leading-relaxed">
            {movie.description}
          </p>
        </div>

        {/* Movie Info Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="bg-muted flex items-center justify-between rounded-lg p-3">
              <span className="font-medium">Movie ID</span>
              <span className="text-muted-foreground">#{movie.id}</span>
            </div>
            <div className="bg-muted flex items-center justify-between rounded-lg p-3">
              <span className="font-medium">Duration</span>
              <span className="text-muted-foreground">
                {formatDuration(movie.durationMin)}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-muted flex items-center justify-between rounded-lg p-3">
              <span className="font-medium">Rating</span>
              <div className="flex items-center gap-1">
                <PersonStanding />
                <span className="text-muted-foreground">{movie.rating}</span>
              </div>
            </div>
            <div className="bg-muted flex items-center justify-between rounded-lg p-3">
              <span className="font-medium">Status</span>
              <Badge variant={movie.active ? "default" : "secondary"}>
                {movie.active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieDetails;
