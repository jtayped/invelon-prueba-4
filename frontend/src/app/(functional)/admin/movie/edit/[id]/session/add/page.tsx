import { CreateSessionForm } from "@/components/sessions/form";
import React from "react";

const AddSessionToMoviePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return <CreateSessionForm movieId={parseInt(id)} />;
};

export default AddSessionToMoviePage;
