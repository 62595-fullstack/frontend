import "@/app/globals.css";
import React from "react";
import { PagebarProvider } from "@/components/pagebar/PagebarContext";
import AppShell from "@/components/AppShell";

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
  return (
    <PagebarProvider>
      <AppShell>{children}</AppShell>
    </PagebarProvider>
  );
}
