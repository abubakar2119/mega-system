1. =>Your stack, recorded

Web Framework — Fastify: I chose Fastify because it is lightweight, fast, and flexible, but I gave up some 
built-in structure provided by frameworks like NestJS.

Database Access — Prisma: I chose Prisma because it makes database operations easier and provides good TypeScript support, but I gave up some direct control over SQL.

Validation — Zod: I chose Zod because it validates incoming data at runtime, but it adds another library to the project.

Node.js + TypeScript: I chose them for a strong JavaScript ecosystem and type safety, but TypeScript requires extra type definitions.

PostgreSQL: I chose it because the job portal has many relationships and needs transactions, but it requires more structured database design.

Redis: I chose Redis for fast caching and queue support, but it adds another system to manage.

BullMQ: I chose it for background jobs such as emails and notifications, but it requires managing queues and workers.

S3-compatible storage: I chose it for storing resumes and other files, but it adds separate file storage instead of keeping everything in the database.


=>The pick you debated most

The decision I debated most was Fastify vs NestJS. Fastify is lightweight and gives more control, while NestJS provides more built-in structure. I chose Fastify because this project needs flexibility and a lightweight backend.



2.=> TypeScript vs JavaScript

For example, if the job application expects an applicant ID but I accidentally use the wrong property name, TypeScript can catch the mistake before the application runs. Plain JavaScript may allow the mistake to continue until it causes a problem at runtime.

The framework axis

Minimal frameworks provide fewer built-in features and give developers more freedom, while batteries-included frameworks provide more features and structure. Fastify is closer to the minimal side, which suits this project because I want more control over the architecture.
 
 Database-access spectrum

Raw SQL means writing SQL directly, a query builder helps construct SQL through code, and an ORM lets us work with database models. A full ORM can hide inefficient database queries, especially the N+1 query problem.

 Runtime validation

TypeScript types mainly exist during development and are removed when the code runs. Zod checks the actual incoming request at runtime, so it can reject invalid data that TypeScript alone cannot detect.

Redis's double duty

Redis has two jobs: caching data and supporting BullMQ background job queues. Caching is used in the caching module, while Redis is also used later for background jobs and workers.