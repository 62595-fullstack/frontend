"use client";

import { usePagebar } from "./PagebarContext";

export default function Pagebar() {
  const { content } = usePagebar();

  if (!content) return null;

  return (
    <aside className="w-48 h-screen bg-zinc-300 text-zinc-800 p-4">
      {content}
    </aside>
  );
}
