# LastMile Carbon · Frontend Engineering

## Tech Stack & Architecture Blueprint — Person 1

The exact technologies, project structure, and integration contract for building the Rider App, Platform Dashboard, and Buyer Portal from the Figma blueprint.

### Contents

1. Tech Stack
2. Frontend Architecture
3. Folder Structure
4. Routing Architecture
5. State Architecture
6. API Integration Structure
7. Component Architecture
8. Development Structure
9. Frontend ↔ Backend Integration
10. Final Architecture Diagram

---

## 01 — Tech Stack

Every choice below optimizes for one thing: Person 1 shipping three working UIs in 24 hours without fighting the tools. Nothing exotic, nothing that needs config beyond a few minutes.

### Rider mobile app
**React Native + Expo (TypeScript)**

Matches the report's own stack choice. Expo Go lets you preview on a real phone in seconds with no native build step — critical when you have 24 hours, not 24 hours plus an Xcode/Android Studio setup.

### Platform/Admin web dashboard & Corporate Buyer portal
**React + Vite (TypeScript)**

One web codebase for both (see Section 2 for why). Vite gives near-instant hot reload, which matters more than anything else when you're iterating on 20+ screens in one day.

### UI components
**shadcn/ui + Radix primitives (web) · React Native Paper (rider app)**

shadcn/ui gives accessible, unstyled-enough-to-customize components (tables, modals, dropdowns) that map directly onto the Figma component list in Section 7 without a fight. React Native Paper covers the rider app's simpler component needs (buttons, cards, inputs) without pulling in a heavy UI kit.

### Styling
**Tailwind CSS (web) · NativeWind (rider app)**

NativeWind lets the rider app use the exact same Tailwind utility classes as the web apps, so the color tokens, spacing scale, and radius values from the Figma design system (Section 6 of the blueprint) are configured once in a shared `tailwind.config` and used identically everywhere.

### Routing
**React Router v6 (web) · React Navigation — Bottom Tabs + Native Stack (rider app)**

Standard, boring, well-documented — exactly what you want under time pressure. React Navigation's bottom tabs map 1:1 onto the rider app's 4-tab structure from the blueprint.

### State management
**Zustand (client/UI state) + TanStack Query (server/API state)**

Zustand needs almost no boilerplate for things like "which route is currently selected" or "is the sidebar collapsed." TanStack Query handles all backend data — caching, loading states, error states, refetching — for free, which directly solves the loading/error/empty states specified for every screen in the blueprint.

### API communication
**Axios + a single typed API client, wrapped by TanStack Query hooks**

One Axios instance per app with a base URL and interceptors (auth token injection, error normalization) — see Section 6 for the exact structure.

### Forms & validation
**React Hook Form + Zod**

Covers login/OTP, vehicle profile settings, buyer purchase quantity input, and report filters with minimal code and built-in validation error states.

### Charts / analytics
**Recharts (web) · react-native-svg + Victory Native (rider app)**

Recharts covers every chart type in the Platform Dashboard and Buyer Portal (line, bar, donut) with simple declarative components. Victory Native handles the rider app's CO2 history line chart without needing a second charting mental model.

### Maps & route visualization
**@rnmapbox/maps (rider app only)**

Matches the backend's Mapbox integration directly — same provider, same route/polyline data shapes. Platform Dashboard and Buyer Portal don't need live maps for the MVP (city breakdowns are charts/tables, not maps), so skip adding Mapbox to the web bundle entirely.

### Animations
**React Native Reanimated + Lottie (rider app) · Framer Motion (web, sparingly)**

The reward celebration and CO2 count-up moments are the emotional core of the rider demo — Lottie handles a pre-made confetti/checkmark animation with zero custom animation code. Framer Motion is used only for subtle transitions on web (page fades, card entrances), not required for MVP function.

### Icons
**Lucide (lucide-react for web, lucide-react-native for rider app)**

Same icon set, same visual language, both platforms — matches the "one consistent icon set" rule from the design system.

