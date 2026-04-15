"use client";

import { useState } from "react";
import Pagebar from "./Pagebar";
import { usePagebar } from "./PagebarContext";

export default function PagebarWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const { content } = usePagebar();

  if (!content) return null;

  return (
    <>
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded text-text bg-bg"
        onClick={() => setIsOpen(true)}
        aria-label="Open page menu"
      >
        <div className="w-6 h-0.5 bg-current mb-1.5" />
        <div className="w-6 h-0.5 bg-current mb-1.5" />
        <div className="w-6 h-0.5 bg-current" />
      </button>

      <div className="hidden md:flex h-full">
        <Pagebar />
      </div>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex justify-end">
          <Pagebar onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}
