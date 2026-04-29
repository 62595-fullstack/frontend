"use client";

import { usePagebar } from "./PagebarContext";
import React, { useEffect } from "react";

export default function PagebarContent({ 
  children,
  title,
}: { 
  children: React.ReactNode;
  title?: string; 
}) {
  const { setContent, setTitle } = usePagebar();

  useEffect(() => {
    setContent(children);
    if (title) setTitle(title);
    return () => {
      setContent(null);
      setTitle("PageBar");
    };
  }, [children, setContent, setTitle, title]);

  return null;
}
