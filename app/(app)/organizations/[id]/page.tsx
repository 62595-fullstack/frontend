'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProfilePage from "@/components/profile/ProfilePage";
import { api } from "@/lib/api";

export default function OrganizationProfilePage() {
  const { id } = useParams<{ id: string }>();
  const orgId = Number(id);
  const [isOrgAdmin, setIsOrgAdmin] = useState(false);

  useEffect(() => {
    api.getUserOrganizationBindingForCurrentUser(orgId)
      .then((binding) => { setIsOrgAdmin(binding?.roleId === 1000); })
      .catch(() => {});
  }, [orgId]);

  return <ProfilePage variant="organization" orgId={orgId} isOrgAdmin={isOrgAdmin} />;
}
