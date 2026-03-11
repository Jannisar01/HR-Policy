import { rankEvidenceByAuthority } from "@/lib/policy/retrieval";
import type { PolicyAnswer, RetrievedPolicyExcerpt } from "@/lib/types/policy";

function hasWeakEvidence(evidence: RetrievedPolicyExcerpt[]) {
  return evidence.length === 0 || evidence.every((item) => item.evidenceStrength === "weak");
}

export function buildPolicyAnswer(question: string, evidence: RetrievedPolicyExcerpt[]): PolicyAnswer {
  if (hasWeakEvidence(evidence)) {
    return {
      status: "uncertain",
      answer:
        "I cannot provide a reliable answer from approved policy sources for this question yet.",
      rationale:
        "Insufficient grounded evidence was found. Escalate to UW Oshkosh HR for official interpretation.",
      citations: []
    };
  }

  const ranked = rankEvidenceByAuthority(evidence);
  const top = ranked[0];

  const conflictingHighAuthority = ranked.some(
    (item) => item !== top && item.source.tier === top.source.tier && item.excerpt !== top.excerpt
  );

  if (conflictingHighAuthority) {
    return {
      status: "escalate",
      answer: "Approved sources contain potentially conflicting guidance at the same authority level.",
      rationale:
        "To avoid incorrect policy interpretation, this should be reviewed by HR compliance staff.",
      citations: ranked.map((item) => ({
        title: item.source.title,
        url: item.source.url,
        tier: item.source.tier
      }))
    };
  }

  return {
    status: "answer",
    answer: `Based on approved sources, the controlling guidance comes from ${top.source.owner} (${top.source.tier}). ${top.excerpt}`,
    rationale:
      "Higher-authority sources are prioritized over lower-level institutional or department procedures.",
    citations: ranked.map((item) => ({
      title: item.source.title,
      url: item.source.url,
      tier: item.source.tier
    }))
  };
}
