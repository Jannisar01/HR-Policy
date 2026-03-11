import { WorkspacePage } from "@/components/layout/workspace-page";
import { SectionHeader } from "@/components/states/section-header";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <WorkspacePage>
      <SectionHeader
        eyebrow="Configuration"
        title="Settings"
        description="Customize workspace defaults, notifications, and behavior for policy answering and review operations."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-base font-semibold">Assistant defaults</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Configure confidence thresholds, citation depth, and escalation behavior.
          </p>
          <div className="mt-4 h-36 rounded-xl border border-dashed border-border bg-muted/30" />
        </Card>
        <Card className="rounded-2xl p-6">
          <h3 className="text-base font-semibold">Notifications</h3>
          <p className="mt-2 text-sm text-muted-foreground">Digest schedules, alert channels, and run completion messages.</p>
        </Card>
      </div>
    </WorkspacePage>
  );
}
