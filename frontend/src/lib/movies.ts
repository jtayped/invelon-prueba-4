import api from "@/lib/auth";
import {
  movieResponseSchema,
  type Movie,
  type MovieCreate,
  type MovieEdit,
} from "@/validators/movies";

export async function createMovie(movie: MovieCreate) {
  const res = await api.post("/api/movies/create/", movie);
  const parsed = movieResponseSchema.parse(res.data);

  return parsed;
}

export async function editMovie(movie: MovieEdit) {
  const res = await api.put(`/api/movies/${movie.id}/edit/`, movie);
  const parsed = movieResponseSchema.parse(res.data);

  return parsed;
}

export async function getMovie(id: number): Promise<Movie | null> {
  try {
    const res = await api.get(`/api/movies/${id}/`);
    const parsed = movieResponseSchema.parse(res.data);

    return parsed;
  } catch (error) {
    console.error(error);
  }

  return null;
}

export async function getMovies(): Promise<Movie[]> {
  const res = await api.get("/api/movies/");
  const parsed = movieResponseSchema.array().parse(res.data);

  return parsed;
}

export async function removeMovie(movieId: number) {
  await api.delete(`/api/movies/${movieId}/delete/`);
}
