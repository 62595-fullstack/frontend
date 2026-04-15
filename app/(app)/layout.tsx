import "@/app/globals.css";
import React from "react";
import { PagebarProvider } from "@/components/pagebar/PagebarContext";
import AppShell from "@/components/AppShell";
import { redirect } from "next/navigation";
import { checkIfLoggedIn } from "@/lib/auth";

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
  const { isLoggedIn } = await checkIfLoggedIn();
  if (!isLoggedIn) {
    redirect('/login');
  }

  return (
    <PagebarProvider>
      <AppShell>{children}</AppShell>
    </PagebarProvider>
  );
}
