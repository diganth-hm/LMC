# INTEGRATION AUDIT — LastMile Carbon Frontend ↔ Backend

## 1. Frontend Applications

| Codebase | Path | Tech | Status |
|---|---|---|---|
| Web (Platform + Buyer) | `Frontend/apps/web` | React + Vite + Tailwind + TanStack Query + Zustand | ✅ Built, running on localhost:5173 |
| Rider App | `Frontend/apps/rider` | React + Vite (web preview, not React Native) + Tailwind + TanStack Query + Zustand | ✅ Built |

> **Note:** The rider app is implemented as a Vite web app (not React Native/Expo as documented). This is a documentation vs. implementation discrepancy — the web preview approach is acceptable for hackathon demo.

## 2. Backend Services

| Service | Path | Status |
|---|---|---|
| Express app (TypeScript) | `Backend/src/app.ts` | ✅ Built |
| Auth (JWT + bcrypt) | `Backend/src/services/authService.ts` | ✅ Built |
| Emissions/CO2 | `Backend/src/services/emissionsService.ts` | ✅ Built |
| Rewards | `Backend/src/services/rewardService.ts` | ✅ Built |
| Wallet | `Backend/src/services/walletService.ts` | ✅ Built |
| Route/GRS | `Backend/src/services/routeService.ts` | ✅ Built |
| Credit Aggregation | `Backend/src/services/creditAggregationService.ts` | ✅ Built |
| Verification | `Backend/src/services/verificationService.ts` | ✅ Built |
| Purchase | `Backend/src/services/purchaseService.ts` | ✅ Built |
| Certificate | `Backend/src/services/certificateService.ts` | ✅ Built |
| Report | `Backend/src/services/reportService.ts` | ✅ Built |
| Database (Prisma) | `Backend/prisma/schema.prisma` | ✅ 15 tables defined |

## 3. Existing API Endpoints (Backend)

Routes are mounted under both `/` and `/api/` (dual-mount via `mountRoutes()` in `app.ts`).

### Auth
| Method | Endpoint | Controller |
|---|---|---|
| POST | `/auth/rider/login` | `AuthController.requestRiderOtp` |
| POST | `/auth/rider/verify-otp` | `AuthController.verifyRiderOtp` |
| POST | `/auth/login` | `AuthController.loginEmailPassword` |
| GET | `/auth/me` | `AuthController.me` (requireAuth) |
| POST | `/auth/logout` | `AuthController.logout` (requireAuth) |

### Rider (requireAuth + requireRole('rider'))
| Method | Endpoint | Controller |
|---|---|---|
| GET | `/riders/me` | `RiderController.getMe` |
| PATCH | `/riders/me/vehicle` | `RiderController.updateVehicle` |

### Deliveries (requireAuth + requireRole('rider'))
| Method | Endpoint | Controller |
|---|---|---|
| GET | `/deliveries/current` | `DeliveriesController.getCurrentDelivery` |
| POST | `/deliveries/:id/complete` | `DeliveriesController.completeDelivery` |
| GET | `/deliveries/history` | `DeliveriesController.getHistory` |

### Routes (requireAuth + requireRole('rider'))
| Method | Endpoint | Controller |
|---|---|---|
| GET | `/routes?deliveryId=` | `RoutesController.getCandidateRoutes` |
| POST | `/routes/:id/select` | `RoutesController.selectRoute` |

### CO2 (requireAuth + requireRole('rider'))
| Method | Endpoint | Controller |
|---|---|---|
| GET | `/co2/history` | `Co2Controller.getHistory` |
| GET | `/co2/summary` | `Co2Controller.getSummary` |

### Wallet (requireAuth + requireRole('rider'))
| Method | Endpoint | Controller |
|---|---|---|
| GET | `/wallet` | `WalletController.getWallet` |
| GET | `/wallet/transactions` | `WalletController.getTransactions` |

### Platform (requireAuth + requireRole('platform_admin'))
| Method | Endpoint | Controller |
|---|---|---|
| GET | `/platform/overview` | `PlatformController.getOverview` |
| GET | `/platform/fleet-analytics` | `PlatformController.getFleetAnalytics` |
| GET | `/platform/billing` | `PlatformController.getBilling` |
| POST | `/platform/aggregate-now` | `PlatformController.triggerAggregation` |

