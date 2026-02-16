'use client'

import PagebarContent from "@/components/PagebarContent";

export default function Page() {
  return (
    <div className="flex flex-1 min-h-screen items-center justify-center font-sans space-x-4">
      <PagebarContent>
        <h2 className="font-bold mb-4">Notifications</h2>
        <ul className="space-y-2">
          <li>All</li>
          <li>Unread</li>
          <li>Read</li>
        </ul>
      </PagebarContent>
      <p>Notifications</p>
    </div>
  );
}
