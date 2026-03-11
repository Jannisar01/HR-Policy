export type PolicyTier = "federal" | "state" | "uw-system" | "uwo" | "department";

export type EvidenceStrength = "strong" | "medium" | "weak";

export interface PolicySource {
  id: string;
  title: string;
  url: string;
  tier: PolicyTier;
  owner: string;
  approved: boolean;
}

export interface RetrievedPolicyExcerpt {
  source: PolicySource;
  excerpt: string;
  evidenceStrength: EvidenceStrength;
  conflictsWith?: string[];
}

export type AnswerStatus = "answer" | "escalate" | "uncertain";

export interface PolicyAnswer {
  status: AnswerStatus;
  answer: string;
  rationale: string;
  citations: Array<{ title: string; url: string; tier: PolicyTier }>;
}
