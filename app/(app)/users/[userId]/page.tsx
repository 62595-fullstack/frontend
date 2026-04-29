"use client";

import { use } from "react";
import ProfilePage from "@/components/profile/ProfilePage";

export default function Page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  return <ProfilePage variant="user" userId={userId} />;
}
