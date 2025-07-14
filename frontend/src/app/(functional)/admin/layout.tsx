"use client";
import { useSession } from "@/hooks/session";
import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSession();
  const isAdmin = user?.isAdmin;

  if (!isAdmin) return <p>You are not an admin user...</p>;

  return <>{children}</>;
};

export default AdminLayout;
