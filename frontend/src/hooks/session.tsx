"use client";

import React, { createContext, useContext, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getCurrentUser, getAccessToken, clearTokens } from "@/lib/auth";
import type { User } from "@/types/user";

interface SessionContextProps {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const SessionContext = createContext<SessionContextProps | undefined>(
  undefined,
);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const fetchUser = async (): Promise<User | null> => {
    const token = getAccessToken();
    if (!token) {
      // no point in calling /me if there’s no token
      return null;
    }

    try {
      return await getCurrentUser();
    } catch (err) {
      // only clear if it really was a 401 from the server
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        clearTokens();
        // (your interceptor already does the redirect-to-/login on refresh failure)
      } else {
        // log other failures so you can catch schema mismatches, etc.
        console.error("Error in getCurrentUser:", err);
      }
      return null;
    }
  };

  const {
    data: user,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["me"],
    queryFn: fetchUser,
    enabled: Boolean(getAccessToken()),
    staleTime: 5 * 60 * 1000, // 5m
    retry: false,
  });

  async function refreshUser() {
    await refetch();
  }

  const logout = () => {
    clearTokens();
    queryClient.setQueryData(["me"], null);
    window.location.href = "/login";
  };

  return (
    <SessionContext.Provider
      value={{
        user: user ?? null,
        loading,
        refreshUser,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextProps => {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be inside a SessionProvider");
  }
  return ctx;
};
