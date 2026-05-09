'use client'

import { useEffect, useMemo, useState } from "react";
import { useEvent } from "@/components/events/EventContext";
import { api, EventComment } from "@/lib/api";
import MessageInput from "@/components/MessageInput";

type CommentNode = EventComment & { children: CommentNode[] };

function buildTree(comments: EventComment[]): CommentNode[] {
  const byId = new Map<number, CommentNode>();
  comments.forEach((c) => byId.set(c.id, { ...c, children: [] }));

  const roots: CommentNode[] = [];
  byId.forEach((node) => {
    if (node.parentCommentId && byId.has(node.parentCommentId)) {
      byId.get(node.parentCommentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortByDate = (nodes: CommentNode[]) => {
    nodes.sort((a, b) => a.createdDate.localeCompare(b.createdDate));
    nodes.forEach((n) => sortByDate(n.children));
  };
  sortByDate(roots);

  return roots;
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CommentItem({
  node,
  depth,
  authorNames,
  onReply,
  replyingTo,
  onSubmitReply,
  onCancelReply,
  submitting,
}: {
  node: CommentNode;
  depth: number;
  authorNames: Record<string, string>;
  onReply: (id: number) => void;
  replyingTo: number | null;
  onSubmitReply: (parentId: number, content: string) => Promise<void>;
  onCancelReply: () => void;
  submitting: boolean;
}) {
  const [draft, setDraft] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const isReplying = replyingTo === node.id;
  const hasChildren = node.children.length > 0;

  return (
    <div
      className="relative pl-4"
      style={{ marginLeft: depth === 0 ? 0 : 12 }}
    >
      {hasChildren ? (
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand replies" : "Collapse replies"}
          className="group absolute left-0 inset-y-0 w-4 cursor-pointer"
        >
          <span className="absolute left-0 top-3.5 bottom-0 w-px bg-border-muted group-hover:bg-text transition-colors" />
          <span
            aria-hidden="true"
            className="absolute -left-2 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-bg text-base leading-none text-text-muted group-hover:text-text transition-colors"
          >
            {collapsed ? "▸" : "▾"}
          </span>
        </button>
      ) : (
        <span className="absolute left-0 inset-y-0 w-px bg-border-muted" />
      )}
      <div className="py-2">
        <div className="flex items-baseline gap-2 text-xs text-text-muted">
          <span className="font-semibold text-text">
            {authorNames[node.authorUserId] ?? "Unknown user"}
          </span>
          <span>{formatDate(node.createdDate)}</span>
          {hasChildren && collapsed && (
            <span className="text-text-muted">
              · {node.children.length} {node.children.length === 1 ? "reply" : "replies"} hidden
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-text whitespace-pre-wrap">{node.content}</p>
        <button
          onClick={() => onReply(node.id)}
          className="mt-1 text-xs text-text-muted hover:text-text transition-colors"
        >
          Reply
        </button>

        {isReplying && (
          <div className="mt-2">
            <MessageInput
              value={draft}
              onChange={setDraft}
              onSend={async () => {
                await onSubmitReply(node.id, draft.trim());
                setDraft("");
              }}
              onBlur={() => {
                setDraft("");
                onCancelReply();
              }}
              placeholder="Write a reply…"
              sendLabel={submitting ? "Posting…" : "Reply"}
              disabled={submitting}
              autoFocus
            />
          </div>
        )}
      </div>

      {hasChildren && !collapsed && (
        <div className="ml-2">
          {node.children.map((child) => (
            <CommentItem
              key={child.id}
              node={child}
              depth={depth + 1}
              authorNames={authorNames}
              onReply={onReply}
              replyingTo={replyingTo}
              onSubmitReply={onSubmitReply}
              onCancelReply={onCancelReply}
              submitting={submitting}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentsTab() {
  const event = useEvent();
  const [comments, setComments] = useState<EventComment[]>([]);
  const [authorNames, setAuthorNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  useEffect(() => {
    if (!event) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const rows = await api.getEventComments(event.id);
        if (!cancelled) setComments(rows ?? []);
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "Failed to load comments.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [event]);

  useEffect(() => {
    const missing = Array.from(new Set(comments.map((c) => c.authorUserId)))
      .filter((id) => id && !(id in authorNames));
    if (missing.length === 0) return;

    let cancelled = false;
    Promise.all(
      missing.map((id) =>
        api.getUserById(id)
          .then((u) => [id, `${u.firstName} ${u.lastName}`.trim() || "Unknown user"] as const)
          .catch(() => [id, "Unknown user"] as const)
      )
    ).then((entries) => {
      if (cancelled) return;
      setAuthorNames((prev) => {
        const next = { ...prev };
        for (const [id, name] of entries) next[id] = name;
        return next;
      });
    });
    return () => { cancelled = true; };
  }, [comments, authorNames]);

  const tree = useMemo(() => buildTree(comments), [comments]);

  async function postTopLevel() {
    if (!event || !draft.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await api.createEventComment(event.id, draft.trim(), null);
      setComments((prev) => [...prev, created]);
      setDraft("");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  }

  async function postReply(parentId: number, content: string) {
    if (!event) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await api.createEventComment(event.id, content, parentId);
      setComments((prev) => [...prev, created]);
      setReplyingTo(null);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to post reply.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-lg bg-bg">
      <div className="h-10 bg-bg-dark px-6 py-2 underline text-text">Comments</div>
      <div className="p-6 text-text">
        <div className="flex flex-col gap-2">
          <MessageInput
            value={draft}
            onChange={setDraft}
            onSend={postTopLevel}
            placeholder="Add a comment…"
            sendLabel={submitting ? "Posting…" : "Post"}
            disabled={submitting}
          />
          {submitError && <p className="text-sm text-danger">{submitError}</p>}
        </div>

        <div className="mt-6">
          {loading && <p className="text-sm text-text-muted">Loading comments…</p>}
          {loadError && <p className="text-sm text-danger">{loadError}</p>}
          {!loading && !loadError && tree.length === 0 && (
            <p className="text-sm text-text-muted">No comments yet. Be the first to post.</p>
          )}
          {!loading && !loadError && tree.length > 0 && (
            <div className="flex flex-col gap-2">
              {tree.map((node) => (
                <CommentItem
                  key={node.id}
                  node={node}
                  depth={0}
                  authorNames={authorNames}
                  onReply={(id) => setReplyingTo(id)}
                  replyingTo={replyingTo}
                  onSubmitReply={postReply}
                  onCancelReply={() => setReplyingTo(null)}
                  submitting={submitting}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
