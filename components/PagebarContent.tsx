"use client";

import { usePagebar } from "./PagebarContext";
import { useEffect } from "react";

export default function PagebarContent({ children }: { children: React.ReactNode }) {
  const { setContent } = usePagebar();

  useEffect(() => {
    setContent(children);
    return () => setContent(null);
  }, [children, setContent]);

  return null;
}
