'use client'

import { useEvent } from "@/components/events/EventContext";

export default function OverviewTab() {
  const event = useEvent();

  return (
    <div className="overflow-hidden rounded-lg bg-gray-200">
      <div className="h-10 bg-sky-200 px-6 py-2 underline text-black">Description</div>
      <div className="p-6 text-black">
        {event?.description ?? "No description provided."}
      </div>
    </div>
  );
}
