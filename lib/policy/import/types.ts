import type { AccessLevel, CrawlStatus, PolicyLevel, PolicyStatus } from "@/lib/types/database"

export interface SpreadsheetPolicySourceRow {
  rowNumber: number
  source_name?: string
  source_url?: string
  source_type?: string
  source_citation_label?: string
  document_title?: string
  owner?: string
  department?: string
  policy_area?: string
  policy_level?: string
  precedence_rank?: number | string
  status?: string
  approval_status?: string
  access_level?: string
  crawl_status?: string
  crawl_frequency_hours?: number | string
  active?: boolean | string
  metadata?: Record<string, unknown>
}

export interface NormalizedPolicySourceRow {
  rowNumber: number
  sourceName: string
  sourceUrl: string
  sourceType: string
  sourceCitationLabel: string
  documentTitle: string
  owner: string
  department: string | null
  policyArea: string
  policyLevel: PolicyLevel
  precedenceRank: number
  status: PolicyStatus
  approvalStatus: PolicyStatus
  accessLevel: AccessLevel
  crawlStatus: CrawlStatus
  crawlFrequencyHours: number
  active: boolean
  metadata: Record<string, unknown>
  needsManualReview: boolean
  reviewReasons: string[]
}

export interface PolicySourceInsertPayload {
  source_name: string
  source_url: string
  source_type: string
  source_citation_label: string
  owner: string
  department: string | null
  policy_area: string
  policy_level: PolicyLevel
  precedence_rank: number
  status: PolicyStatus
  approval_status: PolicyStatus
  access_level: AccessLevel
  crawl_status: CrawlStatus
  crawl_frequency_hours: number
  active: boolean
  metadata: Record<string, unknown>
}

export interface PolicySourceDuplicateKey {
  sourceUrl: string
  documentTitle: string
}

export interface PolicySourceImportRepository {
  listExistingDuplicateKeys: () => Promise<PolicySourceDuplicateKey[]>
  insertPolicySources: (rows: PolicySourceInsertPayload[]) => Promise<void>
}

export type ImportErrorCode =
  | "REQUIRED_FIELD"
  | "INVALID_FIELD"
  | "DUPLICATE_ROW"
  | "REPOSITORY_ERROR"

export interface ImportIssue {
  code: ImportErrorCode
  rowNumber: number
  field?: keyof SpreadsheetPolicySourceRow
  message: string
  hint?: string
}

export interface AdminSafeImportIssue {
  code: ImportErrorCode
  rowNumber: number
  field?: string
  message: string
  hint?: string
}

export interface PolicySourceImportResult {
  importedCount: number
  skippedCount: number
  reviewCount: number
  importedRows: NormalizedPolicySourceRow[]
  skippedRows: Array<{
    rowNumber: number
    reason: string
  }>
  issues: ImportIssue[]
  adminSafeIssues: AdminSafeImportIssue[]
}

export interface SpreadsheetRowAdapter {
  loadRows: () => Promise<SpreadsheetPolicySourceRow[]>
}