### PDF / certificate viewing
**Browser-native `<iframe>`/object rendering for preview + direct download link for the PDF blob returned by the backend**

Person 2's backend generates the actual certificate PDF (see the execution plan). The frontend does not need a PDF-generation library at all — it only needs to display and trigger download of a file the backend already produced. This avoids pulling in a heavy PDF library for a 24-hour build.

### Authentication handling
**JWT stored in Expo SecureStore (rider app) / httpOnly-style handling via localStorage + Axios interceptor (web, hackathon-acceptable)**

SecureStore is the standard, low-effort secure token storage for Expo. On web, given the 24-hour scope, a plain Axios interceptor reading from localStorage is acceptable — a production hardening pass (httpOnly cookies) is a fine post-hackathon task, not a demo blocker.

### Notifications / toasts
**react-hot-toast (web) · react-native-toast-message + Expo Notifications (rider app)**

Expo Notifications specifically covers the "new delivery assigned" push notification described in the blueprint's rider app flow — react-native-toast-message covers in-app confirmation toasts (e.g. reward paid).

### Build / deployment
**Vite build → Vercel or Netlify (web apps) · Expo Go / EAS preview build (rider app)**

Web apps deploy in under a minute on Vercel with zero config. For the rider app, skip a full native build entirely for the hackathon — demo via Expo Go on a physical device or the Expo web preview, and only consider an EAS build if there's spare time at the end.

---

## 02 — Frontend Architecture

### One frontend project, or separate?

Two codebases, not three:

