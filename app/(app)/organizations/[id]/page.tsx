'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProfilePage from "@/components/profile/ProfilePage";
import { api } from "@/lib/api";

export default function OrganizationProfilePage() {
  const { id } = useParams<{ id: string }>();
  const orgId = Number(id);
  const [isOrgAdmin, setIsOrgAdmin] = useState(false);
  const [isMember, setIsMember] = useState<boolean | null>(null);

  useEffect(() => {
    api.getUserOrganizationBindingForCurrentUser(orgId)
      .then((binding) => {
        setIsOrgAdmin(binding?.roleId === 1000);
        setIsMember(binding != null);
      })
      .catch(() => { setIsMember(false); });
  }, [orgId]);

  return <ProfilePage variant="organization" orgId={orgId} isOrgAdmin={isOrgAdmin} isMember={isMember} />;
}
