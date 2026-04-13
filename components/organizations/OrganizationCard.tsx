'use client'

import Link from "next/link";
import { Organization } from "@/lib/api";
import { getOrgImages } from "@/lib/mockOrgImages";

interface OrganizationCardProps {
  organization: Organization;
}

export default function OrganizationCard({ organization }: OrganizationCardProps) {
  const { profilePicture, coverPhoto } = getOrgImages(organization.id);

  const initials = organization.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="card flex flex-col items-center text-center">
      {/* Banner / Cover Photo + centered Avatar */}
      <div className="relative w-full h-28">
        {coverPhoto ? (
          <div
            className="w-full h-full rounded-t-lg bg-cover bg-center"
            style={{ backgroundImage: `url(${coverPhoto})` }}
          />
        ) : (
          <div className="w-full h-full bg-brand/20 rounded-t-lg" />
        )}

        {/* Avatar / Profile Picture — always centered on the banner */}
        {profilePicture ? (
          <img
            src={profilePicture}
            alt={organization.name}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-4 border-bg object-cover"
          />
        ) : (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-bg-light border-4 border-bg flex items-center justify-center text-2xl font-bold text-brand select-none">
            {initials}
          </div>
        )}
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
