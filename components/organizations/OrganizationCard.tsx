'use client'

import Link from "next/link";
import { Organization } from "@/lib/api";

interface OrganizationCardProps {
  organization: Organization;
}

export default function OrganizationCard({ organization }: OrganizationCardProps) {
  const initials = organization.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="card flex flex-col items-center text-center">
      {/* Banner */}
      <div className="w-full h-16 bg-brand/20 rounded-t-lg" />

      {/* Avatar */}
      <div className="-mt-10 w-20 h-20 rounded-full bg-bg-light border-4 border-bg flex items-center justify-center text-2xl font-bold text-brand select-none">
        {initials}
      </div>

      {/* Info */}
      <div className="px-4 pt-3 pb-2 flex flex-col items-center gap-1 flex-1">
        <h3 className="text-base font-semibold text-text leading-tight">{organization.name}</h3>
        {organization.description && (
          <p className="text-xs text-text-muted line-clamp-2">{organization.description}</p>
        )}
      </div>

      {/* Action */}
      <div className="px-4 pb-4 w-full">
        <Link
          href={`/organizations/${organization.id}`}
          className="btn-brand block w-full text-center text-sm py-2"
        >
          View Organization
        </Link>
      </div>
    </div>
  );
}
