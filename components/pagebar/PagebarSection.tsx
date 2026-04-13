"use client";

import React from "react";

export function PagebarSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border/70 bg-bg-light/80 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur">
      <div className="mb-4">
        {eyebrow ? (
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-text-muted">
            {eyebrow}
          </p>
        ) : null}
        <h3 className="mt-2 text-base font-semibold text-text">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function PagebarStat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "default" | "accent" | "success";
}) {
  const toneClass =
    tone === "accent"
      ? "border-brand/40 bg-brand/12"
      : tone === "success"
        ? "border-success/40 bg-success/10"
        : "border-border/70 bg-bg/70";

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClass}`}>
      <p className="text-xs uppercase tracking-[0.18em] text-text-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold text-text">{value}</p>
    </div>
  );
}

export function PagebarAction({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl border border-border/70 bg-bg/70 px-4 py-3 text-left text-sm text-text transition hover:border-brand/50 hover:bg-highlight/40"
    >
      <span>{children}</span>
      <span className="text-text-muted">+</span>
    </button>
  );
}

export function PagebarList({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="space-y-2">{children}</div>;
}

export function PagebarListItem({
  title,
  meta,
  active = false,
}: {
  title: string;
  meta?: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 ${
        active
          ? "border-brand/45 bg-brand/12"
          : "border-border/70 bg-bg/65"
      }`}
    >
      <p className="truncate text-sm font-medium text-text">{title}</p>
      {meta ? <p className="mt-1 text-xs text-text-muted">{meta}</p> : null}
    </div>
  );
}
