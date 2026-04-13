"use client";

import React, { useEffect, useMemo, useState } from "react";
import PagebarContent from "@/components/pagebar/PagebarContent";
import { PagebarList, PagebarListItem, PagebarSection, PagebarStat } from "@/components/pagebar/PagebarSection";
import { api, Post } from "@/lib/api";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-black/5">
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);

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

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a: Post, b: Post) => {
      const ad = new Date(a?.createdDate ?? 0).getTime();
      const bd = new Date(b?.createdDate ?? 0).getTime();
      return bd - ad;
    });
  }, [posts]);

  const aboutRows = detailRows(fallbackProfile);
  const pagebarTitle =
    activeTab === "posts" ? "Profile overview" : activeTab === "about" ? "About profile" : "Friend network";

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-100 font-sans">
      <PagebarContent title="Profile">
        <PagebarSection eyebrow="Identity" title={pagebarTitle}>
          <div className="grid grid-cols-2 gap-3">
            <PagebarStat label="Posts" value={sortedPosts.length} tone="accent" />
            <PagebarStat label="Friends" value={fallbackProfile.friendsCount ?? "N/A"} />
          </div>
          <PagebarList>
            <PagebarListItem active={activeTab === "posts"} title="Posts" meta="Latest activity and publishing history" />
            <PagebarListItem active={activeTab === "about"} title="About" meta="Bio, location, work, and school details" />
            <PagebarListItem active={activeTab === "friends"} title="Friends" meta="Relationship graph and social context" />
          </PagebarList>
        </PagebarSection>
      </PagebarContent>

      <div className="flex w-full gap-4 px-6 py-6">
        <div className="min-w-0 flex-1 space-y-4">
          <Card>
            <div className="relative h-56 rounded-t-xl bg-gradient-to-r from-blue-600 to-indigo-600">
              <button className="absolute bottom-3 right-3 rounded-lg bg-white/90 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-white">
                Edit cover photo
              </button>
            </div>

            <div className="relative px-4 pb-4">
              <div className="-mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-end gap-3">
                  <div className="relative">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gray-300 text-3xl font-bold text-gray-700">
                      {getInitials(fallbackProfile.name)}
                    </div>
                    <button className="absolute bottom-1 right-1 rounded-full bg-white p-2 shadow hover:bg-gray-50">
                      Edit
                    </button>
                  </div>

                  <div className="pb-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {fallbackProfile.name}
                    </h1>
                    <p className="text-sm text-gray-500">
                      {formatFriendsCount(fallbackProfile.friendsCount)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>Profile API not available on the current backend.</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:pb-2">
                  <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200">
                    Edit profile
                  </button>
                  <button className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200">
                    More
                  </button>
                </div>
              </div>

              <div className="mt-4 border-t">
                <div className="flex gap-2 overflow-x-auto py-2 text-sm font-semibold">
                  <button
                    onClick={() => setActiveTab("posts")}
                    className={`rounded-lg px-3 py-2 ${
                      activeTab === "posts"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Posts
                  </button>

                  <button
                    onClick={() => setActiveTab("about")}
                    className={`rounded-lg px-3 py-2 ${
                      activeTab === "about"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    About
                  </button>

                  <button
                    onClick={() => setActiveTab("friends")}
                    className={`rounded-lg px-3 py-2 ${
                      activeTab === "friends"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
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
                    <p className="text-sm font-semibold text-gray-900">Intro</p>
                    <p className="mt-2 text-sm text-gray-700">
                      {fallbackProfile.bio}
                    </p>

                    <ul className="mt-3 space-y-2 text-sm text-gray-700">
                      {aboutRows.length > 0 ? (
                        aboutRows.map((row) => <li key={row}>{row}</li>)
                      ) : (
                        <li>No additional profile details available yet.</li>
                      )}
                    </ul>

                    <button className="mt-4 w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200">
                      Edit details
                    </button>
                  </div>
                </Card>
              </div>

              <div className="space-y-4 lg:col-span-7">
                <Card>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">Posts</p>
                      {postsLoading ? (
                        <span className="text-xs text-gray-500">Loading...</span>
                      ) : (
                        <span className="text-xs text-gray-500">
                          {sortedPosts.length} total
                        </span>
                      )}
                    </div>

                    {postsError && (
                      <p className="mt-2 text-sm text-red-600">{postsError}</p>
                    )}
                  </div>
                </Card>

                {sortedPosts.map((post: Post, index: number) => (
                  <Card
                    key={`${post.id || "post"}-${post.createdDate || "no-date"}-${post.title || "untitled"}-${index}`}
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-xs font-semibold text-gray-700">
                          {getInitials(fallbackProfile.name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {fallbackProfile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatPostTime(post.createdDate)} | Public
                          </p>
                        </div>
                      </div>
                      <button className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100">
                        More
                      </button>
                    </div>

                    <div className="space-y-2 px-4 pb-3 text-sm text-gray-800">
                      {post.title ? <p className="font-semibold">{post.title}</p> : null}

                      <p className="whitespace-pre-wrap">
                        {post.bodytext?.trim() ? post.bodytext : "(No body text)"}
                      </p>
                    </div>

                    <div className="h-64 bg-gray-200" />

                    <div className="grid grid-cols-3 gap-2 border-t p-2 text-sm font-semibold text-gray-700">
                      <button className="rounded-lg px-3 py-2 hover:bg-gray-100">
                        Like
                      </button>
                      <button className="rounded-lg px-3 py-2 hover:bg-gray-100">
                        Comment
                      </button>
                      <button className="rounded-lg px-3 py-2 hover:bg-gray-100">
                        Share
                      </button>
                    </div>
                  </Card>
                ))}

                {!postsLoading && !postsError && sortedPosts.length === 0 && (
                  <Card>
                    <div className="p-4 text-sm text-gray-700">No posts yet.</div>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <Card>
              <div className="space-y-4 p-4">
                <p className="text-sm font-semibold text-gray-900">About</p>

                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Bio:</span>{" "}
                    {fallbackProfile.bio || "No bio available."}
                  </p>
                  <p>
                    <span className="font-semibold">Works at:</span>{" "}
                    {fallbackProfile.company || "Not provided"}
                  </p>
                  <p>
                    <span className="font-semibold">Studied at:</span>{" "}
                    {fallbackProfile.school || "Not provided"}
                  </p>
                  <p>
                    <span className="font-semibold">Lives in:</span>{" "}
                    {fallbackProfile.city || "Not provided"}
                  </p>
                  <p>
                    <span className="font-semibold">Website:</span>{" "}
                    {fallbackProfile.website || "Not provided"}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "friends" && (
            <Card>
              <div className="space-y-4 p-4">
                <p className="text-sm font-semibold text-gray-900">Friends</p>

                <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                  The current backend does not expose a friends list yet.
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
