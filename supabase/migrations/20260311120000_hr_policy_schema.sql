-- HR Policy Assistant schema (Supabase Postgres)

create extension if not exists pgcrypto;
create extension if not exists vector;

-- Enums
create type policy_level as enum (
  'federal',
  'state',
  'system',
  'institution',
  'department',
  'team'
);

create type policy_status as enum (
  'draft',
  'approved',
  'archived',
  'retired'
);

create type audience_type as enum (
  'all_staff',
  'faculty',
  'students',
  'hr_admins',
  'managers',
  'executives',
  'contractors'
);

create type access_level as enum (
  'public',
  'internal',
  'restricted',
  'confidential'
);

create type crawl_status as enum (
  'queued',
  'running',
  'succeeded',
  'failed',
  'skipped'
);

create type document_format as enum (
  'html',
  'pdf',
  'docx',
  'markdown',
  'text'
);

create type evaluation_status as enum (
  'pending',
  'passed',
  'failed',
  'blocked'
);

create type evaluation_type as enum (
  'retrieval',
  'answer_quality',
  'policy_precedence',
  'safety'
);

create type role_name as enum (
  'admin',
  'policy_owner',
  'reviewer',
  'auditor',
  'viewer'
);

-- Shared trigger for auditability + version tracking
create or replace function set_row_audit_fields()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  if tg_op = 'UPDATE' then
    new.row_version = old.row_version + 1;
  end if;
  return new;
end;
$$;

-- Users and access mappings
create table users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  email text not null unique,
  display_name text,
  department text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version integer not null default 1
);

create table roles (
  id uuid primary key default gen_random_uuid(),
  role role_name not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version integer not null default 1
);

create table user_role_mappings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  role_id uuid not null references roles(id) on delete cascade,
  granted_by uuid references users(id) on delete set null,
  granted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version integer not null default 1,
  unique (user_id, role_id)
);

-- Approved source registry
create table policy_sources (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  source_url text not null,
  source_type text not null default 'website',
  source_citation_label text not null,
  owner text not null,
  department text,
  policy_area text not null,
  audience audience_type[] not null default '{}',
  policy_level policy_level not null,
  precedence_rank smallint not null check (precedence_rank between 1 and 100),
  status policy_status not null default 'draft',
  access_level access_level not null default 'internal',
  approval_status policy_status not null default 'draft',
  active boolean not null default true,
  last_crawled_at timestamptz,
  crawl_status crawl_status not null default 'queued',
  crawl_frequency_hours integer not null default 24 check (crawl_frequency_hours > 0),
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references users(id) on delete set null,
  updated_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version integer not null default 1,
  unique (source_url)
);

-- Extracted policy documents/versions
create table policy_documents (
  id uuid primary key default gen_random_uuid(),
  policy_source_id uuid not null references policy_sources(id) on delete cascade,
  document_title text not null,
  source_url text not null,
  source_citation_label text not null,
  external_document_id text,
  version_number integer not null default 1 check (version_number > 0),
  is_current_version boolean not null default true,
  status policy_status not null default 'draft',
  access_level access_level not null default 'internal',
  policy_level policy_level not null,
  policy_area text not null,
  audience audience_type[] not null default '{}',
  owner text not null,
  department text,
  effective_date date,
  last_reviewed date,
  supersedes_document_id uuid references policy_documents(id) on delete set null,
  content_hash text not null,
  checksum_algorithm text not null default 'sha256',
  content_format document_format not null default 'html',
  extracted_text text not null,
  extraction_metadata jsonb not null default '{}'::jsonb,
  retrieval_tags text[] not null default '{}',
  archived_at timestamptz,
  created_by uuid references users(id) on delete set null,
  updated_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version integer not null default 1,
  unique (policy_source_id, version_number),
  unique (policy_source_id, content_hash)
);

-- Chunked retrieval sections
create table policy_sections (
  id uuid primary key default gen_random_uuid(),
  policy_document_id uuid not null references policy_documents(id) on delete cascade,
  section_key text not null,
  heading text,
  section_path text,
  chunk_index integer not null check (chunk_index >= 0),
  chunk_text text not null,
  token_count integer check (token_count >= 0),
  embedding vector(1536),
  citation_label text,
  retrieval_filters jsonb not null default '{}'::jsonb,
  content_hash text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version integer not null default 1,
  unique (policy_document_id, chunk_index),
  unique (policy_document_id, content_hash)
);

