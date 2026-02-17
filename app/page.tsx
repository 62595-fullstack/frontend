export default function Home() {
  const mockEvents = [
    "Summer Music Festival",
    "Tech Conference 2026",
    "Food & Wine Tasting",
    "Outdoor Yoga Session",
    "Art Exhibition Opening",
    "Charity Run 5K",
    "Board Game Night",
    "Photography Workshop",
    "Stand-up Comedy Show",
    "Startup Pitch Night",
  ];

  return (
    <div className="flex flex-col min-h-screen items-center font-sans p-8">
      <h1 className="text-5xl font-bold text-black mb-6">Upcoming Events</h1>
      <div className="w-full max-w-5xl max-h-[70vh] rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-y-auto max-h-[70vh] space-y-4 p-4">
          {mockEvents.map((event, index) => (
            <div
              key={index}
              className="p-4 bg-gray-800 text-white rounded-lg shadow"
            >
              {event}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
