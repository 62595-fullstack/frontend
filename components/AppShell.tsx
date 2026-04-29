"use client";

import { useState } from "react";
import SidebarWrapper from "./sidebar/SidebarWrapper";
import PagebarWrapper from "./pagebar/PagebarWrapper";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pagebarOpen, setPagebarOpen] = useState(false);

  function openSidebar() {
    setPagebarOpen(false);
    setSidebarOpen(true);
  }

  function openPagebar() {
    setSidebarOpen(false);
    setPagebarOpen(true);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarWrapper isOpen={sidebarOpen} onOpen={openSidebar} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-auto">{children}</main>
      <PagebarWrapper isOpen={pagebarOpen} onOpen={openPagebar} onClose={() => setPagebarOpen(false)} />
    </div>
  );
}
