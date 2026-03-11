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

      <Card className="p-0">
        <div className="flex items-center justify-between border-b border-border/70 px-6 py-4">
          <h3 className="text-base font-semibold">Source registry</h3>
          <span className="rounded-md border border-border/70 bg-muted/70 px-2 py-1 text-xs text-muted-foreground">3 active domains</span>
        </div>
        <div className="p-4">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Domain</th>
                <th>Trust tier</th>
                <th>Last ingestion</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Leave & Absence</td>
                <td>Tier 1</td>
                <td>2 hours ago</td>
                <td className="text-emerald-600 dark:text-emerald-400">Healthy</td>
              </tr>
              <tr>
                <td>Compensation</td>
                <td>Tier 1</td>
                <td>Yesterday</td>
                <td className="text-amber-600 dark:text-amber-400">Pending refresh</td>
              </tr>
              <tr>
                <td>Code of Conduct</td>
                <td>Tier 2</td>
                <td>3 days ago</td>
                <td className="text-muted-foreground">Monitoring</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <EmptyState
        title="No pending source approvals"
        description="When new policy URLs are submitted, review tasks will appear here for governance approval."
      />
    </WorkspacePage>
  );
}
