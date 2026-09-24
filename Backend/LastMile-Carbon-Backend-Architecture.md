LASTMILE CARBON · BACKEND ENGINEERING

Backend Architecture & Execution Plan — Person 2
Database, APIs, CO²/reward/carbon-credit logic, verification, buyer transactions, demo data, and
deployment — built to connect cleanly with Person 1's frontend from hour one.

CONTENTS

1. Tech Stack

10. Authentication & Roles

2. Complete Backend Architecture

11. Demo Data / Seed System

3. Backend Folder Structure

12. External API Strategy

4. Database Architecture

13. 24-Hour Execution Plan

5. API Architecture

14. Integration Plan With Person 1

6. Frontend ↔ Backend Contract

15. Testing Checklist

7. Core Business Logic

16. Deployment Architecture

8. Data Flow

17. Final Backend Deliverables

9. Real-Time Demo Flow

01 Tech Stack
Every choice favors speed of development and low integration friction with Person 1's React/React Native
stack over theoretical scalability.
Backend framework + language
Node.js + Express (TypeScript)
Same language as the entire frontend (TypeScript), so types can be shared/mirrored between frontend and backend with zero contextswitching. Express has the lowest setup friction of any Node framework for a REST API built in hours, not days.

Database
PostgreSQL
Relational integrity matters here — deliveries link to riders link to rewards link to credit batches link to purchases; this is a naturally
relational data model, not a document store use case. Matches the stack already named in the project's own technical report.

ORM
Prisma
Schema-first — one schema.prisma file defines every table, generates fully-typed query functions, and auto-generates migrations.
This is the single fastest path from "database design" to "working queries" for two people who don't have time to hand-write SQL and
matching types separately.

Authentication
JSON Web Tokens (jsonwebtoken) + bcrypt for password hashing
Stateless, no session store needed, trivially verified in Express middleware, and simple for the frontend to attach as a bearer token. No
need for a full auth provider (Auth0, Clerk) at hackathon scale — it adds integration surface area without adding demo value.

API architecture
REST over JSON
Simplest possible contract for Person 1 to consume with Axios + TanStack Query — no GraphQL schema/resolver layer to build, no
gRPC tooling. Every endpoint is documented explicitly in Section 5.

Validation
Zod
Same library Person 1 is using on the frontend for form validation — request body schemas can be defined once per endpoint and
reused as the source of truth for the API contract documentation in Section 5.

Security
Helmet, cors, express-rate-limit, bcrypt
Four lightweight middleware packages cover the baseline: secure HTTP headers, controlled cross-origin access (critical since frontend
and backend are separate deployments), basic abuse-rate limiting, and password hashing. This is "good enough for a public demo,"
not a security audit — appropriate for the scope.

External APIs
Mapbox Directions API (real) · CarbonAPI (simulated/internal — see Section 12) · Stripe Connect (sandbox/test
mode, real)
Full reasoning and fallback plan per service is in Section 12 — summarized here because it directly shapes the tech stack decision to
include the Stripe and Mapbox SDKs.

File / PDF generation
pdf-lib (server-side, no headless browser required)
Generates the ESG report export and the buyer certificate as real downloadable PDFs without the overhead of running a headless
Chrome instance (Puppeteer) for a hackathon-scale document. Faster to set up, faster to run, no extra system dependencies to install.

Real-time communication
Not required — polling via TanStack Query refetch intervals is sufficient
See Section 9 for the full reasoning. Socket.io is a legitimate stretch goal but is not on the critical MVP path — the demo's "real-time"
feel can be achieved with a 5-10 second polling interval on the platform and buyer dashboards, which is far less integration risk during
a 24-hour window.

Testing
A maintained Postman/Thunder Client collection (primary) + a handful of Jest smoke tests on the CO2/reward
calculation functions (secondary)
Full test coverage is not a hackathon priority. The Postman collection doubles as living API documentation for Person 1 (see Section
14) and as Person 2's own manual regression check. A few unit tests specifically on the calculation logic (Section 7) are worth the 30
minutes because that logic is the one thing judges will probe hardest.

Deployment
Render or Railway (backend) + Neon or Supabase (managed PostgreSQL)
Both offer a working public HTTPS URL from a git push in minutes, free tier sufficient for demo traffic, and zero server management.
Neon/Supabase both give an instant Postgres connection string with no local database setup required.

Environment / configuration management
dotenv + a checked-in .env.example
Standard, zero-friction, and directly supports the integration contract in Section 14 — Person 1 needs to know exactly which
environment variables exist without guessing.

02 Complete Backend Architecture

Frontend (Person 1) — Rider App, Platform Dashboard, Buyer Portal

↓
API Layer — Express app, CORS, Helmet, rate limiting, JSON body parsing

↓
Routes — one router file per domain, maps HTTP method + path to a controller function

↓
Middleware — requireAuth, requireRole, Zod request validation (sits between Routes and Controllers)

↓
Controllers — parse the request, call the relevant service(s), shape the HTTP response

↓
Services / Business Logic — AuthService, RouteService, EmissionsService, RewardService, WalletService,
CreditAggregationService, VerificationService, PurchaseService, CertificateService

↓
Database — PostgreSQL via Prisma ORM

Where each capability lives
Capability
Authentication

CO² calculation

Lives in

Notes

services/authService.ts + middleware/

Issues and verifies JWTs; middleware runs before any protected

requireAuth.ts

controller

services/emissionsService.ts

Calls the Mapbox client, applies the GRS scoring and emission factor
formulas (Section 7), calls the internal verification step

Reward

services/rewardService.ts

calculation
Credit

walletService to record the payout
services/creditAggregationService.ts

aggregation
Verification

Runs immediately after a delivery is marked complete; calls

Runs on a schedule (or on-demand for the demo) to pool verified CO2
savings into a credit batch

services/verificationService.ts

Attaches a verification record to each aggregated batch — the audit trail
data Person 1's Buyer Portal reads

