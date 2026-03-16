'use client'

import { useState } from "react";
import { mockEvents } from "@/lib/mockEvents";
import EventCard from "@/components/eventcard/EventCard";
import CreateEventModal from "@/components/events/CreateEventModal";
import PagebarContent from "@/components/pagebar/PagebarContent";
import { api } from "@/lib/api";

type EventItem = typeof mockEvents[number];

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Page() {
  const [events, setEvents] = useState<EventItem[]>(mockEvents);
  const [showModal, setShowModal] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function handleCreate(data: { title: string; description: string; imageUrl: string }) {
    setCreateError(null);
    try {
      const nextId = events.length > 0 ? Math.max(...events.map((e) => Number(e.id))) + 1 : 1;
      await api.createOrganizationEvent({
        id: nextId,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
      });
      const newEvent: EventItem = {
        id: String(nextId),
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        posterName: "John Doe",
        posterAvatar: "https://picsum.photos/seed/john/100/100",
        posterOrganization: "DTU",
        likes: 0,
        comments: 0,
        shares: 0,
        createdDate: formatDate(new Date()),
      };
      setEvents((prev) => [newEvent, ...prev]);
      setShowModal(false);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create event.");
    }
  }

  return (
    <div className="flex flex-col h-screen items-center font-sans p-8">
      {/* Pagebar – empty for now */}
      <PagebarContent title="Events">
        <h2>Events pagebar</h2>
      </PagebarContent>

      {/* Header row */}
      <div className="flex items-center w-full max-w-5xl mb-6">
        <h1 className="text-5xl font-bold text-black flex-1 text-center">Events</h1>
        <button
          onClick={() => setShowModal(true)}
          aria-label="Create new event"
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-3xl font-light flex items-center justify-center shadow-lg transition-all flex-shrink-0 cursor-pointer"
        >
          +
        </button>
      </div>

      {/* Scrollable card list */}
      <div className="w-full max-w-5xl flex-1 min-h-0 rounded-lg overflow-hidden">
        <div
          className="overflow-y-auto h-full space-y-4 p-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <CreateEventModal
          onClose={() => { setShowModal(false); setCreateError(null); }}
          onSubmit={handleCreate}
          error={createError}
        />
      )}
    </div>
  );
}
