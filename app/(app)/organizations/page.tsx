'use client'

import { useState, useEffect } from "react";
import CreateOrganizationModal from "@/components/organizations/CreateOrganizationModal";
import CreateButton from "@/components/ui/CreateButton";
import PagebarContent from "@/components/pagebar/PagebarContent";
import { api, Organization } from "@/lib/api";

export default function Page() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    api.getOrganizations().then((data) => {
      setOrganizations(Array.isArray(data) ? data : JSON.parse(data as unknown as string));
    });
  }, []);

  async function handleCreate(data: { name: string; description: string }) {
    setCreateError(null);
    try {
      await api.createOrganization(data);
      const updated = await api.getOrganizations();
      setOrganizations(Array.isArray(updated) ? updated : JSON.parse(updated as unknown as string));
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
