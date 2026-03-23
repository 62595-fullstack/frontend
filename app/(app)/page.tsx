'use client'

import EventCard from "@/components/eventcard/EventCard";
import PagebarContent from "@/components/pagebar/PagebarContent";
import { mockEvents } from "@/lib/mockEvents";

export default function Home() {
  return (
    <div className="bg-bg flex flex-col h-screen items-center font-sans p-8">
      <PagebarContent>
        <ul className="space-y-2">
          <li>Events</li>
        </ul>
      </PagebarContent>
      <h1 className="text-5xl font-bold text-text mb-6">Upcoming Events</h1>
      <div className="w-full max-w-5xl flex-1 min-h-0 rounded-lg overflow-hidden">
        <div
          className="overflow-y-auto h-full gap-4 p-4 flex flex-col items-center"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {mockEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </div>
    </div>
  );
}
