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
    createdDate: string;
    mock?: boolean;
}

export default function EventCard({
    id,
    title,
    description,
    attachment,
    posterName,
    posterAvatar,
    posterOrganization,
    createdDate,
    mock,
}: EventCardProps) {
    return (
        <div className="card w-full md:w-3/4 lg:max-w-3xl flex flex-col flex-shrink-0">
            {/* Top bar - Poster info */}
            <div className="flex items-center p-4">
                {posterAvatar && (
                    <img
                        src={posterAvatar}
                        alt={posterName}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                )}
                <div className="flex flex-col space-y-2">
                    <span className="text-2xl text-text font-semibold leading-tight">{title}</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xs text-text-muted">{posterOrganization}</span>
                        <span className="text-xs text-text-muted">•</span>
                        <span className="text-xs text-text-muted">by {posterName}</span>
                        <span className="text-xs text-text-muted">•</span>
                        <span className="text-xs text-text-muted">Posted: {createdDate}</span>
                    </div>
                </div>
                {mock && (
                    <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded bg-yellow-200 text-yellow-800">
                        Mock
                    </span>
                )}
            </div>

            {/* Event image */}
            {attachment && (
                <img
                    src={`data:${attachment.fileType};base64,${attachment.content}`}
                    alt={title}
                    className="mb-4 w-full aspect-video object-cover"
                />
            )}

            {/* Stats bar */}
            {/*<div className="flex items-center gap-6 px-4 py-3 border-b border-brand text-text-muted text-sm">
                <span>👍 {likes}</span>
                <span>💬 {comments}</span>
                <span>📤 {shares}</span>
            </div>*/}

            {/* Content */}
            <div className="px-4 pb-4 space-y-3">
                {description && (
                    <p className="text-text-muted text-sm">{description}</p>
                )}

                <Link
                    href={`/events/${id}`}
                    className="btn-brand mt-1"
                >
                    View Event
                </Link>
            </div>
        </div>
    );
}