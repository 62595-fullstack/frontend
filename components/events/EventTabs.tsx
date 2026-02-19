"use client";

import { useState } from "react";

const tabs = ["Overview", "Bracket", "Participants", "Rules"] as const;
type Tab = (typeof tabs)[number];

export default function EventTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  return (
    <>
      <div className="mt-4 flex items-center gap-8 border-b border-gray-300">
        {tabs.map((t) => {
          const active = t === activeTab;

          return (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={[
                "pb-3 text-base font-semibold transition-colors",
                "border-b-2 -mb-px",
                active
                  ? "text-black border-black"
                  : "text-gray-600 border-transparent hover:text-black",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* optional: switch panel content based on activeTab */}
      <div className="mt-3 overflow-hidden rounded-lg bg-gray-200">
        <div className="h-6 bg-sky-200" />
        <div className="h-[560px]" />
      </div>
    </>
  );
}
