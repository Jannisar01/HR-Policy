export type PolicyLevel =
  | "federal"
  | "state"
  | "system"
  | "institution"
  | "department"
  | "team";

export type PolicyStatus = "draft" | "approved" | "archived" | "retired";

export type AudienceType =
  | "all_staff"
  | "faculty"
  | "students"
  | "hr_admins"
  | "managers"
  | "executives"
  | "contractors";

export type AccessLevel = "public" | "internal" | "restricted" | "confidential";

export type CrawlStatus = "queued" | "running" | "succeeded" | "failed" | "skipped";

export type DocumentFormat = "html" | "pdf" | "docx" | "markdown" | "text";

export type EvaluationStatus = "pending" | "passed" | "failed" | "blocked";

export type EvaluationType = "retrieval" | "answer_quality" | "policy_precedence" | "safety";

export type RoleName = "admin" | "policy_owner" | "reviewer" | "auditor" | "viewer";

interface AuditFields {
  created_at: string;
  updated_at: string;
  row_version: number;
}

export interface UserModel extends AuditFields {
  id: string;
  auth_user_id: string | null;
  email: string;
  display_name: string | null;
  department: string | null;
  is_active: boolean;
}

export interface RoleModel extends AuditFields {
  id: string;
  role: RoleName;
  description: string | null;
}

export interface UserRoleMappingModel extends AuditFields {
  id: string;
  user_id: string;
  role_id: string;
  granted_by: string | null;
  granted_at: string;
}

export interface PolicySourceModel extends AuditFields {
  id: string;
  source_name: string;
  source_url: string;
  source_type: string;
  source_citation_label: string;
  owner: string;
  department: string | null;
  policy_area: string;
  audience: AudienceType[];
  policy_level: PolicyLevel;
  precedence_rank: number;
  status: PolicyStatus;
  access_level: AccessLevel;
  approval_status: PolicyStatus;
  active: boolean;
  last_crawled_at: string | null;
  crawl_status: CrawlStatus;
  crawl_frequency_hours: number;
  metadata: Record<string, unknown>;
  created_by: string | null;
  updated_by: string | null;
}

export interface PolicyDocumentModel extends AuditFields {
  id: string;
  policy_source_id: string;
  document_title: string;
  source_url: string;
  source_citation_label: string;
  external_document_id: string | null;
  version_number: number;
  is_current_version: boolean;
  status: PolicyStatus;
  access_level: AccessLevel;
  policy_level: PolicyLevel;
  policy_area: string;
  audience: AudienceType[];
  owner: string;
  department: string | null;
  effective_date: string | null;
  last_reviewed: string | null;
  supersedes_document_id: string | null;
  content_hash: string;
  checksum_algorithm: string;
  content_format: DocumentFormat;
  extracted_text: string;
  extraction_metadata: Record<string, unknown>;
  retrieval_tags: string[];
  archived_at: string | null;
  created_by: string | null;
  updated_by: string | null;
}

export interface PolicySectionModel extends AuditFields {
  id: string;
  policy_document_id: string;
  section_key: string;
  heading: string | null;
  section_path: string | null;
  chunk_index: number;
  chunk_text: string;
  token_count: number | null;
  embedding: number[] | null;
  citation_label: string | null;
  retrieval_filters: Record<string, unknown>;
  content_hash: string;
  active: boolean;
}

export interface CrawlModel extends AuditFields {
  id: string;
  policy_source_id: string;
  started_at: string;
  completed_at: string | null;
  crawl_status: CrawlStatus;
  http_status: number | null;
  discovered_url: string | null;
  fetched_url: string | null;
  pages_discovered: number;
  pages_crawled: number;
  documents_extracted: number;
  error_message: string | null;
  request_metadata: Record<string, unknown>;
  response_metadata: Record<string, unknown>;
  created_by: string | null;
}

export interface EvaluationModel extends AuditFields {
  id: string;
  evaluation_name: string;
  evaluation_type: EvaluationType;
  evaluation_status: EvaluationStatus;
  question: string;
  expected_answer: string | null;
  expected_citations: string[];
  actual_answer: string | null;
  actual_citations: string[];
  policy_document_id: string | null;
  policy_section_id: string | null;
  score: number | null;
  notes: string | null;
  run_by: string | null;
  run_at: string;
}

export interface QuestionLogModel {
  id: string;
  user_id: string | null;
  question: string;
  normalized_question: string | null;
  answer: string | null;
  answer_status: string;
  confidence: number | null;
  policy_level: PolicyLevel | null;
  policy_area: string | null;
  audience: AudienceType[];
  access_level: AccessLevel | null;
  retrieved_document_ids: string[];
  retrieved_section_ids: string[];
  cited_source_labels: string[];
  escalation_required: boolean;
  model_name: string | null;
  latency_ms: number | null;
  request_metadata: Record<string, unknown>;
  response_metadata: Record<string, unknown>;
  created_at: string;
}