Buyer purchases

services/purchaseService.ts

Validates available inventory, deducts it, creates the purchase record

Certificate

services/certificateService.ts

Called immediately after a successful purchase; generates the PDF via

generation
External APIs

pdf-lib and stores/returns a reference to it
services/external/ (mapboxClient.ts,

Isolated behind a thin client wrapper per Section 12, so a failure or mock-

carbonApiClient.ts, stripeClient.ts)

swap never touches controller code

Controllers never contain business logic themselves — they only translate HTTP in and out. This is what
lets Person 2 unit-test the CO2/reward/verification math (Section 15) without spinning up the whole Express
app.

03 Backend Folder Structure
backend/
├── src/
│
├── routes/
# one file per domain — maps paths to controller functions, applies middleware
│
│
├── auth.routes.ts
│
│
├── rider.routes.ts
│
│
├── deliveries.routes.ts
│
│
├── routes.routes.ts
# route-comparison/selection endpoints
│
│
├── co2.routes.ts
│
│
├── wallet.routes.ts
│
│
├── platform.routes.ts
│
│
├── analytics.routes.ts
│
│
├── credits.routes.ts
│
│
├── verification.routes.ts
│
│
├── buyer.routes.ts
│
│
├── purchases.routes.ts
│
│
└── certificates.routes.ts
│
├── controllers/
# one file per domain, mirrors routes/ 1:1
│
├── services/
# all business logic — see Section 2 table
│
│
└── external/
# mapboxClient.ts, carbonApiClient.ts, stripeClient.ts
│
├── models/
# prisma schema lives here (schema.prisma) + generated client re-export
│
├── middleware/
│
│
├── requireAuth.ts
│
│
├── requireRole.ts
│
│
├── validateRequest.ts
# wraps a Zod schema around req.body/query/params
│
│
└── errorHandler.ts
# central error normalizer — matches the frontend's expected error shape
│
├── utils/
# formatCurrency, kgToTonnes, dateHelpers, emissionFactors.ts (constants table)
│
├── config/
│
│
├── env.ts
# typed, validated process.env access — single source of truth
│
│
└── constants.ts
# reward rate, threshold, pricing tiers
│
├── types/
# shared request/response TypeScript interfaces — mirrors frontend types/
│
├── app.ts
# Express app assembly — middleware, route mounting
│
└── server.ts
# entrypoint — starts the HTTP server
├── prisma/
│
├── schema.prisma
# full database schema (Section 4)
│
└── migrations/
├── seed/
│
├── seed.ts
# entrypoint — orchestrates the full demo dataset build (Section 11)
│
├── seedRiders.ts
│
├── seedDeliveries.ts
│
└── seedBuyers.ts
├── tests/
│
└── emissionsService.test.ts
# Jest — the handful of calculation-logic tests worth writing
├── .env.example
├── package.json
└── tsconfig.json

04 Database Architecture
15 tables. PostgreSQL, managed via Prisma. All primary keys are UUIDs unless noted.
Table

Key fields

PK

FK → references

Notable indexes

users

email, phone, password_hash, role (enum:

id

—

unique(email),

rider/platform_admin/corporate_buyer),

unique(phone)

created_at
riders

user_id, name, tier (enum: bronze/silver/

id

user_id → users.id

index(tier)

id

rider_id → riders.id

index(rider_id)

id

platform_admin_user_id →

—

gold/platinum), grs_score, member_since
vehicles

rider_id, type (enum: petrol_2w/ev_2w/
diesel_3w/cng_3w), registered_at

fleets

name (e.g. Swiggy, Zomato),
platform_admin_user_id,

users.id

saas_rate_per_rider
cities

name, state

id

—

unique(name)

deliveries

rider_id, fleet_id, city_id, pickup_lat/lng,

id

rider_id → riders.id, fleet_id →

index(rider_id, assigned_at),

fleets.id, city_id → cities.id

index(status)

delivery_id → deliveries.id

index(delivery_id) — 3 rows

drop_lat/lng, status (enum: assigned/
in_progress/completed), assigned_at,
completed_at
routes

route_selections

delivery_id, distance_km, duration_min,

id

congestion_score, grs_score, co2_kg,

per delivery (candidate

is_selected (bool)

routes)

delivery_id, route_id, selected_at

id

delivery_id → deliveries.id,

unique(delivery_id) — one

route_id → routes.id

confirmed selection per
delivery

co2_calculations

delivery_id, baseline_co2_kg,

id

delivery_id → deliveries.id

unique(delivery_id)

id

delivery_id → deliveries.id,

index(rider_id, paid_at)

actual_co2_kg, co2_saved_kg,
calculated_at
rewards

delivery_id, rider_id, co2_saved_kg,
amount_inr, status (enum: pending/paid/

rider_id → riders.id

failed), paid_at
wallet_transactions

rider_id, reward_id, amount_inr, type (enum:

id

credit/withdrawal), balance_after, created_at

rider_id → riders.id, reward_id

index(rider_id, created_at)

→ rewards.id (nullable —
withdrawals have none)

credit_batches

city_id, period_start, period_end,

id

city_id → cities.id

index(status)

id

credit_batch_id →

index(credit_batch_id)

total_kg_pooled, total_tonnes,
price_per_tonne, tonnes_available, status
(enum: pending_verification/verified/
sold_out)
credit_batch_deliveries

credit_batch_id, co2_calculation_id — join
table linking individual verified savings into a

credit_batches.id,

batch

co2_calculation_id →
co2_calculations.id

verification_records

