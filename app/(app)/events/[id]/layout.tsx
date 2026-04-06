'use client'

import { use, useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import PagebarContent from "@/components/pagebar/PagebarContent";
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
      <div className="mx-auto max-w-4xl px-8 py-10 text-sm text-gray-500">
        Loading…
      </div>
    );
  }

  return (
    <EventContext.Provider value={event}>
      {/* RIGHT PAGEBAR */}
      <PagebarContent>
        <aside className="w-full">
          <div className="rounded-md bg-white shadow-sm border border-gray-200 overflow-hidden">
            {/* Identity row */}
            <div className="flex items-center gap-3 px-4 py-4">
              <div
                className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-600">
                {event.title.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-black">{event.title}</p>
                <p className="truncate text-xs text-gray-600">{orgName || `Org #${event.organizationId}`}</p>
              </div>
            </div>

            <div className="border-t border-gray-200"/>

            {/* Details */}
            <div className="px-4 py-4">
              <h3 className="text-sm font-bold text-black">Details</h3>
              <div className="mt-3 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-700">Organization:</span>
                  <span className="font-semibold text-black">{orgName || `#${event.organizationId}`}</span>
                </div>
                {event.creatorName && (
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-700">Posted by:</span>
                    <span className="font-semibold text-black">{event.creatorName}</span>
                  </div>
                )}
                {event.startDate && (
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-700">Start date:</span>
                    <span className="font-semibold text-black">
                      {new Date(event.startDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                )}
                {event.ageLimit !== undefined && event.ageLimit > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-700">Age limit:</span>
                    <span className="font-semibold text-black">{event.ageLimit}+</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200"/>

            {/* Signup */}
            <div className="px-4 py-4">
              <button
                type="button"
                className="w-full rounded bg-gray-200 py-2 text-sm font-medium text-black"
              >
                Not signed up
              </button>
            </div>
          </div>
        </aside>
      </PagebarContent>

      {/* Page contents */}
      <div className="mx-auto max-w-4xl px-8 py-10">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          {/* Header row */}
          <div className="flex items-start justify-between gap-6 grid grid-cols-1 xl:grid-cols-2">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-gray-600">
                {event.title.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">{event.title}</h1>
                <div className="mt-1 flex items-center gap-2 text-xs text-black">
                  <span className="font-semibold text-black">{orgName || `Org #${event.organizationId}`}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <button className="rounded bg-gray-200 px-6 py-2 text-sm font-semibold text-black">Share</button>
                <button className="rounded bg-gray-200 px-6 py-2 text-sm font-semibold text-black">Save</button>
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
