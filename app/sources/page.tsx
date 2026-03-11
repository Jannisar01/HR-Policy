import { WorkspacePage } from "@/components/layout/workspace-page";
import { EmptyState } from "@/components/states/empty-state";
import { SectionHeader } from "@/components/states/section-header";
import { Card } from "@/components/ui/card";

export default function SourcesPage() {
  return (
    <WorkspacePage>
      <SectionHeader
        eyebrow="Knowledge"
        title="Sources"
        description="Manage approved policy repositories, freshness checks, and authority tiers used by the assistant."
      />

      <Card className="rounded-2xl p-6">
        <h3 className="text-base font-semibold">Source registry</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {/* TODO: Bind to source-registry records and show sync status, owner, and trust tier. */}
          This table will show policy domains, trust tiers, and ingestion timestamps.
        </p>
        <div className="mt-5 h-56 rounded-xl border border-dashed border-border bg-muted/30" />
      </Card>

      <EmptyState
        title="No pending source approvals"
        description="When new policy URLs are submitted, review tasks will appear here for governance approval."
      />
    </WorkspacePage>
  );
}
