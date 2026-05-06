'use client'

import Image from "next/image";
import PagebarContent from "@/components/pagebar/PagebarContent";
import { PagebarSection, PagebarStat } from "@/components/pagebar/PagebarSection";
import { useNotifications } from "@/lib/NotificationsContext";
import { Notification } from "@/lib/api";

function avatarFor(userId: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(userId)}/100/100`;
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Page() {
  const { notifications, unreadCount, loading, error, markRead, markAllRead } = useNotifications();

  const handleClick = (n: Notification) => {
    if (!n.read) markRead(n.id);
  };

  return (
    <div className="page">
      <PagebarContent title="Notifications">
        <PagebarSection eyebrow="Inbox" title="Overview">
          <div className="grid grid-cols-2 gap-2">
            <PagebarStat label="All" value={String(notifications.length)} tone="accent" />
            <PagebarStat label="Unread" value={String(unreadCount)} />
          </div>
        </PagebarSection>

        {unreadCount > 0 && (
          <PagebarSection eyebrow="Actions" title="Quick actions">
            <button
              onClick={() => markAllRead()}
              className="w-full px-3 py-2 rounded-lg text-sm bg-brand text-bg-dark hover:opacity-90 transition-opacity cursor-pointer"
            >
              Mark all as read
            </button>
          </PagebarSection>
        )}
      </PagebarContent>

      <div className="flex flex-col px-6 lg:px-12 py-8 max-w-3xl mx-auto w-full">
        <h1 className="text-3xl lg:text-5xl font-bold text-text mb-6">Notifications</h1>

        {error && <p className="text-sm text-danger mb-4">{error}</p>}
        {loading && <p className="text-sm text-text-muted">Loading…</p>}
        {!loading && notifications.length === 0 && (
          <p className="text-sm text-text-muted">You&apos;re all caught up.</p>
        )}

        <ul className="flex flex-col gap-2">
          {notifications.map((n) => (
            <li key={n.id}>
              <button
                onClick={() => handleClick(n)}
                className={`w-full flex items-start gap-3 px-4 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                  n.read ? "bg-bg-light hover:bg-highlight" : "bg-bg-light border-l-4 border-brand hover:bg-highlight"
                }`}
              >
                {n.actorUserId && (
                  <Image
                    src={avatarFor(n.actorUserId)}
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-full object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.read ? "text-text-muted" : "text-text font-semibold"}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-text-muted mt-1">{formatTimestamp(n.createdDate)}</p>
                </div>
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-brand flex-shrink-0 mt-2" aria-label="Unread" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
