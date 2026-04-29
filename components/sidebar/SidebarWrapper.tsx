"use client";

import Sidebar from "./Sidebar";
import React from "react";

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function SidebarWrapper({ isOpen, onOpen, onClose }: Props) {
  return (
    <>
      <button
        className="lg:hidden fixed top-6 left-6 z-[60] btn-brand border-brand/40 p-2 text-sm"
        onClick={isOpen ? onClose : onOpen}
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
             stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <div className={`hidden lg:flex h-full`}>
        <Sidebar/>
      </div>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex" onClick={onClose}>
          <div onClick={(e) => e.stopPropagation()}>
            <Sidebar onClose={onClose}/>
          </div>
        </div>
      )}
    </>
  );
}
