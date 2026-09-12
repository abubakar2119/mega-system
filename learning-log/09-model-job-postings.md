Columns Classification

id (Relational): Primary key used to uniquely identify each job record.

company_id (Relational): Foreign key linking jobs to companies.

title (Relational): Core field queried, sorted, and displayed across job boards.

description (Relational): Main job content used for display and full-text search.

status (Relational): Fixed state variable (draft, open, closed) filtered across search queries.

deadline (Relational): Date field used for time-based queries and expiration filtering.

attributes (JSONB): Flexible object holding role-specific metadata that varies per job type.

screening_questions (JSONB): Array storing application questions loaded alongside the job.

created_at (Relational): Timestamp tracking when the record was created.

updated_at (Relational): Timestamp tracking changes for cache management.

Foreign Key and NOT NULL

jobs.company_id links to companies.id
NOT NULL ensures every job must belong to an existing company; orphaned jobs are not allowed.

Column vs JSONB Decision

status (Clearly Relational): Has a fixed set of values (draft, open, closed), is filtered on most public board queries, and requires a CHECK constraint.

attributes (Clearly JSONB): Stores highly variable data depending on the role (e.g., tech_stack for engineers vs commission_plan for sales) without filling the table with empty columns.

remote_policy (Borderline Case): Kept in attributes as display metadata for now, but if filtering candidates by remote work options becomes a requirement, it must move to its own relational column.

Screening Questions Shape and ID Stability

An entry consists of four fields:

id: Unique UUID identifying the question.

text: The prompt string shown to the applicant.

type: Input element type (text, boolean, url).

required: Boolean flag indicating if an answer is mandatory.

The id must remain a stable UUID so submitted answers stay permanently linked to the exact question asked, even if questions are reordered or edited later.

JSONB vs Separate Table Decision

Why JSONB: Questions are read exclusively with the parent job record as a single unit and are never queried across jobs independently.

When a Separate Table is Better: Needed if you must search across questions (e.g., finding all jobs asking about salary), maintain a global reusable question library, or support complex logic like multiple-choice branches.

 DDL & Example JSONB Structure

sql

CREATE TABLE jobs (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          uuid        NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
  title               text        NOT NULL,
  description         text        NOT NULL,
  status              text        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed')),
  deadline            date,
  attributes          jsonb       NOT NULL DEFAULT '{}',
  screening_questions jsonb       NOT NULL DEFAULT '[]',
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);



json


[
  {
    "id": "e3a89012-b456-7890-abcd-ef1234567890",
    "text": "Describe your experience working with distributed systems.",
    "type": "text",
    "required": true
  }
]

```