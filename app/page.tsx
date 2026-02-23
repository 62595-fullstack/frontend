'use client'

import EventCard from "@/components/eventcard/EventCard";
import PagebarContent from "@/components/pagebar/PagebarContent";

const mockEvents = [
  {
    id: "1",
    title: "Summer Music Festival",
    description: "A weekend of live music, food trucks, and good vibes in the park.",
    imageUrl: "https://picsum.photos/seed/music/800/400",
    posterName: "John Doe",
    posterAvatar: "https://picsum.photos/seed/john/100/100",
    posterOrganization: "DTU",
    likes: 245,
    comments: 38,
    shares: 12,
    createdDate: "Feb 15, 2026",
  },
  {
    id: "2",
    title: "Tech Conference 2026",
    description: "Join industry leaders for talks on AI, web development, and cloud computing.",
    imageUrl: "https://picsum.photos/seed/tech/800/400",
    posterName: "Jane Smith",
    posterAvatar: "https://picsum.photos/seed/jane/100/100",
    posterOrganization: "ITU",
    likes: 189,
    comments: 52,
    shares: 27,
    createdDate: "Feb 10, 2026",
  },
  {
    id: "3",
    title: "Food & Wine Tasting",
    description: "Explore local flavors with curated wine pairings and gourmet dishes.",
    imageUrl: "https://picsum.photos/seed/food/800/400",
    posterName: "Chef Marco",
    posterAvatar: "https://picsum.photos/seed/marco/100/100",
    posterOrganization: "KU",
    likes: 312,
    comments: 45,
    shares: 8,
    createdDate: "Jan 28, 2026",
  },
  {
    id: "4",
    title: "Outdoor Yoga Session",
    description: "Start your morning with a peaceful yoga session by the lake.",
    imageUrl: "https://picsum.photos/seed/yoga/800/400",
    posterName: "Lisa Green",
    posterAvatar: "https://picsum.photos/seed/lisa/100/100",
    posterOrganization: "DTU",
    likes: 97,
    comments: 14,
    shares: 3,
    createdDate: "Feb 17, 2026",
  },
  {
    id: "5",
    title: "Art Exhibition Opening",
    description: "Discover stunning contemporary art pieces from emerging local artists.",
    imageUrl: "https://picsum.photos/seed/art/800/400",
    posterName: "Gallery One",
    posterAvatar: "https://picsum.photos/seed/gallery/100/100",
    posterOrganization: "ITU",
    likes: 156,
    comments: 23,
    shares: 19,
    createdDate: "Feb 5, 2026",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col h-screen items-center font-sans p-8">
      <PagebarContent>
        <ul className="space-y-2">
          <li>Events</li>
        </ul>
      </PagebarContent>
      <h1 className="text-5xl font-bold text-black mb-6">Upcoming Events</h1>
      <div className="w-full max-w-5xl flex-1 min-h-0 rounded-lg overflow-hidden">
        <div
          className="overflow-y-auto h-full space-y-4 p-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {mockEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </div>
    </div>
  );
}
