# HR Policy Assistant Database Schema (Supabase Postgres)

## Why each table exists

- **`policy_sources`**: Registry of approved policy origins (official websites/repos) with ownership, policy scope, crawl settings, approval state, and precedence metadata.
- **`policy_documents`**: Versioned extracted policy artifacts from each source URL, including canonical metadata (`document_title`, `effective_date`, `last_reviewed`, `supersedes`) and active/archive lifecycle fields.
- **`policy_sections`**: Retrieval-ready chunk store for semantic search and filtering; each row is a section/chunk with embeddings, citation labels, and per-chunk filter metadata.
- **`crawls`**: Full crawl execution history for online URL ingestion, success/failure tracking, and operational audit trails.
- **`evaluations`**: Offline and continuous testing results for retrieval quality, answer quality, precedence correctness, and safety.
- **`users`**: Application-level user profile table linked to Supabase Auth for ownership, approvals, and accountability.
- **`roles` / `user_role_mappings`**: RBAC layer for who can approve, review, audit, or administer policy data.
- **`question_logs`**: Query/answer audit log capturing retrieval evidence, model behavior, and escalation outcomes for traceability.

## Design highlights

- **Policy hierarchy & precedence** via `policy_level` + `precedence_rank`.
- **Lifecycle controls** via `status`, `approval_status`, `active`, `archived_at`, `is_current_version`.
- **Version tracking** via `version_number`, `row_version`, and update triggers.
- **Auditability** via `created_by`, `updated_by`, crawl/evaluation runs, and immutable `question_logs` timestamps.
- **Retrieval filtering** via structured fields (`policy_area`, `audience`, `access_level`) plus JSONB and GIN indexes.
