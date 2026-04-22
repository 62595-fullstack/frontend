'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, Organization, OrganizationEvent } from "@/lib/api";
import { getOrgImages } from "@/lib/mockOrgImages";
import PagebarContent from "@/components/pagebar/PagebarContent";
import { PagebarSection, PagebarStat, PagebarList, PagebarListItem } from "@/components/pagebar/PagebarSection";

export default function OrganizationProfilePage() {
  const { id } = useParams<{ id: string }>();
  const orgId = Number(id);

  const [org, setOrg] = useState<Organization | null>(null);
  const [events, setEvents] = useState<OrganizationEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId) return;

    api.getOrganizationById(orgId)
      .then(setOrg)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load organization."));

    api.getOrganizationEvents(orgId)
      .then(setEvents)
      .catch(() => setEvents([]));
  }, [orgId]);

  if (error) {
    return (
      <div className="page">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  if (!org) {
    return <div className="page"><p className="text-text-muted">Loading…</p></div>;
  }

  const { profilePicture, coverPhoto } = getOrgImages(org.id);
  const initials = org.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="page !items-center">
      {/* Pagebar content */}
      <PagebarContent title={org.name}>
        <PagebarSection eyebrow="Overview" title="Organization details">
          <div className="grid grid-cols-2 gap-3">
            <PagebarStat label="Events" value={events.length} tone="accent" />
            <PagebarStat label="Members" value="N/A" />
          </div>
        </PagebarSection>

        <PagebarSection eyebrow="Directory" title="Upcoming events">
          {events.length > 0 ? (
            <PagebarList>
              {events.slice(0, 3).map((event, index) => (
                <PagebarListItem
                  key={event.id}
                  active={index === 0}
                  title={event.title}
                  meta={event.startDate
                    ? new Date(event.startDate).toLocaleDateString()
                    : "No date"}
                />
              ))}
            </PagebarList>
          ) : (
            <p className="text-sm text-text-muted">No events yet.</p>
          )}
        </PagebarSection>
      </PagebarContent>

      {/* Cover photo card */}
      <div className="w-full max-w-5xl p-4 space-y-4">
        <div className="rounded-xl bg-bg-light shadow-sm overflow-hidden">
          {/* Cover */}
          <div className="relative">
            {coverPhoto ? (
              <div
                className="w-full h-40 md:h-56 bg-cover bg-center"
                style={{ backgroundImage: `url(${coverPhoto})` }}
              />
            ) : (
              <div className="w-full h-40 md:h-56 bg-brand/20" />
            )}
          </div>

          {/* Profile info row */}
          <div className="relative px-4 pb-4">
            <div className="-mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-3">
                {/* Avatar */}
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt={org.name}
                    className="w-28 h-28 rounded-full border-4 border-bg object-cover"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-bg-light border-4 border-bg flex items-center justify-center text-3xl font-bold text-brand select-none">
                    {initials}
                  </div>
                )}

                {/* Name + description */}
                <div className="pb-1">
                  <h1 className="text-2xl font-bold text-text">{org.name}</h1>
                  {org.description && (
                    <p className="text-sm text-text-muted">{org.description}</p>
                  )}
                  <p className="text-xs text-text-muted mt-1">
                    {events.length} event{events.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Two-column body: About (left) + Events (right) */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Left column — About */}
          <div className="space-y-4 lg:col-span-5">
            <div className="rounded-xl bg-bg-light shadow-sm p-4">
              <h2 className="text-sm font-semibold text-text">About</h2>
              <p className="mt-2 text-sm text-text-muted">
                {org.description?.trim() || "No description yet."}
              </p>
            </div>
          </div>

          {/* Right column — Events */}
          <div className="space-y-4 lg:col-span-7">
            <div className="rounded-xl bg-bg-light shadow-sm p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-text">Events</h2>
                <span className="text-xs text-text-muted">{events.length} total</span>
              </div>
            </div>

            {events.length === 0 ? (
              <div className="rounded-xl bg-bg-light shadow-sm p-4">
                <p className="text-sm text-text-muted">No events yet.</p>
              </div>
            ) : (
              events.map((event) => (
                <div key={event.id} className="rounded-xl bg-bg-light shadow-sm p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Small org avatar */}
                      {profilePicture ? (
                        <img
                          src={profilePicture}
                          alt={org.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-bg-light flex items-center justify-center text-xs font-semibold text-brand">
                          {initials}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-text">{event.title}</p>
                        <p className="text-xs text-text-muted">
                          {event.startDate
                            ? new Date(event.startDate).toLocaleDateString()
                            : "No date"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {event.description && (
                    <p className="mt-2 text-sm text-text-muted whitespace-pre-wrap">
                      {event.description}
                    </p>
                  )}

                  <Link
                    href={`/events/${event.id}`}
                    className="btn-brand mt-3 text-sm"
                  >
                    View Event
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