-- Crawl/ingestion history
create table crawls (
  id uuid primary key default gen_random_uuid(),
  policy_source_id uuid not null references policy_sources(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  crawl_status crawl_status not null default 'queued',
  http_status integer,
  discovered_url text,
  fetched_url text,
  pages_discovered integer not null default 0,
  pages_crawled integer not null default 0,
  documents_extracted integer not null default 0,
  error_message text,
  request_metadata jsonb not null default '{}'::jsonb,
  response_metadata jsonb not null default '{}'::jsonb,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version integer not null default 1
);

-- Evaluation/testing results
create table evaluations (
  id uuid primary key default gen_random_uuid(),
  evaluation_name text not null,
  evaluation_type evaluation_type not null,
  evaluation_status evaluation_status not null default 'pending',
  question text not null,
  expected_answer text,
  expected_citations text[] not null default '{}',
  actual_answer text,
  actual_citations text[] not null default '{}',
  policy_document_id uuid references policy_documents(id) on delete set null,
  policy_section_id uuid references policy_sections(id) on delete set null,
  score numeric(5,2),
  notes text,
  run_by uuid references users(id) on delete set null,
  run_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  row_version integer not null default 1
);

-- Audit + usage logging
create table question_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  question text not null,
  normalized_question text,
  answer text,
  answer_status text not null,
  confidence numeric(5,2),
  policy_level policy_level,
  policy_area text,
  audience audience_type[] not null default '{}',
  access_level access_level,
  retrieved_document_ids uuid[] not null default '{}',
  retrieved_section_ids uuid[] not null default '{}',
  cited_source_labels text[] not null default '{}',
  escalation_required boolean not null default false,
  model_name text,
  latency_ms integer,
  request_metadata jsonb not null default '{}'::jsonb,
  response_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_policy_sources_status on policy_sources(status);
create index idx_policy_sources_level_area on policy_sources(policy_level, policy_area);
create index idx_policy_sources_last_crawled on policy_sources(last_crawled_at desc);

create index idx_policy_documents_source on policy_documents(policy_source_id);
create index idx_policy_documents_status_current on policy_documents(status, is_current_version);
create index idx_policy_documents_effective_date on policy_documents(effective_date desc);
create index idx_policy_documents_filtering on policy_documents(policy_level, policy_area, access_level);
create index idx_policy_documents_tags_gin on policy_documents using gin (retrieval_tags);

create index idx_policy_sections_document on policy_sections(policy_document_id);
create index idx_policy_sections_filters_gin on policy_sections using gin (retrieval_filters);
create index idx_policy_sections_embedding on policy_sections using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create index idx_crawls_source_started on crawls(policy_source_id, started_at desc);
create index idx_crawls_status on crawls(crawl_status);

create index idx_evaluations_type_status on evaluations(evaluation_type, evaluation_status);
create index idx_evaluations_run_at on evaluations(run_at desc);

create index idx_question_logs_user_created on question_logs(user_id, created_at desc);
create index idx_question_logs_filters on question_logs(policy_level, policy_area, access_level);
create index idx_question_logs_retrieved_docs_gin on question_logs using gin (retrieved_document_ids);

-- Triggers
create trigger trg_users_audit before update on users
for each row execute function set_row_audit_fields();

create trigger trg_roles_audit before update on roles
for each row execute function set_row_audit_fields();

create trigger trg_user_role_mappings_audit before update on user_role_mappings
for each row execute function set_row_audit_fields();

create trigger trg_policy_sources_audit before update on policy_sources
for each row execute function set_row_audit_fields();

create trigger trg_policy_documents_audit before update on policy_documents
for each row execute function set_row_audit_fields();

create trigger trg_policy_sections_audit before update on policy_sections
for each row execute function set_row_audit_fields();

create trigger trg_crawls_audit before update on crawls
for each row execute function set_row_audit_fields();

create trigger trg_evaluations_audit before update on evaluations
for each row execute function set_row_audit_fields();
