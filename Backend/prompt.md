I'm giving you a Backend Architecture PDF for the LastMile Carbon project. This document contains the complete system architecture, backend responsibilities, service/module design, API structure, database schema and relationships, authentication/authorization approach, external API integrations, end-to-end data flow, and technology stack. Treat this PDF as the primary, authoritative source of truth for everything you build. Your job is to actually implement the working backend in this repository — not to describe it, not to produce a plan and stop, not to give recommendations. Build it.

One correction to apply wherever the PDF specifies Stripe or Stripe Connect: use Razorpay instead (RazorpayX Payouts for rider reward payouts, Razorpay Orders/Payment API for buyer credit purchases), since Stripe is not currently available for Indian merchant accounts. Apply this substitution consistently — environment variable names, service wrapper naming, and any code you write — everywhere the PDF references Stripe.

## Step 1 — Inspect the repository first
Before reading the PDF or writing any code, inspect the existing repository. Determine what already exists: backend code, configuration, dependencies, database setup, API routes, environment files, and any existing frontend/backend integration points. Note anything already built, even partially.

## Step 2 — Read and fully understand the architecture before writing any code
Read the entire Backend Architecture PDF completely. From it, build a full understanding of:
- The complete system architecture and how layers connect (API layer → routes → controllers → services → database)
- Every service and module's responsibility
- The full API structure — every endpoint group, method, path, and contract
- The complete database schema — every table, field, data type, relationship, and index
- The authentication and authorization approach, including role-based access
- Every external API/service integration and why each one exists
- The complete data flow between frontend, backend, database, and external services
- Any background jobs, real-time functionality, caching, or queue requirements specified
- Security and validation requirements

Do not start implementing anything until you've done this. Summarize back to me, in a few bullet points, the tech stack, the total table/endpoint count, and the key business logic you're about to implement — so I can catch any misreading before you start generating files.

## Step 3 — Compare the architecture against the existing codebase
Identify what's missing, incomplete, or incorrect relative to the PDF. Do not blindly overwrite existing working functionality — if something already implemented conflicts with the PDF, analyze the conflict carefully before deciding how to resolve it, and preserve useful existing code where it's compatible with the architecture.

## Step 4 — Create an implementation plan, then actually build
After comparing architecture to existing code, create a short implementation plan covering the order you'll build in. Then proceed to implement it. Do not stop after producing the plan — the plan is a checkpoint, not the deliverable.

## Step 5 — Follow the architecture exactly; don't redesign it
Implement precisely what the PDF specifies:
- The exact technology stack named in the document
- The exact database structure — every table, field, relationship, and index as specified
- The exact API contracts — method, path, request/response shapes, and the response envelope format specified
- The exact service boundaries and module responsibilities
- The exact authentication/authorization approach
- The exact external integrations and data flow

Do not introduce a different technology, pattern, or structure than what's specified. If something in the PDF is ambiguous or a minor detail is unspecified, make a reasonable engineering decision that stays consistent with the rest of the architecture — never substitute a different technology or invent an unspecified feature.

## Step 6 — Build the backend completely, not a skeleton
Implement all backend functionality required by the architecture, including as applicable: server/application setup, configuration, environment variable handling, database connection, models/schema, migrations, authentication, authorization, API routes, controllers, services, business logic, validation, error handling, external API integrations, the CO2/emissions calculation logic, route-related processing, reward calculation logic, rider/user functionality, dashboard/analytics functionality, reporting, notifications, any real-time or background processing specified, caching, and logging. Only build what the PDF specifies or what's necessary to make that specified architecture actually function — don't add unspecified features.

## Step 7 — Implement every API properly
For every endpoint described in the architecture, implement the correct HTTP method, URL/path, request parameters and body, validation, authentication requirement, authorization/role check, business logic, database operations, response structure, error responses, and HTTP status codes. Every response must follow one consistent structure across the entire API — implement the response envelope format the PDF specifies and apply it everywhere, success and error alike.

## Step 8 — Implement the database exactly as specified
Build every table/collection with the correct fields, data types, relationships, constraints, indexes, unique fields, foreign keys, timestamps, and required/optional fields exactly as the PDF specifies. Create proper migrations/schema generation for the chosen stack. Use real persistent storage everywhere the architecture requires it — never substitute temporary in-memory data for something the PDF specifies as persisted.

