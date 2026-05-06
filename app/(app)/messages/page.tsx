'use client'

import { useState, useEffect, useRef, useMemo } from "react";
import React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import PagebarContent from "@/components/pagebar/PagebarContent";
import MessageInput from "@/components/MessageInput";
import { api, DirectMessage, FriendSummary, UserSummary } from "@/lib/api";

const TIME_SEPARATOR_GAP_MS = 60 * 60 * 1000;

function avatarFor(userId: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(userId)}/100/100`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const friendIdFromUrl = searchParams.get("friend");

  const [me, setMe] = useState<UserSummary | null>(null);
  const [friends, setFriends] = useState<FriendSummary[] | null>(null);
  const [messagesByFriend, setMessagesByFriend] = useState<Record<string, DirectMessage[]>>({});
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeId = useMemo<string | null>(() => {
    if (!friends || friends.length === 0) return null;
    if (friendIdFromUrl && friends.some((f) => f.id === friendIdFromUrl)) return friendIdFromUrl;
    return friends[0].id;
  }, [friends, friendIdFromUrl]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.getMe(), api.getMyFriends()])
      .then(([myUser, myFriends]) => {
        if (cancelled) return;
        setMe(myUser);
        setFriends(myFriends);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load.");
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!activeId) return;
    if (friendIdFromUrl === activeId) return;
    router.replace(`/messages?friend=${encodeURIComponent(activeId)}`, { scroll: false });
  }, [activeId, friendIdFromUrl, router]);

  const selectFriend = (id: string) => {
    setInput("");
    router.replace(`/messages?friend=${encodeURIComponent(id)}`, { scroll: false });
  };

  useEffect(() => {
    if (!activeId) return;
    if (messagesByFriend[activeId]) return;
    let cancelled = false;
    setLoadingHistory(true);
    api.getMessagesWith(activeId)
      .then((rows) => {
        if (cancelled) return;
        setMessagesByFriend((prev) => ({ ...prev, [activeId]: rows ?? [] }));
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load messages.");
      })
      .finally(() => {
        if (!cancelled) setLoadingHistory(false);
      });
    return () => { cancelled = true; };
  }, [activeId, messagesByFriend]);

  useEffect(() => {
    if (!me) return;
    const es = new EventSource("/api/messaging-proxy/Messages/stream");
    es.onmessage = (event) => {
      try {
        const msg: DirectMessage = JSON.parse(event.data);
        const friendId = msg.senderUserId === me.id ? msg.receiverUserId : msg.senderUserId;
        setMessagesByFriend((prev) => {
          const existing = prev[friendId];
          if (!existing) return prev;
          if (existing.some((m) => m.id === msg.id)) return prev;
          return { ...prev, [friendId]: [...existing, msg] };
        });
      } catch {
        // ignore malformed events
      }
    };
    return () => { es.close(); };
  }, [me]);

  const messages = activeId ? messagesByFriend[activeId] ?? [] : [];
  const activeFriend = friends?.find((f) => f.id === activeId) ?? null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || !activeId) return;
    setInput("");
    try {
      const created = await api.sendMessage(activeId, trimmed);
      setMessagesByFriend((prev) => ({
        ...prev,
        [activeId]: [...(prev[activeId] ?? []), created],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
      setInput(trimmed);
    }
  };

  return (
    <div className="page">
      <div className="flex flex-col h-full w-full font-sans">
        <PagebarContent title="Conversations">
          {friends === null && <p className="px-2 py-2 text-sm text-text-muted">Loading…</p>}
          {friends && friends.length === 0 && (
            <p className="px-2 py-2 text-sm text-text-muted">Add friends to start messaging.</p>
          )}
          {friends && friends.length > 0 && (
            <ul className="space-y-1">
              {friends.map((f) => (
                <li key={f.id}>
                  <button
                    onClick={() => selectFriend(f.id)}
                    className={`flex items-center gap-2 w-full px-2 py-2 rounded-lg text-left text-sm transition-all cursor-pointer ${
                      f.id === activeId ? "bg-brand text-bg-dark" : "hover:bg-highlight text-text"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <Image
                        src={avatarFor(f.id)}
                        alt={`${f.firstName} ${f.lastName}`}
                        width={28}
                        height={28}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <span className="truncate">{f.firstName} {f.lastName}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </PagebarContent>

        {activeFriend && (
          <div className="flex items-center gap-3 px-6 py-4 bg-bg-light border-b border-brand shadow-sm">
            <div className="relative">
              <Image
                src={avatarFor(activeFriend.id)}
                alt={`${activeFriend.firstName} ${activeFriend.lastName}`}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-text">{activeFriend.firstName} {activeFriend.lastName}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex flex-col flex-1 w-full overflow-y-auto px-6 py-4 space-y-3 bg-bg-dark">
            <div className="flex-1" />
            {error && <p className="text-sm text-danger">{error}</p>}
            {!activeFriend && friends && friends.length > 0 && (
              <p className="text-sm text-text-muted">Select a conversation to start messaging.</p>
            )}
            {activeFriend && loadingHistory && messages.length === 0 && (
              <p className="text-sm text-text-muted">Loading messages…</p>
            )}
            {activeFriend && !loadingHistory && messages.length === 0 && (
              <p className="text-sm text-text-muted">No messages yet. Say hi!</p>
            )}
            {messages.map((msg, index) => {
              const sender = me && msg.senderUserId === me.id ? "me" : "them";
              const prevMsg = messages[index - 1];
              const nextMsg = messages[index + 1];
              const sameAsNext = nextMsg ? nextMsg.senderUserId === msg.senderUserId : false;
              const showTimeSeparator = prevMsg &&
                new Date(msg.createdDate).getTime() - new Date(prevMsg.createdDate).getTime() > TIME_SEPARATOR_GAP_MS;
              const showTimeSeparatorNext = nextMsg &&
                new Date(nextMsg.createdDate).getTime() - new Date(msg.createdDate).getTime() > TIME_SEPARATOR_GAP_MS;
              const showImageAndTimestamp = !sameAsNext || showTimeSeparatorNext;
              const timestamp = formatTime(msg.createdDate);

              return (
                <React.Fragment key={msg.id}>
                  {showTimeSeparator && (
                    <div className="flex items-center gap-3 py-2">
                      <div className="flex-1 h-px bg-text-muted/25" />
                      <span className="text-xs text-text-muted px-1">{timestamp}</span>
                      <div className="flex-1 h-px bg-text-muted/25" />
                    </div>
                  )}
                  <div className={`flex items-end gap-2 ${sender === "me" ? "flex-row-reverse" : "flex-row"}`}>
                    {sender === "them" && activeFriend && (
                      <div className="w-7 flex-shrink-0">
                        {showImageAndTimestamp && (
                          <Image
                            src={avatarFor(activeFriend.id)}
                            alt={`${activeFriend.firstName} ${activeFriend.lastName}`}
                            width={28}
                            height={28}
                            className="rounded-full object-cover mb-1"
                          />
                        )}
                      </div>
                    )}
                    <div className={`flex flex-col ${sender === "me" ? "items-end" : "items-start"}`}>
                      <div
                        className={`max-w-sm px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                          sender === "me"
                            ? "bg-brand text-bg-dark rounded-br-sm"
                            : showImageAndTimestamp
                              ? "bg-bg-light text-text rounded-bl-sm shadow-sm"
                              : "bg-bg-light text-text rounded-2xl shadow-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                      {showImageAndTimestamp && (
                        <span className="text-xs text-text-muted mt-1">{timestamp}</span>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={bottomRef}/>
          </div>

          {activeFriend && (
            <div className="px-6 py-4 bg-bg-light border-t border-brand">
              <MessageInput
                value={input}
                onChange={setInput}
                onSend={handleSend}
                placeholder="Type a message..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
