'use client'

import { useParams } from "next/navigation";
import ProfilePage from "@/components/profile/ProfilePage";

export default function OrganizationProfilePage() {
  const { id } = useParams<{ id: string }>();
  return <ProfilePage variant="organization" orgId={Number(id)} />;
}