### Analytics (requireAuth + requireRole('platform_admin'))
| Method | Endpoint | Controller |
|---|---|---|
| GET | `/analytics/emissions` | `AnalyticsController.getEmissions` |
| GET | `/analytics/leaderboard` | `AnalyticsController.getLeaderboard` |
| GET | `/analytics/deliveries` | `AnalyticsController.getDeliveryTrend` |
| POST | `/analytics/reports/generate` | `AnalyticsController.generateReport` |

### Credits (requireAuth + requireRole('corporate_buyer', 'platform_admin'))
| Method | Endpoint | Controller |
|---|---|---|
| GET | `/credits` | `CreditsController.listAvailableBatches` |
| GET | `/credits/:id` | `CreditsController.getBatchDetail` |

### Verification (requireAuth + requireRole('corporate_buyer', 'platform_admin'))
| Method | Endpoint | Controller |
|---|---|---|
| GET | `/credits/:id/audit-trail` | `VerificationController.getAuditTrail` |

### Buyer (requireAuth + requireRole('corporate_buyer'))
| Method | Endpoint | Controller |
|---|---|---|
| GET | `/buyer/dashboard` | `BuyerController.getDashboard` |
| GET | `/buyer/profile` | `BuyerController.getProfile` |
| PATCH | `/buyer/profile` | `BuyerController.updateProfile` |

### Purchases (requireAuth + requireRole('corporate_buyer'))
| Method | Endpoint | Controller |
|---|---|---|
| POST | `/purchases` | `PurchasesController.executePurchase` |
| GET | `/purchases` | `PurchasesController.getPurchases` |
| GET | `/purchases/:id` | `PurchasesController.getPurchaseDetail` |

### Certificates (requireAuth + requireRole('corporate_buyer', 'platform_admin'))
| Method | Endpoint | Controller |
|---|---|---|
| GET | `/certificates/:id` | `CertificatesController.getCertificate` |
| GET | `/certificates/:id/download` | `CertificatesController.downloadCertificate` |

---

## 4. Frontend API Calls (Current Implementation)

### Web — Platform Service (`services/api/platform.ts`)
| Function | Mock Endpoint | Real Endpoint |
|---|---|---|
| `getFleetOverview()` | mock | GET `/platform/overview` |
| `getCityStats()` | mock | GET `/platform/cities` ⚠️ |
| `getEmissionsStats()` | mock | GET `/platform/emissions` ⚠️ |
| `getLeaderboard()` | mock | GET `/platform/leaderboard` ⚠️ |
| `getDeliveryAnalytics()` | mock | GET `/platform/delivery-analytics` ⚠️ |
| `getInvoices()` | mock | GET `/platform/invoices` ⚠️ |
| `getReportTemplates()` | mock | GET `/platform/report-templates` ⚠️ |
| `generateReport()` | mock | POST `/platform/reports/generate` ⚠️ |

### Web — Buyer Service (`services/api/buyer.ts`)
| Function | Mock Endpoint | Real Endpoint |
|---|---|---|
| `getCreditBatches()` | mock | GET `/buyer/batches` ⚠️ |
| `getBatchDetails(batchId)` | mock | GET `/buyer/batches/:id` ⚠️ |
| `getAuditTrail(batchId)` | mock | GET `/buyer/batches/:id/audit-trail` ⚠️ |
| `getPricingTiers()` | mock | GET `/buyer/pricing-tiers` ⚠️ |
| `purchaseCredits()` | mock | POST `/buyer/purchase` ⚠️ |
| `getOrders()` | mock | GET `/buyer/orders` ⚠️ |
| `getCertificate(certId)` | mock | GET `/buyer/certificates/:id` ⚠️ |
| `getBuyerImpact()` | mock | GET `/buyer/impact` ⚠️ |
| `getBuyerProfile()` | mock | GET `/buyer/profile` |

### Web — Auth Service (`services/api/auth.ts`)
| Function | Mock Endpoint | Real Endpoint |
|---|---|---|
| `login(email, role)` | mock | POST `/auth/login` ⚠️ (missing password param) |

### Rider — Service (`services/api/riders.ts`)
| Function | Mock | Real Endpoint |
|---|---|---|
| All 10 functions | mock | `throw 'Not implemented'` ❌ |

---

## 5. Endpoint Mismatches (CRITICAL)

