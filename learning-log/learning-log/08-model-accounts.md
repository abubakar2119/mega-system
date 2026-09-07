CREATE TABLE users (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text        NOT NULL UNIQUE,
  password_hash text        NOT NULL,   -- salted slow hash; hashing covered in ch19
  role          text        NOT NULL
                              CHECK (role IN ('recruiter', 'applicant', 'admin')),
  status        text        NOT NULL DEFAULT 'unverified'
                              CHECK (status IN ('active', 'unverified', 'suspended')),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE companies (
  id         uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text    NOT NULL,
  slug       text    NOT NULL UNIQUE,   -- URL-friendly: 'acme-corp', 'nova-labs'
  website    text,
  verified   boolean NOT NULL DEFAULT false,
  suspended  boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE recruiters (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  company_id   uuid NOT NULL REFERENCES companies(id),
  company_role text NOT NULL DEFAULT 'recruiter'
                 CHECK (company_role IN ('owner', 'hr_manager', 'recruiter', 'hiring_manager')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE applicants (
  id         uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid  NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name  text  NOT NULL,
  headline   text,
  location   text,
  attributes jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE admins (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

=>The Single Users Table Problem (Sparse Tables & Lack of Enforcement)
When you combine every role into a single users table with nullable columns, the database loses its ability to enforce domain rules at the schema level. If full_name is nullable so recruiters can skip it, the database cannot prevent an applicant from registering with a NULL name, forcing you to rely entirely on bug-prone application logic. Furthermore, this leads to a "sparse table" full of empty NULL cells, degrading storage efficiency and complicating future column maintenance as new role features are added.

=> Company Suspension Workflow (Centralized Workspace Flags)
When an admin suspends a company with eight recruiters, the database updates a single column: companies.suspended is set to true for that specific company row. Placing the suspended flag on the companies table rather than individual recruiter rows ensures a single source of truth; any auth or permission check for a recruiter evaluates companies.suspended in a single JOIN. This avoids expensive bulk updates across multiple recruiter rows and guarantees that all current and future team members under that workspace are instantly blocked in one operation.

=> Cascading Deletes Justification (user_id vs. company_id)
ON DELETE CASCADE appears on recruiters.user_id because a recruiter profile cannot exist without its underlying identity account; deleting the user record should cleanly purge the profile child record. In contrast, applying CASCADE to recruiters.company_id would be disastrous—deleting a company entity would silently and automatically hard-delete every recruiter's central users account from the entire system. Instead, company deletion should be restricted (ON DELETE RESTRICT) or handled via soft deletion, requiring explicit administrative logic to revoke access or reassign team members before removing the workspace.