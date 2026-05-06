"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { api, Notification } from "@/lib/api";
import { useToast } from "@/components/ui/Toaster";

type NotificationsContextValue = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const router = useRouter();
  const seenIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    let cancelled = false;
    api
      .getNotifications()
      .then((rows) => {
        if (cancelled) return;
        const list = rows ?? [];
        for (const n of list) seenIdsRef.current.add(n.id);
        setNotifications(list);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load notifications.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const es = new EventSource("/api/proxy/notifications/stream");
    es.onmessage = (event) => {
      try {
        const incoming: Notification = JSON.parse(event.data);
        if (seenIdsRef.current.has(incoming.id)) return;
        seenIdsRef.current.add(incoming.id);
        setNotifications((prev) => [incoming, ...prev]);
        showToast({
          title: "New notification",
          message: incoming.message,
          onClick: () => router.push("/notifications"),
        });
      } catch {
        // ignore malformed events
      }
    };
    return () => {
      es.close();
    };
  }, [showToast, router]);

  const markRead = useCallback(async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    try {
      await api.markNotificationRead(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark as read.");
    }
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.markAllNotificationsRead();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark all as read.");
    }
  }, []);

  const unreadCount = useMemo(
    () => notifications.reduce((acc, n) => acc + (n.read ? 0 : 1), 0),
    [notifications],
  );

  const value = useMemo<NotificationsContextValue>(
    () => ({ notifications, unreadCount, loading, error, markRead, markAllRead }),
    [notifications, unreadCount, loading, error, markRead, markAllRead],
  );

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationsProvider");
  return ctx;
}
