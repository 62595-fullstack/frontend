// components/events/EventTabs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Overview", href: (id: string) => `/events/${id}` },
  { label: "Bracket", href: (id: string) => `/events/${id}/bracket` },
  { label: "Participants", href: (id: string) => `/events/${id}/participants` },
  { label: "Rules", href: (id: string) => `/events/${id}/rules` },
  { label: "Comments", href: (id: string) => `/events/${id}/comments` },
] as const;

export default function EventTabs({ eventId }: { eventId: string }) {
  const pathname = usePathname();

  return (
    <div className="mt-6 flex border-b border-gray-300">
      {tabs.map((t) => {
        const href = t.href(eventId);
        const active = pathname === href;

        return (
          <Link
            key={t.label}
            href={href}
            className={[
              "pb-3 px-8 text-base font-semibold text-black",
              "cursor-pointer transition-all duration-200 ease-in-out",
              active
                ? "border-b-2 border-black opacity-100"
                : "opacity-70 hover:opacity-100 hover:border-b-2 hover:border-black/60",
            ].join(" ")}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}