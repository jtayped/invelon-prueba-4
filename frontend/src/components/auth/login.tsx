"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginUser } from "@/lib/auth";
import Link from "next/link";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/session";

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  className?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ className, ...props }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { refreshUser } = useSession();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormValues) =>
      loginUser(data.username, data.password),
    onError(error: AxiosError) {
      if (error.response?.status === 401) {
        form.setError("root", { message: "Email or password is wrong" });
      } else {
        form.setError("root", {
          message: "An error occurred. Please try again.",
        });
      }
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      await refreshUser();
      router.push("/");
    },
  });

  function onSubmit(values: LoginFormValues) {
    form.clearErrors("root");
    loginMutation.mutate(values);
  }

  const rootError = form.formState.errors.root;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                {rootError && (
                  <Alert variant="destructive">
                    <AlertDescription>{rootError.message}</AlertDescription>
                  </Alert>
                )}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="johndoe123"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
