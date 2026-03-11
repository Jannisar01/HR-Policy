import {
  createRowSourceImportService,
  type PolicySourceDuplicateKey,
  type PolicySourceImportRepository,
  type PolicySourceInsertPayload,
  type SpreadsheetPolicySourceRow
} from "@/lib/policy/import"

const sampleRows: SpreadsheetPolicySourceRow[] = [
  {
    rowNumber: 2,
    source_name: "U.S. Department of Labor",
    source_url: "https://www.dol.gov/general/topic/benefits-leave/fmla",
    document_title: "Federal FMLA Overview",
    owner: "U.S. Department of Labor",
    policy_area: "leave",
    policy_level: "federal",
    status: "published",
    approval_status: "approved"
  },
  {
    rowNumber: 3,
    source_name: "UW Oshkosh HR",
    source_url: "https://www.uwosh.edu/hr/policies/leave",
    document_title: "Leave Policies",
    owner: "UW Oshkosh",
    policy_area: "leave",
    policy_level: "uwo",
    status: "draft",
    approval_status: "draft"
  }
]

class ConsoleRepository implements PolicySourceImportRepository {
  private readonly duplicateKeys: PolicySourceDuplicateKey[] = []

  async listExistingDuplicateKeys() {
    return this.duplicateKeys
  }

  async insertPolicySources(rows: PolicySourceInsertPayload[]) {
    console.table(
      rows.map((row) => ({
        source_name: row.source_name,
        source_url: row.source_url,
        policy_level: row.policy_level,
        status: row.status,
        review: row.metadata.import_manual_review
      }))
    )
  }
}

async function main() {
  const service = createRowSourceImportService(async () => sampleRows)
  const result = await service.import(new ConsoleRepository())

  if (result.adminSafeIssues.length > 0) {
    console.log("Admin-safe import issues:")
    console.table(result.adminSafeIssues)
  }

  console.log(`Imported: ${result.importedCount}, Skipped: ${result.skippedCount}, Manual review: ${result.reviewCount}`)
}

main().catch((error) => {
  console.error("Seed import failed", error)
  process.exitCode = 1
})
