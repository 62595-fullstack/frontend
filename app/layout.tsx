import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";

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

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script dangerouslySetInnerHTML={{__html: `
          const saved = localStorage.getItem("theme");
          if (saved === "light") document.body.classList.add("light");
        `}} />
      <div className="flex min-h-screen">
        <main className="flex-1">{children}</main>
      </div>
      </body>
    </html>
  );
}
