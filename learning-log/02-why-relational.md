Part A 

=> I chose a relational database (PostgreSQL) for this job portal because it guarantees strict transactional safety and structural predictability for high-stakes business logic. The two requirements that drove this decision hardest are the one-application-per-applicant uniqueness constraint and gating filters (like status, deadlines, and location types); both demand absolute data integrity and fast cross-table querying where failure or delayed consistency is completely unacceptable.

=> While a pure document model would genuinely fit better for high-volume, unstructured tracking like job viewed analytics events or wildly varying per-role custom screening questions, I still don't add a second database for it. Introducing a NoSQL store solely for telemetry or flexible metadata would shatter our atomic transaction boundaries, force eventual-consistency bugs onto core applicant workflows, and introduce unnecessary infrastructure and operational complexity for a project best served by PostgreSQL's native `JSONB` flexibility.

Part B

=> Relational vs document: Relational databases store data in structured, normalized tables with fixed schemas and strictly enforce relationships, data types, and constraints at the database enginering  level. Document databases store self-contained JSON-like documents with dynamic, flexible schemas, leaving structural validation, relationship tracking, and consistency rules entirely up to your application code.



=> Transactions & atomicity:A transaction is a single logical unit of work made up of one or more database operations. In our application submission flow (such as shortlisting candidates or saving a multi-step submission across records), atomicity guarantees that either every step succeeds completely or the entire operation rolls back. Without it, you risk a partial failure state where an applicant's quota is deducted or status updates halfway, leaving orphaned records and broken data integrity.

=> Foreign keys & referential integrity: A foreign key guarantees referential integrity by anchoring a column's values to the primary key of another table. Using `applications.job_id → jobs.id`, the database will now strictly refuse to:
1 Insert an application for a `job_id` that does not actually exist in the `jobs` table.
2 Delete a job record from the `jobs` table while active applications are still linked to it (preventing orphaned records).


=> Referential integrity: is used to check connection between the table is correct or not.

=> Joins:A join is a query operation that combines rows from two or more tables based on a related column between them. Our portal constantly renders the candidate dashboard using a join across the `applications`, `jobs`, and `companies` tables; without joins, you would have to execute multiple fragmented queries in application code and manually stitch the data together, resulting in severe performance overhead and complex filtering bugs.

=> The JSONB hybrid: Postgres lets you keep relational guarantees while storing wildly varying per-role attributes by combining strict relational columns for core business logic with a specialized binary JSON type (`JSONB`) that supports indexing and flexible key-value storage. For our `jobs` table:
1 Real columns: `id` (primary key) and `status` (gating rule)—both must be strict relational columns because they enforce core uniqueness and power primary board-filtering indexes. 2. JSONB attributes: `remote_equipment_perks` and `custom_screening_questions`—both belong in `JSONB` because their internal structures vary wildly from one job role to another and they never act as application-gating filters
