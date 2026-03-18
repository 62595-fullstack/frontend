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
      {/* RIGHT PAGEBAR (persistent across tabs) */}
      <PagebarContent>
        <aside className="w-full">
          <div className="rounded-md bg-white shadow-sm border border-gray-200 overflow-hidden">
            {/* Top identity row */}
            <div className="flex items-center gap-3 px-4 py-4">
              <img
                src={event.posterAvatar}
                alt={event.posterName}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-black">
                  {event.posterName}
                </p>
                <p className="truncate text-xs text-gray-600">
                  Organization: {event.posterOrganization}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200" />

            {/* Details */}
            <div className="px-4 py-4">
              <h3 className="text-sm font-bold text-black">Details</h3>

              <div className="mt-3 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-700">Format:</span>
                  <span className="font-semibold text-black">
                    Single Elimination
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-700">Slots:</span>
                  <span className="font-semibold text-black">8 Players</span>
                </div>

                <div className="pt-2" />

                <div className="flex justify-between gap-4">
                  <span className="text-gray-700">Start Time:</span>
                  <span className="font-semibold text-black">2:00 PM CEST</span>
                </div>

                <div className="pt-2" />

                <div className="flex justify-between gap-4">
                  <span className="text-gray-700">Seeding:</span>
                  <span className="font-semibold text-black">Random</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200" />

            {/* Signup status button (like screenshot) */}
            <div className="px-4 py-4">
              <button
                type="button"
                className="w-full rounded bg-gray-200 py-2 text-sm font-medium text-black"
              >
                Not signed up
              </button>
            </div>

            <div className="border-t border-gray-200" />

            {/* Your status */}
            <div className="px-4 py-4">
              <h3 className="text-sm font-bold text-black">Your status</h3>
              <button
                type="button"
                className="mt-3 w-full rounded bg-gray-200 py-2 text-sm font-medium text-black"
              >
                Not signed up
              </button>
            </div>

            <div className="border-t border-gray-200" />

            {/* Events near you */}
            <div className="px-4 py-4">
              <h3 className="text-sm font-bold text-black">Events near you</h3>

              <div className="mt-3 flex items-center gap-3">
                <img
                  src={event.posterAvatar}
                  alt=""
                  className="h-9 w-9 rounded-full object-cover"
                />
                <p className="text-sm font-semibold leading-tight text-black">
                  {event.title}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </PagebarContent>

      {/* MIDDLE COLUMN CONTENT */}
      <div className="mx-auto max-w-4xl px-8 py-10">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          {/* Header row (keep your existing header, this is just a safe default) */}
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <img
                src={event.posterAvatar}
                alt={event.posterName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h1 className="text-xl font-bold text-black">{event.title}</h1>
                <div className="mt-1 flex items-center gap-2 text-xs text-black">
                  <span className="font-semibold text-black">
                    {event.posterName}
                  </span>
                  <span>Organization: {event.posterOrganization}</span>
                  <span className="text-gray-400">•</span>
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

          {/* Date pill */}
          <div className="mt-4 w-full max-w-xs rounded bg-gray-200 px-4 py-2 text-sm font-medium text-black">
            Date ...
          </div>

          {/* Tabs */}
          <EventTabs eventId={event.id} />

          {/* Active tab page content */}
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </>
  );
}