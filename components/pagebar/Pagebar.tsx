"use client";

import { usePagebar } from "./PagebarContext";

export default function Pagebar() {
  const { content } = usePagebar();

  if (!content) return null;

  return (
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

      {/* Dynamic page content */}
      <div className="p-5">
        {content}
      </div>
    </aside>
  );
}
