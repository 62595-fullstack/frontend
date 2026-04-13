'use client'

import { useState, useEffect } from "react";
import CreateOrganizationModal from "@/components/organizations/CreateOrganizationModal";
import OrganizationCard from "@/components/organizations/OrganizationCard";
import CreateButton from "@/components/ui/CreateButton";
import PagebarContent from "@/components/pagebar/PagebarContent";
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

  return (
    <div className="page">
      <PagebarContent title="Organizations">
        <h2>Organizations pagebar</h2>
      </PagebarContent>

      {/* Header row */}
      <div className="flex items-center w-full max-w-5xl mb-6">
        <h1 className="text-5xl font-bold flex-1 text-center">Organizations</h1>
        <CreateButton onClick={() => setShowModal(true)} label="organization"/>
      </div>

      {loadError && <p className="text-danger text-sm mb-4">{loadError}</p>}

      {/* Card grid */}
      <div className="w-full max-w-5xl flex-1 min-h-0 overflow-hidden">
        <div
          className="overflow-y-auto h-full p-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {organizations.map((org) => (
              <OrganizationCard key={org.id} organization={org} />
            ))}
          </div>
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
