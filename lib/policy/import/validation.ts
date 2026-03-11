import { z } from "zod"

import type {
  AdminSafeImportIssue,
  ImportIssue,
  NormalizedPolicySourceRow,
  SpreadsheetPolicySourceRow
} from "@/lib/policy/import/types"
import type { AccessLevel, CrawlStatus, PolicyLevel, PolicyStatus } from "@/lib/types/database"

const requiredString = (field: keyof SpreadsheetPolicySourceRow) =>
  z
    .string()
    .trim()
    .min(1, `${field} is required`)

const allowedPolicyLevels: Record<string, PolicyLevel> = {
  federal: "federal",
  state: "state",
  system: "system",
  "uw-system": "system",
  institution: "institution",
  uwo: "institution",
  campus: "institution",
  department: "department",
  team: "team"
}

const allowedStatuses: Record<string, PolicyStatus> = {
  draft: "draft",
  approved: "approved",
  archived: "archived",
  retired: "retired",
  active: "approved",
  published: "approved",
  inactive: "archived"
}

const allowedAccessLevels: Record<string, AccessLevel> = {
  public: "public",
  internal: "internal",
  restricted: "restricted",
  confidential: "confidential"
}

const allowedCrawlStatuses: Record<string, CrawlStatus> = {
  queued: "queued",
  running: "running",
  succeeded: "succeeded",
  failed: "failed",
  skipped: "skipped"
}

const schema = z.object({
  rowNumber: z.number().int().positive(),
  source_name: z.string().trim().optional(),
  source_url: requiredString("source_url").url("source_url must be a valid URL"),
  source_type: z.string().trim().default("website"),
  source_citation_label: z.string().trim().optional(),
  document_title: requiredString("document_title"),
  owner: requiredString("owner"),
  department: z.string().trim().optional(),
  policy_area: requiredString("policy_area"),
  policy_level: requiredString("policy_level"),
  precedence_rank: z.union([z.number(), z.string()]).optional(),
  status: z.string().trim().optional(),
  approval_status: z.string().trim().optional(),
  access_level: z.string().trim().optional(),
  crawl_status: z.string().trim().optional(),
  crawl_frequency_hours: z.union([z.number(), z.string()]).optional(),
  active: z.union([z.boolean(), z.string()]).optional(),
  metadata: z.record(z.unknown()).optional()
})

const normalizeKey = (value: string) => value.trim().toLowerCase()

export const normalizePolicyLevel = (value: string): PolicyLevel | null => {
  return allowedPolicyLevels[normalizeKey(value)] ?? null
}

export const normalizePolicyStatus = (value: string | undefined, fallback: PolicyStatus): PolicyStatus => {
  if (!value) {
    return fallback
  }

  return allowedStatuses[normalizeKey(value)] ?? fallback
}

const parseNumber = (value: number | string | undefined, fallback: number) => {
  if (value === undefined) {
    return fallback
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  const parsed = Number.parseInt(String(value).trim(), 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

const parseBoolean = (value: boolean | string | undefined, fallback: boolean) => {
  if (value === undefined) {
    return fallback
  }

  if (typeof value === "boolean") {
    return value
  }

  const normalized = value.trim().toLowerCase()
  if (["true", "1", "yes", "y"].includes(normalized)) {
    return true
  }

  if (["false", "0", "no", "n"].includes(normalized)) {
    return false
  }

  return fallback
}

const createIssue = (
  rowNumber: number,
  message: string,
  field?: keyof SpreadsheetPolicySourceRow,
  code: ImportIssue["code"] = "INVALID_FIELD",
  hint?: string
): ImportIssue => ({
  code,
  rowNumber,
  field,
  message,
  hint
})

export const validateAndNormalizeRow = (row: SpreadsheetPolicySourceRow) => {
  const parsed = schema.safeParse(row)
  if (!parsed.success) {
    const issues: ImportIssue[] = parsed.error.issues.map((issue) => {
      const [field] = issue.path
      const fieldName = typeof field === "string" ? (field as keyof SpreadsheetPolicySourceRow) : undefined
      return createIssue(
        row.rowNumber,
        issue.message,
        fieldName,
        issue.message.includes("required") ? "REQUIRED_FIELD" : "INVALID_FIELD"
      )
    })

    return {
      ok: false as const,
      issues
    }
  }

  const value = parsed.data
  const normalizedPolicyLevel = normalizePolicyLevel(value.policy_level)

  if (!normalizedPolicyLevel) {
    return {
      ok: false as const,
      issues: [
        createIssue(
          row.rowNumber,
          `Unsupported policy_level '${value.policy_level}'`,
          "policy_level",
          "INVALID_FIELD",
          "Use federal, state, system, institution, department, or team"
        )
      ]
    }
  }

  const reviewReasons: string[] = []
  const normalizedStatus = normalizePolicyStatus(value.status, "draft")
  const normalizedApproval = normalizePolicyStatus(value.approval_status, "draft")

  if (normalizedStatus !== "approved" || normalizedApproval !== "approved") {
    reviewReasons.push("status or approval_status is not approved")
  }

  const normalized: NormalizedPolicySourceRow = {
    rowNumber: value.rowNumber,
    sourceName: value.source_name?.trim() || value.document_title,
    sourceUrl: value.source_url.trim(),
    sourceType: value.source_type.trim(),
    sourceCitationLabel: value.source_citation_label?.trim() || value.document_title,
    documentTitle: value.document_title.trim(),
    owner: value.owner.trim(),
    department: value.department?.trim() || null,
    policyArea: value.policy_area.trim(),
    policyLevel: normalizedPolicyLevel,
    precedenceRank: Math.min(Math.max(parseNumber(value.precedence_rank, 50), 1), 100),
    status: normalizedStatus,
    approvalStatus: normalizedApproval,
    accessLevel: allowedAccessLevels[normalizeKey(value.access_level || "internal")] || "internal",
    crawlStatus: allowedCrawlStatuses[normalizeKey(value.crawl_status || "queued")] || "queued",
    crawlFrequencyHours: Math.max(parseNumber(value.crawl_frequency_hours, 24), 1),
    active: parseBoolean(value.active, true),
    metadata: value.metadata || {},
    needsManualReview: reviewReasons.length > 0,
    reviewReasons
  }

  return {
    ok: true as const,
    value: normalized
  }
}

export const toAdminSafeIssues = (issues: ImportIssue[]): AdminSafeImportIssue[] => {
  return issues.map((issue) => ({
    code: issue.code,
    rowNumber: issue.rowNumber,
    field: issue.field,
    message: issue.message.replace(/https?:\/\/\S+/gi, "[url]"),
    hint: issue.hint
  }))
}
