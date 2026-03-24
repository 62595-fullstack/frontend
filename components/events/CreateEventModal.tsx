'use client'

import { useRef, useState, useEffect } from "react";
import { api, Organization, Attachment } from "@/lib/api";

interface NewEventData {
    title: string;
    description: string;
    attachment: Attachment | null;
    organizationId: number;
}

interface CreateEventModalProps {
    onClose: () => void;
    onSubmit: (data: NewEventData) => Promise<void>;
    error?: string | null;
}

export default function CreateEventModal({ onClose, onSubmit, error }: CreateEventModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [imageAttachment, setImageAttachment] = useState<Attachment | null>(null);
    const [titleError, setTitleError] = useState(false);
    const [orgError, setOrgError] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [organizationId, setOrganizationId] = useState<number | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        api.getOrganizations().then((data) => {
            const orgs = Array.isArray(data) ? data : JSON.parse(data as unknown as string);
            setOrganizations(orgs);
            if (orgs.length > 0 && orgs[0].id) setOrganizationId(orgs[0].id);
        });
    }, []);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            setImagePreview(dataUrl);
            setImageAttachment({
                fileName: file.name,
                fileType: file.type,
                content: dataUrl.split(",")[1],
                createdDate: new Date().toISOString(),
            });
        };
        reader.readAsDataURL(file);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let valid = true;
        if (!title.trim()) { setTitleError(true); valid = false; }
        if (!organizationId) { setOrgError(true); valid = false; }
        if (!valid) return;
        setSubmitting(true);
        await onSubmit({ title: title.trim(), description: description.trim(), attachment: imageAttachment, organizationId: organizationId! });
        setSubmitting(false);
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Create New Event</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl leading-none cursor-pointer"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Title */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-300">
                            Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => { setTitle(e.target.value); setTitleError(false); }}
                            placeholder="Event title"
                            className={`bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none border ${
                                titleError ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                            } transition-colors`}
                        />
                        {titleError && (
                            <span className="text-red-400 text-xs">Title is required.</span>
                        )}
                    </div>

                    {/* Organization */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-300">
                            Organization <span className="text-red-400">*</span>
                        </label>
                        <div ref={dropdownRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setDropdownOpen((o) => !o)}
                                className={`w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm text-left border ${
                                    orgError ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                                } transition-colors flex items-center justify-between`}
                            >
                                <span>{organizations.find((o) => o.id === organizationId)?.name ?? "No organizations available"}</span>
                                <span className="ml-2 text-gray-400">▾</span>
                            </button>
                            {dropdownOpen && organizations.length > 0 && (
                                <ul className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg">
                                    {organizations.map((org) => (
                                        <li
                                            key={org.id}
                                            onClick={() => { setOrganizationId(org.id); setOrgError(false); setDropdownOpen(false); }}
                                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 ${org.id === organizationId ? "text-blue-400" : "text-white"}`}
                                        >
                                            {org.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {orgError && (
                            <span className="text-red-400 text-xs">Organization is required.</span>
                        )}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-300">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your event (optional)"
                            rows={4}
                            className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none border border-gray-700 focus:border-blue-500 transition-colors resize-none"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-300">Image (optional)</label>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="self-start bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
                        >
                            Upload Image
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        {imagePreview && (
                            <div className="relative mt-1">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full max-h-48 object-cover rounded-lg border border-gray-700"
                                />
                                <button
                                    type="button"
                                    onClick={() => { setImagePreview(""); setImageAttachment(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm leading-none cursor-pointer"
                                    aria-label="Remove image"
                                >
                                    &times;
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="text-gray-400 hover:text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Creating…" : "Create Event"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
