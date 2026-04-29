"use client";

import Pagebar from "./Pagebar";
import { usePagebar } from "./PagebarContext";
import React from "react";

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function PagebarWrapper({ isOpen, onOpen, onClose }: Props) {
  const { content } = usePagebar();

  if (!content) return null;

  return (
    <>
      <button
        className="md:hidden fixed top-6 right-6 z-[60] btn-brand border-brand/40 p-2 text-sm"
        onClick={isOpen ? onClose : onOpen}
        aria-label="Open page menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
             stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <div className="hidden md:flex h-full">
        <Pagebar/>
      </div>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex justify-end" onClick={onClose}>
          <div onClick={(e) => e.stopPropagation()}>
            <Pagebar onClose={onClose}/>
          </div>
        </div>
      )}
    </>
  );
}
