"use client";

import { useEffect, useState } from "react";
import { api, Organization } from "@/lib/api";

export default function TestPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getOrganizations().then(setOrgs).catch((e) => setError(e.message));
  }, []);

  if (error) return <div>Error: {error}</div>;

  return <pre>{JSON.stringify(orgs, null, 2)}</pre>;
}