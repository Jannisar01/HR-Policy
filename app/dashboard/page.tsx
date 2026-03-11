"use client";

import { motion } from "framer-motion";
import { MetricCard } from "@/components/dashboard/metric-card";
import { WorkspacePage } from "@/components/layout/workspace-page";
import { SectionHeader } from "@/components/states/section-header";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <WorkspacePage>
      <SectionHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Track policy assistant activity, source freshness, and operational reliability across your HR governance workspace."
      />

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Answered Queries" value="4,892" trend="+8.1% vs last month" />
        <MetricCard label="Citation Coverage" value="97.2%" trend="+1.4 points" />
        <MetricCard label="Escalation Rate" value="2.9%" trend="-0.8 points" />
        <MetricCard label="Source Freshness" value="99.1%" trend="Stable" />
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-base font-semibold">Weekly activity snapshot</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Placeholder chart area for trends. {/* TODO: Integrate analytics API for real query and satisfaction trends. */}
          </p>
          <div className="mt-5 h-60 rounded-xl border border-dashed border-border bg-muted/40" />
        </Card>

        <Card className="rounded-2xl p-6">
          <h3 className="text-base font-semibold">Governance feed</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="rounded-lg bg-muted/60 p-3">New handbook revision detected for leave policy source.</li>
            <li className="rounded-lg bg-muted/60 p-3">2 escalations pending legal review.</li>
            <li className="rounded-lg bg-muted/60 p-3">Evaluation pack ready for weekly sign-off.</li>
          </ul>
        </Card>
      </div>
    </WorkspacePage>
  );
}
