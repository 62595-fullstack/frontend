import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import { redirect } from "next/navigation";
import { checkIfLoggedIn } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookFace",
  description: "Connect your book with other faces.",
};

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
  const { isLoggedIn } = await checkIfLoggedIn()
  if (!isLoggedIn) {
    redirect('/login')
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <div className="flex min-h-screen">
        <main className="flex-1">{children}</main>
      </div>
      </body>
    </html>
  );
}
