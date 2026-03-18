import "@/app/globals.css";
import React from "react";
import { PagebarProvider } from "@/components/pagebar/PagebarContext";
import Sidebar from "@/components/sidebar/Sidebar";
import Pagebar from "@/components/pagebar/Pagebar";

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
  return (
    <PagebarProvider>
      <div className="flex min-h-screen">
        <Sidebar/>
        <main className="flex-1">{children}</main>
        <Pagebar/>
      </div>
    </PagebarProvider>
  );
}
