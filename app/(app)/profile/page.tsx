"use client";

import React, { useEffect, useMemo, useState } from "react";
import PagebarContent from "@/components/pagebar/PagebarContent";
import { api, Post } from "@/lib/api";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-black/5">
      {children}
    </div>
  );
}

function formatPostTime(iso?: string) {
  if (!iso) return "—";
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
      } catch (e: unknown) {
        if (!cancelled) {
          setPostsError((e as Error)?.message ?? "Failed to load posts");
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

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-100 font-sans">
      <div className="flex w-full gap-4 px-6 py-6">
        <div className="min-w-0 flex-1 space-y-4">
          <Card>
            <div className="relative h-56 rounded-t-xl bg-gradient-to-r from-blue-600 to-indigo-600">
              <button className="absolute bottom-3 right-3 rounded-lg bg-white/90 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-white">
                📷 Edit cover photo
              </button>
            </div>

            <div className="relative px-4 pb-4">
              <div className="-mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-end gap-3">
                  <div className="relative">
                    <div className="h-28 w-28 rounded-full border-4 border-white bg-gray-300" />
                    <button className="absolute bottom-1 right-1 rounded-full bg-white p-2 shadow hover:bg-gray-50">
                      📷
                    </button>
                  </div>

                  <div className="pb-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Your Name
                    </h1>
                    <p className="text-sm text-gray-500">1,234 friends</p>
                    <div className="mt-2 flex -space-x-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-8 w-8 rounded-full border-2 border-white bg-gray-300"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:pb-2">
                  <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200">
                    ✏️ Edit profile
                  </button>
                  <button className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200">
                    ⋯
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
                      Add a short bio here.
                    </p>

                    <ul className="mt-3 space-y-2 text-sm text-gray-700">
                      <li>
                        🏢 Works at{" "}
                        <span className="font-semibold">Company</span>
                      </li>
                      <li>
                        🎓 Studied at{" "}
                        <span className="font-semibold">School</span>
                      </li>
                      <li>
                        📍 Lives in <span className="font-semibold">City</span>
                      </li>
                      <li>
                        🔗 <span className="font-semibold">your-site.com</span>
                      </li>
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
                      <p className="text-sm font-semibold text-gray-900">
                        Posts
                      </p>
                      {postsLoading ? (
                        <span className="text-xs text-gray-500">Loading…</span>
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

                {sortedPosts.map((post: Post) => (
                  <Card key={post.id}>
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-300" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Your Name
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatPostTime(post.createdDate)} · 🌐
                          </p>
                        </div>
                      </div>
                      <button className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100">
                        ⋯
                      </button>
                    </div>

                    <div className="space-y-2 px-4 pb-3 text-sm text-gray-800">
                      {post.title ? (
                        <p className="font-semibold">{post.title}</p>
                      ) : null}

                      <p className="whitespace-pre-wrap">
                        {post.bodytext?.trim()
                          ? post.bodytext
                          : "(No body text)"}
                      </p>
                    </div>

                    <div className="h-64 bg-gray-200" />

                    <div className="grid grid-cols-3 gap-2 border-t p-2 text-sm font-semibold text-gray-700">
                      <button className="rounded-lg px-3 py-2 hover:bg-gray-100">
                        👍 Like
                      </button>
                      <button className="rounded-lg px-3 py-2 hover:bg-gray-100">
                        💬 Comment
                      </button>
                      <button className="rounded-lg px-3 py-2 hover:bg-gray-100">
                        ↗️ Share
                      </button>
                    </div>
                  </Card>
                ))}

                {!postsLoading && !postsError && sortedPosts.length === 0 && (
                  <Card>
                    <div className="p-4 text-sm text-gray-700">
                      No posts yet.
                    </div>
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
                    <span className="font-semibold">Bio:</span> Add a short bio
                    here.
                  </p>
                  <p>
                    <span className="font-semibold">Works at:</span> Company
                  </p>
                  <p>
                    <span className="font-semibold">Studied at:</span> School
                  </p>
                  <p>
                    <span className="font-semibold">Lives in:</span> City
                  </p>
                  <p>
                    <span className="font-semibold">Website:</span> your-site.com
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "friends" && (
            <Card>
              <div className="space-y-4 p-4">
                <p className="text-sm font-semibold text-gray-900">Friends</p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
                    >
                      <div className="h-12 w-12 rounded-full bg-gray-300" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Friend {i + 1}
                        </p>
                        <p className="text-xs text-gray-500">Mutual friend</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        <PagebarContent>
          <ul className="space-y-2">
            <li className="text-sm font-semibold text-gray-800">Profile</li>
          </ul>
        </PagebarContent>
      </div>
    </div>
  );
}