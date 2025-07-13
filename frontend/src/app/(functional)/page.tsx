"use client";
import { useSession } from "@/hooks/session";

export default function HomePage() {
  const { user } = useSession();

  return <div>{user?.username}</div>;
}
