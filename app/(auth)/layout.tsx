import "@/app/globals.css";
import React from "react";
import { redirect } from "next/navigation";
import { checkIfLoggedIn } from "@/lib/auth";

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
  const { isLoggedIn } = await checkIfLoggedIn();
  if (isLoggedIn) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen">
      <main className="flex-1">{children}</main>
    </div>
  );
}
