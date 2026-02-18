"use client";

import { usePagebar } from "./PagebarContext";

export default function Pagebar() {
  const { content, title } = usePagebar();

  if (!content) return null;

  return (
    <aside className="w-48 h-screen bg-zinc-200 text-zinc-800 flex flex-col">
      <div className="bg-zinc-300 px-4 h-[73px] flex items-center font-semibold text-zinc-600 text-xl flex-shrink-0">
        {title}
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
