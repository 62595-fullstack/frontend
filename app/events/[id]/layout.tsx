// app/events/[id]/layout.tsx
import { notFound } from "next/navigation";
import { mockEvents } from "@/lib/mockEvents";
import PagebarContent from "@/components/pagebar/PagebarContent";
import EventTabs from "@/components/events/EventTabs";

export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = mockEvents.find((e) => e.id === id);
  if (!event) return notFound();

  return (
    <>
      {/* RIGHT PAGEBAR */}
      <PagebarContent>
        {/* keep your existing pagebar code, using `event` */}
        <div className="space-y-6 text-black">
          {/* ... */}
        </div>
      </PagebarContent>

      {/* MIDDLE COLUMN CONTENT */}
      <div className="mx-auto max-w-4xl px-8 py-10">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          {/* Header */}
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <img
                src={event.posterAvatar}
                alt={event.posterName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                {/* NOTE: Your original had text-white inside a white card.
                    Keep it if your outer background is dark; otherwise change to text-black. */}
                <h1 className="text-xl font-bold text-white">{event.title}</h1>
                <div className="mt-1 flex items-center gap-2 text-xs text-white-600">
                  <span className="font-semibold text-white">
                    {event.posterName}
                  </span>
                  <span>Organization: {event.posterOrganization}</span>
                  <span className="text-white-800">•</span>
                  <span>2h</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="rounded bg-gray-200 px-6 py-2 text-sm font-semibold text-black">
                Share
              </button>
              <button className="rounded bg-gray-200 px-6 py-2 text-sm font-semibold text-black">
                Save
              </button>
            </div>
          </div>

          {/* Date */}
          <div className="mt-4 w-full max-w-xs rounded bg-gray-200 px-4 py-2 text-sm font-medium text-black">
            Date ...
          </div>

          {/* Tabs (real navigation) */}
          <EventTabs eventId={event.id} />

          {/* Tab content */}
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </>
  );
}