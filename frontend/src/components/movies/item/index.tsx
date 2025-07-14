import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";
import type { Movie } from "@/validators/movies";
import { Clock, PersonStanding } from "lucide-react";
import Link from "next/link";
import React from "react";

const MovieItem = ({ movie }: { movie: Movie }) => {
  return (
    <Link href={`/${movie.id}`}>
      <Card className="h-full cursor-pointer transition-shadow duration-200 hover:shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{movie.title}</CardTitle>
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(movie.durationMin)}</span>
            </div>
            <div className="flex items-center gap-1">
              <PersonStanding />
              <span className="font-medium">{movie.rating}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="line-clamp-2">
            {movie.description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MovieItem;
