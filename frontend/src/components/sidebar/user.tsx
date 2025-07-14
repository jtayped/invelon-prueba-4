import { useSession } from "@/hooks/session";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

const UserInfo = () => {
  const { user, logout } = useSession();

  if (!user) return;

  return (
    <Card className="py-4">
      <CardContent className="flex items-center justify-between px-4">
        <div>
          <p className="text-lg font-medium">{user.username}</p>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
        <div>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="cursor-pointer"
            onClick={logout}
          >
            <LogOut />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
