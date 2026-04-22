"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { api, UserSummary } from "@/lib/api";

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "?";
}

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await api.searchUsers(trimmed);
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") search(query);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for users…"
          className="flex-1 rounded-xl bg-bg-light border border-border-muted px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-brand transition-colors"
        />
        <button
          onClick={() => search(query)}
          disabled={loading}
          className="btn-brand px-5 text-sm"
        >
          {loading ? "…" : "Search"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}

      {searched && !loading && !error && results.length === 0 && (
        <p className="text-sm text-text-muted">No users found.</p>
      )}

      {results.length > 0 && (
        <ul className="space-y-2">
          {results.map((user) => (
            <li key={user.id}>
              <Link
                href={`/profile/${user.id}`}
                className="flex items-center gap-3 rounded-xl bg-bg-light border border-border-muted px-4 py-3 hover:bg-highlight transition-colors group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/20 text-sm font-bold text-brand">
                  {getInitials(user.firstName, user.lastName)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text group-hover:text-brand transition-colors">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-text-muted truncate">{user.email}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-text-muted group-hover:text-brand transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
