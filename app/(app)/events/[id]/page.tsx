'use client'

import { useState } from "react";
import { useEvent, useEventContext } from "@/components/events/EventContext";
import { api } from "@/lib/api";

export default function OverviewTab() {
  const event = useEvent();
  const { isCreator, setEvent } = useEventContext();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function startEdit() {
    setDraft(event?.description ?? "");
    setSaveError(null);
    setEditing(true);
  }

  async function save() {
    if (!event) return;
    setSaving(true);
    setSaveError(null);
    try {
      await api.updateEvent(event.id, { description: draft });
      setEvent({ ...event, description: draft });
      setEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-lg bg-bg">
      <div className="h-10 bg-bg-dark px-6 py-2 flex items-center justify-between">
        <span className="underline text-text">Description</span>
        {isCreator && !editing && (
          <button
            onClick={startEdit}
            className="text-xs text-text-muted hover:text-text transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      <div className="p-6 text-text">
        {editing ? (
          <div className="flex flex-col gap-3">
            <textarea
              className="w-full rounded bg-bg-light border border-highlight p-3 text-sm text-text resize-y min-h-[120px] focus:outline-none focus:ring-1 focus:ring-accent"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={saving}
            />
            {saveError && <p className="text-sm text-danger">{saveError}</p>}
            <div className="flex gap-2 justify-end">
              <button
                className="btn-regular text-sm"
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="rounded bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                onClick={save}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        ) : (
          event?.description ?? "No description provided."
        )}
      </div>
    </div>
  );
}
