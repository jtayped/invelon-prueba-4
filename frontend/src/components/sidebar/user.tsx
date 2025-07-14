import { useSession } from "@/hooks/session";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { Badge } from "../ui/badge";

const UserInfo = () => {
  const { user, logout } = useSession();

  if (!user) return;

  return (
    <Card className="py-4">
      <CardContent className="flex items-center justify-between px-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-lg font-medium">{user.username}</p>
            {user.isAdmin && <Badge>Admin</Badge>}
          </div>
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
