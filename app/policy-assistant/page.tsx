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

      <Card className="rounded-2xl p-5">
        <label className="text-sm font-medium" htmlFor="policy-question">
          Ask a policy question
        </label>
        <textarea
          id="policy-question"
          className="mt-2 min-h-32 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring-2"
          placeholder="Example: What documentation is required before approving intermittent FMLA leave?"
        />
        <div className="mt-4 flex justify-end">
          <Button onClick={() => setLoading((state) => !state)}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate response
          </Button>
        </div>
      </Card>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 lg:grid-cols-2">
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
