"use client";

import React, { useEffect, useMemo, useState } from "react";
import PagebarContent from "@/components/pagebar/PagebarContent";
import { PagebarList, PagebarListItem, PagebarSection, PagebarStat } from "@/components/pagebar/PagebarSection";
import { api, FriendSummary, Post } from "@/lib/api";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-bg-light shadow-sm">
      {children}
    </div>
  );
}

function formatPostTime(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFriendSince(iso?: string) {
  if (!iso) return "Friends since unknown date";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Friends since unknown date";

  return `Friends since ${d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })}`;
}

type CurrentUserProfile = {
  name: string;
  bio?: string;
  website?: string;
  city?: string;
  company?: string;
  school?: string;
  friendsCount?: number;
};

function getInitials(name?: string) {
  const parts = (name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) return "YP";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function formatFriendsCount(count?: number) {
  if (typeof count !== "number" || !Number.isFinite(count)) {
    return "Friends count unavailable";
  }

  return `${count.toLocaleString()} friend${count === 1 ? "" : "s"}`;
}

function detailRows(profile: CurrentUserProfile) {
  return [
    profile.company ? `Works at ${profile.company}` : null,
    profile.school ? `Studied at ${profile.school}` : null,
    profile.city ? `Lives in ${profile.city}` : null,
    profile.website ? `Website: ${profile.website}` : null,
  ].filter((value): value is string => Boolean(value));
}

const fallbackProfile: CurrentUserProfile = {
  name: "Your Profile",
  bio: "Your backend does not expose a profile endpoint yet, so this page is using local placeholder profile details.",
};

export default function Page() {
  const [activeTab, setActiveTab] = useState<"posts" | "about" | "friends">(
    "posts"
  );
  const [showMenu, setShowMenu] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [friends, setFriends] = useState<FriendSummary[]>([]);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [friendsError, setFriendsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setPostsLoading(true);
      setPostsError(null);
      try {
        const data = await api.getPosts();
        if (!cancelled) setPosts(data ?? []);
      } catch (error) {
        if (!cancelled) {
          setPostsError(
            error instanceof Error ? error.message : "Failed to load posts"
          );
        }
      } finally {
        if (!cancelled) setPostsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadFriends() {
      setFriendsLoading(true);
      setFriendsError(null);
      try {
        const data = await api.getMyFriends();
        if (!cancelled) {
          setFriends(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (!cancelled) {
          setFriendsError(
            error instanceof Error ? error.message : "Failed to load friends"
          );
        }
      } finally {
        if (!cancelled) setFriendsLoading(false);
      }
    }

    loadFriends();
    return () => {
      cancelled = true;
    };
  }, []);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a: Post, b: Post) => {
      const ad = new Date(a?.createdDate ?? 0).getTime();
      const bd = new Date(b?.createdDate ?? 0).getTime();
      return bd - ad;
    });
  }, [posts]);

  const profile = useMemo<CurrentUserProfile>(() => {
    return {
      ...fallbackProfile,
      friendsCount: friends.length,
    };
  }, [friends.length]);

  const aboutRows = detailRows(profile);
  const pagebarTitle =
    activeTab === "posts" ? "Profile overview" : activeTab === "about" ? "About profile" : "Friend network";

  return (
    <div className="page !items-center">
      <PagebarContent title="Profile">
        <PagebarSection eyebrow="Identity" title={pagebarTitle}>
          <div className="grid grid-cols-2 gap-3">
            <PagebarStat label="Posts" value={sortedPosts.length} tone="accent" />
            <PagebarStat label="Friends" value={friendsLoading ? "..." : profile.friendsCount ?? 0} />
          </div>
          <PagebarList>
            <PagebarListItem active={activeTab === "posts"} title="Posts" meta="Latest activity and publishing history" />
            <PagebarListItem active={activeTab === "about"} title="About" meta="Bio, location, work, and school details" />
            <PagebarListItem active={activeTab === "friends"} title="Friends" meta="Relationship graph and social context" />
          </PagebarList>
        </PagebarSection>
      </PagebarContent>

      <div className="w-full max-w-5xl flex-1 min-h-0 overflow-hidden">
        <div
          className="overflow-y-auto h-full p-4 space-y-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          <Card>
            <div className="relative h-40 md:h-56 rounded-t-xl bg-brand/20">
              <button className="absolute bottom-3 right-3 btn-brand text-sm hidden xl:block z-10">
                Edit cover photo
              </button>
            </div>

            <div className="relative px-4 pb-4">
              <div className="-mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-end gap-3">
                  <div className="relative">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-bg bg-bg-light text-3xl font-bold text-brand">
                      {getInitials(profile.name)}
                    </div>
                    <button className="absolute bottom-1 right-1 rounded-full bg-bg-light p-2 shadow text-text-muted hover:bg-highlight">
                      Edit
                    </button>
                  </div>

                  <div className="pb-1">
                    <h1 className="text-2xl font-bold text-text">
                      {profile.name}
                    </h1>
                    <p className="text-sm text-text-muted">
                      {friendsLoading ? "Loading friends..." : formatFriendsCount(profile.friendsCount)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-text-muted">
                      <span>
                        {friendsError
                          ? "Friends could not be loaded from the backend."
                          : "Friends are loaded from the backend dummy data."}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Full buttons on xl+ */}
                <div className="hidden xl:flex flex-wrap gap-2 xl:pb-2">
                  <button className="btn-brand text-sm">
                    Edit profile
                  </button>
                  <button className="btn-brand text-sm">
                    More
                  </button>
                </div>

                {/* Hamburger menu on small screens */}
                <div className="relative xl:hidden self-end">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="btn-brand p-2 text-sm"
                    aria-label="Profile menu"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 mt-1 w-44 rounded-lg bg-bg-light shadow-lg border border-border-muted z-10">
                      <button className="block w-full text-left px-4 py-2 text-sm text-text hover:bg-highlight rounded-t-lg">
                        Edit cover photo
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-sm text-text hover:bg-highlight">
                        Edit profile
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-sm text-text hover:bg-highlight rounded-b-lg">
                        More
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 border-t border-border-muted">
                <div className="flex gap-2 overflow-x-auto py-2 text-sm font-semibold">
                  <button
                    onClick={() => setActiveTab("posts")}
                    className={`rounded-lg px-3 py-2 ${
                      activeTab === "posts"
                        ? "bg-brand/20 text-brand"
                        : "text-text-muted hover:bg-highlight"
                    }`}
                  >
                    Posts
                  </button>

                  <button
                    onClick={() => setActiveTab("about")}
                    className={`rounded-lg px-3 py-2 ${
                      activeTab === "about"
                        ? "bg-brand/20 text-brand"
                        : "text-text-muted hover:bg-highlight"
                    }`}
                  >
                    About
                  </button>

                  <button
                    onClick={() => setActiveTab("friends")}
                    className={`rounded-lg px-3 py-2 ${
                      activeTab === "friends"
                        ? "bg-brand/20 text-brand"
                        : "text-text-muted hover:bg-highlight"
                    }`}
                  >
                    Friends
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {activeTab === "posts" && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-5">
                <Card>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-text">Intro</p>
                    <p className="mt-2 text-sm text-text-muted">
                      {profile.bio}
                    </p>

                    <ul className="mt-3 space-y-2 text-sm text-text-muted">
                      {aboutRows.length > 0 ? (
                        aboutRows.map((row) => <li key={row}>{row}</li>)
                      ) : (
                        <li>No additional profile details available yet.</li>
                      )}
                    </ul>

                    <button className="btn-brand mt-4 w-full text-sm">
                      Edit details
                    </button>
                  </div>
                </Card>
              </div>

              <div className="space-y-4 lg:col-span-7">
                <Card>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-text">Posts</p>
                      {postsLoading ? (
                        <span className="text-xs text-text-muted">Loading...</span>
                      ) : (
                        <span className="text-xs text-text-muted">
                          {sortedPosts.length} total
                        </span>
                      )}
                    </div>

                    {postsError && (
                      <p className="mt-2 text-sm text-danger">{postsError}</p>
                    )}
                  </div>
                </Card>

                {sortedPosts.map((post: Post, index: number) => (
                  <Card
                    key={`${post.id || "post"}-${post.createdDate || "no-date"}-${post.title || "untitled"}-${index}`}
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg text-xs font-semibold text-brand">
                          {getInitials(profile.name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text">
                            {profile.name}
                          </p>
                          <p className="text-xs text-text-muted">
                            {formatPostTime(post.createdDate)} | Public
                          </p>
                        </div>
                      </div>
                      <button className="rounded-lg px-2 py-1 text-text-muted hover:bg-highlight">
                        More
                      </button>
                    </div>

                    <div className="space-y-2 px-4 pb-3 text-sm text-text">
                      {post.title ? <p className="font-semibold">{post.title}</p> : null}

                      <p className="whitespace-pre-wrap text-text-muted">
                        {post.bodytext?.trim() ? post.bodytext : "(No body text)"}
                      </p>
                    </div>

                    <div className="h-64 bg-bg" />

                    <div className="grid grid-cols-3 gap-2 border-t border-border-muted p-2 text-sm font-semibold text-text-muted">
                      <button className="rounded-lg px-3 py-2 hover:bg-highlight">
                        Like
                      </button>
                      <button className="rounded-lg px-3 py-2 hover:bg-highlight">
                        Comment
                      </button>
                      <button className="rounded-lg px-3 py-2 hover:bg-highlight">
                        Share
                      </button>
                    </div>
                  </Card>
                ))}

                {!postsLoading && !postsError && sortedPosts.length === 0 && (
                  <Card>
                    <div className="p-4 text-sm text-text-muted">No posts yet.</div>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <Card>
              <div className="space-y-4 p-4">
                <p className="text-sm font-semibold text-text">About</p>

                <div className="space-y-2 text-sm text-text-muted">
                  <p>
                    <span className="font-semibold text-text">Bio:</span>{" "}
                    {profile.bio || "No bio available."}
                  </p>
                  <p>
                    <span className="font-semibold text-text">Works at:</span>{" "}
                    {profile.company || "Not provided"}
                  </p>
                  <p>
                    <span className="font-semibold text-text">Studied at:</span>{" "}
                    {profile.school || "Not provided"}
                  </p>
                  <p>
                    <span className="font-semibold text-text">Lives in:</span>{" "}
                    {profile.city || "Not provided"}
                  </p>
                  <p>
                    <span className="font-semibold text-text">Website:</span>{" "}
                    {profile.website || "Not provided"}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "friends" && (
            <Card>
              <div className="space-y-4 p-4">
                <p className="text-sm font-semibold text-text">Friends</p>

                {friendsError ? (
                  <div className="rounded-lg bg-bg p-4 text-sm text-danger">
                    {friendsError}
                  </div>
                ) : null}

                {friendsLoading ? (
                  <div className="rounded-lg bg-bg p-4 text-sm text-text-muted">
                    Loading friends...
                  </div>
                ) : null}

                {!friendsLoading && !friendsError && friends.length === 0 ? (
                  <div className="rounded-lg bg-bg p-4 text-sm text-text-muted">
                    No friends found for the current user.
                  </div>
                ) : null}

                {!friendsLoading && !friendsError && friends.length > 0 ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {friends.map((friend) => (
                      <div
                        key={friend.id}
                        className="rounded-xl border border-border-muted bg-bg p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/20 text-sm font-bold text-brand">
                            {getInitials(friend.userName || friend.firstName)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-text">
                              {friend.userName || friend.firstName}
                            </p>
                            <p className="truncate text-xs text-text-muted">
                              {friend.email}
                            </p>
                            <p className="mt-2 text-xs text-text-muted">
                              {formatFriendSince(friend.friendsSince)}
                            </p>
                          </div>
                          <span className="rounded-full bg-highlight px-2 py-1 text-[11px] font-medium text-text">
                            {friend.age}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
