import Link from "next/link";
import { Attachment } from "@/lib/api";

interface EventCardProps {
    id: string;
    title: string;
    description: string;
    attachment: Attachment | null;
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
    attachment,
    posterName,
    posterAvatar,
    posterOrganization,
    likes,
    comments,
    shares,
    createdDate,
}: EventCardProps) {
    return (
        <div className="card w-full md:w-3/4 lg:max-w-3xl flex flex-col flex-shrink-0">
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
                    <span className="text-2xl text-text font-semibold">{posterName}</span>
                    <span className="text-xs text-text">Organization: {posterOrganization}</span>
                    <span className="text-xs text-text-muted font-normal">•</span>
                    <span className="text-xs text-text-muted font-normal">Posted: {createdDate}</span>
                </div>
            </div>

            {/* Event image */}
            {attachment && (
                <img
                    src={`data:${attachment.fileType};base64,${attachment.content}`}
                    alt={title}
                    className="w-full aspect-video object-cover"
                />
            )}

            {/* Stats bar */}
            <div className="flex items-center gap-6 px-4 py-3 border-b border-brand text-text-muted text-sm">
                <span>👍 {likes}</span>
                <span>💬 {comments}</span>
                <span>📤 {shares}</span>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <h2 className="text-xl font-bold text-text">{title}</h2>
                <p className="text-text-muted text-sm">{description}</p>

                <Link
                    href={`/events/${id}`}
                    className="btn-brand"
                >
                    View Event
                </Link>
            </div>
        </div>
    );
}