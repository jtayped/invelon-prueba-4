import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/session";
import { removeMovie } from "@/lib/movies";
import type { Movie } from "@/validators/movies";
import { useQueryClient } from "@tanstack/react-query";
import { Pen, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const MovieAdminSection = ({ movie }: { movie: Movie }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { user } = useSession();
  const isAdmin = user?.isAdmin;

  if (!isAdmin) return;

  return (
    <div className="flex items-center gap-4">
      <Button asChild variant={"default"}>
        <Link href={`/admin/movie/edit/${movie.id}/session/add`}>
          <Plus />
          Add sessions
        </Link>
      </Button>
      <Button asChild variant={"secondary"}>
        <Link href={`/admin/movie/edit/${movie.id}`}>
          <Pen />
          Edit movie
        </Link>
      </Button>
      <Button
        variant={"destructive"}
        onClick={async () => {
          await removeMovie(movie.id);
          await queryClient.invalidateQueries({ queryKey: ["movies"] });
          router.push("/");
        }}
      >
        <Trash />
        Delete movie
      </Button>
    </div>
  );
};

export default MovieAdminSection;
