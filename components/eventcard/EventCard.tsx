import Link from "next/link";

interface EventCardProps {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    posterName: string;
    posterAvatar: string;
    posterOrganization: string;
    likes: number;
    comments: number;
    shares: number;
    createdDate: string;
}

export default function EventCard({
    id,
    title,
    description,
    imageUrl,
    posterName,
    posterAvatar,
    posterOrganization,
    likes,
    comments,
    shares,
    createdDate,
}: EventCardProps) {
    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            {/* Top bar - Poster info */}
            <div className="flex items-center gap-3 p-4">
                {posterAvatar && (
                    <img
                        src={posterAvatar}
                        alt={posterName}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                )}
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl text-white font-semibold">{posterName}</span>
                    <span className="text-xs text-white">Organization: {posterOrganization}</span>
                    <span className="text-xs text-gray-400 font-normal">•</span>
                    <span className="text-xs text-gray-400 font-normal">Posted: {createdDate}</span>
                </div>
            </div>

            {/* Event image */}
            {imageUrl && (
                <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE}${imageUrl}`}
                    alt={title}
                    className="w-full h-64 object-cover"
                />
            )}

            {/* Stats bar */}
            <div className="flex items-center gap-6 px-4 py-3 border-b border-gray-700 text-gray-300 text-sm">
                <span>👍 {likes}</span>
                <span>💬 {comments}</span>
                <span>📤 {shares}</span>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <p className="text-gray-300 text-sm">{description}</p>

                <Link
                    href={`/events/${id}`}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    View Event
                </Link>
            </div>
        </div>
    );
}