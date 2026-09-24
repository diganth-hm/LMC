You are now working on the FINAL FRONTEND ↔ BACKEND INTEGRATION
phase of my LastMile Carbon project.

IMPORTANT:

The frontend is ALREADY BUILT.
The backend is ALREADY BUILT.

Both projects already contain their own architecture documentation:

- FRONTEND_ARCHITECTURE.md
- BACKEND_ARCHITECTURE.md

Your job is to connect the existing frontend and backend.

DO NOT rebuild either project.
DO NOT redesign the frontend.
DO NOT rewrite the backend.
DO NOT replace existing working business logic.
DO NOT create duplicate APIs.

==================================================
PHASE 1 — READ THE ARCHITECTURE DOCUMENTS
==================================================

Before changing any code, locate and read:

1. FRONTEND_ARCHITECTURE.md
2. BACKEND_ARCHITECTURE.md

Treat these files as the primary technical documentation
for the existing project.

Understand:

- frontend architecture
- backend architecture
- folder structure
- frontend applications
- backend services
- API contract
- authentication
- database
- Supabase integration
- Mapbox integration
- GRS calculation
- carbon calculation
- rewards
- buyer/credit functionality
- admin functionality
- user roles
- API endpoints
- request/response formats
- environment variables
- error handling

Do not assume an architecture that is not documented in
these files.

==================================================
PHASE 2 — COMPARE DOCUMENTATION WITH ACTUAL CODE
==================================================

After reading both architecture files, inspect the actual codebase.

The documentation may describe the intended architecture,
while the code represents the current implementation.

Compare:

FRONTEND_ARCHITECTURE.md
        ↕
Actual frontend code

BACKEND_ARCHITECTURE.md
        ↕
Actual backend code

Identify any differences.

Create:

INTEGRATION_AUDIT.md

Include:

1. Frontend applications
2. Backend services
3. Existing API endpoints
4. Frontend API calls
5. Endpoint mismatches
6. Request/response mismatches
7. Type mismatches
8. Authentication mismatches
9. Role/permission mismatches
10. Missing API services
11. Missing frontend hooks
12. Hardcoded/mock data
13. Environment variables
14. CORS requirements
15. Supabase integration
16. Mapbox integration
17. Remaining integration work

DO NOT make major code changes yet.

==================================================
PHASE 3 — CREATE FRONTEND ↔ BACKEND API MAP
==================================================

Create a complete mapping:

Frontend Screen
        ↓
Frontend Hook
        ↓
Frontend Service
        ↓
HTTP Method
        ↓
Backend Endpoint
        ↓
Request
        ↓
Backend Response
        ↓
Frontend Type
        ↓
UI

Example:

Rider Dashboard
→ useRiderSummary()
→ riders.ts
→ GET
→ /api/riders/:id/summary
→ RiderSummary
→ RiderSummary Type
→ Dashboard UI

Do this for all major screens.

==================================================
PHASE 4 — CONNECT THE EXISTING SYSTEMS
==================================================

After the audit, connect the frontend to the EXISTING backend.

Follow the architecture documented in the frontend
architecture file.

If the architecture specifies:

Page
 ↓
Component
 ↓
TanStack Query / Zustand
 ↓
Typed API Service
 ↓
Axios
 ↓
Backend

follow that structure.

Components should not directly call Axios unless the
existing architecture explicitly specifies otherwise.

==================================================
PHASE 5 — AUTHENTICATION
==================================================

Connect the frontend to the backend's existing authentication.

Do NOT create a new authentication system.

Verify:

- login
- OTP/password flow as documented
- JWT/session handling
- token persistence
- Axios authentication headers
- logout
- session restoration
- token expiration
- 401 handling
- role-based access

Use the exact authentication contract defined in:

BACKEND_ARCHITECTURE.md

==================================================
PHASE 6 — ENVIRONMENT VARIABLES
==================================================

Find the environment variables specified by the architecture
documents.

Do not hardcode:

- backend URLs
- Supabase secrets
- JWT secrets
- Mapbox secrets
- API keys

Make sure frontend environment variables point to the actual
running backend.

Create/update .env.example if required.

Never commit real secrets.

==================================================
PHASE 7 — REMOVE ONLY THE NECESSARY MOCK DATA
==================================================

Find frontend screens that currently use:

- mock users
- mock routes
- mock CO2
- mock GRS
- mock rewards
- mock wallet data
- mock analytics
- mock credits
- mock purchases
- mock certificates

Connect them to the real backend.

If the frontend architecture already supports mock mode,
KEEP IT.

The desired behavior should be:

USE_MOCKS=true
→ mock data

USE_MOCKS=false
→ real backend

Do not rewrite components just to remove mock data.

==================================================
PHASE 8 — RIDER APP
==================================================

Connect the actual Rider App flow defined in
FRONTEND_ARCHITECTURE.md.

Verify:

Login
→ Dashboard
→ Delivery Assignment
→ Route Comparison
→ Route Selection
→ Live Tracking
→ Completion
→ CO2 Result
→ Reward
→ Wallet / History

The frontend must NOT independently recreate backend
business logic.

The backend remains the source of truth for:

- route selection
- GRS
- CO2
- rewards
- delivery status
- wallet
- carbon calculations

==================================================
PHASE 9 — PLATFORM
==================================================

Connect every Platform/Admin screen defined by the
frontend architecture.

