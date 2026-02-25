"use client";

import { usePagebar } from "./PagebarContext";

export default function Pagebar() {
  const { content, title } = usePagebar();

  if (!content) return null;

  return (
    <aside className="w-72 h-screen bg-zinc-200 text-zinc-800 flex flex-col">
      <div className="bg-zinc-300 px-4 h-[73px] flex items-center font-semibold text-zinc-600 text-xl flex-shrink-0">
        {title}
    <aside className="w-80 bg-gray-100">
      {/* Grey header */}
      <div className="bg-gray-300 p-4 flex items-center gap-3">
        <img
          src="/profile.jpg"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="font-semibold text-gray-700">Guest</p>
          <p className="text-sm text-gray-600">Organization: DTU</p>
        </div>
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
