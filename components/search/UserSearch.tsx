"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { api, UserSearchResult } from "@/lib/api";

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "?";
}

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setOpen(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const data = await api.searchUsers(trimmed);
        setResults(Array.isArray(data) ? data : []);
        setOpen(true);
        setActiveIndex(-1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigateTo = (userId: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/users/${userId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      navigateTo(results[activeIndex].id);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder="Search for users…"
          autoComplete="off"
          className="w-full rounded-xl bg-bg-light border border-border-muted px-4 py-2.5 pr-10 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-brand transition-colors"
        />
        <div className="pointer-events-none absolute right-3 text-text-muted">
          {loading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
            </svg>
          )}
        </div>
      </div>

      {showDropdown && (
        <div className="absolute z-20 mt-1 w-full rounded-xl bg-bg-light border border-border-muted shadow-lg overflow-hidden">
          {error && (
            <p className="px-4 py-3 text-sm text-danger">{error}</p>
          )}
          {!error && results.length === 0 && !loading && (
            <p className="px-4 py-3 text-sm text-text-muted">No users found.</p>
          )}
          {!error && results.map((user, i) => (
            <button
              key={user.id}
              onMouseDown={() => navigateTo(user.id)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                i === activeIndex ? "bg-highlight" : "hover:bg-highlight"
              } ${i > 0 ? "border-t border-border-muted" : ""}`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/20 text-sm font-bold text-brand">
                {getInitials(user.firstName, user.lastName)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
