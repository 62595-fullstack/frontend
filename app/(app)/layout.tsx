import "@/app/globals.css";
import React from "react";
import { PagebarProvider } from "@/components/pagebar/PagebarContext";
import { NotificationsProvider } from "@/lib/NotificationsContext";
import { ToastProvider } from "@/components/ui/Toaster";
import AppShell from "@/components/AppShell";

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ToastProvider>
      <NotificationsProvider>
        <PagebarProvider>
          <AppShell>{children}</AppShell>
        </PagebarProvider>
      </NotificationsProvider>
    </ToastProvider>
  );
}
