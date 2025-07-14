import { CreateSessionForm } from "@/components/sessions/form";
import React from "react";

const EditSessionToMoviePage = async ({
  params,
}: {
  params: Promise<{ id: string; sessionId: string }>;
}) => {
  const { id, sessionId } = await params;

  return (
    <CreateSessionForm movieId={parseInt(id)} sessionId={parseInt(sessionId)} />
  );
};

export default EditSessionToMoviePage;
