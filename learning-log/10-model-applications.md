CREATE TABLE applications (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id            uuid        NOT NULL REFERENCES jobs(id),
  applicant_id      uuid        NOT NULL REFERENCES applicants(id),
  stage             text        NOT NULL DEFAULT 'applied'
                                  CHECK (stage IN (
                                    'applied', 'screening', 'interview',
                                    'final_interview', 'offer',
                                    'hired', 'rejected'
                                  )),
  screening_answers jsonb       NOT NULL DEFAULT '{}',
  profile_snapshot  jsonb       NOT NULL DEFAULT '{}',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, applicant_id)
);


{
  "a1b2c3d4-e5f6-7890-abcd-ef1234567890": "I've worked with distributed systems for three years, primarily Kafka and Kubernetes in a fintech context.",
  "b2c3d4e5-f6a7-8901-bcde-f12345678901": true,
  "c3d4e5f6-a7b8-9012-cdef-123456789012": "https://github.com/myusername/project-x"
}

Data integrity makes sure that the user applied only once time when he try again database automatically rejected or delete


applied -> screening -> interview -> final interview -> offer -> hired/reject



Here is the English translation of the answers to all three questions:



Question 1: Stage in JSONB vs Column?

Answer:

Schema-Level Problem (Filtering & Grouping):** The column-vs-JSONB rule dictates that any field used for filtering or grouping in queries must be stored as a dedicated, first-class column. Recruiters frequently filter and group candidates by their current pipeline stage (e.g.Show candidates in the Interview stage or Group by stage).
Performance & Constraints:Storing stage inside JSONB degrades index and query performance, and makes it impossible (or overly complex) to enforce valid pipeline states using a standard database-level CHECK constraint.



 Question 2: Timeout & Re-submission (Idempotency) ?

Answer:

Database Level:** When the applicant clicks submit a second time, the database attempts to insert a record with the same (job_id, applicant_id) pair. The UNIQUE (job_id, applicant_id)constraint fires instantly, rejecting the duplicate row and throwing a unique constraint violation error.

Application Layer:** The application layer (backend code) must catch this constraint violation gracefully. Instead of crashing or returning a 500 Server Error to the user, it should acknowledge that the submission already exists and return a success response (e.g., 200 OK) or a handled conflict, ensuring a smooth user experience.



Question 3: Correcting Question Typo & Historic Data

Answer:

Do the records change?** No, those 12 submitted screening_answers records will not change.
Why, and which Chapter 9 design decision enables this?** The UUID-Keyed Architecture from Chapter 9 ensures this safety. In screening_answers, we store question UUIDs as keys rather than raw question text (e.g., a1b2c3d4: Answer). The actual question text resides separately in jobs.screening_questions. Updating the question text alters only the text string while leaving the question's UUID unchanged. When historical answers are queried, the system resolves the same UUID to the updated question text without altering any existing response data.