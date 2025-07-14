"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSession, editSession, getSession } from "@/lib/sessions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sessionCreateSchema, type SessionCreate } from "@/validators/sessions";
import { getScreens } from "@/lib/screens";

export function CreateSessionForm({
  movieId,
  sessionId,
}: {
  movieId: number;
  sessionId?: number;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<SessionCreate>({
    resolver: zodResolver(sessionCreateSchema),
    defaultValues: {
      movie: movieId,
      startsAt: "",
      price: 9.99,
      screen: undefined,
    },
  });

  const { data: screens, isLoading: isLoadingScreens } = useQuery({
    queryKey: ["screens"],
    queryFn: getScreens,
  });

  const { data: session, isLoading } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => getSession(sessionId!),
    enabled: Boolean(sessionId),
  });

  useEffect(() => {
    if (!session) return;

    const dt = new Date(session.startsAt);

    const tzOffsetMs = dt.getTimezoneOffset() * 60000;
    const localISO = new Date(dt.getTime() - tzOffsetMs)
      .toISOString()
      .slice(0, 16); // "YYYY-MM-DDThh:mm"

    console.log(session.screen);
    form.reset({
      movie: session.movie,
      startsAt: localISO,
      screen: session.screen,
      price: parseFloat(session.price),
    });
  }, [session, form]);

  const createMutation = useMutation({
    mutationFn: createSession,
    onSuccess() {
      void queryClient.invalidateQueries({
        queryKey: ["sessions", { movieId }],
      });
      router.push(`/${movieId}`);
    },
  });
  const editMutation = useMutation({
    mutationFn: editSession,
    onSuccess() {
      void queryClient.invalidateQueries({
        queryKey: ["sessions", { movieId }],
      });
      router.push(`/${movieId}`);
    },
    onError(error) {
      console.error(error);
    },
  });

  const onSubmit = (values: SessionCreate) => {
    if (sessionId) {
      editMutation.mutate({ ...values, id: sessionId });
    } else {
      createMutation.mutate(values);
    }
  };

  if (sessionId && isLoading) {
    return <p>Loading session…</p>;
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startsAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isLoadingScreens ? (
            <p>Loading screens…</p>
          ) : (
            <FormField
              control={form.control}
              name="screen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Screen</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value?.toString() ?? ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a screen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Screens</SelectLabel>
                          {screens?.map((s) => (
                            <SelectItem key={s.id} value={s.id.toString()}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving…"
            : sessionId
              ? "Update Session"
              : "Create Session"}
        </Button>
      </form>
    </Form>
  );
}