credit_batch_id, method (e.g. "ISO 14064

id

factor cross-check"), verification_hash,

credit_batch_id →

unique(credit_batch_id)

credit_batches.id (1:1)

rider_count, delivery_count, verified_at
corporate_buyers

user_id, company_name, billing_contact

id

user_id → users.id

—

purchases

buyer_id, credit_batch_id,

id

buyer_id → corporate_buyers.id,

index(buyer_id,

credit_batch_id →

purchased_at)

tonnes_purchased, price_per_tonne,

credit_batches.id

total_amount_inr, status (enum: completed/
failed), purchased_at
certificates

purchase_id, pdf_url, verification_hash,
issued_at

id

purchase_id → purchases.id

unique(purchase_id)

(1:1)

Relationships, in plain terms

• A rider belongs to a fleet (via their deliveries) and has one active vehicle record
• A delivery generates exactly 3 routes (Mapbox candidates), one of which becomes a
route_selection
• Once a delivery completes, one co2_calculations row is created (baseline vs actual for the selected
route), which produces one rewards row, which produces one wallet_transactions row
• Many co2_calculations rows (across many riders) are pooled into one credit_batches row via the
credit_batch_deliveries join table — this is the aggregation step
• Each credit_batches row gets exactly one verification_records row before its status can move to
verified and become purchasable
• A corporate_buyer makes a purchases row against a specific credit_batches row, which
decrements that batch's tonnes_available
• Each successful purchases row produces exactly one certificates row

05 API Architecture
Every response follows one consistent envelope: { success: boolean, data: T | null, error:
{ code, message } | null }. This is what makes the frontend's generic loading/error handling
(Section 6 of the frontend blueprint doc) possible without per-endpoint special-casing.
Authentication
Method

Endpoint

Purpose

Auth

Request

/auth/rider/

Start rider login — send OTP to phone

None

{ phone }

POST

login

POST

Verify OTP, issue JWT

/auth/rider/

None

Platform admin / buyer email+password

/auth/login

{ phone, otp }

None

login
GET

Errors

{ otpSent:

400 invalid phone

true }

verify-otp

POST

Response

Return the currently authenticated user

/auth/me

Required

{ token,

401 invalid/

user }

expired OTP

{ email,

{ token,

401 invalid

password }

user }

credentials

—

{ user }

401 no/invalid

+ role
POST

token

Invalidate client-side session (stateless

/auth/logout

Required

—

—

{ success:

— mostly a formality)

true }

Rider
Method

Endpoint

Purpose

Auth

Request

GET

/riders/me

Rider dashboard

Rider

—

PATCH

/riders/me/

Response

Errors

{ name, tier, grsScore,

404 rider

summary — today's

todayDeliveries, todayCo2Saved,

not found

stats, tier

todayEarned }

Update vehicle type

Rider

{ vehicleType }

400 invalid

{ vehicle }

type

vehicle

Deliveries
Method
GET

POST

GET

Endpoint

Purpose

Auth

Request

Response

Errors

Rider

—

{ delivery | null }

—

Rider

—

/deliveries/

Get the rider's active/

current

pending delivery, if any

/deliveries/:id/

Mark delivered — triggers

{ co2Saved,

404 delivery not found,

complete

CO2 calc → reward →

rewardAmount,

409 already completed

wallet chain

newBalance }

/deliveries/

Paginated past deliveries for

history

Route History screen

Rider

query:

{ deliveries[],

page,

pagination }

—

limit

Routes
Method
GET

Endpoint

Purpose

Auth

Request

/routes?

Get 3 scored route

Rider

deliveryId=

candidates for a
delivery

Response

Errors

query:

{ routes: [{ id, distanceKm,

404 delivery not found,

deliveryId

durationMin, co2Kg, fuelCostInr,

502 Mapbox

grsScore, isGreenest }] }

unavailable (fallback
used)

POST

/routes/:id/

Confirm the chosen

select

route, locks the

Rider

—

{ routeSelection }

409 already selected

delivery in progress

CO²
Method
GET

GET

Endpoint

Purpose

Auth

Request

Rider

/co2/history?

Daily CO2 saved trend for the

range=

CO2 History screen

/co2/summary

Cumulative CO2 stats for

Rider

Response

Errors

query: range

{ series: [{ date, co2SavedKg }],

—

(7d/30d)

totalKg, treeEquivalent }

—

{ totalSavedKg, treeEquivalent }

—

dashboard cards

Rewards / Wallet
Method

Endpoint

Purpose

Auth

Request

GET

/wallet

Current balance + weekly

Rider

—

summary
GET

Errors

{ balance, weeklyEarnings:

—

[...] }

Paginated transaction list

/wallet/

Response

Rider

transactions

query: page,

—

{ transactions[], pagination }

limit

Platform / Admin
Method
GET

Endpoint

Purpose

Auth

Request

/platform/

Dashboard KPI row

Platform
Admin
Platform

query: from,

{ cities: [{ name, riderCount,

Admin

to, city

co2Saved, avgGrs, adoptionPct }] }

—

overview

GET

/platform/fleet-

Per-city breakdown

analytics

GET

Response

Errors

query: from,

{ activeRiders, totalCo2Saved,

—

to

totalBonusesPaid, avgGrs }

/platform/

Current + historical

Platform

billing

SaaS invoices

Admin

Endpoint

Purpose

Auth

Request

/analytics/

Baseline-vs-actual

Platform

query: from, to

emissions

CO2 chart data

Admin

—

—

{ current: { riderCount, ratePerRider,
totalDue, status }, history[] }

Analytics
Method
GET

Response

Errors

{ series: [{ date, baselineKg,

—

actualKg }], pctReduction,
byVehicleType }

GET

GET

/analytics/

Ranked riders by

Platform

leaderboard

green performance

Admin

/analytics/

Delivery volume +

Platform

deliveries

route adoption

Admin

query: sortBy

query: from, to

—

{ volumeSeries[],

—

adoptionSeries[],

trend
POST

{ riders: [{ rank, name, tier,
co2Saved, adoptionPct }] }

avgDeliveryTime }

/analytics/

Generate BRSR/

Platform

{ template, from,

reports/

ESG report PDF/

Admin

to, format }

generate

CSV

{ downloadUrl }

400 no
data for
range

Carbon Credits
Method

Endpoint

GET

/credits

Purpose

Auth

Request

Response

Errors
—

Available credit

Corporate

query:

{ batches: [{ id, city, period,

batch inventory

Buyer

sortBy

tonnesAvailable, pricePerTonne,
verified }] }

GET

/

Single batch detail

Corporate

—

Buyer

credits/:id

{ batch, riderCount, deliveryCount,

404 not

dateRange }

found

Verification
Method
GET

Endpoint

Purpose

Auth

Request

/credits/:id/

Full verification

Corporate

—

audit-trail

breakdown for a

Buyer

Response

Errors

{ method, verificationHash, riderCount,

404 not

deliveryCount, sampleRecords: [...] }

found

batch

Corporate Buyer
Method
GET

Endpoint

Purpose

Auth

Request

/buyer/

KPI summary

Corporate

—

dashboard

+ recent

Buyer

PATCH

Errors

{ totalTonnesPurchased,

—

impactEquivalent, activeCertificates,

activity
GET

Response

recentActivity[] }

/buyer/

Company

Corporate

profile

profile/settings

Buyer

—

{ companyName, billingContact }

—

/buyer/

Update

profile

settings

Corporate

{ companyName?,

{ profile }

400

Buyer

billingContact? }

invalid
input

Purchases
Method

Endpoint

Purpose

Auth

POST

/purchases

Execute a credit

Corporate

purchase

Buyer

Request

Response

Errors

{ creditBatchId,

{ purchase,

400 exceeds available

tonnes }

certificateId }

inventory, 402 payment
failed

GET

GET

Purchase

Corporate

history

Buyer

/

Single

Corporate

purchases/:id

purchase detail

Buyer

/purchases

query: from, to

{ purchases[] }

—

—

{ purchase }

404 not found

Certificates
Method

Endpoint

Purpose

Auth

Request

GET

/certificates/:id

Certificate

Corporate

—

metadata for

Buyer

Response

Errors

{ certificate: { companyName, tonnes,

404 not

verificationHash, issuedAt } }

found

binary PDF stream

404 not

preview
GET

/certificates/:id/

Download the

Corporate

download

generated PDF

Buyer

—

found

06 Frontend ↔ Backend Contract
Every screen from Person 1's blueprint, mapped to the exact API call that powers it.
Rider
Screen

API

Method

Required data

Response used for

Login

/auth/rider/login , /auth/rider/verify-otp

POST,

phone, otp

token storage, redirect to

POST

Dashboard

Dashboard

/riders/me , /deliveries/current

GET, GET

—

stat cards, active delivery card

Delivery

/deliveries/current

GET

—

pickup/drop/fee display

Route Comparison

/routes?deliveryId=

GET

deliveryId

3 route cards, map polylines

Route Selection

/routes/:id/select

POST

routeId (path

confirms selection, starts tracking

Assignment

param)
Live Tracking

no dedicated endpoint — client-side GPS + the already-

—

—

live position rendering

POST

deliveryId (path

triggers the full CO2 → reward →

param)

wallet chain

fetched route polyline
Delivery

/deliveries/:id/complete

Completion
CO² Saving

same call as above — response includes co2Saved

—

—

animated counter reveal

Green Reward

same call as above — response includes

—

—

reward notification amount

GET, GET

page, limit

balance card, weekly chart,

rewardAmount, newBalance

Wallet

/wallet , /wallet/transactions

transaction list
History (CO2 +

/co2/history , /deliveries/history

GET, GET

range / page, limit

trend chart, route list

Vehicle Profile

/riders/me/vehicle

PATCH

vehicleType

updates emission-factor basis

Green Score

/riders/me

GET

—

tier, grsScore, progress

Route)

Platform
Screen

API

Method

Required data

Response used for

Dashboard

/platform/overview

GET

from, to

KPI row, trend chart

Fleet Analytics

/platform/fleet-analytics

GET

from, to, city

per-city bar chart + table

City Analytics

/platform/fleet-analytics (filtered)

GET

city

same endpoint, city-scoped view

CO² Analytics

/analytics/emissions

GET

from, to

baseline-vs-actual chart, vehicle breakdown

Leaderboard

/analytics/leaderboard

GET

sortBy

ranked rider table

Billing

/platform/billing

GET

—

invoice summary + history table

Reports

/analytics/reports/generate

POST

template, from, to, format

download link

Corporate Buyer
Screen

API

Method

Required data

Response used for

Dashboard

/buyer/dashboard

GET

—

KPI row, activity feed

Credit Inventory

/credits

GET

sortBy

batch card grid

Credit Details

/credits/:id

GET

batchId (path

batch summary header +

param)

overview tab

batchId (path

verification banner, sample record

param)

table, hash

—

—

tier comparison cards

POST

creditBatchId,

executes transaction

Verification / Audit

/credits/:id/audit-trail

GET

Trail
Pricing

static/local — pricing tier thresholds are a config constant,
not a live endpoint

Purchase

/purchases

tonnes
Purchase

response of the above call

—

—

order ID, total, certificate link

/purchases

GET

from, to

transaction table
preview pane, PDF download

Confirmation
Purchase History
Certificate

Impact Summary

/

GET,

certId (path

certificates/:id , /certificates/:id/download

GET

param)

/buyer/dashboard (impact fields)

GET

—

cumulative offset stat, equivalence
icons

07 Core Business Logic
Route comparison

For a given delivery, EmissionsService requests 3 alternative routes from Mapbox (pickup → drop,
profile: driving-traffic). For each candidate: distance_km and congestion come directly
from Mapbox's annotations. A baseline route is defined as the highest-GRS (least green) of the 3
candidates — this represents "what the rider would have taken without the app." The rider's actuallyselected route becomes the selected route. The gap between baseline and selected route's CO2 is what
eventually becomes the "CO2 saved" figure — see below.
CO² calculation
Input

Source

distance_km

Mapbox route response

avg_speed_kmh, congestion

Mapbox route annotations

vehicle type

vehicles table, per rider

emission factor (kg CO2 per liter/kWh)

config/constants.ts — petrol 2.31, diesel 2.68, EV 0.82/kWh, CNG 1.97

Formula: fuelEfficiency = f(vehicleType, avgSpeed, congestion) → fuelUsed =
distanceKm / fuelEfficiency → co2Kg = fuelUsed × emissionFactor[vehicleType].
Output unit is kilograms, stored per route in routes.co2_kg, and per delivery (baseline vs actual) in
co2_calculations.
Green route determination (GRS)

Each of the 3 candidate routes gets a Green Route Score from 0-100 (lower = greener), computed from a
weighted combination of normalized distance, congestion, and the resulting CO2 for that specific vehicle
type. The route with the lowest GRS is flagged isGreenest: true in the API response and visually
highlighted by the frontend — the backend decides which route is greenest, the frontend only renders that
decision.
Reward calculation

co2SavedKg = max(0, baselineCo2Kg - actualCo2Kg). If co2SavedKg > 0.05 (the minimum
threshold, avoids sub-paisa payouts), rewardAmountInr = co2SavedKg × 8.5. This runs inside
RewardService, called synchronously from the /deliveries/:id/complete controller so the
frontend gets the reward amount in the same response that confirms completion.
Green Score / tiers
Tier

Threshold (rolling 30-day green route adoption %)

Bronze

0-39%

Silver

40-64%

Gold

65-84%

Platinum

85%+

A rider's grs_score field (their personal Green Route Score, distinct from a per-route GRS) is recalculated
after each completed delivery as a rolling average of their own adoption rate, and their tier is derived from
that score against the table above — this is what the Green Score screen displays.
Wallet

Every paid rewards row immediately writes one wallet_transactions row (type: credit). Balance
is never stored as a single mutable number — it's always computed as the running sum of that rider's
transactions (or cached and invalidated on each new transaction for performance), which keeps the wallet
auditable and avoids balance-drift bugs.
Carbon aggregation

CreditAggregationService pools co2_calculations rows (via credit_batch_deliveries)
within a defined period and city into a single credit_batches row, summing co2_saved_kg across all
included deliveries and converting to tonnes (÷ 1000). For the hackathon, this runs on-demand (a seed/
admin-triggered function) rather than a real scheduled job — see Section 9.
Explicit separation, stated plainly: a raw CO2 saving is not automatically a sellable credit. The pipeline is strictly: CO2 savings
(from co2_calculations, generated per delivery) → aggregation (pooled into a credit_batches row, status
pending_verification) → verification/eligibility (a verification_records row is created, batch status becomes verified)
→ credit inventory (only verified batches are returned by GET /credits). A batch that hasn't passed the verification step is
never visible to a buyer, and the API enforces this with a status filter, not just a UI convention.

Verification (demo-level mechanism)

For the hackathon, "verification" is an internal cross-check, not a connection to a real third-party ISO 14064
auditor — that would be a post-hackathon integration. The demo-level mechanism:
VerificationService recomputes each included delivery's CO2 figure independently from its stored
inputs (distance, vehicle type, emission factor) and confirms it matches the stored co2_calculations
value within tolerance; it then generates a verification_hash (a hash of the batch's aggregated inputs)
and records rider/delivery counts. This is honestly described to judges as "an internal consistency and
audit-trail verification," not a claim of third-party legal certification.
Buyer purchase

Quantity selection is validated against the batch's current tonnes_available at request time (not at
page-load time, to avoid stale-inventory race conditions). Pricing tier is looked up from a config table based
on the requested quantity. On purchase: a purchases row is created,
credit_batches.tonnes_available is decremented by the purchased amount within the same
database transaction (so a failure rolls back both together), and a Stripe sandbox charge is simulated/
executed. Purchase history is simply purchases rows filtered by buyer_id.

Certificate

Immediately after a successful purchase, CertificateService generates a PDF containing: buyer
company name, tonnes certified, the source batch's verification_hash, issue date, and a QR code
linking to a public (or buyer-authenticated) verification page. The PDF is stored and its reference saved in
the certificates table; the API returns a downloadable URL.

08 Data Flow
Stage

Handled by

Rider completes delivery

DeliveryController.complete — entrypoint for the whole chain

Route selected (already happened earlier

RouteController.select — confirms which of the 3 candidates was taken

in the flow)
CO² calculated

EmissionsService.calculate — baseline vs. actual

CO² saving recorded

Written to co2_calculations

Reward generated

RewardService.calculate → written to rewards

Wallet updated

WalletService.credit → written to wallet_transactions

Savings aggregated

CreditAggregationService.pool (on-demand for demo) → written to credit_batches +
credit_batch_deliveries

Credit batch created

Same call above — batch status starts as pending_verification

Verification record

VerificationService.verify → written to verification_records , batch status → verified

Credit inventory

GET /credits — filters to verified batches only

Corporate buyer views credit

CreditController.list / .detail / VerificationController.auditTrail

Buyer purchases

PurchaseService.purchase — validates inventory, calls Stripe

Inventory updated

Same call — decrements credit_batches.tonnes_available in the same DB transaction

Purchase recorded

Written to purchases

Certificate generated

CertificateService.generate — writes to certificates , returns PDF URL

09 Real-Time Demo Flow
The scenario — a rider's completed delivery visibly changing platform stats and buyer inventory — is
achievable and worth designing for. What's real vs. simulated:
Piece
Rider completes a

Real or
simulated

How

Real

Actual database writes via the normal API call

Platform dashboard

Real, near-

The frontend's TanStack Query hook on /platform/overview uses a short polling interval (5-10s) during

reflecting the new

real-time

the demo — no websocket needed for this to look live

Credit batch aggregation

Simulated/

Rather than a real scheduled cron job pooling savings hourly, a demo-only admin action (button or script)

picking up the new

triggered

triggers CreditAggregationService.pool on cue during the live demo, so the presenter controls exactly

delivery → CO2/reward
recorded

delivery

saving

when the buyer's inventory updates

Buyer portal showing

Real, polling-

updated inventory

based

Same polling pattern as the platform dashboard on GET /credits

Recommended demo sequencing: complete a rider delivery live → switch to platform dashboard (stats already updated via polling)
→ trigger the aggregation manually → switch to buyer portal (inventory now reflects it) → execute a purchase. This is honest about
what's automated vs. presenter-triggered while still delivering the "everything is connected" impression judges are looking for.

10 Authentication & Roles
Role

Login flow

Token

Protected routes

Rider

Phone number → OTP (mocked OTP acceptable for demo

JWT, 7-day expiry, stored in

All /riders/* , /deliveries/* , /

— e.g. always 1234 in a non-prod environment flag)

Expo SecureStore

routes/* , /co2/* , /wallet/*

Email + password

JWT, 24hr expiry, stored in

All /platform/* , /analytics/*

Platform
Admin
Corporate

web localStorage
Email + password

Buyer

JWT, 24hr expiry, stored in

All /buyer/* , /credits/* , /

web localStorage

purchases/* , /certificates/*

Backend authorization mechanism: every JWT payload includes { userId, role }. requireAuth
middleware verifies the token signature and attaches the decoded payload to req.user.
requireRole('rider' | 'platform_admin' | 'corporate_buyer') is applied per-route-group
(e.g. every router file under /platform/* applies requireRole('platform_admin') once at the
router level, not per individual endpoint) — this keeps authorization consistent and impossible to forget on a
new route added under an existing group.

11 Demo Data / Seed System
Entity

Approx. count

Notes

Cities

3

Mangaluru (primary/detailed), plus 2 comparison cities for the Fleet Analytics screen

Fleets

2-3

Swiggy, Zomato (matches the pitch report's named partners)

Riders

25-40 detailed + aggregate

One rider — Guru Prasad — gets the full 30-day detailed dataset matching the pitch report's week-

padding to represent "1,500"

by-week table exactly; the rest get lighter randomized-but-plausible data. Platform-level KPIs (e.g.
"1,500 active riders") are computed as a documented multiplier applied consistently across every
screen, not a separately hardcoded number

Deliveries

~30 days × ~20/day for Guru =

Distributed realistically across the 30-day window with a clear improving trend

~600, plus proportionally scaled
counts for other seeded riders
Routes

3 per delivery

Generated with the real GRS/CO2 formula against randomized-but-plausible distance/congestion
inputs, not hand-typed numbers

CO² savings /

1 per completed delivery

Derived from the actual formula in Section 7 — never a disconnected hardcoded figure

3-4

Aggregated from the seeded co2_calculations using the real aggregation service, not invented

rewards
Credit
batches
Verification

tonnage
1 per batch

Generated via the real VerificationService logic against the seeded batches

2-3

Named demo personas (e.g. stand-ins for Manipal Group, ING Vysya per the pitch report — rename

records
Corporate
buyers
Purchases

if no sign-off)
2-3

At least one purchase pre-seeded (for Purchase History to not be empty) and one credit batch
deliberately left unpurchased (for the live demo purchase flow)

Internal consistency rule: the seed script runs the actual service-layer functions (EmissionsService, RewardService,
CreditAggregationService) against randomized realistic inputs, rather than inserting pre-computed numbers directly into the
database. This guarantees every number a judge sees on the rider app, platform dashboard, and buyer portal was derived from the
same underlying formula and the same underlying rows — exactly the "no disconnected hardcoded numbers" requirement.

12 External API Strategy
Service

Why needed

Real or mocked

If it fails

Fallback

Mapbox Directions API

Real route generation

Real — free tier is sufficient for

Route

A small set of pre-fetched/cached

with live traffic/

demo volume

Comparison

route responses for the demo's known

congestion — the

screen has

pickup/drop pairs, served if the live call

actual product

nothing to show

errors or times out

N/A

mechanism
"CarbonAPI" (verification)

The pitch report

Simulated/internal — no real

N/A — it's internal,

names this as a third-

product by this name is integrated;

so "failure" isn't an

party emissions

the verification step described in

external

verification service

Section 7 is LastMile Carbon's own

dependency risk

internal cross-check logic,
presented honestly as such
Stripe Connect

Real payout

Real, sandbox/test mode —

Reward/purchase

Wrap the Stripe call in a try/catch that

mechanism for rider

Stripe's test mode is fully functional

confirmation

still completes the database

rewards and real

and free, giving genuine

would fail

transaction and marks the reward/

transaction

transaction confirmations without

purchase as pending rather than

mechanism for buyer

moving real money

blocking the whole request — the

purchases

demo narrative continues even if Stripe
sandbox has a hiccup

Geolocation (device

Live Tracking

Real — this is a device capability,

GPS)

screen's rider position

not a backend integration; no

N/A

N/A

N/A — it's local

N/A

backend risk here
PDF generation

Certificates and ESG

Real, but via a local library (pdf-lib)

reports

rather than an external API — this
removes an entire class of externaldependency risk

Priority call: Mapbox and Stripe are the only genuine external dependencies in the whole system, and both are given explicit fallback
behavior above specifically because a live demo cannot afford either one going down mid-presentation. Every other "external API"
named in the original pitch materials is either a device capability (GPS) or better implemented as internal logic for a 24-hour build
(CarbonAPI, PDF generation).

13 24-Hour Execution Plan
Phase 1 — Project Setup

Hr 0-1

• Scaffold Express + TypeScript project
• Initialize Prisma, connect to a Neon/Supabase Postgres instance
• Set up .env, config/env.ts, Helmet/cors/rate-limit middleware
• Get Mapbox and Stripe sandbox API keys working with a single test call each
• Joint task: agree the API contract with Person 1 (Section 6 of this doc is the starting draft)
Output: running Express server, DB connected

Depends on: nothing

Checkpoint — Server responds on localhost; Mapbox and Stripe test calls succeed.

Phase 2 — Database

Hr 1-3

• Write the full schema.prisma per Section 4
• Run initial migration
• Verify all relationships with a few manual test inserts via Prisma Studio
Output: all 15 tables live and queryable

Depends on: Phase 1

Checkpoint — Every table in Section 4 exists and accepts a test row respecting its foreign keys.

Phase 3 — Authentication

Hr 3-5

• Build AuthService (JWT issue/verify, bcrypt for platform/buyer passwords)
• Rider OTP flow (mocked OTP acceptable per Section 10)
• Platform/buyer email+password flow
• Build requireAuth and requireRole middleware
Output: all 5 auth endpoints working

Depends on: Phase 2 (users table)

Checkpoint — A test login for each of the 3 roles returns a valid JWT; a protected route rejects requests without one.

Phase 4 — Rider APIs

Hr 5-8

• Riders, Deliveries, Routes endpoint groups (Section 5)
• Mapbox client integration in services/external/mapboxClient.ts
Output: rider dashboard, delivery, and route endpoints functional

Depends on: Phase 3

Checkpoint — Calling GET /routes?deliveryId= against a real test delivery returns 3 Mapbox-backed routes with distance/
congestion data.

Phase 5 — CO²/Reward Engine

Hr 8-12

• Build EmissionsService (GRS scoring + CO2 formula from Section 7)
• Build RewardService (baseline/actual comparison, threshold, payout calc)
• Build WalletService
• Wire POST /deliveries/:id/complete to run the full chain synchronously
• Write the Jest tests on the calculation functions here, while the logic is fresh
Output: completing a test delivery produces a correct CO2, reward, and wallet update in one call

Depends on: Phase 4

Checkpoint — A direct API call to POST /deliveries/:id/complete returns correct co2Saved and rewardAmount, verified by
hand against the formula.

Phase 6 — Platform APIs

Hr 12-15

• Platform/Admin and Analytics endpoint groups (Section 5)
• Aggregation queries for overview/fleet/emissions/leaderboard
Output: all 7 platform-facing endpoints functional against real seeded-style data
Depends on: Phase 5 (needs real deliveries/rewards to aggregate)
Checkpoint — GET /platform/overview returns numbers that correctly sum the test data created so far.

Phase 7 — Carbon-Credit System

Hr 15-18

• Build CreditAggregationService
• Build VerificationService
• Carbon Credits and Verification endpoint groups
Output: a batch of test CO2 savings can be pooled, verified, and appear in GET /credits

Depends on: Phase 5

Checkpoint — Running the aggregation function against test deliveries produces a credit_batches row with status verified and
a populated audit trail.

Phase 8 — Buyer APIs

Hr 18-20

• Corporate Buyer and Purchases endpoint groups
• Build PurchaseService (inventory validation, decrement, Stripe sandbox call, all in one DB transaction)
Output: a test purchase correctly decrements inventory and creates a purchase record

Depends on: Phase 7

Checkpoint — A direct API call to POST /purchases against a verified test batch succeeds, decrements tonnes_available, and a
second call exceeding remaining inventory correctly fails with 400.

Phase 9 — Certificate Generation

Hr 20-21

• Build CertificateService using pdf-lib
• Certificates endpoint group
Output: a purchase produces a downloadable, correctly formatted PDF

Depends on: Phase 8

Checkpoint — Downloading a certificate for the test purchase opens as a valid PDF with the right buyer name and tonnage.

Phase 10 — Seed Data

Hr 21-22

• Write and run the full seed script per Section 11, using the real service functions
• Manually spot-check numbers across rider/platform/buyer views for consistency
Output: full demo dataset live in the database

Depends on: Phases 4-9 all complete

Checkpoint — Guru's 30-day dataset matches the pitch report's week-by-week table; platform totals correctly reflect the seeded
riders.

Phase 11 — Frontend Integration

Hr 22-23

• Support Person 1 swapping mock calls for live endpoints
• Fix any contract mismatches live
• Confirm CORS is correctly configured for the frontend's deployed/local URL
Output: all three frontend apps running against the real backend

Depends on: Phase 10

Checkpoint — Every screen on the critical demo path loads real data with no console errors.

Phase 12 — Testing

Hr 23-23.5

• Run through the full testing checklist (Section 15)
• Fix any high-priority breaks on the critical demo path first
Output: known-good state on the demo path

Depends on: Phase 11

Checkpoint — Full demo path (Section 5 of the frontend blueprint) runs once, start to finish, without a manual fix.

Phase 13 — Deployment

Hr 23.5-23.75

• Deploy backend to Render/Railway, confirm the production URL works
• Point the frontend's production env var at it
• Export the static demo-snapshot JSON as a fallback (per the earlier execution plan)
Output: publicly reachable backend

Depends on: Phase 12

Checkpoint — The deployed backend URL responds correctly to a real request from the deployed frontend, not just localhost.

Phase 14 — Final Demo Preparation

Hr 23.75-24

• Be on standby during demo rehearsal to restart/monitor the backend
• Confirm the aggregation-trigger action for the real-time demo moment (Section 9) works on cue
Output: backend ready and monitored for live judging

Depends on: Phase 13

Checkpoint — A full rehearsal run, including the manual aggregation trigger, completes without incident.

14 Integration Plan With Person 1
Item

What Person 2 provides

API documentation

The Postman/Thunder Client collection (kept updated as endpoints are built) plus this document's Section 5/6 as the
canonical reference

Environment variables

.env.example committed to the repo listing every variable Person 1 needs to know exists (even though most are

backend-only) — specifically, the production API base URL once deployed
Base API URL

Local: http://localhost:PORT/api . Production: the Render/Railway URL, shared the moment Phase 13 completes

Authentication format

Bearer JWT in the Authorization header — documented once, applies identically to all three frontend apps

Sample requests/responses

Every endpoint in Section 5 already includes a request/response shape; the Postman collection includes real example
payloads generated against the seeded data

CORS configuration

Backend explicitly allows the frontend's local dev origin(s) and its deployed origin — configured as an env-driven allowlist,
not a wildcard, so it's a one-line change when the frontend's deployed URL is known

Error format

The consistent envelope from Section 5: { success, data, error: { code, message } } — Person 1's Axios
interceptor is built against this exact shape

Mock API data if backend is

Person 2 exports a static JSON snapshot (Section 10 of the earlier execution plan) matching the real response shapes,

unfinished

usable by Person 1's mock-data toggle at any point before live integration

When to integrate: not continuously. Both people work independently against the agreed contract for roughly the first 21-22 hours
(Person 1 against mocks, Person 2 testing endpoints directly via Postman). Integration is one deliberate window at Hour 22-23 —
matching Phase 11 above and the equivalent phase in Person 1's own plan — where mock calls are swapped for live ones, screen by
screen, starting with the rider app's core delivery loop.

15 Testing Checklist
Area

Checks

Authentication

Rider OTP login succeeds; platform/buyer email+password login succeeds; invalid credentials correctly rejected; expired/missing
token correctly rejected on a protected route

Rider flow

Dashboard loads current stats; delivery assignment appears; all 3 routes render with distinct CO2/cost values

Route selection

Selecting a route locks it (second selection attempt correctly rejected); selected route's data matches what's shown on the tracking
screen

CO² calculation

Manually verify one delivery's CO2 figure against the formula by hand; confirm baseline is always ≥ actual (or saving is correctly 0,
never negative)

Reward calculation

Reward amount matches co2Saved × 8.5 ; a saving below the 0.05kg threshold correctly produces no reward

Wallet

Balance after a new reward equals previous balance plus reward amount; transaction list correctly paginates

Platform analytics

Overview KPIs match a manual sum of the underlying seeded deliveries; date range filter correctly changes results

Credit inventory

Only verified batches appear; a pending_verification batch is correctly excluded

Verification

Audit trail rider/delivery counts match the batch's actual aggregated rows; verification hash is present and consistent

Buyer purchase

A valid purchase succeeds and returns a certificate ID; a purchase exceeding available inventory is correctly rejected

Inventory

tonnes_available correctly decreases by the purchased amount immediately after purchase; concurrent/duplicate submission

deduction

doesn't double-deduct

Certificate

Generated PDF opens correctly and contains the right buyer name, tonnage, and hash

generation
API errors

Every documented error case in Section 5 actually returns the documented status code and error shape

Authorization

A rider token cannot access /platform/* or /buyer/* endpoints, and vice versa, for every role combination

Frontend

Every screen on the critical demo path loads with zero console errors against the live backend, not just mocks

integration

16 Deployment Architecture

Frontend (3 apps) → Vercel (web: Platform Dashboard + Buyer Portal) · Expo Go / EAS preview (Rider App)

↓
Backend (Express API) → Render or Railway

↓
Database (PostgreSQL) → Neon or Supabase

Item

Detail

Environment variables

DATABASE_URL , JWT_SECRET , MAPBOX_TOKEN , STRIPE_SECRET_KEY , ALLOWED_ORIGINS , PORT

(backend)
Production API URL
CORS

Set once Render/Railway assigns it; shared with Person 1 immediately (Section 14)
ALLOWED_ORIGINS env var, comma-separated list of the deployed web app's URL and local dev URLs — read into the cors

middleware config, never a wildcard in production
Database connection

Neon/Supabase connection string set as DATABASE_URL ; Prisma migrations run once against the production database
before first deploy ( prisma migrate deploy )

Secrets

All API keys (Mapbox, Stripe) and JWT_SECRET set directly in the hosting platform's environment variable dashboard —
never committed to the repo, .env stays gitignored

Basic deployment checklist

• All environment variables set on the hosting platform, matching .env.example
• Migrations run against the production database
• Seed script run once against production (or seeded data migrated from local)
• CORS allowlist includes the actual deployed frontend URL
• A test request from the deployed frontend to the deployed backend succeeds end-to-end
• Demo-snapshot JSON fallback exported and handed to Person 1 in case of live connectivity issues during
judging

17 Final Backend Deliverables
MUST HAVE — critical for the demo
• Working authentication for all 3 roles
• Rider delivery loop fully functional: assignment → routes → selection → completion → CO2 → reward → wallet
• Platform overview, emissions, and leaderboard endpoints returning real aggregated data
• Credit inventory, audit trail, and purchase flow fully functional, including inventory deduction
• Certificate generation producing a real downloadable PDF
• Full seed dataset internally consistent across rider, platform, and buyer views
• Backend deployed and reachable at a public URL
• CORS correctly configured for the deployed frontend
• Demo-snapshot JSON fallback exported

SHOULD HAVE — useful if time remains
• Fleet/city analytics breakdown with multiple cities
• Reports/export endpoint generating a real BRSR-style PDF
• Jest unit tests on the CO2/reward calculation functions
• Rate limiting tuned rather than left at defaults
• A basic admin-triggered endpoint to manually run aggregation on demand for the live demo moment (Section 9)

POST-HACKATHON — real infrastructure not worth 24 hours now
• Real scheduled cron job for aggregation instead of on-demand triggering
• Real third-party ISO 14064 verification integration
• Websocket-based real-time updates instead of polling
• Production-grade auth (refresh tokens, httpOnly cookies, rate-limited OTP with a real SMS provider)
• Full automated test suite and CI pipeline
• Multi-region deployment, database read replicas, caching layer

15 tables. 30+ endpoints. One contract with Person 1. One dataset, told consistently
everywhere.

