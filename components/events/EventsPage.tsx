'use client'

import { useState, useEffect } from "react";
import EventCard from "@/components/eventcard/EventCard";
import CreateEventModal from "@/components/events/CreateEventModal";
import CreateButton from "@/components/ui/CreateButton"
import PagebarContent from "@/components/pagebar/PagebarContent";
import { PagebarAction, PagebarList, PagebarListItem, PagebarSection, PagebarStat } from "@/components/pagebar/PagebarSection";
import { api, OrganizationEvent, Organization, Attachment } from "@/lib/api";

export default function EventsPage() {
  const [events, setEvents] = useState<OrganizationEvent[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  async function loadAllEvents() {
    const orgData = await api.getOrganizations();
    const orgList = Array.isArray(orgData) ? orgData : [];
    const results = await Promise.all(orgList.map((org) => api.getOrganizationEvents(org.id)));
    const allEvents = results.flatMap((data) => Array.isArray(data) ? data : []);
    allEvents.sort((a, b) => new Date(b.createdDate ?? 0).getTime() - new Date(a.createdDate ?? 0).getTime());
    return { orgList, allEvents };
  }

  useEffect(() => {
    loadAllEvents()
      .then(({ orgList, allEvents }) => {
        setOrgs(orgList);
        setEvents(allEvents);
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load events."));
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
      const { orgList, allEvents } = await loadAllEvents();
      setOrgs(orgList);
      setEvents(allEvents);
      setShowModal(false);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create event.");
    }
  }

  const scheduledCount = events.filter((event) => Boolean(event.startDate)).length;
  const featuredEvent = events[0];

  return (
    <div className="page">
      {/* Pagebar – empty for now */}
      <PagebarContent title="Events">
        <PagebarSection eyebrow="Overview" title="Event pulse">
          <div className="grid grid-cols-2 gap-3">
            <PagebarStat label="Live feed" value={events.length} tone="accent" />
            <PagebarStat label="Scheduled" value={scheduledCount} tone="success" />
          </div>
          <PagebarStat label="Organizations" value={orgs.length} />
        </PagebarSection>

        <PagebarSection eyebrow="Actions" title="Manage events">
          <PagebarAction onClick={() => setShowModal(true)}>Create a new event</PagebarAction>
          <PagebarAction>Review recent activity</PagebarAction>
        </PagebarSection>

        <PagebarSection eyebrow="Featured" title="Latest posted event">
          {featuredEvent ? (
            <PagebarList>
              <PagebarListItem
                active
                title={featuredEvent.title}
                meta={`${orgs.find((org) => org.id === featuredEvent.organizationId)?.name ?? "Unknown organization"}${featuredEvent.startDate ? ` • ${new Date(featuredEvent.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : ""}`}
              />
            </PagebarList>
          ) : (
            <p className="text-sm text-text-muted">
              Event details will appear here once the API returns data.
            </p>
          )}
        </PagebarSection>
      </PagebarContent>

      {/* Header row */}
      <div className="flex items-center w-full max-w-3xl p-8">
        <div className="w-12 flex-shrink-0" />
        <h1 className="text-3xl lg:text-5xl font-bold text-text flex-1 text-center">Events</h1>
      </div>

      {loadError && <p className="text-danger text-sm mb-4">{loadError}</p>}

      {/* Scrollable card list */}
      <div className="w-full flex-1 min-h-0 rounded-lg overflow-y-auto">
        <div
          className="h-full gap-4 p-4 flex flex-col items-center"
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
              posterOrganization={orgs.find((o) => o.id === event.organizationId)?.name ?? String(event.organizationId)}
              createdDate={event.createdDate ? new Date(event.createdDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""}
            />
          ))}

          {!loadError && events.length === 0 && (
            <div className="w-full md:w-3/4 lg:max-w-3xl rounded-lg border border-dashed border-gray-300 bg-white/70 p-8 text-center text-sm text-gray-600">
              No events were returned from the API.
            </div>
          )}
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
