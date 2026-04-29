'use client'

import Modal from "@/components/ui/Modal";

interface CreateOrganizationModalProps {
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
  error?: string | null;
}

export default function CreateOrganizationModal({ onClose, onSubmit, error }: CreateOrganizationModalProps) {
  return (
    <Modal
      title="Create New Organization"
      submitLabel="Create Organization"
      submittingLabel="Creating…"
      onClose={onClose}
      error={error}
      onSubmit={async (values) => {
        await onSubmit({
          name: values.name,
          description: values.description,
        });
      }}
      fields={[
        {
          type: "text",
          name: "name",
          label: "Name",
          placeholder: "Organization name",
          required: true,
        },
        {
          type: "textarea",
          name: "description",
          label: "Description",
          placeholder: "Describe the organization (optional)",
          rows: 4,
        },
      ]}
    />
  );
}