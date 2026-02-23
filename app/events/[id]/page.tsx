import { notFound } from "next/navigation";
import { mockEvents } from "@/lib/mockEvents";
import PagebarContent from "@/components/pagebar/PagebarContent";
import EventTabs from "@/components/events/EventTabs";

const tabs = ["Overview", "Bracket", "Participants", "Rules"] as const;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = mockEvents.find((e) => e.id === id);
  if (!event) return notFound();

  return (
    <>
      {/* RIGHT PAGEBAR (injected into global pagebar) */}
      <PagebarContent>
        <div className="space-y-6 text-black">
          <div>
            <h3 className="text-base font-bold text-black mb-4">Details</h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between gap-6">
                <span className="text-gray-800 font-medium">Format:</span>
                <span className="text-black font-semibold">
                  Single Elimination
                </span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-gray-800 font-medium">Slots:</span>
                <span className="text-black font-semibold">8 Players</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-gray-800 font-medium">Start Time:</span>
                <span className="text-black font-semibold">2:00 PM CEST</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-gray-800 font-medium">Seeding:</span>
                <span className="text-black font-semibold">Random</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4">
            <button className="w-full rounded bg-gray-200 py-2 text-sm font-semibold text-black">
              Not signed up
            </button>
          </div>

          <div className="border-t border-gray-300 pt-4">
            <h3 className="text-base font-bold text-black mb-3">Your status</h3>
            <button className="w-full rounded bg-gray-200 py-2 text-sm font-semibold text-black">
              Not signed up
            </button>
          </div>

          <div className="border-t border-gray-300 pt-4">
            <h3 className="text-base font-bold text-black mb-3">
              Events near you
            </h3>
            <div className="flex items-center gap-3">
              <img
                src={event.posterAvatar}
                alt=""
                className="w-9 h-9 rounded-full object-cover"
              />
              <p className="text-sm font-semibold leading-tight text-black">
                {event.title}
              </p>
            </div>
          </div>
        </div>
      </PagebarContent>

      {/* MIDDLE COLUMN CONTENT */}
      <div className="mx-auto max-w-4xl px-8 py-10">
        {/* White surface to ensure contrast even if layout bg is dark */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          {/* Header row */}
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <img
                src={event.posterAvatar}
                alt={event.posterName}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div>
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

            {/* Share / Save */}
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
          <div className="mt-6 flex border-b border-gray-300">
          {tabs.map((t) => {
            const active = t === "Overview";

              return (
                <button
                  key={t}
                  type="button"
                  className={[
                  "pb-3 px-4 text-base font-semibold text-white transition-colors",
                  active
                    ? "border-b-2 border-white"
                    : "opacity-70 hover:opacity-100",
                ].join(" ")}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* Main content panel */}
          <div className="mt-3 overflow-hidden rounded-lg bg-gray-200">
            {/* light blue bar on top */}
            <div className="h-6 bg-sky-200" />
            <div className="h-[560px]" />
          </div>
        </div>
      </div>
    </>
  );
}
