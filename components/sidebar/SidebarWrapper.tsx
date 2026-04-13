"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function SidebarWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded text-text bg-bg"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <div className="w-6 h-0.5 bg-current mb-1.5" />
        <div className="w-6 h-0.5 bg-current mb-1.5" />
        <div className="w-6 h-0.5 bg-current" />
      </button>

      <div className={`hidden md:flex h-full`}>
        <Sidebar />
      </div>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <Sidebar onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}
