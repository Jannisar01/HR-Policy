import { approvedPolicySources, policyTierRank } from "@/lib/policy/source-registry";
import type { RetrievedPolicyExcerpt } from "@/lib/types/policy";

export async function retrieveApprovedPolicyEvidence(question: string): Promise<RetrievedPolicyExcerpt[]> {
  const normalized = question.toLowerCase();

  // Production note: replace with URL ingestion + semantic retrieval from Supabase/OpenAI File Search.
  if (normalized.includes("fmla") || normalized.includes("family") || normalized.includes("medical leave")) {
    return [
      {
        source: approvedPolicySources[0],
        excerpt: "Federal FMLA provides eligible employees up to 12 weeks of unpaid, job-protected leave.",
        evidenceStrength: "strong"
      },
      {
        source: approvedPolicySources[1],
        excerpt: "Wisconsin FMLA provides state-level leave rights with different eligibility details.",
        evidenceStrength: "medium"
      }
    ];
  }

  if (normalized.includes("department") || normalized.includes("local procedure")) {
    return [
      {
        source: approvedPolicySources[2],
        excerpt: "Campus HR policy pages describe institution-wide rules and process links.",
        evidenceStrength: "medium"
      }
    ];
  }

  return [];
}

export function rankEvidenceByAuthority(evidence: RetrievedPolicyExcerpt[]) {
  return [...evidence].sort(
    (a, b) => policyTierRank[b.source.tier] - policyTierRank[a.source.tier]
  );
}
