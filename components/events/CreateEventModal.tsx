'use client'

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { api, Organization, Attachment } from "@/lib/api";

interface CreateEventModalProps {
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; attachment: Attachment | null; organizationId: number; startDate: string; ageLimit: number }) => Promise<void>;
  error?: string | null;
}

export default function CreateEventModal({ onClose, onSubmit, error }: CreateEventModalProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    api.getOrganizations().then((data) => {
      const orgs = Array.isArray(data) ? data : JSON.parse(data as unknown as string);
      setOrganizations(orgs);
    });
  }, []);

  return (
    <Modal
      title="Create New Event"
      submitLabel="Create Event"
      submittingLabel="Creating…"
      onClose={onClose}
      error={error}
      onSubmit={async (values) => {
        await onSubmit({
          title: values.title,
          description: values.description,
          attachment: values.image,
          organizationId: values.organization,
          startDate: values.startDate,
          ageLimit: values.ageLimit === "" ? 0 : Number(values.ageLimit),
        });
      }}
      fields={[
        {
          type: "text",
          name: "title",
          label: "Title",
          placeholder: "Event title",
          required: true,
        },
        {
          type: "dropdown",
          name: "organization",
          label: "Organization",
          required: true,
          options: organizations.map((org) => ({ value: org.id, label: org.name })),
        },
        {
          type: "textarea",
          name: "description",
          label: "Description",
          placeholder: "Describe your event (optional)",
          rows: 4,
        },
        {
          type: "date",
          name: "startDate",
          label: "Start Date",
          required: true,
        },
        {
          type: "number",
          name: "ageLimit",
          label: "Age Limit",
          placeholder: "0 = no limit",
          min: 0,
        },
        {
          type: "file",
          name: "image",
          label: "Image (optional)",
          accept: "image/*",
        },
      ]}
    />
  );
}