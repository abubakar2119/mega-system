Why is the health check wired directly in app.ts rather than inside a module under src/modules/?

Anwser :-
        The health check is an infrastructure-level concern for process status, not a domain or product feature. Placing it directly in app.ts keeps it lightweight, avoids modular overhead, and ensures it registers before feature routes.


Imagine you had added a SELECT 1 to the health check handler. The database goes down. Walk through exactly what happens to the running process — step by step — and explain why that's a worse outcome than if the health check hadn't queried the database at all?

Anwser :-
         When the database drops, /health returns a 500 error, causing orchestrators (like Kubernetes) to assume the app process is broken and restart it. This drops all in-flight requests without fixing the database, creating a cascade failure that is much worse than letting the app process stay alive.

What is the difference between a liveness probe and a readiness probe? Which one did you just build, and which chapter builds the other?

Anwser :-
        A liveness probe checks if the application process is running, while a readiness probe verifies if all dependencies (like DB/Redis) are ready to handle traffic. You just built the liveness probe, and the readiness probe will be built in Chapter 72.