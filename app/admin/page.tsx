import { WorkspacePage } from "@/components/layout/workspace-page";
import { ErrorState } from "@/components/states/error-state";
import { SectionHeader } from "@/components/states/section-header";
import { Card } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <WorkspacePage>
      <SectionHeader
        eyebrow="Governance"
        title="Admin"
        description="Configure access controls, escalation workflows, and compliance guardrails for HR policy operations."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl p-6">
          <h3 className="text-base font-semibold">Role permissions</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {/* TODO: Integrate SSO roles and RBAC policies from identity provider. */}
            Configure who can approve sources, publish prompts, and view evaluation data.
          </p>
        </Card>
        <Card className="rounded-2xl p-6">
          <h3 className="text-base font-semibold">Escalation routes</h3>
          <p className="mt-2 text-sm text-muted-foreground">Route uncertain answers to HR Ops, Legal, or Compliance reviewers.</p>
        </Card>
      </div>

      <ErrorState
        title="Admin API not connected"
        description="This is an initial scaffold. Hook into your identity and workflow services to activate controls."
      />
    </WorkspacePage>
  );
}
