import BuyPageComponent from "@/components/buy/page";
import React from "react";

const BuyPage = async ({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) => {
  const { sessionId } = await params;

  return <BuyPageComponent sessionId={parseInt(sessionId)} />;
};

export default BuyPage;
