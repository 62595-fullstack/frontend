'use client'

import { useState, useEffect } from "react";
import CreateOrganizationModal from "@/components/organizations/CreateOrganizationModal";
import CreateButton from "@/components/ui/CreateButton";
import PagebarContent from "@/components/pagebar/PagebarContent";
import { PagebarAction, PagebarList, PagebarListItem, PagebarSection, PagebarStat } from "@/components/pagebar/PagebarSection";
import { api, Organization } from "@/lib/api";

export default function Page() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    api.getOrganizations()
      .then((data) => {
        console.log("organizations:", data);
        setOrganizations(Array.isArray(data) ? data : []);
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load organizations."));
  }, []);

  async function handleCreate(data: { name: string; description: string }) {
    setCreateError(null);
    try {
      await api.createOrganization(data);
      const updated = await api.getOrganizations();
      setOrganizations(Array.isArray(updated) ? updated : []);
      setShowModal(false);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create organization.");
    }
  }

  const describedCount = organizations.filter((org) => org.description?.trim()).length;
  const newestOrganizations = organizations.slice(0, 3);

  return (
    <div className="page">
      <PagebarContent title="Organizations">
        <PagebarSection eyebrow="Overview" title="Network health">
          <div className="grid grid-cols-2 gap-3">
            <PagebarStat label="Organizations" value={organizations.length} tone="accent" />
            <PagebarStat label="With bio" value={describedCount} />
          </div>
        </PagebarSection>

        <PagebarSection eyebrow="Actions" title="Organization tools">
          <PagebarAction onClick={() => setShowModal(true)}>Create organization</PagebarAction>
          <PagebarAction>Invite collaborators</PagebarAction>
        </PagebarSection>

        <PagebarSection eyebrow="Directory" title="Recently loaded">
          {newestOrganizations.length > 0 ? (
            <PagebarList>
              {newestOrganizations.map((org, index) => (
                <PagebarListItem
                  key={org.id}
                  active={index === 0}
                  title={org.name}
                  meta={org.description?.trim() || "No description yet"}
                />
              ))}
            </PagebarList>
          ) : (
            <p className="text-sm text-text-muted">
              Organizations will show here after the first successful fetch.
            </p>
          )}
        </PagebarSection>
      </PagebarContent>

      {/* Header row */}
      <div className="flex items-center w-full max-w-5xl mb-6">
        <div className="w-12 flex-shrink-0" />
        <h1 className="text-3xl lg:text-5xl font-bold flex-1 text-center">Organizations</h1>
        <CreateButton onClick={() => setShowModal(true)} label="organization"/>
      </div>

      {loadError && <p className="text-danger text-sm mb-4">{loadError}</p>}

      {/* Scrollable list */}
      <div className="w-full max-w-5xl flex-1 min-h-0 rounded-lg overflow-hidden">
        <div
          className="overflow-y-auto h-full space-y-4 p-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {organizations.map((org) => (
            <div key={org.id} className="bg-gray-800 rounded-lg p-5 shadow-lg">
              <h2 className="text-xl font-bold text-white">{org.name}</h2>
              {org.description && (
                <p className="text-gray-300 text-sm mt-2">{org.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <CreateOrganizationModal
          onClose={() => { setShowModal(false); setCreateError(null); }}
          onSubmit={handleCreate}
          error={createError}
        />
      )}
    </div>
  );
}
