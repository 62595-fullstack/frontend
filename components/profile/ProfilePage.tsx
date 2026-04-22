"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PagebarContent from "@/components/pagebar/PagebarContent";
import { PagebarList, PagebarListItem, PagebarSection, PagebarStat } from "@/components/pagebar/PagebarSection";
import { api, Organization, OrganizationEvent, Post } from "@/lib/api";
import { getOrgImages } from "@/lib/mockOrgImages";

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl bg-bg-light shadow-sm p-4">{children}</div>;
}

function ItemHeader({
  picture,
  initials,
  title,
  meta,
  action,
}: {
  picture?: string | null;
  initials: string;
  title: string;
  meta: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {picture ? (
          <img src={picture} alt={title} className="w-10 h-10 rounded-full object-cover"/>
        ) : (
          <div
            className="w-10 h-10 rounded-full bg-bg flex items-center justify-center text-xs font-semibold text-brand">
            {initials}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-text">{title}</p>
          <p className="text-xs text-text-muted">{meta}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function getInitials(name?: string) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) return "?";
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

function formatPostTime(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit",
  });
}

function formatFriendSince(iso?: string) {
  if (!iso) return "Friends since unknown date";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Friends since unknown date";
  return `Friends since ${d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}`;
}

function formatMemberSince(iso?: string) {
  if (!iso) return "Member since unknown date";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Member since unknown date";
  return `Member since ${d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}`;
}

function formatFriendsCount(count?: number) {
  if (typeof count !== "number" || !Number.isFinite(count)) return "Friends count unavailable";
  return `${count.toLocaleString()} friend${count === 1 ? "" : "s"}`;
}

function formatMembersCount(count?: number) {
  if (typeof count !== "number" || !Number.isFinite(count)) return "Members count unavailable";
  return `${count.toLocaleString()} member${count === 1 ? "" : "s"}`;
}

type ProfileUser = {
  id: string;
  firstName: string;
  lastName: string;
  detail?: string;
  since: string;
  badge?: string | number;
};

type UserProfileData = {
  name: string;
  bio?: string;
  website?: string;
  city?: string;
  company?: string;
  school?: string;
  friendsCount?: number;
};

export type ProfilePageProps =
  | { variant: "user"; userId?: string }
  | { variant: "organization"; orgId: number };

export default function ProfilePage(props: ProfilePageProps) {
  const isOrg = props.variant === "organization";
  const orgId = isOrg ? (props as { variant: "organization"; orgId: number }).orgId : null;
  const userId = !isOrg ? (props as { variant: "user"; userId?: string }).userId : null;
  const isOwnProfile = !isOrg && !userId;

  const [resolvedUserId, setResolvedUserId] = useState<string | null>(userId ?? null);

  const Tabs = {
    overview: {
      id: 'overview',
      title: isOrg ? 'Events' : 'Posts',
      description: isOrg ? 'Current organization events' : 'User posts',
    },
    about: {
      id: 'about',
      title: 'About',
      description: isOrg ? 'About this organization' : 'Bio, location, work, and school details'
    },
    users: {
      id: 'users',
      title: isOrg ? 'Members' : 'Friends',
      description: isOrg ? 'Organization members' : 'User friends'
    },
  } as const;

  type Tab = typeof Tabs[keyof typeof Tabs]

  const [activeTab, setActiveTab] = useState<Tab>(Tabs.overview);
  const [showMenu, setShowMenu] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);

  const [users, setUsers] = useState<ProfileUser[]>(
    isOrg ? [
      { id: "1", firstName: "Alice", lastName: "Johnson", since: formatMemberSince("2023-03-15"), badge: "Admin" },
      { id: "2", firstName: "Bob", lastName: "Smith", since: formatMemberSince("2023-06-01"), badge: "Member" },
      { id: "3", firstName: "Carol", lastName: "White", since: formatMemberSince("2024-01-20"), badge: "Member" },
      { id: "4", firstName: "David", lastName: "Lee", since: formatMemberSince("2024-09-05"), badge: "Member" },
    ] : []
  );
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersLoadingError, setUsersLoadingError] = useState<string | null>(null);

  const [org, setOrg] = useState<Organization | null>(null);
  const [orgError, setOrgError] = useState<string | null>(null);
  const [events, setEvents] = useState<OrganizationEvent[]>([]);

  const [viewedUser, setViewedUser] = useState<{ firstName: string; lastName: string } | null>(null);

  useEffect(() => {
    if (!isOwnProfile) return;
    let cancelled = false;
    api.getMe()
    .then((me) => { if (!cancelled) setResolvedUserId(me.id); })
    .catch(() => {});
    return () => { cancelled = true; };
  }, [isOwnProfile]);

  useEffect(() => {
    if (props.variant !== "user" || !resolvedUserId) return;
    let cancelled = false;
    setPostsLoading(true);
    setPostsError(null);
    api.getPostsByUser(resolvedUserId)
    .then((data) => { if (!cancelled) setPosts(data ?? []); })
    .catch((err) => { if (!cancelled) setPostsError(err instanceof Error ? err.message : "Failed to load posts"); })
    .finally(() => { if (!cancelled) setPostsLoading(false); });
    return () => { cancelled = true; };
  }, [props.variant, resolvedUserId]);

  useEffect(() => {
    if (props.variant !== "user" || !resolvedUserId) return;
    let cancelled = false;
    setUsersLoading(true);
    setUsersLoadingError(null);
    api.getFriendsByUser(resolvedUserId)
    .then((friends) => {
      if (!cancelled) setUsers(Array.isArray(friends) ? friends.map((friend) => ({
        id: friend.id,
        firstName: friend.firstName,
        lastName: friend.lastName,
        detail: friend.email,
        since: formatFriendSince(friend.friendsSince),
        badge: friend.age,
      })) : []);
    })
    .catch((err) => { if (!cancelled) setUsersLoadingError(err instanceof Error ? err.message : "Failed to load friends"); })
    .finally(() => { if (!cancelled) setUsersLoading(false); });
    return () => { cancelled = true; };
  }, [props.variant, resolvedUserId]);

  useEffect(() => {
    if (isOwnProfile || !resolvedUserId) return;
    let cancelled = false;
    api.getUserById(resolvedUserId)
    .then((user) => { if (!cancelled) setViewedUser({ firstName: user.firstName, lastName: user.lastName }); })
    .catch(() => {});
    return () => { cancelled = true; };
  }, [isOwnProfile, resolvedUserId]);

  useEffect(() => {
    if (!orgId) return;
    let cancelled = false;
    api.getOrganizationById(orgId)
    .then((data) => { if (!cancelled) setOrg(data); })
    .catch((err) => { if (!cancelled) setOrgError(err instanceof Error ? err.message : "Failed to load organization."); });
    api.getOrganizationEvents(orgId)
    .then((data) => { if (!cancelled) setEvents(data); })
    .catch(() => { if (!cancelled) setEvents([]); });
    return () => { cancelled = true; };
  }, [orgId]);

  const sortedPosts = useMemo(() => (
    [...posts].sort((a, b) =>
      new Date(b?.createdDate ?? 0).getTime() - new Date(a?.createdDate ?? 0).getTime()
    )
  ), [posts]);

  const userProfile = useMemo<UserProfileData>(() => ({
    name: isOwnProfile
      ? "Your Profile"
      : viewedUser
        ? `${viewedUser.firstName} ${viewedUser.lastName}`
        : userId ?? "User",
    bio: isOwnProfile
      ? "Your backend does not expose a profile endpoint yet, so this page is using local placeholder profile details."
      : undefined,
    friendsCount: users.length,
  }), [isOwnProfile, userId, viewedUser, users.length]);

  if (isOrg && orgError) {
    return <div className="page"><p className="text-danger">{orgError}</p></div>;
  }
  if (isOrg && !org) {
    return <div className="page"><p className="text-text-muted">Loading…</p></div>;
  }

  const orgImages = org ? getOrgImages(org.id) : null;
  const coverPhoto = orgImages?.coverPhoto ?? null;
  const profilePicture = orgImages?.profilePicture ?? null;
  const displayName = isOrg ? org!.name : userProfile.name;
  const initials = isOrg ? getInitials(org!.name) : getInitials(userProfile.name);

  const pagebarTitle = isOrg
    ? "Organization details"
    : activeTab.id === Tabs.overview.id ? "Profile overview"
      : activeTab.id === Tabs.about.id ? "About profile"
        : "Friend network";

  const itemsCount = isOrg ? events.length : sortedPosts.length;
  const itemsCountLabel = isOrg
    ? `${events.length} total`
    : postsLoading ? "Loading..." : `${sortedPosts.length} total`;

  return (
    <div className="page !items-center overflow-y-auto">
      <PagebarContent title={displayName}>
        <PagebarSection eyebrow={isOrg ? "Overview" : "Identity"} title={pagebarTitle}>
          <div className="grid grid-cols-2 gap-3">
            <PagebarStat label={Tabs.overview.title} value={isOrg ? events.length : sortedPosts.length}
                         tone="accent"/>
            <PagebarStat label={Tabs.users.title}
                         value={usersLoading ? "..." : users.length}/>
          </div>
          {isOrg && events.length > 0 && (
            <PagebarList>
              {events.slice(0, 3).map((event, i) => (
                <PagebarListItem
                  key={event.id}
                  active={i === 0}
                  title={event.title}
                  meta={event.startDate ? new Date(event.startDate).toLocaleDateString() : "No date"}
                />
              ))}
            </PagebarList>
          )}
          <PagebarList>
            {Object.values(Tabs).map((tab) => (
              <PagebarListItem key={tab.id} active={activeTab.id === tab.id} title={tab.title}
                               meta={tab.description}/>
            ))}
          </PagebarList>
        </PagebarSection>
      </PagebarContent>

      <div className="w-full max-w-5xl p-4 space-y-4">
        {/* Header card — identical structure for both variants */}
        <div className="rounded-xl bg-bg-light shadow-sm overflow-hidden">
          {/* Cover photo */}
          <div className="relative">
            {coverPhoto ? (
              <div
                className="w-full h-40 md:h-56 bg-cover bg-center"
                style={{ backgroundImage: `url(${coverPhoto})` }}
              />
            ) : (
              <div className="w-full h-40 md:h-56 bg-brand/20"/>
            )}
            {isOwnProfile && (
              <button className="absolute bottom-3 right-3 btn-brand text-sm hidden xl:block z-10">
                Edit cover photo
              </button>
            )}
          </div>

          {/* Profile info row */}
          <div className="relative px-4 pb-4">
            <div className="-mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-3">
                {/* Avatar */}
                <div className="relative">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt={displayName}
                      className="w-28 h-28 rounded-full border-4 border-bg object-cover"
                    />
                  ) : (
                    <div
                      className="w-28 h-28 rounded-full bg-bg-light border-4 border-bg flex items-center justify-center text-3xl font-bold text-brand select-none">
                      {initials}
                    </div>
                  )}
                  {isOwnProfile && (
                    <button
                      className="absolute bottom-1 right-1 rounded-full bg-bg-light p-2 shadow text-text-muted hover:text-text transition-all cursor-pointer hover:bg-highlight active:scale-95 active:bg-brand-on-click">
                      Edit
                    </button>
                  )}
                </div>

                {/* Name + subtitle */}
                <div className="pb-1 text-sm text-text-muted">
                  <h1 className="text-2xl font-bold text-text">{displayName}</h1>
                  <p>
                    {usersLoading ? "..." : (isOrg ? formatMembersCount(users.length) : formatFriendsCount(users.length))}
                  </p>
                </div>
              </div>

              {/* User-only action buttons */}
              {isOwnProfile && (
                <>
                  <div className="hidden xl:flex flex-wrap gap-2 xl:pb-2">
                    <button className="btn-brand text-sm">Edit profile</button>
                    <button className="btn-brand text-sm">More</button>
                  </div>
                  <div className="relative xl:hidden self-end">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="btn-brand p-2 text-sm"
                      aria-label="Profile menu"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24"
                           stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                      </svg>
                    </button>
                    {showMenu && (
                      <div
                        className="absolute right-0 mt-1 w-44 rounded-lg bg-bg-light shadow-lg border border-border-muted z-10">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-text hover:bg-highlight rounded-t-lg">Edit
                          cover photo
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-text hover:bg-highlight">Edit
                          profile
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-text hover:bg-highlight rounded-b-lg">More
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Tab bar */}
            <div className="mt-4 border-t border-border-muted">
              <div className="flex gap-2 overflow-x-auto py-2 text-sm font-semibold">
                {Object.values(Tabs).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-lg px-3 py-2 transition-all cursor-pointer active:scale-95 active:bg-brand-on-click ${
                      activeTab.id === tab.id ? "bg-brand text-bg-dark" : "text-text hover:bg-highlight"
                    }`}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Posts tab */}
        {activeTab.id === Tabs.overview.id && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Left: About */}
            <div className="space-y-4 lg:col-span-5">
              <Card>
                <h2 className="text-sm font-semibold text-text">About</h2>
                <p className="mt-2 text-sm text-text-muted">
                  {isOrg ? (org!.description?.trim() || "No description yet.") : userProfile.bio}
                </p>
                {isOwnProfile && (
                  <button className="btn-brand mt-4 w-full text-sm">Edit details</button>
                )}
              </Card>
            </div>

            {/* Right: Events / Posts */}
            <div className="space-y-4 lg:col-span-7">
              {/* Header card — identical structure for both variants */}
              <Card>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-text">{Tabs.overview.title}</h2>
                  <span className="text-xs text-text-muted">{itemsCountLabel}</span>
                </div>
                {!isOrg && postsError && (
                  <p className="mt-2 text-sm text-danger">{postsError}</p>
                )}
              </Card>

              {/* Empty state — same structure for both */}
              {itemsCount === 0 && !postsLoading && (
                <Card>
                  <p className="text-sm text-text-muted">No {Tabs.overview.title.toLowerCase()} yet.</p>
                </Card>
              )}

              {/* Event cards */}
              {isOrg && events.map((event) => (
                <Card key={event.id}>
                  <ItemHeader
                    picture={profilePicture}
                    initials={initials}
                    title={event.title}
                    meta={event.startDate ? new Date(event.startDate).toLocaleDateString() : "No date"}
                  />
                  {event.description && (
                    <p className="mt-2 text-sm text-text-muted whitespace-pre-wrap">{event.description}</p>
                  )}
                  <Link href={`/events/${event.id}`} className="btn-brand mt-3 text-sm inline-block">
                    View Event
                  </Link>
                </Card>
              ))}

              {/* Post cards — same Card wrapper and ItemHeader as event cards */}
              {!isOrg && sortedPosts.map((post, index) => (
                <Card key={`${post.id || "post"}-${post.createdDate || "no-date"}-${index}`}>
                  <ItemHeader
                    picture={profilePicture}
                    initials={initials}
                    title={userProfile.name}
                    meta={`${formatPostTime(post.createdDate)} | Public`}
                    action={
                      <button className="rounded-lg px-2 py-1 text-text-muted hover:text-text transition-all cursor-pointer hover:bg-highlight active:scale-95 active:bg-brand-on-click">
                        More
                      </button>
                    }
                  />
                  <div className="mt-2 space-y-1 text-sm text-text">
                    {post.title && <p className="font-semibold">{post.title}</p>}
                    <p className="whitespace-pre-wrap text-text-muted">
                      {post.bodytext?.trim() ? post.bodytext : "(No body text)"}
                    </p>
                  </div>
                  <div
                    className="mt-3 pt-3 border-t border-border-muted flex gap-1 text-sm font-semibold text-text-muted">
                    {["Like", "Comment", "Share"].map((label) => (
                      <button key={label} className="rounded-lg px-3 py-2 flex-1 hover:text-text transition-all cursor-pointer hover:bg-highlight active:scale-95 active:bg-brand-on-click">
                        {label}
                      </button>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* About tab */}
        {activeTab.id === Tabs.about.id && (
          <Card>
            <h2 className="text-sm font-semibold text-text">{Tabs.about.title}</h2>
            <div className="mt-3 space-y-2 text-sm text-text-muted">
              {isOrg ? (
                <>{org!.description?.trim() || "No description yet."}</>
              ) : (
                <>
                  {[
                    { label: "Bio", value: userProfile.bio },
                    { label: "Works at", value: userProfile.company },
                    { label: "Studied at", value: userProfile.school },
                    { label: "Lives in", value: userProfile.city },
                    { label: "Website", value: userProfile.website },
                  ].map(({ label, value }) => (
                    <p key={label}>
                      <span className="font-semibold text-text">{label}:</span>{" "}
                      {value || "Not provided"}
                    </p>
                  ))}
                </>
              )}
            </div>
          </Card>
        )}

        {/* User friends and organization members tab */}
        {activeTab.id === Tabs.users.id && (
          <Card>
            <h2 className="text-sm font-semibold text-text">{Tabs.users.title}</h2>
            {usersLoadingError && (
              <div className="mt-3 rounded-lg bg-bg p-4 text-sm text-danger">{usersLoadingError}</div>
            )}
            {usersLoading && (
              <div className="mt-3 rounded-lg bg-bg p-4 text-sm text-text-muted">Loading...</div>
            )}
            {!usersLoading && !usersLoadingError && users.length === 0 && (
              <div className="mt-3 rounded-lg bg-bg p-4 text-sm text-text-muted">
                No {Tabs.users.title.toLowerCase()} found.
              </div>
            )}
            {!usersLoading && !usersLoadingError && users.length > 0 && (
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {users.map((user) => (
                  <div key={user.id} className="rounded-xl border border-border-muted bg-bg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/20 text-sm font-bold text-brand">
                        {getInitials(`${user.firstName} ${user.lastName}`)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-text">
                          {`${user.firstName} ${user.lastName}`}
                        </p>
                        {user.detail && <p className="truncate text-xs text-text-muted">{user.detail}</p>}
                        <p className="mt-2 text-xs text-text-muted">{user.since}</p>
                      </div>
                      {user.badge != null && (
                        <span className="rounded-full bg-highlight px-2 py-1 text-[11px] font-medium text-text">
                          {user.badge}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
