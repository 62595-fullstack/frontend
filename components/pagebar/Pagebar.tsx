"use client";

import { usePagebar } from "./PagebarContext";

export default function Pagebar() {
  const { content } = usePagebar();

  if (!content) return null;

  return (
    <aside className="w-48 h-screen bg-zinc-200 text-zinc-800 space-y-4">
      <div className="h-25 bg-amber-500 p-4">
        Hejsa
      </div>

      <div className="p-4">
        {content}
      </div>
    </aside>
  );
}