| Codebase | Contains | Why |
|---|---|---|
| `apps/rider` | Rider mobile app only | Different runtime entirely (React Native vs. web) — cannot share a bundler or routing system with the web apps, so it must be its own project regardless. |
| `apps/web` | Platform/Admin Dashboard and Corporate Buyer Portal, as one Vite React app with two route namespaces (`/platform/*` and `/buyer/*`) | Both are React web apps sharing the same component library, chart library, and table patterns. Running them as one project means one dev server, one build, one deploy, and shared components with zero cross-project workspace configuration — the right trade for a 24-hour build. They stay logically separate via folder structure (Section 3) and route-level access control (a platform admin can't hit `/buyer/*` and vice versa), so nothing about the user experience is compromised by sharing a codebase. |

**Post-hackathon note:** if the platform and buyer portal later need independent deploy schedules or teams, splitting `apps/web` into two projects is a mechanical refactor (the folder structure below already keeps them separated internally) — not a rewrite. Don't do this split now; it buys nothing during the hackathon.

### Layered architecture (applies to both codebases)

```
UI Layer — Pages (screens/routes)
        ↓
Components — feature components + shared component library
        ↓
State — Zustand (client state) + TanStack Query (server state cache)
        ↓
API Layer — typed Axios client + per-domain service functions
        ↓
Backend (Person 2) — REST endpoints per the agreed API contract
```

Every screen follows this exact chain: a Page composes Components, which read from State (a TanStack Query hook for backend data, a Zustand store for UI-only state), which is populated by the API layer calling the Backend. No component ever calls Axios directly — it always goes through a hook.

---

## 03 — Folder Structure

### apps/rider (React Native / Expo)

```
apps/rider/
├── app/                          # Expo Router file-based routes (or React Navigation screens/)
│   ├── (auth)/
│   │   └── login.tsx
│   ├── (tabs)/
│   │   ├── home.tsx
│   │   ├── wallet.tsx
│   │   ├── history.tsx
│   │   └── profile.tsx
│   └── delivery/
│       ├── assignment.tsx
│       ├── route-comparison.tsx
│       ├── live-tracking.tsx
│       ├── completion.tsx
│       └── reward.tsx
├── components/
│   ├── ui/                       # shared-pattern components local to rider app
│   └── rider/                    # RouteCard, CO2Meter, RewardOverlay, TierBadge...
├── hooks/                        # useDelivery(), useWallet(), useRiderProfile()...
├── services/
│   └── api/                      # axios instance + deliveries.ts, wallet.ts, auth.ts
├── store/                        # zustand stores: deliveryStore.ts, uiStore.ts
├── types/                        # Delivery, Route, Reward, RiderProfile interfaces
├── utils/                        # formatCurrency, formatCO2, dateHelpers
├── assets/                       # icons, lottie json, fonts
└── app.config.ts
```

### apps/web (React + Vite — Platform Dashboard + Buyer Portal)

```
apps/web/
├── src/
│   ├── pages/
│   │   ├── auth/
│   │   │   └── Login.tsx
│   │   ├── platform/              # mirrors platform routes 1:1
│   │   │   ├── DashboardOverview.tsx
│   │   │   ├── FleetAnalytics.tsx
│   │   │   ├── Emissions.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   ├── DeliveryAnalytics.tsx
│   │   │   ├── Billing.tsx
│   │   │   └── Reports.tsx
│   │   └── buyer/                 # mirrors buyer routes 1:1
│   │       ├── BuyerDashboard.tsx
│   │       ├── CreditInventory.tsx
│   │       ├── CreditBatchDetail.tsx
│   │       ├── AuditTrail.tsx
│   │       ├── QuantitySelection.tsx
│   │       ├── PurchaseFlow.tsx
│   │       ├── PurchaseConfirmation.tsx
│   │       ├── PurchaseHistory.tsx
│   │       ├── Certificate.tsx
│   │       ├── ImpactSummary.tsx
│   │       └── BuyerSettings.tsx
│   ├── components/
│   │   ├── ui/                    # shadcn/ui-based global components (Button, Card, Table...)
│   │   ├── platform/              # KPICard, LeaderboardRow, InvoiceRow...
│   │   └── buyer/                 # BatchCard, VerificationBanner, PricingTierCard...
│   ├── layouts/
│   │   ├── PlatformLayout.tsx     # sidebar + header shell for /platform/*
│   │   └── BuyerLayout.tsx        # sidebar + header shell for /buyer/*
│   ├── hooks/                     # useFleetOverview(), useCreditInventory(), usePurchase()...
│   ├── services/
│   │   └── api/                   # axios instance + platform.ts, buyer.ts, auth.ts
│   ├── store/                     # zustand: uiStore.ts (sidebar state, filters)
│   ├── types/                     # Rider, CreditBatch, Purchase, Invoice interfaces
│   ├── utils/
│   ├── assets/
│   ├── App.tsx                    # route definitions, role-gated route groups
│   └── main.tsx
├── tailwind.config.ts             # shared design tokens — colors, spacing, radius
└── vite.config.ts
```

---

## 04 — Routing Architecture

### Authentication (shared pattern, both apps)

| Route | Screen |
|---|---|
| `/login` | Login (phone + OTP for rider; email/password or magic link for platform & buyer) |

### Rider App (React Navigation route names)

| Route | Screen |
|---|---|
| Login | Login |
| Tabs/Home | Dashboard |
| Tabs/Wallet | Wallet |
| Tabs/History | CO2 History (with Route History as a sub-tab or segment) |
| Tabs/Profile | Profile / Vehicle |
| Delivery/Assignment | Delivery Assignment |
| Delivery/RouteComparison | Route Comparison |
| Delivery/RouteSelection | Route Selection (confirm) |
| Delivery/LiveTracking | Live Tracking |
| Delivery/Completion | Delivery Completion |
| Delivery/CO2Reveal | CO2 Saving Reveal |
| Delivery/Reward | Green Reward Notification |
| Profile/GreenScore | Green Score / Badge |
| Wallet/TransactionDetail/:id | Transaction Detail |
| History/DeliveryDetail/:id | Delivery Detail drill-down |

### Platform / Admin (React Router, under `/platform`)

| Route | Screen |
|---|---|
| `/platform` | Dashboard Overview |
| `/platform/fleet-analytics` | Fleet / City Analytics |
| `/platform/emissions` | CO2 Emissions & Savings |
| `/platform/leaderboard` | Rider Leaderboard |
| `/platform/leaderboard/:riderId` | Rider Detail |
| `/platform/delivery-analytics` | Delivery Analytics |
| `/platform/billing` | Rewards / Billing |
| `/platform/reports` | Reports / Export |

### Corporate Buyer (React Router, under `/buyer`)

| Route | Screen |
|---|---|
| `/buyer` | Buyer Dashboard |
| `/buyer/inventory` | Credit Inventory |
| `/buyer/inventory/:batchId` | Credit Batch Details |
| `/buyer/inventory/:batchId/audit-trail` | Verification / Audit Trail |
| `/buyer/inventory/:batchId/purchase` | Quantity Selection → Purchase Flow (multi-step within one route, or `/purchase/quantity` and `/purchase/checkout` as two steps) |
| `/buyer/purchase/:orderId/confirmation` | Purchase Confirmation |
| `/buyer/history` | Purchase History |
| `/buyer/certificates/:certId` | Certificate View / Download |
| `/buyer/impact` | Buyer Impact / CO2 Summary |
| `/buyer/settings` | Buyer Profile / Settings |

**Route guards:** `/platform/*` requires role `platform_admin`; `/buyer/*` requires role `corporate_buyer`. A logged-in user with the wrong role hitting the wrong namespace redirects to their own dashboard, not to an error page — keeps the demo resilient if someone clicks the wrong bookmark.

---

## 05 — State Architecture

| State Category | Tool | Notes |
|---|---|---|
| Auth session (token, logged-in user, role) | Global Zustand (persisted) | Read by route guards and the Axios interceptor; written once at login, cleared at logout |
| Rider — active delivery (current assignment, selected route) | Global Zustand (scoped to rider app) | Needs to survive navigation across the whole Assignment → Comparison → Selection → Tracking → Completion chain — this is exactly what global client state is for |
| Rider — wallet balance & transactions | Server state — TanStack Query (`useWallet`) | Backend-owned data, cached and invalidated after a reward event |
| Rider — dashboard stats, CO2/route history | Server state — TanStack Query | Fetched per screen, cached with a short stale time so pull-to-refresh feels responsive |
| Platform — dashboard analytics, fleet/city data, leaderboard | Server state — TanStack Query | Keyed by the active date-range/filter selection so changing a filter triggers a refetch with its own cache entry |
| Platform — active filters (date range, city selection) | Local/UI state | Component-local `useState`, or a small Zustand slice if shared across a page's sub-components — doesn't need to persist across navigation; resets when leaving the page |
| Buyer — credit inventory listing | Server state — TanStack Query | Cached with a short stale time; inventory can change if another buyer purchases mid-session |
| Buyer — in-progress purchase (selected batch, quantity, tier) | Global Zustand (scoped to buyer app) | Needs to survive the Batch Details → Quantity Selection → Purchase Flow → Confirmation chain, same reasoning as the rider's active delivery state |
| Buyer — purchase history, certificates | Server state — TanStack Query | Invalidated/refetched immediately after a successful purchase |
| Form inputs (login OTP, vehicle selector, purchase quantity) | Local state — React Hook Form internal state | Never promoted to global state — forms own their own draft values until submit |
| UI-only state (sidebar collapsed, active tab, modal open/closed) | Local/UI state — Component-local `useState` | Pure presentation state, no reason to lift it higher |

**Rule of thumb applied consistently:** if the data comes from the backend, it's a TanStack Query hook. If it's UI-only and needed by one component tree, it's local `useState`. If it's UI-adjacent but needs to survive a multi-screen flow (an in-progress delivery, an in-progress purchase), it's Zustand. This is the same three-way split for both the rider app and the web app — no separate mental model needed per surface.

---

## 06 — API Integration Structure

Mirrors the API contract already agreed with Person 2 (from the execution plan). One Axios instance per app, one service file per backend domain, one TanStack Query hook per screen-level data need.

```
services/api/client.ts       # axios.create({ baseURL, timeout }) + request/response interceptors
services/api/auth.ts         # login(), verifyOtp(), logout()
services/api/deliveries.ts   # getRoutes(deliveryId), completeDelivery(id) [rider app]
services/api/riders.ts       # getRiderSummary(id) [rider app]
services/api/fleet.ts        # getFleetOverview(filters) [platform]
services/api/credits.ts      # getCredits(), getAuditTrail(id), purchaseCredit() [buyer]
```

| Layer | Responsibility |
|---|---|
| Axios instance (`client.ts`) | Base URL from environment variable, request interceptor attaches the auth token, response interceptor normalizes errors into one shape (see below) before they reach any hook |
| Service functions (`auth.ts`, `deliveries.ts`, etc.) | One function per endpoint, fully typed request/response — this is the literal implementation of the shared API contract table from the execution plan |
| TanStack Query hooks (`useRoutes()`, `useCreditInventory()`, etc.) | Wrap a service function with caching, loading, and error state — this is what components actually import and call |
| Components/Pages | Call only the hooks, never the service functions or Axios directly |

### Normalized error shape (returned by the response interceptor)

| Field | Meaning |
|---|---|
| `status` | HTTP status code, or `"network"` if the request never reached the server |
| `message` | Human-readable message safe to show directly in a toast or inline error state |
| `code` | Machine-readable error code (e.g. `INSUFFICIENT_INVENTORY`, `OTP_INVALID`) for cases where the UI needs to branch behavior, not just display a message |

Every screen's "Error" state specified in the blueprint reads from this exact shape — a component never has to know whether an error came from a 500, a validation failure, or a dropped connection.

---

## 07 — Component Architecture

Directly maps onto the component library already defined in the Figma blueprint — same four groups.

| Group | Lives in | Examples |
|---|---|---|
| GLOBAL | `apps/web/src/components/ui/` and `apps/rider/components/ui/` (duplicated intentionally — see note below) | Button, Input, Card, Badge, Table, Modal, Toast, LoadingSkeleton, EmptyState, DateRangePicker, Avatar, LineChart, BarChart, DonutChart |
| RIDER | `apps/rider/components/rider/` | BottomTabBar, RouteComparisonCard, CO2MeterWidget, RewardCelebrationOverlay, WalletTransactionItem, RouteHistoryItem, VehicleTypeSelector, GreenTierBadge, DeliveryAssignmentSheet |
| PLATFORM | `apps/web/src/components/platform/` | Sidebar (platform variant), KPICard, CityFilterDropdown, LeaderboardRow, InvoiceRow, ReportTemplateCard, BaselineVsActualChart |
| BUYER | `apps/web/src/components/buyer/` | Sidebar (buyer variant), CreditBatchCard, VerificationBadgeBanner, AuditTrailRecordRow, PricingTierCard, QuantityStepper, CertificatePreview, ImpactEquivalenceIcons |

**Why global components are duplicated rather than shared via a package:** setting up a shared `packages/ui` workspace that both a React Native app and a Vite web app consume is real cross-platform tooling work (React Native and web can't literally share JSX components without an abstraction layer like Tamagui or a monorepo build config). For 24 hours, it's faster to implement the same design tokens twice — one Tailwind config, applied consistently — than to build that abstraction. Post-hackathon, unifying them into a shared package is a reasonable next step, not a hackathon one.

---

## 08 — Development Structure

Ordered so Person 1 always has something demoable, and never blocks on Person 2 (mock data covers every gap — see Section 9's mock data strategy).

| Hours | Phase | Details |
|---|---|---|
| Hr 0–1 | Setup | Scaffold both codebases (`apps/rider` via create-expo-app, `apps/web` via create-vite). Configure Tailwind/NativeWind with the design system's tokens (colors, spacing, radius) from the Figma blueprint. Agree the API contract with Person 2. |
| Hr 1–2 | Global component library | Build the shared components first (Button, Card, Badge, Table, Modal, Toast, LoadingSkeleton, EmptyState) in both codebases — every subsequent screen depends on these existing. |
| Hr 2–8 | Rider App — core delivery loop | Login → Dashboard → Delivery Assignment → Route Comparison → Route Selection → Live Tracking → Completion → CO2 Reveal → Reward, wired to mock data end to end. |
| Hr 8–11 | Rider App — secondary screens | Wallet, CO2 History, Route History, Profile/Vehicle, Green Score — all read-only views on the same mock dataset. |
| Hr 11–16 | Platform Dashboard — all 7 pages | Build in the order a judge would view them: Overview → Emissions → Leaderboard → Fleet Analytics → Delivery Analytics → Billing → Reports. |
| Hr 16–21 | Buyer Portal — all 12 screens | Build the critical path first: Dashboard → Inventory → Batch Details → Audit Trail (highest design priority) → Quantity → Purchase → Confirmation → Certificate, then the secondary screens (History, Impact, Settings, Pricing Tiers). |
| Hr 21–23 | Integration | Swap every mock data call for Person 2's live endpoints, screen by screen, in the same priority order as above. |
| Hr 23–24 | Demo rehearsal | Full run-through on real devices; confirm the mock-data fallback still works if any live endpoint is unstable during judging. |

---

## 09 — Frontend ↔ Backend Integration

| Contract item | Definition |
|---|---|
| API base URL | One environment variable per app: `EXPO_PUBLIC_API_URL` (rider) and `VITE_API_URL` (web) — never hardcoded in a service file, so switching between local backend, staging, and demo-day URL is a one-line `.env` change |
| Authentication | Backend issues a JWT on login/OTP-verify; frontend stores it (SecureStore on rider, localStorage on web) and the Axios interceptor attaches it as `Authorization: Bearer <token>` on every request automatically |
| Request/response handling | All requests/responses follow the shapes defined in the shared `api-contract.md` from the execution plan; the frontend's TypeScript types in `types/` are written to match that contract exactly, so a mismatch is a compile error, not a runtime surprise |
| Error handling | Every error passes through the Axios response interceptor into the normalized shape from Section 6 before any component sees it — components render error states generically, never parsing raw backend error payloads themselves |
| Loading states | Provided automatically by TanStack Query's `isLoading` / `isFetching` flags on every hook — no manual loading booleans anywhere in the codebase |
| Mock data strategy | A `mocks/` folder (mirroring the real response shapes) is used by every hook via a single feature flag (`USE_MOCKS` environment variable). Person 1 builds 100% of the UI against this before Person 2's endpoints exist; flipping the flag off at integration time (Hr 21–23) points the same hooks at the real API with no component code changes. |
| Environment variables | `EXPO_PUBLIC_API_URL`, `VITE_API_URL`, `VITE_USE_MOCKS` / `EXPO_PUBLIC_USE_MOCKS` — kept in `.env.local` per app, never committed, with a checked-in `.env.example` so Person 2 (or anyone else) can spin up the frontend against their own backend instantly |

---

## 10 — Final Architecture Diagram

```
     Rider App                Platform Dashboard          Buyer Portal
 React Native / Expo         React / Vite — /platform/*   React / Vite — /buyer/*
        │                              │                          │
        └──────────────────────────────┼──────────────────────────┘
                                        ↓
                      Shared Frontend Architecture
        Pages → Components → State (Zustand + TanStack Query) → Typed API layer
                                        ↓
                                  API Layer
        Axios client + interceptors · per-domain service functions ·
                    normalized errors · mock/live toggle
                                        ↓
                              Backend (Person 2)
        Database · CO2/GRS/Reward logic · Carbon ledger · REST endpoints
                              per api-contract.md
```

Two codebases feed one shared architectural pattern into one API contract into one backend. The rider app never talks to the same server routes as the web app's `/buyer/*` section talks to for purchases — but both go through the identical layered structure (Page → Component → Hook → Service → Axios), which is what makes this a genuinely maintainable frontend rather than three unrelated projects that happen to share a Figma file.

**Two codebases. One layered pattern. One contract with Person 2. Zero blocked hours.**
