"use client";

import { usePagebar } from "./PagebarContext";

export default function Pagebar({ onClose }: { onClose?: () => void }) {
  const { content, title } = usePagebar();

  if (!content) return null;

  return (
    <aside className="flex h-full min-h-0 w-72 flex-shrink-0 flex-col border-l border-border/60 bg-[radial-gradient(circle_at_top,_rgba(124,92,255,0.12),_transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_16%),var(--bg)] text-text">
      <div className="border-b border-border/60 px-5 py-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-text">{title}</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text"
            aria-label="Close menu"
          >
            ✕
          </button>
        )}
      </div>
      <div
        className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        {content}
      </div>
    </aside>
  );
}
