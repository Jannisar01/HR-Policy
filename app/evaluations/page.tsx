import { WorkspacePage } from "@/components/layout/workspace-page";
import { LoadingGrid } from "@/components/states/loading-grid";
import { SectionHeader } from "@/components/states/section-header";
import { Card } from "@/components/ui/card";

export default function EvaluationsPage() {
  return (
    <WorkspacePage>
      <SectionHeader
        eyebrow="Quality"
        title="Evaluations"
        description="Monitor answer quality, citation relevance, and drift across your benchmark policy prompts."
      />

      <Card className="rounded-2xl p-6">
        <h3 className="text-base font-semibold">Evaluation pipeline</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {/* TODO: Pull run history and benchmark scores from evaluation service. */}
          Pending baseline run for March release candidate.
        </p>
      </Card>

      <LoadingGrid />
    </WorkspacePage>
  );
}
