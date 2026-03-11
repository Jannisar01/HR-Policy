"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, BookOpen, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PolicyAnswer } from "@/lib/types/policy";

export default function HomePage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PolicyAnswer | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });

      if (!response.ok) {
        throw new Error("Unable to process request with approved policy pipeline.");
      }

      const payload = (await response.json()) as { data: PolicyAnswer };
      setResult(payload.data);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-slate-600">
          <ShieldCheck className="h-3.5 w-3.5" />
          Approved-source HR policy assistant
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">UW Oshkosh HR Policy Assistant</h1>
        <p className="max-w-3xl text-slate-600">
          Answers are grounded in approved policy URLs with authority-aware source hierarchy and safe
          escalation when evidence is weak or conflicting.
        </p>
      </header>

      <Card className="p-5">
        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="text-sm font-medium" htmlFor="question">
            Ask an HR policy question
          </label>
          <textarea
            id="question"
            className="min-h-28 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring-2"
            placeholder="Example: How does Wisconsin FMLA interact with federal FMLA for eligible employees?"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
          />
          <Button disabled={loading || question.length < 5} size="lg" type="submit">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate grounded answer
          </Button>
        </form>
      </Card>

      {error ? (
        <Card className="border-red-200 bg-red-50 p-4 text-red-700">
          <p className="inline-flex items-center gap-2 text-sm font-medium">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        </Card>
      ) : null}

      {result ? (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4"
        >
          <Card className="p-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Status</p>
            <p className="text-sm font-medium">{result.status}</p>
            <p className="mt-3 text-lg leading-relaxed">{result.answer}</p>
            <p className="mt-3 text-sm text-slate-600">{result.rationale}</p>
          </Card>

          <Card className="p-5">
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-medium">
              <BookOpen className="h-4 w-4" />
              Citations
            </p>
            <ul className="space-y-2 text-sm">
              {result.citations.length === 0 ? (
                <li className="text-slate-500">No reliable citations were available for this answer.</li>
              ) : (
                result.citations.map((citation) => (
                  <li className="rounded-md border bg-white p-3" key={`${citation.url}-${citation.tier}`}>
                    <p className="font-medium">{citation.title}</p>
                    <p className="text-xs uppercase text-slate-500">Tier: {citation.tier}</p>
                    <a className="text-primary underline" href={citation.url} rel="noreferrer" target="_blank">
                      {citation.url}
                    </a>
                  </li>
                ))
              )}
            </ul>
          </Card>
        </motion.section>
      ) : (
        <Card className="p-6 text-sm text-slate-500">
          Ask a question to see a grounded response, citations, and escalation behavior.
        </Card>
      )}
    </main>
  );
}
