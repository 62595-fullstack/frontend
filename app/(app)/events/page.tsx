'use client'

import { useState, useEffect } from "react";
import EventCard from "@/components/eventcard/EventCard";
import CreateEventModal from "@/components/events/CreateEventModal";
import PagebarContent from "@/components/pagebar/PagebarContent";
import { api, OrganizationEvent, Attachment } from "@/lib/api";

export default function Page() {
  const [events, setEvents] = useState<OrganizationEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function loadAllEvents() {
    const orgs = await api.getOrganizations();
    const orgList = Array.isArray(orgs) ? orgs : JSON.parse(orgs as unknown as string);
    const results = await Promise.all(
      orgList.map((org: { id: number }) => api.getOrganizationEvents(org.id))
    );
    const all = results.flatMap((data) =>
      Array.isArray(data) ? data : JSON.parse(data as unknown as string)
    );
    setEvents(all);
  }

  useEffect(() => {
    api.getOrganizations().then((orgs) => {
      const orgList = Array.isArray(orgs) ? orgs : JSON.parse(orgs as unknown as string);
      Promise.all(orgList.map((org: { id: number }) => api.getOrganizationEvents(org.id))).then((results) => {
        setEvents(results.flatMap((data) => Array.isArray(data) ? data : JSON.parse(data as unknown as string)));
      });
    });
  }, []);

  async function handleCreate(data: { title: string; description: string; imageUrl: Attachment | null; organizationId: number }) {
    setCreateError(null);
    try {
      await api.createOrganizationEvent({
        id: 0,
        organizationId: data.organizationId,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
      });
      await loadAllEvents();
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
        <h1 className="text-5xl font-bold text-text flex-1 text-center">Events</h1>
        <button
          onClick={() => setShowModal(true)}
          aria-label="Create new event"
          className="w-12 h-12 rounded-full hover:bg-blue-700 active:scale-95 text-white text-3xl font-light flex items-center justify-center shadow-lg transition-all flex-shrink-0 cursor-pointer"
        >
          +
        </button>
      </div>

      {/* Scrollable card list */}
      <div className="w-full max-w-5xl flex-1 min-h-0 rounded-lg overflow-hidden">
        <div
          className="overflow-y-auto h-full gap-4 p-4 flex flex-col items-center"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={String(event.id)}
              title={event.title}
              description={event.description}
              imageUrl={event.imageUrl}
              posterName="Unknown"
              posterAvatar=""
              posterOrganization=""
              likes={0}
              comments={0}
              shares={0}
              createdDate=""
            />
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
