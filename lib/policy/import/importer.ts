import type {
  ImportIssue,
  PolicySourceDuplicateKey,
  PolicySourceImportRepository,
  PolicySourceImportResult,
  PolicySourceInsertPayload,
  SpreadsheetPolicySourceRow,
  NormalizedPolicySourceRow
} from "@/lib/policy/import/types"
import { toAdminSafeIssues, validateAndNormalizeRow } from "@/lib/policy/import/validation"

const dedupeKey = (pair: PolicySourceDuplicateKey) => `${pair.sourceUrl.trim().toLowerCase()}::${pair.documentTitle.trim().toLowerCase()}`

const createPayload = (row: NormalizedPolicySourceRow): PolicySourceInsertPayload => {
  const metadata = {
    ...row.metadata,
    import_document_title: row.documentTitle,
    import_manual_review: row.needsManualReview,
    import_review_reasons: row.reviewReasons
  }

  return {
    source_name: row.sourceName,
    source_url: row.sourceUrl,
    source_type: row.sourceType,
    source_citation_label: row.sourceCitationLabel,
    owner: row.owner,
    department: row.department,
    policy_area: row.policyArea,
    policy_level: row.policyLevel,
    precedence_rank: row.precedenceRank,
    status: row.status,
    approval_status: row.approvalStatus,
    access_level: row.accessLevel,
    crawl_status: row.crawlStatus,
    crawl_frequency_hours: row.crawlFrequencyHours,
    active: row.active,
    metadata
  }
}

export const importPolicySources = async (
  rows: SpreadsheetPolicySourceRow[],
  repository: PolicySourceImportRepository
): Promise<PolicySourceImportResult> => {
  const existingKeys = new Set((await repository.listExistingDuplicateKeys()).map(dedupeKey))

  const importedRows: PolicySourceImportResult["importedRows"] = []
  const skippedRows: PolicySourceImportResult["skippedRows"] = []
  const issues: ImportIssue[] = []
  const rowsToInsert: PolicySourceInsertPayload[] = []

  for (const row of rows) {
    const normalized = validateAndNormalizeRow(row)

    if (!normalized.ok) {
      issues.push(...normalized.issues)
      skippedRows.push({ rowNumber: row.rowNumber, reason: "Validation failed" })
      continue
    }

    const key = dedupeKey({
      sourceUrl: normalized.value.sourceUrl,
      documentTitle: normalized.value.documentTitle
    })

    if (existingKeys.has(key)) {
      issues.push({
        code: "DUPLICATE_ROW",
        rowNumber: row.rowNumber,
        field: "source_url",
        message: "Duplicate source_url + document_title combination",
        hint: "Review the source registry row and merge if needed"
      })
      skippedRows.push({ rowNumber: row.rowNumber, reason: "Duplicate row" })
      continue
    }

    existingKeys.add(key)
    importedRows.push(normalized.value)
    rowsToInsert.push(createPayload(normalized.value))
  }

  try {
    if (rowsToInsert.length > 0) {
      await repository.insertPolicySources(rowsToInsert)
    }
  } catch (error) {
    issues.push({
      code: "REPOSITORY_ERROR",
      rowNumber: 0,
      message: "Failed to persist imported rows",
      hint: error instanceof Error ? error.message : "Unknown repository error"
    })
  }

  return {
    importedCount: rowsToInsert.length,
    skippedCount: skippedRows.length,
    reviewCount: importedRows.filter((row) => row.needsManualReview).length,
    importedRows,
    skippedRows,
    issues,
    adminSafeIssues: toAdminSafeIssues(issues)
  }
}

export interface RowSourceImportService {
  import: (repository: PolicySourceImportRepository) => Promise<PolicySourceImportResult>
}

export const createRowSourceImportService = (loadRows: () => Promise<SpreadsheetPolicySourceRow[]>): RowSourceImportService => {
  return {
    import: async (repository) => {
      const rows = await loadRows()
      return importPolicySources(rows, repository)
    }
  }
}
