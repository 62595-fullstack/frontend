"use client";

import { usePagebar } from "./PagebarContext";

export default function Pagebar() {
  const { content, title } = usePagebar();

  if (!content) return null;

  return (
    <aside className="w-72 h-screen bg-bg text-text flex flex-col">
      <div className="bg-bg px-4 h-[73px] flex items-center font-semibold text-text text-xl flex-shrink-0">
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