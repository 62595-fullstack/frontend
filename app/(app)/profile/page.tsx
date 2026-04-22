"use client";

import { useEffect, useState } from "react";
import ProfilePage from "@/components/profile/ProfilePage";
import { api } from "@/lib/api";

export default function Page() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    api.getMe().then((me) => setUserId(me.id)).catch(() => {});
  }, []);

  if (!userId) return <div className="page"><p className="text-text-muted">Loading…</p></div>;

  return <ProfilePage variant="user" userId={userId} isOwnProfile />;
}
