'use client'

import PagebarContent from "@/components/pagebar/PagebarContent";

export default function Page() {
  return (
    <div className="flex flex-1 min-h-screen items-center justify-center font-sans space-x-4">
      <PagebarContent>
        <ul className="space-y-2">
          <li>Organizations</li>
        </ul>
      </PagebarContent>
      <p>Organizations</p>
    </div>
  );
}
