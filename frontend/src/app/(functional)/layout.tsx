import AppHeader from "@/components/header";
import AppSidebar from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const FunctionalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full p-6">
        <AppHeader />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default FunctionalLayout;
