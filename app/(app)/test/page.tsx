"use client";

import { useMemo, useState } from "react";
import {
  api,
  Organization,
  Post,
  OrganizationEvent,
  UserOrganizationBinding,
} from "@/lib/api";

// import { mockPosts } from "@/lib/mockPosts";

type CallResult = {
  ok: boolean;
  statusText: string;
  ms: number;
  data?: unknown;
  error?: string;
};

function nowMs() {
  return (typeof performance !== "undefined" ? performance.now() : Date.now());
}

export default function TestPage() {
  const [organizationId, setOrganizationId] = useState<number>(1);
  const [userId, setUserId] = useState<number>(1);

  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const [organizationsRes, setOrganizationsRes] = useState<CallResult | null>(
    null
  );
  const [organizationByIdRes, setOrganizationByIdRes] =
    useState<CallResult | null>(null);
  const [deleteOrganizationRes, setDeleteOrganizationRes] =
    useState<CallResult | null>(null);

  const [postsRes, setPostsRes] = useState<CallResult | null>(null);
  const [postsByOrgRes, setPostsByOrgRes] = useState<CallResult | null>(null);

  const [eventsRes, setEventsRes] = useState<CallResult | null>(null);
  const [bindingsRes, setBindingsRes] = useState<CallResult | null>(null);

  const [gdprRes, setGdprRes] = useState<CallResult | null>(null);

  // This toggle, uncomment mockPosts import above and this state
  // const [useMockPosts, setUseMockPosts] = useState(false);

  const canCall = useMemo(() => loadingKey === null, [loadingKey]);

  async function run<T>(key: string, fn: () => Promise<T>): Promise<CallResult> {
    setLoadingKey(key);
    const start = nowMs();
    try {
      const data = await fn();
      const ms = Math.round(nowMs() - start);
      return { ok: true, statusText: "OK", ms, data };
    } catch (e: unknown) {
      const ms = Math.round(nowMs() - start);
      return {
        ok: false,
        statusText: "ERROR",
        ms,
        error: (e as Error)?.message ?? String(e),
      };
    } finally {
      setLoadingKey(null);
    }
  }

  const blackStyle: React.CSSProperties = { color: "black" };
  const cardStyle: React.CSSProperties = {
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    background: "white",
  };
  const btnStyle: React.CSSProperties = {
    border: "1px solid #aaa",
    padding: "8px 10px",
    borderRadius: 8,
    background: canCall ? "white" : "#f4f4f4",
    cursor: canCall ? "pointer" : "not-allowed",
  };
  const inputStyle: React.CSSProperties = {
    border: "1px solid #aaa",
    borderRadius: 8,
    padding: "6px 8px",
    width: 120,
  };

  function ResultView({ result }: { result: CallResult | null }) {
    if (!result) return <div style={blackStyle}>No result yet.</div>;
    return (
      <div style={blackStyle}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <strong>{result.ok ? "✅ Success" : "❌ Failed"}</strong>
          <span>{result.statusText}</span>
          <span>{result.ms}ms</span>
        </div>
        <pre style={{ ...blackStyle, marginTop: 10, whiteSpace: "pre-wrap" }}>
          {JSON.stringify(result.ok ? result.data : { error: result.error }, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div style={{ ...blackStyle, padding: 20, maxWidth: 1100 }}>
      <h1 style={blackStyle}>Backend API Test Console</h1>

      {/* Controls */}
      <div style={{ ...cardStyle }}>
        <h2 style={blackStyle}>Inputs</h2>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span>organizationId</span>
            <input
              style={inputStyle}
              type="number"
              value={organizationId}
              onChange={(e) => setOrganizationId(Number(e.target.value))}
            />
          </label>

          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span>userId</span>
            <input
              style={inputStyle}
              type="number"
              value={userId}
              onChange={(e) => setUserId(Number(e.target.value))}
            />
          </label>

          {/* Uncomment if you want mock toggle */}
          {/*
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={useMockPosts}
              onChange={(e) => setUseMockPosts(e.target.checked)}
            />
            <span>Use mock posts</span>
          </label>
          */}
        </div>

        <div style={{ marginTop: 12, opacity: 0.8 }}>
          {loadingKey ? (
            <span>Running: <strong>{loadingKey}</strong>…</span>
          ) : (
            <span>Idle</span>
          )}
        </div>
      </div>

      {/* Organizations */}
      <div style={cardStyle}>
        <h2 style={blackStyle}>Organizations</h2>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            style={btnStyle}
            disabled={!canCall}
            onClick={async () =>
              setOrganizationsRes(
                await run<Organization[]>("getOrganizations", api.getOrganizations)
              )
            }
          >
            GET /organizations
          </button>

          <button
            style={btnStyle}
            disabled={!canCall}
            onClick={async () =>
              setOrganizationByIdRes(
                await run<Organization>(
                  "getOrganizationById",
                  () => api.getOrganizationById(organizationId)
                )
              )
            }
          >
            GET /organizations/{`{id}`}
          </button>

          <button
            style={btnStyle}
            disabled={!canCall}
            onClick={async () =>
              setDeleteOrganizationRes(
                await run<boolean>(
                  "deleteOrganization",
                  () => api.deleteOrganization(organizationId)
                )
              )
            }
          >
            DELETE /organizations/{`{id}`}
          </button>
        </div>

        <h3 style={{ ...blackStyle, marginTop: 16 }}>GET /organizations</h3>
        <ResultView result={organizationsRes} />

        <h3 style={{ ...blackStyle, marginTop: 16 }}>
          GET /organizations/{`{id}`}
        </h3>
        <ResultView result={organizationByIdRes} />

        <h3 style={{ ...blackStyle, marginTop: 16 }}>
          DELETE /organizations/{`{id}`}
        </h3>
        <ResultView result={deleteOrganizationRes} />
      </div>

      {/* Posts */}
      <div style={cardStyle}>
        <h2 style={blackStyle}>Posts</h2>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            style={btnStyle}
            disabled={!canCall}
            onClick={async () => {
              // If you enable mock toggle:
              // if (useMockPosts) return setPostsRes({ ok: true, statusText: "MOCK", ms: 0, data: mockPosts });

              setPostsRes(await run<Post[]>("getPosts", api.getPosts));
            }}
          >
            GET /posts
          </button>

          <button
            style={btnStyle}
            disabled={!canCall}
            onClick={async () =>
              setPostsByOrgRes(
                await run<Post[]>(
                  "getPostsByOrganization",
                  () => api.getPostsByOrganization(organizationId)
                )
              )
            }
          >
            GET /posts/{`{organizationId}`}
          </button>
        </div>

        <h3 style={{ ...blackStyle, marginTop: 16 }}>GET /posts</h3>
        <ResultView result={postsRes} />

        <h3 style={{ ...blackStyle, marginTop: 16 }}>
          GET /posts/{`{organizationId}`}
        </h3>
        <ResultView result={postsByOrgRes} />
      </div>

      {/* Events + Bindings */}
      <div style={cardStyle}>
        <h2 style={blackStyle}>Events & Bindings</h2>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            style={btnStyle}
            disabled={!canCall}
            onClick={async () =>
              setEventsRes(
                await run<OrganizationEvent[]>(
                  "getOrganizationEvents",
                  () => api.getOrganizationEvents(organizationId)
                )
              )
            }
          >
            GET /OrganizationEvents/{`{organizationId}`}
          </button>

          <button
            style={btnStyle}
            disabled={!canCall}
            onClick={async () =>
              setBindingsRes(
                await run<UserOrganizationBinding[]>(
                  "getUserOrganizationBindings",
                  () => api.getUserOrganizationBindings(organizationId)
                )
              )
            }
          >
            GET /UserOrganizationBinding/{`{organizationId}`}
          </button>
        </div>

        <h3 style={{ ...blackStyle, marginTop: 16 }}>
          GET /OrganizationEvents/{`{organizationId}`}
        </h3>
        <ResultView result={eventsRes} />

        <h3 style={{ ...blackStyle, marginTop: 16 }}>
          GET /UserOrganizationBinding/{`{organizationId}`}
        </h3>
        <ResultView result={bindingsRes} />
      </div>

      {/* GDPR */}
      <div style={cardStyle}>
        <h2 style={blackStyle}>GDPR</h2>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            style={btnStyle}
            disabled={!canCall}
            onClick={async () =>
              setGdprRes(
                await run<boolean>(
                  "deleteGdprByUserId",
                  () => api.deleteGdprByUserId(userId)
                )
              )
            }
          >
            DELETE /GDPR/{`{userId}`}
          </button>
        </div>

        <h3 style={{ ...blackStyle, marginTop: 16 }}>
          DELETE /GDPR/{`{userId}`}
        </h3>
        <ResultView result={gdprRes} />
      </div>
    </div>
  );
}