## Step 9 — Implement backend security properly
Cover authentication, authorization, password handling, token/session security, input validation, sanitization, rate limiting where specified, CORS, environment-based secrets, API key protection, injection prevention, secure error responses (no leaking internals), and sensitive data handling. Never hardcode API keys, passwords, secrets, or credentials anywhere in the codebase — everything sensitive goes through environment variables.

## Step 10 — Integrate external APIs properly
For every external service the architecture specifies (routing/maps, payments/payouts, or any other named integration): understand from the PDF why each integration exists, build a clean service wrapper around it, keep its API keys in environment variables only, handle failures/timeouts/invalid responses gracefully with the fallback behavior the PDF specifies, never expose external API keys to the frontend, and keep each integration modular enough to be swapped later. If an integration requires credentials I haven't provided, build the integration structure correctly and clearly tell me which environment variable is needed — never invent placeholder credentials that look real.

## Step 11 — Robust error handling and validation throughout
Validate every incoming request, return meaningful and consistent error responses, and handle database failures, external API failures, authentication failures, invalid resource requests, and unexpected server errors gracefully. Never expose internal stack traces or implementation details in production-facing error responses.

## Step 12 — Write production-quality, well-organized code
Clear project organization matching the folder structure the PDF specifies, proper separation of concerns, reusable services and utilities, meaningful naming, proper typing, clean error handling, minimal duplication, and maintainable business logic. Do not dump the backend into a few giant files. Follow the architecture's intended structure rather than introducing your own unnecessary abstractions.

## Step 13 — Environment configuration
Create a complete `.env.example` listing every environment variable the architecture requires — database connection, authentication secrets, external API keys (Mapbox, Razorpay, etc.), and any other integration specified in the PDF — each with a short comment explaining its purpose. Never commit real secrets or credentials to the repository.

## Step 14 — Test the backend, don't just assume it compiles
Implement tests for the highest-priority areas: authentication, authorization, the core CO2/emissions calculation logic, route processing, reward calculation logic, database operations, the most important API endpoints, and external API failure handling. A successful build is not evidence the implementation is correct — actually exercise the logic, especially the calculation functions, and verify outputs against hand-calculated expected values where the PDF gives you the formula.

## Step 15 — API documentation
If the PDF specifies a documentation approach (e.g. a Postman collection or OpenAPI spec), implement it that way. Otherwise, produce clear documentation covering: available endpoints, request/response formats, authentication requirements, required environment variables, how to run the backend locally, and how to test the APIs.

## Step 16 — Frontend integration readiness
Ensure stable, predictable API contracts; proper CORS configuration for the frontend's origin(s); a clear authentication flow; consistent error responses; consistent response structures throughout; and no unnecessary coupling between frontend and backend concerns.

## Step 17 — Final verification before declaring this done
Confirm all of the following actually work, not just that the code compiles:
- Backend starts successfully
- Database connects successfully
- Migrations/schema setup runs correctly
- APIs are reachable and return the documented shapes
- Authentication works for every role the architecture specifies
- Authorization correctly restricts each role to its own endpoints
- Validation correctly rejects bad input
- Core business logic (CO2 calculation, reward calculation, credit aggregation/verification, purchase flow) produces correct results
- External integrations are handled correctly, including their failure/fallback paths
- Errors are handled properly and consistently
- Every environment variable is documented in `.env.example`
- No secrets are committed anywhere in the repository
- The implementation matches the Backend Architecture PDF

## Final summary
When you're done, give me one summary covering: what was implemented, what was changed (if this was an existing repo), what was tested and how, which environment variables I need to configure myself, which external API keys I need to provide, and any remaining limitations or TODOs.

## Ground rules for this whole session
- The PDF is the primary source of truth — do not redesign the architecture it specifies
- Never invent API keys, credentials, database passwords, external service accounts, or unspecified features
- When a minor detail is genuinely unspecified, make a reasonable decision consistent with the rest of the architecture rather than asking me about every small thing — only come back to me when something is genuinely undeterminable from the PDF and the existing repo combined
- Do not stop after producing a plan or a partial implementation — the objective is a working, tested backend