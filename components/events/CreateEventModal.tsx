'use client'

import { useRef, useState } from "react";

interface NewEventData {
    title: string;
    description: string;
    imageUrl: string;
}

interface CreateEventModalProps {
    onClose: () => void;
    onSubmit: (data: NewEventData) => void;
}

export default function CreateEventModal({ onClose, onSubmit }: CreateEventModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [titleError, setTitleError] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            setImageUrl(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) {
            setTitleError(true);
            return;
        }
        onSubmit({ title: title.trim(), description: description.trim(), imageUrl });
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
                        {imageUrl && (
                            <div className="relative mt-1">
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="w-full max-h-48 object-cover rounded-lg border border-gray-700"
                                />
                                <button
                                    type="button"
                                    onClick={() => { setImageUrl(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm leading-none cursor-pointer"
                                    aria-label="Remove image"
                                >
                                    &times;
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 hover:text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer"
                        >
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