Verify real backend data for:

- dashboard
- fleet analytics
- emissions
- leaderboard
- rider details
- delivery analytics
- billing
- reports

Do not calculate backend analytics independently in React
if the backend already provides them.

==================================================
PHASE 10 — BUYER PORTAL
==================================================

Connect every Buyer screen defined by the frontend architecture.

Verify:

- dashboard
- credit inventory
- batch details
- audit trail
- pricing
- quantity selection
- purchase
- confirmation
- purchase history
- certificates
- impact
- settings

The backend remains authoritative for:

- inventory
- pricing
- purchase validation
- transactions
- certificates
- carbon-credit data

Never trust frontend-calculated purchase totals as the
authoritative transaction value.

==================================================
PHASE 11 — MAPBOX
==================================================

Inspect the existing Mapbox implementation.

Connect it according to the architecture documents.

Verify:

- Mapbox token
- route data
- polylines
- pickup
- destination
- rider location
- selected route
- alternate routes
- live tracking

Do not duplicate backend route calculation unnecessarily.

==================================================
PHASE 12 — LOADING / ERROR / EMPTY STATES
==================================================

Connect the existing UI states to real API states.

Verify:

Loading
→ skeleton/loading UI

Success
→ real backend data

Empty
→ existing empty-state UI

Error
→ existing error UI + retry

Do not remove the existing UI/UX.

==================================================
PHASE 13 — QUERY INVALIDATION
==================================================

After mutations, make sure related frontend data refreshes.

Examples:

Delivery completed
→ refresh delivery
→ refresh dashboard
→ refresh CO2 history
→ refresh route history

Reward received
→ refresh wallet
→ refresh dashboard

Credit purchased
→ refresh inventory
→ refresh purchase history
→ refresh certificates
→ refresh impact

Follow the state architecture documented in
FRONTEND_ARCHITECTURE.md.

==================================================
PHASE 14 — SECURITY
==================================================

Verify:

- no secrets in frontend
- no service-role Supabase key exposed
- protected backend endpoints remain protected
- JWT handling is correct
- role authorization works
- CORS is correct
- users cannot access another user's data
- frontend route guards are not treated as the only security layer

Do not weaken backend security to make integration easier.

==================================================
PHASE 15 — END-TO-END TESTING
==================================================

Test the real system, not just the UI.

RIDER:

Login
→ Dashboard
→ Delivery
→ Routes
→ GRS
→ Green Route
→ Tracking
→ Completion
→ CO2
→ Reward
→ Wallet

PLATFORM:

Login
→ Dashboard
→ Analytics
→ Emissions
→ Leaderboard
→ Delivery Analytics
→ Billing
→ Reports

BUYER:

Login
→ Dashboard
→ Inventory
→ Batch
→ Audit Trail
→ Purchase
→ Confirmation
→ Certificate
→ Impact

Verify that database/backend records actually change.

==================================================
PHASE 16 — BUILD AND TYPE CHECK
==================================================

Run the appropriate checks for BOTH frontend applications
and backend.

Fix:

- TypeScript errors
- API type mismatches
- build errors
- runtime errors
- authentication errors
- CORS errors
- network errors

Do not hide errors using:

- any
- @ts-ignore
- disabling TypeScript checks
- disabling lint rules unnecessarily

==================================================
PHASE 17 — FINAL REPORT
==================================================

After integration is complete, create:

INTEGRATION_REPORT.md

Include:

1. Frontend ↔ backend connection status
2. Connected API endpoints
3. Authentication status
4. Rider integration status
5. Platform integration status
6. Buyer integration status
7. Mapbox status
8. Supabase status
9. Environment variables
10. Mock data status
11. Query invalidation
12. CORS status
13. Errors fixed
14. Remaining issues
15. Manual testing results
16. Deployment requirements

For every unresolved issue, specify:

FILE:
PROBLEM:
CAUSE:
REQUIRED ACTION:

==================================================
STRICT RULES
==================================================

1. READ BOTH ARCHITECTURE.md FILES FIRST.
2. INSPECT THE ACTUAL CODE SECOND.
3. DOCUMENT MISMATCHES BEFORE MAKING LARGE CHANGES.
4. DO NOT REBUILD THE FRONTEND.
5. DO NOT REBUILD THE BACKEND.
6. DO NOT REDESIGN THE UI.
7. DO NOT INVENT API ENDPOINTS.
8. DO NOT INVENT DATABASE FIELDS.
9. DO NOT duplicate backend business logic in frontend.
10. DO NOT expose secrets.
11. DO NOT weaken authentication or authorization.
12. Keep the existing architecture.
13. Reuse existing services, hooks, components and types.
14. Make small, testable integration changes.
15. Test every major flow against the REAL backend.
16. If architecture documentation and actual code disagree,
    identify the discrepancy and use the actual implementation
    plus documented contract to determine the safest fix.
17. Do not declare integration complete until real API flows
    have been tested.

==================================================
START NOW
==================================================

FIRST:

1. Locate FRONTEND_ARCHITECTURE.md.
2. Locate BACKEND_ARCHITECTURE.md.
3. Read both completely.
4. Inspect the frontend.
5. Inspect the backend.
6. Create INTEGRATION_AUDIT.md.
7. Create the frontend ↔ backend endpoint mapping.

DO NOT start modifying the application until these are complete.