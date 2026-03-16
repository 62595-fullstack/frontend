'use client'

import { useState } from "react";

interface CreateOrganizationModalProps {
    onClose: () => void;
    onSubmit: (data: { name: string; description: string }) => Promise<void>;
    error?: string | null;
}

export default function CreateOrganizationModal({ onClose, onSubmit, error }: CreateOrganizationModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [nameError, setNameError] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) {
            setNameError(true);
            return;
        }
        setSubmitting(true);
        await onSubmit({ name: name.trim(), description: description.trim() });
        setSubmitting(false);
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Create New Organization</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl leading-none cursor-pointer"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-300">
                            Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setNameError(false); }}
                            placeholder="Organization name"
                            className={`bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none border ${
                                nameError ? "border-red-500" : "border-gray-700 focus:border-blue-500"
                            } transition-colors`}
                        />
                        {nameError && (
                            <span className="text-red-400 text-xs">Name is required.</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-300">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the organization (optional)"
                            rows={4}
                            className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none border border-gray-700 focus:border-blue-500 transition-colors resize-none"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

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
                            {submitting ? "Creating…" : "Create Organization"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
