import "@/app/globals.css";
import React from "react";

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1">{children}</main>
    </div>
  );
}
