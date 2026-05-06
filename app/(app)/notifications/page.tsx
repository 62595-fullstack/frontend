'use client'

import { useState } from "react";
import Image from "next/image";
import PagebarContent from "@/components/pagebar/PagebarContent";
import { PagebarSection, PagebarStat } from "@/components/pagebar/PagebarSection";
import { useNotifications } from "@/lib/NotificationsContext";
import { api, Notification } from "@/lib/api";

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
  const { notifications, unreadCount, loading, error, markRead, markAllRead, deleteNotification } = useNotifications();
  const [requestActionPending, setRequestActionPending] = useState<Set<number>>(new Set());

  const handleHover = (n: Notification) => {
    if (!n.read) markRead(n.id);
  };

  const respondToFriendRequest = async (n: Notification, accept: boolean) => {
    if (!n.actorUserId) return;
    setRequestActionPending((prev) => new Set(prev).add(n.id));
    try {
      if (accept) await api.acceptFriendRequest(n.actorUserId);
      else await api.declineFriendRequest(n.actorUserId);
      deleteNotification(n.id);
    } catch {
      setRequestActionPending((prev) => {
        const next = new Set(prev);
        next.delete(n.id);
        return next;
      });
    }
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
              <div
                onMouseEnter={() => handleHover(n)}
                onFocus={() => handleHover(n)}
                tabIndex={0}
                className={`flex items-start gap-3 px-4 py-3 rounded-lg transition-colors ${
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
                  {n.type === "friend_request" && n.actorUserId && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => respondToFriendRequest(n, true)}
                        disabled={requestActionPending.has(n.id)}
                        className="px-3 py-1 rounded-md text-xs font-semibold bg-brand text-bg-dark hover:opacity-90 disabled:opacity-50 cursor-pointer transition-opacity"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => respondToFriendRequest(n, false)}
                        disabled={requestActionPending.has(n.id)}
                        className="px-3 py-1 rounded-md text-xs font-semibold bg-bg-light border border-text-muted/40 text-text hover:bg-highlight disabled:opacity-50 cursor-pointer transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-brand flex-shrink-0 mt-2" aria-label="Unread" />
                )}
                <button
                  onClick={() => deleteNotification(n.id)}
                  aria-label="Delete notification"
                  className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-text-muted hover:bg-danger hover:text-white transition-colors cursor-pointer"
                >
                  <span aria-hidden="true" className="text-lg leading-none">×</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
