"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { movieCreateSchema, type MovieCreate } from "@/validators/movies";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { createMovie, editMovie, getMovie } from "@/lib/movies";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function CreateMovieForm({ id }: { id?: number }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<MovieCreate>({
    resolver: zodResolver(movieCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      durationMin: 0,
      rating: "",
      active: true,
    },
  });

  const createMovieMutation = useMutation({
    mutationFn: createMovie,
    async onSuccess(data) {
      await queryClient.invalidateQueries({ queryKey: ["movies"] });
      router.push(`/${data.id}`);
    },
  });

  const editMovieMutation = useMutation({
    mutationFn: editMovie,
    async onSuccess(data) {
      await queryClient.invalidateQueries({ queryKey: ["movies"] });
      router.push(`/${data.id}`);
    },
  });

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      if (id) return await getMovie(id);
      return null;
    },
  });

  useEffect(() => {
    if (id && movie) {
      form.setValue("title", movie.title);
      form.setValue("description", movie.description);
      form.setValue("durationMin", movie.durationMin);
      form.setValue("active", movie.active);
      form.setValue("rating", movie.rating);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie, id]);

  const onSubmit = async (values: MovieCreate) => {
    if (id) {
      await editMovieMutation.mutateAsync({ ...values, id });
    } else {
      await createMovieMutation.mutateAsync(values);
    }
  };

  if (id && isLoading) return <p>Loading...</p>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter movie title" {...field} />
              </FormControl>
              <FormDescription>
                The official movie title (e.g. “The Matrix”).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a description…"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A short summary of the plot or key details.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Duration */}
          <FormField
            control={form.control}
            name="durationMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === "" ? null : Number(val));
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Total runtime in minutes (e.g. 120).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rating */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. PG-13" maxLength={5} {...field} />
                </FormControl>
                <FormDescription>
                  Age or content rating (e.g. “PG-13”, “R”).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Active */}
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="m-0">Active</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Saving…"
            : id
              ? "Update Movie"
              : "Create Movie"}
        </Button>
      </form>
    </Form>
  );
}
