import "@/app/globals.css";
import React from "react";
import { PagebarProvider } from "@/components/pagebar/PagebarContext";
import SidebarWrapper from "@/components/sidebar/SidebarWrapper";
import Pagebar from "@/components/pagebar/Pagebar";
import { redirect } from "next/navigation";
import { checkIfLoggedIn } from "@/lib/auth";

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
  const { isLoggedIn } = await checkIfLoggedIn();
  if (!isLoggedIn) {
    redirect('/login');
  }

  return (
    <PagebarProvider>
      <div className="flex h-screen overflow-hidden">
        <SidebarWrapper/>
        <main className="flex-1 overflow-auto">{children}</main>
        <Pagebar/>
      </div>
    </PagebarProvider>
  );
}
