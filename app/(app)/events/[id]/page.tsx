'use client'

import { useEvent } from "@/components/events/EventContext";

export default function OverviewTab() {
  const event = useEvent();

  return (
    <div className="overflow-hidden rounded-lg bg-bg">
      <div className="h-10 bg-bg-dark px-6 py-2 underline text-text">Description</div>
      <div className="p-6 text-text">
        {event?.description ?? "No description provided."}
      </div>
    </div>
  );
}
