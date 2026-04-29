'use client'

import { use, useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import PagebarContent from "@/components/pagebar/PagebarContent";
import { PagebarAction, PagebarSection, PagebarStat } from "@/components/pagebar/PagebarSection";
import EventTabs from "@/components/events/EventTabs";
import { EventContext } from "@/components/events/EventContext";
import { getEventById, OrganizationEvent, api } from "@/lib/api";

export default function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [event, setEvent] = useState<OrganizationEvent | null>(null);
  const [orgName, setOrgName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const found = await getEventById(Number(id));
        if (found) {
          setEvent(found);
          const [org, myBinding] = await Promise.all([
            api.getOrganizationById(found.organizationId),
            api.getUserOrganizationBindingForCurrentUser(found.organizationId).catch(() => null),
          ]);
          if (org) setOrgName(org.name);
          if (myBinding && myBinding.id === found.userOrganizationBindingId) {
            setIsCreator(true);
          }
          setLoading(false);
          return;
        }
        setMissing(true);
        setLoading(false);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Failed to load event.");
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (missing) return notFound();

  if (loadError) {
    return (
      <div className="mx-auto max-w-4xl px-8 py-10 text-sm text-danger">
        {loadError}
      </div>
    );
  }

  if (loading || !event) {
    return (
      <div className="mx-auto max-w-4xl px-8 py-10 text-sm text-text-muted">
        Loading…
      </div>
    );
  }

  return (
    <EventContext.Provider value={{ event, isCreator, setEvent }}>
      <PagebarContent title="Event details">
        <PagebarSection eyebrow="Live event" title={event.title}>
          <PagebarStat
            label="Organization"
            value={orgName || `#${event.organizationId}`}
            tone="accent"
          />
          <PagebarStat
            label="Age limit"
            value={event.ageLimit && event.ageLimit > 0 ? `${event.ageLimit}+` : "Open"}
          />
          {event.startDate ? (
            <PagebarStat
              label="Starts"
              value={new Date(event.startDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            />
          ) : null}
        </PagebarSection>

        <PagebarSection eyebrow="Actions" title="Participation">
          <PagebarAction>Not signed up</PagebarAction>
          <PagebarAction>Share with friends</PagebarAction>
        </PagebarSection>

        <PagebarSection eyebrow="Posted by" title="Creator">
          <p className="text-sm text-text">
            <span className="font-semibold">{event.creatorName || "Unknown creator"}</span>
          </p>
          <p className="text-sm leading-6 text-text-muted">
            Use the tabs in the main view to inspect rules, comments, the bracket, and participant details.
          </p>
        </PagebarSection>
      </PagebarContent>

      {/* Page contents */}
      <div className="mx-auto max-w-4xl px-8 py-10">
        <div className="rounded-lg bg-bg-light p-6 shadow-sm">
          {/* Header row */}
          <div className="flex items-start justify-between gap-6 grid grid-cols-1 xl:grid-cols-2">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-full bg-highlight flex items-center justify-center text-lg font-bold text-text-muted">
                {event.title.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-text">{event.title}</h1>
                <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                  <span className="font-semibold text-text-muted">{orgName || `Org #${event.organizationId}`}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center xl:justify-end gap-3">
                <button className="rounded bg-highlight px-6 py-2 text-sm font-semibold text-text">Share</button>
                {isCreator && (
                  <button
                    className="rounded bg-red-500 px-6 py-2 text-sm font-semibold text-white hover:bg-red-600 active:scale-95 transition-all"
                    onClick={() => {
                      setDeleteError(null);
                      setShowDeleteConfirm(true);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
              {deleteError && <p className="text-sm text-red-500 mt-2">{deleteError}</p>}
            </div>
          </div>

          {/* Tabs */}
          <EventTabs eventId={String(event.id)}/>

          {/* Active tab content */}
          <div className="mt-4">{children}</div>

          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="popup-brand max-w-sm">
                <h2 className="text-lg font-bold">Delete event</h2>
                <p className="text-sm text-text-muted">Are you sure you want to delete <span
                  className="font-semibold text-text">{event.title}</span>? This cannot be undone.</p>
                {deleteError && <p className="text-sm text-danger">{deleteError}</p>}
                <div className="flex justify-end gap-3">
                  <button className="btn-regular" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                  <button
                    className="rounded bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 active:scale-95 transition-all"
                    onClick={async () => {
                      setDeleteError(null);
                      try {
                        await api.deleteOrganizationEvent(event.id);
                        router.push("/events");
                      } catch (err) {
                        setDeleteError(err instanceof Error ? err.message : "Failed to delete event.");
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </EventContext.Provider>
  );
}