### Platform
| Frontend Calls | Backend Actual | Fix Needed |
|---|---|---|
| GET `/platform/cities` | GET `/platform/fleet-analytics` | Change frontend |
| GET `/platform/emissions` | GET `/analytics/emissions` | Change frontend |
| GET `/platform/leaderboard` | GET `/analytics/leaderboard` | Change frontend |
| GET `/platform/delivery-analytics` | GET `/analytics/deliveries` | Change frontend |
| GET `/platform/invoices` | GET `/platform/billing` | Change frontend |
| GET `/platform/report-templates` | No backend endpoint (static config) | Keep as static |
| POST `/platform/reports/generate` | POST `/analytics/reports/generate` | Change frontend |

### Buyer
| Frontend Calls | Backend Actual | Fix Needed |
|---|---|---|
| GET `/buyer/batches` | GET `/credits` | Change frontend |
| GET `/buyer/batches/:id` | GET `/credits/:id` | Change frontend |
| GET `/buyer/batches/:id/audit-trail` | GET `/credits/:id/audit-trail` | Change frontend |
| GET `/buyer/pricing-tiers` | No endpoint (static config) | Keep as static/local |
| POST `/buyer/purchase` | POST `/purchases` | Change frontend |
| GET `/buyer/orders` | GET `/purchases` | Change frontend |
| GET `/buyer/certificates/:id` | GET `/certificates/:id` | Change frontend |
| GET `/buyer/impact` | GET `/buyer/dashboard` (impact fields) | Change frontend |

### Auth
| Frontend Calls | Backend Actual | Fix Needed |
|---|---|---|
| POST `/auth/login` with `{ email, role }` | POST `/auth/login` expects `{ email, password }` | Add password field |

---

## 6. Response Envelope Mismatch (CRITICAL)

Backend wraps ALL responses in: `{ success: boolean, data: T | null, error: { code, message } | null }`

**Frontend services currently do `res.data`** — but Axios `.data` gives the HTTP body, which is the envelope. The actual data is at `res.data.data`.

**Fix:** All frontend service functions must extract `res.data.data` instead of `res.data`.

---

## 7. Response Shape Mismatches

| Screen | Frontend Expects | Backend Returns |
|---|---|---|
| Dashboard Overview | `FleetOverview` with trends | `{ activeRiders, totalCo2Saved, totalBonusesPaid, avgGrs }` — no trends |
| Fleet Analytics | `CityStat[]` directly | `{ cities: [...] }` — wrapped |
| Emissions | `EmissionStat[]` | `{ series, pctReduction, byVehicleType }` — different shape |
| Leaderboard | `RiderLeaderboardItem[]` | `{ riders: [...] }` — wrapped + missing fields |
| Delivery Analytics | `DeliveryAnalyticItem[]` | `{ volumeSeries, adoptionSeries, avgDeliveryTime }` — different |
| Billing | `InvoiceItem[]` | `{ current, history }` — different |
| Credits | `CreditBatch[]` directly | `{ batches: [...] }` — wrapped |
| Purchase body | `{ batchId, quantityTonnes, paymentMethod }` | Expects `{ creditBatchId, tonnes }` — different field names |

---

## 8. Authentication Mismatches

| Issue | Detail |
|---|---|
| Web login sends `{ email, role }` | Backend expects `{ email, password }` |
| Auth store starts pre-authenticated | Bypasses actual login in mock mode |
| No 401 interceptor redirect | Missing login redirect on token expiry |
| Rider .env uses wrong prefix | `EXPO_PUBLIC_*` but Vite needs `VITE_*` |

---

## 9. Environment Variable Issues

**PORT MISMATCH:** Frontend base URL = `http://localhost:8000/api/v1`, Backend PORT = `4000`, Backend routes = `/api/` (no `/v1`).

**Fix:** Change frontend base URL to `http://localhost:4000/api`.

---

## 10. Remaining Integration Work (Priority-Ordered)

### CRITICAL
1. Fix API base URL: `localhost:8000/api/v1` → `localhost:4000/api`
2. Fix response envelope extraction: `res.data` → `res.data.data`
3. Fix all ~15 endpoint path mismatches
4. Fix auth login request: add `password` field
5. Fix purchase request body field names
6. Implement real API calls in rider service

### HIGH
7. Fix response type mappings (snake_case → camelCase, shape differences)
8. Connect auth store to real login flow
9. Add 401 interceptor for login redirect
10. Fix rider `.env` prefix (`EXPO_PUBLIC_*` → `VITE_*`)

### MEDIUM
11. Add query invalidation after mutations
12. Add route guards by role
13. Connect BuyerDashboard to `GET /buyer/dashboard`
14. Gate hardcoded auth store default user behind `USE_MOCKS`
