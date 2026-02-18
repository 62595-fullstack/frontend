"use client";

import React, { createContext, useContext, useState } from "react";

const PagebarContext = createContext<{
  content: React.ReactNode;
  setContent: (content: React.ReactNode) => void;
  title: string;
  setTitle: (title: string) => void;
}>({
  content: null,
  setContent: () => {},
  title: "PageBar",
  setTitle: () => {},
});

export function PagebarProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<React.ReactNode>(null);
  const [title, setTitle] = useState("PageBar");
  return (
    <PagebarContext.Provider value={{ content, setContent, title, setTitle }}>
      {children}
    </PagebarContext.Provider>
  );
}

export function usePagebar() {
  return useContext(PagebarContext);
}
