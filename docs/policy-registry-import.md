# Spreadsheet registry import mapping

## Recommended mapping from spreadsheet rows to normalized tables

### Stage 1: Source-level import (`policy_sources`)

A spreadsheet registry row should map into `policy_sources` first, because source governance and approval need to happen before document extraction.

| Spreadsheet column | `policy_sources` column | Notes |
|---|---|---|
| `source_name` or `document_title` | `source_name` | Fallback to `document_title` when source name is missing. |
| `source_url` | `source_url` | Canonicalized URL; required. |
| `source_type` | `source_type` | Defaults to `website`. |
| `source_citation_label` or `document_title` | `source_citation_label` | Human-friendly citation label. |
| `owner` | `owner` | Required. |
| `department` | `department` | Optional. |
| `policy_area` | `policy_area` | Required. |
| `policy_level` | `policy_level` | Normalize aliases (`uw-system` => `system`, `uwo` => `institution`). |
| `precedence_rank` | `precedence_rank` | Clamp to 1-100. |
| `status` | `status` | Normalize aliases (`published` => `approved`). |
| `approval_status` | `approval_status` | Normalize aliases. |
| `access_level` | `access_level` | Defaults to `internal`. |
| `crawl_status` | `crawl_status` | Defaults to `queued`. |
| `crawl_frequency_hours` | `crawl_frequency_hours` | Defaults to `24`. |
| `active` | `active` | Defaults to `true`. |
| `document_title`, import review metadata | `metadata` | Preserve spreadsheet-specific context. |

### Stage 2: Document-level import (`policy_documents`)

After source rows are approved and active, a second ingestion stage can produce `policy_documents` records from source crawls or direct uploads.

- Use spreadsheet `document_title` as `policy_documents.document_title`.
- Link to a source using `policy_source_id` from the stage-1 import.
- Generate `content_hash`, `version_number`, and extraction metadata at ingestion time.
- Keep lifecycle transitions (`draft` -> `approved` -> `archived`) in the normalized status fields.

## Duplicate strategy

Use the composite key `source_url + document_title` as the import-level duplicate detector.

- If duplicate appears in incoming rows: skip and report row-level issue.
- If duplicate already exists in prior imports: skip and report merge suggestion.
- Keep `source_url` as a strong unique key for `policy_sources` and preserve `document_title` in metadata for traceability.

## Manual-review strategy

Mark a row as needing manual review when:

- status is not approved,
- approval_status is not approved,
- or future review rules flag policy-level/owner conflicts.

Store review reasons in metadata so admin pages can filter and triage quickly.

## Extension points for CSV/XLSX upload

- Add parser adapters that output `SpreadsheetPolicySourceRow[]`.
- Reuse the same validation and import orchestration for all file types.
- Keep file parsing concerns isolated from persistence concerns.
- Add per-adapter column mapping profiles for department-specific spreadsheets.
