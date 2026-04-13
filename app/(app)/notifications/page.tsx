'use client'

import PagebarContent from "@/components/pagebar/PagebarContent";
import { PagebarList, PagebarListItem, PagebarSection, PagebarStat } from "@/components/pagebar/PagebarSection";

export default function Page() {
  return (
    <div className="page">
      <PagebarContent title="Notifications">
        <PagebarSection eyebrow="Inbox" title="Filter feed">
          <div className="grid grid-cols-3 gap-2">
            <PagebarStat label="All" value="24" tone="accent" />
            <PagebarStat label="Unread" value="6" />
            <PagebarStat label="Saved" value="3" />
          </div>
        </PagebarSection>

        <PagebarSection eyebrow="Views" title="Quick filters">
          <PagebarList>
            <PagebarListItem active title="All notifications" meta="Everything in one stream" />
            <PagebarListItem title="Unread first" meta="Prioritize items that need a response" />
            <PagebarListItem title="Mentions and invites" meta="Focus on direct interaction" />
          </PagebarList>
        </PagebarSection>
      </PagebarContent>
      <h1 className="text-3xl lg:text-5xl font-bold text-text mb-6">Notifications</h1>
    </div>
  );
}
