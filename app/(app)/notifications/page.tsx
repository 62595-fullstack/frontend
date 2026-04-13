'use client'

import PagebarContent from "@/components/pagebar/PagebarContent";

export default function Page() {
  return (
    <div className="page">
      <PagebarContent>
        <h2 className="font-bold mb-4">Notifications</h2>
        <ul className="space-y-2">
          <li className="btn-sidebar">All</li>
          <li className="btn-sidebar">Unread</li>
          <li className="btn-sidebar">Read</li>
        </ul>
      </PagebarContent>
      <h1 className="text-3xl lg:text-5xl font-bold text-text mb-6">Notifications</h1>
    </div>
  );
}
