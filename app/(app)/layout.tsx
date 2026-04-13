import "@/app/globals.css";
import React from "react";
import { PagebarProvider } from "@/components/pagebar/PagebarContext";
import Sidebar from "@/components/sidebar/Sidebar";
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
      <div className="grid h-screen grid-cols-[18rem_minmax(0,1fr)_18rem] overflow-hidden">
        <Sidebar/>
        <main className="min-h-0 min-w-0 overflow-auto">{children}</main>
        <Pagebar/>
      </div>
    </PagebarProvider>
  );
}
