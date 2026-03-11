"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { WorkspacePage } from "@/components/layout/workspace-page";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { SectionHeader } from "@/components/states/section-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PolicyAssistantPage() {
  const [loading, setLoading] = useState(false);

  return (
    <WorkspacePage>
      <SectionHeader
        eyebrow="Assistant"
        title="Policy Assistant"
        description="Draft grounded responses with source-first confidence indicators and built-in escalation handling."
        actions={<Button>New Session</Button>}
      />

      <Card className="surface-elevated p-6">
        <div className="mb-4 flex items-center justify-between">
          <label className="text-sm font-semibold" htmlFor="policy-question">
            Ask a policy question
          </label>
          <span className="rounded-md border border-border/70 bg-muted/70 px-2 py-1 text-xs text-muted-foreground">AI chat</span>
        </div>
        <textarea
          id="policy-question"
          className="focus-ring min-h-36 w-full rounded-xl border border-border/70 bg-background px-3 py-2.5 text-sm leading-6 transition placeholder:text-muted-foreground/80"
          placeholder="Example: What documentation is required before approving intermittent FMLA leave?"
        />
        <div className="mt-4 flex justify-end">
          <Button onClick={() => setLoading((state) => !state)}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate response
          </Button>
        </div>
      </Card>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5 lg:grid-cols-2">
        <EmptyState
          title="No generated answer yet"
          description="Generated responses will appear here with confidence score, policy rationale, and citation links."
        />
        <ErrorState
          title="Demo integration note"
          description="This scaffold uses placeholders only. Connect this page to /api/ask and your source index when backend wiring begins."
        />
      </motion.div>
    </WorkspacePage>
  );
}
