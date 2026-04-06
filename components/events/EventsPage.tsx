'use client'

import { useState, useEffect } from "react";
import EventCard from "@/components/eventcard/EventCard";
import CreateEventModal from "@/components/events/CreateEventModal";
import CreateButton from "@/components/ui/CreateButton"
import PagebarContent from "@/components/pagebar/PagebarContent";
import { api, OrganizationEvent, Attachment } from "@/lib/api";

export default function EventsPage() {
  const [events, setEvents] = useState<OrganizationEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function loadAllEvents() {
    const orgs = await api.getOrganizations();
    const orgList = Array.isArray(orgs) ? orgs : [];
    const results = await Promise.all(orgList.map((org) => api.getOrganizationEvents(org.id)));
    setEvents(results.flatMap((data) => Array.isArray(data) ? data : []));
  }

  useEffect(() => {
    loadAllEvents();
  }, []);

  async function handleCreate(data: { title: string; description: string; attachment: Attachment | null; organizationId: number; startDate: string; ageLimit: number }) {
    setCreateError(null);
    try {
      const binding = await api.getUserOrganizationBindingForCurrentUser(data.organizationId);
      const bindingId = binding?.id ?? 0;
      await api.createOrganizationEvent({
        id: 0,
        organizationId: data.organizationId,
        userOrganizationBindingId: bindingId,
        title: data.title,
        description: data.description,
        attachment: data.attachment,
        startDate: data.startDate,
        ageLimit: data.ageLimit,
      });
      await loadAllEvents();
      setShowModal(false);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create event.");
    }
  }

  return (
    <div className="page p-8">
      {/* Pagebar – empty for now */}
      <PagebarContent title="Events">
        <h2>Events pagebar</h2>
      </PagebarContent>

      {/* Header row */}
      <div className="flex items-center w-full max-w-5xl mb-6">
        <h1 className="text-5xl font-bold text-text flex-1 text-center">Events</h1>
        <CreateButton onClick={() => setShowModal(true)} label="event"/>
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
              attachment={event.attachment}
              posterName={event.creatorName || "Unknown"}
              posterAvatar=""
              posterOrganization={String(event.organizationId)}
              createdDate={event.createdDate ? new Date(event.createdDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""}
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
