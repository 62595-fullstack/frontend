"use client";

import React, { createContext, useContext, useState } from "react";

const PagebarContext = createContext<{
  content: React.ReactNode;
  setContent: (content: React.ReactNode) => void;
}>({
  content: null,
  setContent: () => {},
});

export function PagebarProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<React.ReactNode>(null);
  return (
    <PagebarContext.Provider value={{ content, setContent }}>
      {children}
    </PagebarContext.Provider>
  );
}

export function usePagebar() {
  return useContext(PagebarContext);
}
