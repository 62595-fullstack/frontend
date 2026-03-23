'use client'

import PagebarContent from "@/components/pagebar/PagebarContent";

export default function Home() {
  return (
    <div className="bg-bg flex flex-col h-screen items-center font-sans p-8">
      <PagebarContent>
        <ul className="space-y-2">
          <li>Events</li>
        </ul>
      </PagebarContent>
    </div>
  );
}
