"use client";

import { usePagebar } from "./PagebarContext";

export default function Pagebar() {
  const { content } = usePagebar();

  if (!content) return null;

  return (
    <aside className="w-48 h-screen bg-zinc-200 text-zinc-800 flex flex-col">
      <div className="bg-zinc-300 p-4 font-semibold text-zinc-600 text-sm flex-shrink-0">
        Conversations
      </div>
      <div
        className="p-2 overflow-y-auto flex-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        {content}
      </div>
    </aside>
  );
}
