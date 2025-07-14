import type { Session } from "@/validators/sessions";
import React from "react";
import SeatsField from "./seats";

const BuyForm = ({ session }: { session: Session }) => {
  return (
    <div>
      <SeatsField session={session} />
    </div>
  );
};

export default BuyForm;
