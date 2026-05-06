'use client'

import { useEffect, useState } from "react";
import { useEvent } from "@/components/events/EventContext";
import { api, EventParticipant } from "@/lib/api";

export default function ParticipantsTab() {
  const event = useEvent();
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!event) return;
    api.getEventParticipants(event.id)
      .then(setParticipants)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load participants."))
      .finally(() => setLoading(false));
  }, [event]);

  return (
    <div className="overflow-hidden rounded-lg bg-bg">
      <div className="h-10 bg-bg-dark px-6 py-2 underline text-text">Participants</div>
      <div className="p-6">
        {loading && <p className="text-sm text-text-muted">Loading…</p>}
        {error && <p className="text-sm text-danger">{error}</p>}
        {!loading && !error && participants.length === 0 && (
          <p className="text-sm text-text-muted">No participants yet. Be the first to register!</p>
        )}
        {!loading && !error && participants.length > 0 && (
          <ul className="space-y-2">
            {participants.map((p) => (
              <li
                key={p.bindingId}
                className="flex items-center gap-3 rounded-lg border border-border/70 bg-bg-light px-4 py-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-highlight text-sm font-bold text-text-muted">
                  {p.firstName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-text">
                  {p.firstName} {p.lastName}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
