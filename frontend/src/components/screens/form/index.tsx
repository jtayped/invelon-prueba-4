"use client";

import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { screenCreateSchema, type ScreenCreate } from "@/validators/screens";
import { createScreen } from "@/lib/screens";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
import { useRouter } from "next/navigation";

export function ScreenForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<ScreenCreate>({
    resolver: zodResolver(screenCreateSchema),
    defaultValues: {
      name: "",
      rows: 1,
      seatsPerRow: 1,
    },
  });

  const createMutation = useMutation({
    mutationFn: createScreen,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["screens"] });
      router.push("/");
      form.reset();
    },
  });

  const onSubmit: SubmitHandler<ScreenCreate> = (values) => {
    createMutation.mutate(values);
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Screen Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Main Hall" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="rows"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Rows</FormLabel>
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
          <FormField
            control={form.control}
            name="seatsPerRow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seats per Row</FormLabel>
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

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving…" : "Create Screen"}
        </Button>
      </form>
    </Form>
  );
}

export default ScreenForm;
