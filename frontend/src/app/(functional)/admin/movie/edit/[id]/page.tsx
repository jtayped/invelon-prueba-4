import { CreateMovieForm } from "@/components/movies/form";
import React from "react";

const AdminEditMoviePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <CreateMovieForm id={parseInt(id)} />;
};

export default AdminEditMoviePage;
