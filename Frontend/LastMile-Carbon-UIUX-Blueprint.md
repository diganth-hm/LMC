# LastMile Carbon · Frontend Blueprint

## Complete UI/UX Blueprint — Person 1

Rider mobile app, Platform/Admin web dashboard, and Corporate Buyer web portal. Screen-by-screen specification, ready to translate directly into Figma frames.

## Contents

1. Overall Frontend Architecture
2. Rider Mobile App — Screen Specs
3. Platform/Admin Web Dashboard
4. Corporate Buyer Web Portal
5. Navigation & User Flows
6. Figma Design System
7. Component Library
8. Responsive Design
9. Demo-Ready States
10. Final Figma Sitemap

---

## 01 Overall Frontend Architecture

Three distinct products, one shared visual system. Person 1 designs and builds all three; they share components but never share layout logic — a rider on a bike and an ESG officer on a laptop need fundamentally different interfaces even where the underlying data overlaps.

### The three surfaces

| Surface | Platform | Primary user | Context of use |
|---|---|---|---|
| Rider App | Mobile (React Native / Expo) | Delivery rider (Guru) | One-handed, outdoors, glanced at for 2-3 seconds mid-ride |
| Platform/Admin Dashboard | Web, desktop-first | Ops manager / sustainability officer at Swiggy, Zomato, Blinkit | Desk, seated, reviewing data over minutes |
| Corporate Buyer Portal | Web, desktop-first | ESG/procurement lead at a buying company | Desk, deliberate purchase decisions, needs trust signals |

### User roles

| Role | Access |
|---|---|
| Rider | Own deliveries, own wallet, own CO₂ history, own profile — no access to other riders' data |
| Platform Admin | Fleet-wide view scoped to their own platform's riders (e.g. Swiggy sees only Swiggy riders), billing, reports, no access to buyer-side data |
| Corporate Buyer | Credit marketplace, own purchase history, own certificates — no access to individual rider identities beyond aggregated/anonymized batch data |

### Navigation structure at a glance

- **Rider App** — bottom tab bar: Home · Wallet · History · Profile (4 tabs, thumb-reachable)
- **Platform Dashboard** — left sidebar: Overview · Fleet Analytics · Emissions · Leaderboard · Delivery Analytics · Billing · Reports
- **Buyer Portal** — left sidebar: Dashboard · Credit Inventory · Purchase History · Certificates · Settings

### Shared design system

One Figma library, three "product" pages inside it. Color tokens, type scale, spacing, and base components (buttons, cards, badges, inputs) are shared across all three surfaces — see Section 6 — but each surface has its own layout templates and navigation chrome.

---

## 02 Rider Mobile App — Screen Specs

**Mobile · React Native / Expo · Mobile-first**

14 screens covering the full loop from login to reward. Route Comparison and Route Selection are designed as two states of one screen (comparison view, then a confirmed/locked state) rather than two separate navigations — this matches how riders actually interact with it: view, then tap.

### 01 Login

Entry point; authenticates the rider before any delivery data loads.

- **Layout:** Full-screen, centered vertical stack: logo/wordmark top third, form middle third, action bottom third
- **Components:**
  - Logo lockup
  - Phone number input field
  - OTP input (4-6 boxes) on second step
  - Primary button ("Continue" / "Verify")
- **Info displayed:** App name/tagline only — no personal data yet
- **Actions:** Enter phone → Continue; Enter OTP → Verify & Login
- **Interactions:** Auto-advance between OTP boxes; resend OTP link appears after 30s countdown
- **Navigates to:** Dashboard (on success)
- **States:**
  - Empty — form unfilled, button disabled
  - Loading — verifying OTP, spinner on button
  - Success — brief checkmark, auto-navigate
  - Error — invalid OTP, red inline message, shake animation

### 02 Dashboard / Home

Rider's home base — shows today's status at a glance and surfaces the next delivery when one arrives.

- **Layout:** Top: greeting + date. Below: 2x2 stat card grid (today's deliveries, today's CO₂ saved, today's earnings, current GRS tier). Below that: large "waiting for delivery" state or active delivery card. Bottom tab bar.
- **Components:**
  - Greeting header with rider name
  - 4x stat cards
  - Green tier badge (small, top-right)
  - Waiting/active delivery card
  - Bottom tab bar
- **Info displayed:** Rider name, today's delivery count, today's kg CO₂ saved, today's ₹ earned, current tier (Bronze/Silver/Gold/Platinum)
- **Actions:** Tap active delivery card → go to Delivery Assignment/Route Comparison
- **Interactions:** Pull-to-refresh; delivery card animates in when a new assignment lands (push notification triggers this)
- **Navigates to:** Delivery Assignment (via active card), Wallet, History, Profile (via tabs)
- **States:**
  - Empty — "No deliveries yet today" illustration
  - Loading — skeleton stat cards
  - Success — populated stats + waiting-for-delivery pulse animation
  - Error — "couldn't load your stats" with retry

### 03 Delivery Assignment

A new delivery has landed — shows pickup/drop before route calculation.

- **Layout:** Full-screen card/modal sliding up from bottom. Map snippet top half, delivery details bottom half, primary CTA anchored at bottom.
- **Components:**
  - Mini map with pickup/drop pins
  - Order details card (restaurant/pickup name, drop address, distance, estimated earnings)
  - "Calculating green routes..." loading indicator
  - Primary button ("View Routes")
- **Info displayed:** Pickup location, drop location, straight-line distance, base delivery fee
- **Actions:** Tap "View Routes" → Route Comparison
- **Interactions:** Screen auto-slides up on new assignment; a subtle pulse on the CTA once routes are ready
- **Navigates to:** Route Comparison
- **States:**
  - Loading — "Calculating green routes" with animated leaf icon
  - Success — CTA enabled once GRS scoring completes
  - Error — "Couldn't fetch routes, showing default" fallback

### 04 Route Comparison

The core 3-second carbon moment — side-by-side route options with CO₂ and cost.

- **Layout:** Top half: full-width map showing all 3 routes overlaid in different colors/opacities. Bottom half: horizontally swipeable or stacked route cards, greenest visually distinguished (border/badge).
- **Components:**
  - Map with 3 colored polylines
  - 3x route card: distance, ETA, CO₂ kg, fuel cost, GRS score, "Greenest" badge on best option
  - Selected-state highlight ring
- **Info displayed:** Per route: distance (km), duration (min), CO₂ (kg), fuel cost (₹), GRS score (0-100)
- **Actions:** Tap a route card to select it (does not yet confirm)
- **Interactions:** Tapping a card highlights its polyline on the map and dims the others; cards are swipeable on narrow screens
- **Navigates to:** Route Selection (confirmation state of this same screen)
- **States:**
  - Loading — skeleton route cards
  - Success — 3 scored routes rendered
  - Error — "Only 1 route available" fallback (2 cards hidden)

### 05 Route Selection (confirm)

Locks in the chosen route and starts the delivery — a deliberate confirm step so the rider commits.

- **Layout:** Same map as comparison, but only the chosen route's polyline shown, full-width. Bottom sheet with route summary and a large confirm button.
- **Components:**
  - Single-route map
  - Summary card (CO₂, cost, potential green bonus estimate)
  - Primary button ("Start Delivery")
  - Secondary link ("Back to route options")
- **Info displayed:** Confirmed route's distance, CO₂, estimated fuel cost, estimated green bonus range
- **Actions:** Tap "Start Delivery" → begins Live Tracking; tap "Back" → returns to Route Comparison
- **Interactions:** Confirm button requires a deliberate tap (not auto-triggered from comparison) to avoid accidental route locks
- **Navigates to:** Live Tracking
- **States:**
  - Success — confirm enabled
  - Loading — "Starting delivery..." brief transition state

### 06 Live Tracking

Active delivery in progress — rider glances at this while riding.

- **Layout:** Full-screen map with rider's live position, route polyline, and a persistent bottom bar showing running CO₂ meter and ETA.
- **Components:**
  - Live map with moving position marker
  - Bottom bar: live CO₂ counter (ticking down/accumulating), distance remaining, ETA
  - "Arrived / Mark Delivered" button (appears near destination)
- **Info displayed:** Live CO₂ accumulated so far, distance remaining, ETA
- **Actions:** Tap "Mark Delivered" on arrival
- **Interactions:** Large touch targets only (rider likely not holding phone while riding — glance-and-go design); minimal text, big numerals
- **Navigates to:** Delivery Completion
- **States:**
  - Success — live tracking active
  - Error — "GPS signal weak" banner, tracking paused indicator

### 07 Delivery Completion

Confirms the delivery is done, transitions into the reward reveal.

- **Layout:** Full-screen success state, centered: checkmark animation, "Delivered!" headline, brief summary card below.
- **Components:**
  - Success animation (checkmark/confetti)
  - Summary card: total distance, time taken
  - Auto-advancing progress indicator toward CO₂ reveal
- **Info displayed:** Delivery duration, distance covered
- **Actions:** Auto-advances after ~2 seconds (no button needed)
- **Interactions:** Short, celebratory, non-blocking — rider shouldn't have to tap anything here
- **Navigates to:** CO₂ Saving Reveal
- **States:** Success — only state; this screen only appears on successful completion

### 08 CO₂ Saving Reveal

Shows the actual vs. baseline CO₂ comparison for this specific delivery — the emotional payoff moment.

- **Layout:** Full-screen, centered: large animated number counting up "X kg CO₂ saved", with a visual comparison bar (baseline vs actual) below it.
- **Components:**
  - Animated counter (kg CO₂ saved)
  - Baseline vs. actual comparison bar/chart
  - Equivalence line ("= X trees" style micro-copy)
  - Auto-advance or tap-to-continue
- **Info displayed:** Baseline CO₂, actual CO₂, CO₂ saved (kg), a relatable equivalence
- **Actions:** Tap "Continue" or auto-advance after a few seconds
- **Interactions:** Number count-up animation is the centerpiece — this is the screen most worth polishing for the demo
- **Navigates to:** Green Reward notification
- **States:**
  - Success — saving > threshold, full reveal
  - No-saving — saving below threshold, muted "no bonus this time" version

### 09 Green Reward Notification

The payoff — shows the actual rupee amount paid.

- **Layout:** Modal/card over a dimmed background: large ₹ amount, "Green Bonus Earned" label, confirmation of instant payout.
- **Components:**
  - Large currency display
  - "Paid instantly" confirmation microcopy with a payment/checkmark icon
  - Primary button ("Back to Home")
  - Secondary link ("View Wallet")
- **Info displayed:** Reward amount (₹), which delivery it's tied to, running daily total
- **Actions:** "Back to Home" → Dashboard; "View Wallet" → Wallet
- **Interactions:** Brief celebratory animation (coins/confetti), dismissible by tapping outside or the button
- **Navigates to:** Dashboard or Wallet
- **States:**
  - Success — reward paid
  - Loading — brief "processing payout" spinner before amount reveals
  - Error — "Payout delayed, will arrive shortly" fallback message

### 10 Wallet

Cumulative earnings view — reinforces the income narrative over time.

- **Layout:** Top: large total balance card. Below: this week's earnings summary chart. Below: scrollable list of past reward transactions.
- **Components:**
  - Balance card (total available)
  - Weekly earnings mini bar chart
  - Transaction list (date, delivery ref, amount)
  - "Withdraw" button (if applicable)
- **Info displayed:** Total balance, weekly trend, individual reward transactions with dates and delivery IDs
- **Actions:** Tap a transaction → expand detail; tap "Withdraw" → withdrawal flow (post-MVP)
- **Interactions:** Scrollable list, pull-to-refresh
- **Navigates to:** Transaction detail (optional drill-down); bottom tab bar to other sections
- **States:**
  - Empty — "No rewards yet, complete a green delivery to start earning"
  - Loading — skeleton list
  - Success — populated list + chart

### 11 CO₂ History

Shows the rider's environmental impact trend over time — the "30-day transformation" view.

- **Layout:** Top: date range selector (week/month). Below: line chart of daily CO₂ saved. Below: cumulative stats row (total kg saved, tree equivalent).
- **Components:**
  - Date range toggle
  - Line chart (CO₂ saved over time)
  - Stat row (total kg, tree equivalent, trend arrow)
- **Info displayed:** Daily/weekly/monthly CO₂ saved trend, cumulative total, equivalence metric
- **Actions:** Toggle date range; tap a chart point for that day's detail
- **Interactions:** Chart is scrubbable/tappable
- **Navigates to:** Route History (via tab or link)
- **States:**
  - Empty — new rider, "Start saving CO₂ today" prompt
  - Success — populated trend line

### 12 Route History

Log of past deliveries and which route was taken each time.

- **Layout:** Scrollable list, one row per past delivery: date, route type chosen (green/default), CO₂ saved, reward earned.
- **Components:**
  - List item component (repeatable): date, mini-map thumbnail, CO₂ delta, ₹ earned
  - Filter chip (All / Green routes only)
- **Info displayed:** Per delivery: date/time, route chosen, CO₂ saved, reward earned
- **Actions:** Tap a row → delivery detail view (map + full breakdown)
- **Interactions:** Infinite scroll/pagination; filter chip toggle
- **Navigates to:** Delivery detail (drill-down)
- **States:**
  - Empty — "No deliveries yet"
  - Loading — skeleton rows
  - Success — populated history

### 13 Profile / Vehicle

Rider's account settings and vehicle configuration (affects emission factor calculations).

- **Layout:** Top: profile photo + name + phone. Middle: vehicle type selector card. Bottom: settings list (notifications, payout account, support, logout).
- **Components:**
  - Profile header
  - Vehicle type selector (petrol 2W / EV 2W / CNG 3W / diesel 3W) with icon per type
  - Settings list items
  - Logout button
- **Info displayed:** Name, phone, vehicle type, member-since date, linked payout account (masked)
- **Actions:** Change vehicle type; edit profile; view payout account; logout
- **Interactions:** Vehicle type change triggers a confirmation ("this affects your CO₂ calculations")
- **Navigates to:** Green Score/Badge detail (via a "View my tier" link)
- **States:**
  - Success — default state
  - Loading — saving vehicle change

### 14 Green Score / Badge

Gamified tier view — explains and displays progress toward the next reward tier (Bronze/Silver/Gold/Platinum).

- **Layout:** Top: large current tier badge/icon with GRS score (0-100). Below: progress bar toward next tier. Below: tier benefits comparison table.
- **Components:**
  - Large tier badge illustration
  - Progress bar with numeric score
  - Tier comparison table (Bronze/Silver/Gold/Platinum with benefit per tier)
- **Info displayed:** Current tier, current GRS score, points/deliveries needed for next tier, benefit differences per tier
- **Actions:** None required — informational/motivational screen
- **Interactions:** Badge has a subtle shine/glow animation on Platinum tier for delight
- **Navigates to:** Back to Profile or Dashboard
- **States:** Success — populated tier and progress

---

## 03 Platform / Admin Web Dashboard

**Web · Desktop-first · Left sidebar nav**

7 pages. Left sidebar persists across all pages; each page has a consistent header zone with filters/date range, and a content zone below.

### 01 Dashboard Overview

Landing page — top-line health check across the whole fleet.

- **Layout:** Header with date range picker (top-right). Below: 4-card KPI row. Below: 2-column layout — CO₂ trend chart (left, larger), top 5 riders mini-leaderboard (right, smaller).
- **Components:**
  - 4x KPI card (active riders, total CO₂ saved, total green bonuses paid, avg GRS score)
  - Line chart (CO₂ saved over selected range)
  - Mini leaderboard widget (top 5)
  - Date range picker
- **Info displayed:** Fleet-wide totals for the selected period, trend direction indicators (up/down vs previous period)
- **Actions:** Change date range; click a KPI card to jump to its detail page; click "View full leaderboard"
- **Interactions:** Chart hover tooltips; KPI cards are clickable navigation shortcuts
- **Navigates to:** Fleet/City Analytics, Rider Leaderboard, Emissions page
- **States:**
  - Loading — skeleton KPI cards + chart
  - Success — populated
  - Empty — new platform account, "onboard your first riders" prompt

### 02 Fleet / City Analytics

Breaks fleet performance down by city/region for multi-city operators.

- **Layout:** Header with city filter dropdown + date range. Below: comparison bar chart (metric by city). Below: sortable data table, one row per city.
- **Components:**
  - City multi-select filter
  - Bar chart (CO₂ saved or rider count by city)
  - Data table: city, rider count, CO₂ saved, avg GRS, green route adoption %
- **Info displayed:** Per-city breakdown of all key metrics
- **Actions:** Filter by city; sort table by any column; click a city row for a city-specific drill-down
- **Interactions:** Table column sort, filter chips
- **Navigates to:** City drill-down (optional deeper page), Delivery Analytics
- **States:**
  - Success — multi-city table populated
  - Empty — single-city pilot, table shows one row

### 03 CO₂ Emissions & Savings

Deep-dive on the core sustainability metric — this is what feeds the ESG report.

- **Layout:** Header with date range. Large area chart (baseline vs actual CO₂ over time, shaded gap = savings). Below: 3 summary cards (total saved, % reduction, tree equivalent).
- **Components:**
  - Area/line comparison chart (baseline vs actual)
  - 3x summary card
  - Vehicle-type breakdown pie/donut (petrol/EV/CNG split of savings)
- **Info displayed:** Baseline CO₂, actual CO₂, total saved, % reduction, tree equivalent, breakdown by vehicle type
- **Actions:** Change date range; toggle chart between kg/tonnes; export this view (link to Reports)
- **Interactions:** Chart hover shows exact daily values; donut segments are clickable filters
- **Navigates to:** Reports/Export page
- **States:**
  - Success — populated comparison chart
  - Loading — skeleton chart

### 04 Rider Leaderboard

Ranks riders by green performance — used for recognition and to spot top/bottom performers.

- **Layout:** Header with sort-by dropdown (CO₂ saved / green route % / deliveries). Below: ranked table with rank number, avatar, name, tier badge, key metric, trend arrow.
- **Components:**
  - Sort/filter controls
  - Ranked table with rider avatar, tier badge, metrics columns
  - Search-by-name field
- **Info displayed:** Rank, rider name, tier, CO₂ saved, green route adoption %, total deliveries
- **Actions:** Sort by different metrics; search for a rider; click a row for rider detail
- **Interactions:** Table sort, live search filtering
- **Navigates to:** Individual rider detail page (optional)
- **States:**
  - Success — ranked list populated
  - Empty — no search results for typed name

### 05 Delivery Analytics

Operational view of delivery volume and route choice patterns, separate from the sustainability framing.

- **Layout:** Header with date range. Below: line chart (deliveries per day). Below: green vs. default route adoption bar chart. Below: avg delivery time comparison card.
- **Components:**
  - Delivery volume line chart
  - Green route adoption % bar chart over time
  - Avg delivery time stat card (green route vs default)
- **Info displayed:** Daily delivery counts, green route adoption trend, delivery time impact of route choice
- **Actions:** Change date range; toggle between daily/weekly view
- **Interactions:** Chart hover tooltips
- **Navigates to:** Fleet Analytics (cross-link)
- **States:** Success — populated charts

### 06 Rewards / Billing

The commercial page — shows what the platform owes LastMile Carbon and what's been paid to riders.

- **Layout:** Top: current billing period summary card (rider count × ₹45 = total due). Below: invoice history table. Below: total green bonuses paid to riders this period (informational, separate line).
- **Components:**
  - Current invoice summary card
  - Invoice history table (period, rider count, amount, status)
  - "Download invoice" button per row
  - Payment method settings link
- **Info displayed:** Active rider count, per-rider rate, total SaaS fee due, invoice status (paid/pending), total rider bonuses paid (for transparency)
- **Actions:** Download invoice PDF; view payment method; (mock) pay now button
- **Interactions:** Table row expand for invoice line-item detail
- **Navigates to:** None further — terminal page
- **States:**
  - Success — invoice paid
  - Loading — invoice processing
  - Error — payment failed banner

### 07 Reports / Export

Generates the BRSR/ESG-ready compliance report — a key deliverable of the SaaS fee.

- **Layout:** Top: report template selector (BRSR / general ESG / custom). Below: date range + city/fleet filter. Below: preview pane. Bottom: "Generate & Download" button.
- **Components:**
  - Report template selector (radio/cards)
  - Filter controls (date range, city)
  - Report preview pane
  - Export format toggle (PDF/CSV)
  - Primary download button
- **Info displayed:** Live preview of the report contents before download
- **Actions:** Select template; set filters; preview; download
- **Interactions:** Preview pane updates live as filters change
- **Navigates to:** Downloads the file — no further navigation
- **States:**
  - Loading — "Generating report..."
  - Success — download triggered, confirmation toast
  - Error — "No data for selected range"

---

## 04 Corporate Buyer Web Portal

**Web · Desktop-first · Trust-critical**

This is the most important journey in the whole product to get right visually — verification and purchase are what turn a skeptical buyer into a paying one. Every screen in the credit-to-purchase path should visibly reinforce trust: verification badges, audit trail transparency, and clear certificate provenance.

### 01 Buyer Dashboard

Landing page — buyer's offset position at a glance.

- **Layout:** Header with company name/logo. 3-card KPI row (total tonnes purchased, total offset impact, active certificates). Below: recent activity feed.
- **Components:**
  - 3x KPI card
  - Recent activity list (purchases, certificates issued)
  - "Browse Inventory" primary CTA
- **Info displayed:** Total tonnes purchased to date, equivalent impact (trees/cars), number of active certificates
- **Actions:** Click "Browse Inventory" → Credit Inventory; click activity item → relevant detail page
- **Interactions:** None complex — an overview, not a workspace
- **Navigates to:** Credit Inventory, Purchase History, Certificates
- **States:**
  - Empty — first-time buyer, "Make your first purchase" prompt
  - Success — populated history

### 02 Carbon Credit Inventory

Marketplace view — available credit batches for purchase.

- **Layout:** Header with filter/sort (price, verification date, source region). Grid or list of credit batch cards, each showing tonnage, price, verification badge.
- **Components:**
  - Filter/sort bar
  - Batch card (repeatable): tonnage available, price/tonne, verification badge, "View details" link
- **Info displayed:** Per batch: available tonnes, price/tonne, verification status (verified/pending), source period (e.g. "Mangaluru, August 2026")
- **Actions:** Click a batch card → Credit Batch Details
- **Interactions:** Filter/sort controls; verification badge is a small trust icon (checkmark shield) on every card, always visible without a click
- **Navigates to:** Credit Batch Details
- **States:**
  - Success — multiple batches listed
  - Empty — "No inventory currently available" (sold out state)

### 03 Credit Batch Details

Full detail on one batch before committing to buy — the trust-building page.

- **Layout:** Top: batch summary header (tonnage, price, verification badge, large). Below: tabbed or stacked sections — "Overview", "Verification & Audit Trail" (see next screen), "Pricing".
- **Components:**
  - Batch summary header
  - Tab/section navigation
  - Overview stats (rider count contributing, delivery count, date range)
  - "View Audit Trail" prominent link/button
  - Sticky "Buy Now" button
- **Info displayed:** Tonnage, price, contributing rider count, delivery count, collection date range, verification status
- **Actions:** View audit trail; proceed to quantity selection/purchase
- **Interactions:** Tabs switch content without page reload; "Buy Now" is sticky/always visible while scrolling
- **Navigates to:** Verification/Audit Trail, Quantity Selection
- **States:** Success — full detail loaded

### 04 Verification / Audit Trail — *high priority*

Proves the credit is real. This single screen answers the judge/buyer question "how do you verify this" — design it to feel unambiguously trustworthy.

- **Layout:** Vertical breakdown, most aggregate → most granular:
  1. Verification method banner at top (ISO 14064 badge + short explanation)
  2. Aggregation summary (X riders, Y deliveries, Z kg)
  3. Expandable sample delivery records showing individual verified entries
  4. Verification hash/ID footer
- **Components:**
  - Verification method banner (icon + "ISO 14064-verified" label)
  - Aggregation stat row
  - Expandable delivery record table (sample rows: delivery ID, rider ID (anonymized), route, CO₂ saved)
  - Verification hash/ID display (monospace, copyable)
- **Info displayed:** Verification standard used, aggregation counts, sample-level delivery records, unique verification hash for this batch
- **Actions:** Expand/collapse sample records; copy verification hash
- **Interactions:** This is a "show your work" screen — favor transparency over brevity; a buyer or judge should be able to drill from the tonne-level claim down to individual verified deliveries
- **Navigates to:** Back to Batch Details, forward to Quantity Selection
- **States:**
  - Success — verified, full trail visible
  - Loading — records loading

### 05 Pricing Tiers

Shows volume-based pricing before the buyer commits to a quantity.

- **Layout:** Simple 3-column tier comparison table/cards: tier name, tonnage range, price/tonne, savings vs. base rate.
- **Components:**
  - 3x tier card (e.g. Standard / Bulk / Enterprise)
  - Highlighted "best value" tier
- **Info displayed:** Tonnage range and ₹/tonne per tier
- **Actions:** Select a tier → carries selection into Quantity Selection
- **Interactions:** Can be shown as a section within Batch Details rather than a standalone page if preferred — design both as options for Figma, use inline on desktop
- **Navigates to:** Quantity Selection
- **States:** Success — static reference content

### 06 Quantity Selection

Buyer specifies how many tonnes to purchase, sees live price calculation.

- **Layout:** Centered card: stepper/input for tonnage, live-updating price breakdown below (unit price × quantity = subtotal), applicable tier shown.
- **Components:**
  - Quantity stepper/input
  - Live price calculation display
  - Applied tier badge
  - "Proceed to Purchase" button
- **Info displayed:** Selected quantity, unit price, subtotal, which pricing tier applies
- **Actions:** Adjust quantity; proceed to purchase
- **Interactions:** Price recalculates instantly as quantity changes; tier badge updates if crossing a threshold
- **Navigates to:** Purchase Flow
- **States:**
  - Error — quantity exceeds available inventory, inline warning
  - Success — valid quantity selected

### 07 Purchase Flow

Final review and payment step.

- **Layout:** Order summary card (batch, quantity, price) top. Payment method selector middle. Terms checkbox + "Confirm Purchase" button bottom.
- **Components:**
  - Order summary card
  - Payment method selector
  - Terms/agreement checkbox
  - Primary confirm button
- **Info displayed:** Full order breakdown before final confirmation
- **Actions:** Select payment method; confirm purchase
- **Interactions:** Confirm button disabled until terms checkbox is checked
- **Navigates to:** Purchase Confirmation
- **States:**
  - Loading — "Processing payment..."
  - Success — proceeds to confirmation
  - Error — payment failed, retry option

### 08 Purchase Confirmation

Celebratory confirmation — the transaction closing moment.

- **Layout:** Centered success state: checkmark, "Purchase Confirmed" headline, order reference number, immediate access to certificate.
- **Components:**
  - Success icon/animation
  - Order reference display
  - "View Certificate" primary button
  - "Back to Dashboard" secondary link
- **Info displayed:** Order/transaction ID, quantity purchased, total paid, date
- **Actions:** View certificate; return to dashboard
- **Interactions:** Brief success animation, then static confirmation
- **Navigates to:** Certificate View, Buyer Dashboard
- **States:** Success — only state shown here

### 09 Purchase History

Full record of all past purchases for the buyer's own compliance records.

- **Layout:** Filterable table: date, batch reference, tonnage, price, certificate status/link.
- **Components:**
  - Date range filter
  - Sortable table
  - "Download Certificate" link per row
- **Info displayed:** All past transactions with full detail
- **Actions:** Filter, sort, download certificates in bulk or individually
- **Interactions:** Standard table interactions
- **Navigates to:** Certificate View (per row)
- **States:**
  - Empty — no purchases yet
  - Success — populated history

### 10 Certificate View / Download

The tangible proof-of-offset document — what the buyer actually uses in their own ESG reporting.

- **Layout:** Document-style preview (looks like a formal certificate): LastMile Carbon branding, buyer company name, tonnage offset, verification hash, issue date, QR code linking back to the audit trail.
- **Components:**
  - Certificate preview pane
  - Download (PDF) button
  - Share/email link option
  - QR code linking to public verification page
- **Info displayed:** Buyer name, tonnage certified, verification hash, issue date, batch reference
- **Actions:** Download PDF; share via email/link
- **Interactions:** Should look formal/official enough to hand to an auditor — this is a design-critical screen for corporate trust
- **Navigates to:** Downloads file; back to Purchase History
- **States:**
  - Success — certificate rendered
  - Loading — generating PDF

### 11 Buyer Impact / CO₂ Summary

Aggregated environmental impact story across all of a buyer's purchases — usable directly in their sustainability reporting/marketing.

- **Layout:** Large headline stat (total tonnes offset to date), below: equivalence visualizations (trees, cars off road), below: a trend chart of purchases over time.
- **Components:**
  - Headline impact stat
  - Equivalence icons/illustrations
  - Purchase trend chart over time
  - "Download impact summary" export button
- **Info displayed:** Cumulative tonnes offset, equivalence metrics, purchase trend
- **Actions:** Export a shareable impact summary (for the buyer's own marketing/reporting)
- **Interactions:** Mostly a read-only, shareable summary view
- **Navigates to:** None further — a shareable summary destination
- **States:**
  - Success — populated summary
  - Empty — no purchases yet

### 12 Buyer Profile / Settings

Account management for the buyer organization.

- **Layout:** Standard settings list: company info, billing details, notification preferences, team member access, logout.
- **Components:**
  - Company profile card
  - Billing info section
  - Team member list (if multi-user)
  - Notification toggle list
- **Info displayed:** Company name, billing contact, team members, notification settings
- **Actions:** Edit company info; manage team access; update notification preferences
- **Interactions:** Standard form interactions
- **Navigates to:** None further
- **States:** Success — default state

---

## 05 Navigation & User Flows

### Rider App — full flow

**Login → Dashboard → Delivery Assignment → Route Comparison → Route Selection → Live Tracking → Delivery Completion → CO₂ Saving Reveal → Green Reward → Dashboard / Wallet**

Dashboard ↔ Wallet ↔ CO₂ History ↔ Route History ↔ Profile ↔ Green Score (via bottom tabs + cross-links)

### Platform Dashboard — full flow

**Login → Dashboard Overview ↔ Fleet/City Analytics ↔ CO₂ Emissions ↔ Rider Leaderboard ↔ Delivery Analytics ↔ Rewards/Billing ↔ Reports/Export** (via persistent sidebar — no forced linear path)

### Buyer Portal — full flow

**Login → Buyer Dashboard → Credit Inventory → Credit Batch Details → Verification/Audit Trail → Pricing Tiers → Quantity Selection → Purchase Flow → Purchase Confirmation → Certificate View**

Buyer Dashboard ↔ Purchase History ↔ Impact Summary ↔ Profile/Settings (via persistent sidebar)

### Critical demo path

The ~8-minute judge walkthrough:

Rider App [Login skipped/pre-authed] → Dashboard → Delivery Assignment → **Route Comparison** (pause here — this is the "3-second carbon moment") → Route Selection → Live Tracking (fast-forward) → Delivery Completion → CO₂ Reveal → Green Reward → *switch device/window to* → Platform Dashboard Overview → CO₂ Emissions page → *switch to* → Buyer Portal Credit Inventory → Batch Details → **Verification/Audit Trail** (pause here — this answers "how do you verify it") → Quantity Selection → Purchase Flow → Confirmation → Certificate.

> **Design every screen on this exact path to look demo-perfect first; everything off this path is secondary polish.**

---

## 06 Figma Design System

### Visual direction

The brand needs to hold three feelings at once: **mobility** (a rider in motion), **sustainability** (credible green, not greenwashed green), and **trust/technology** (a fintech-grade buyer portal). Avoid a cartoonish "eco app" look — lean toward a clean, data-forward fintech aesthetic with a natural green accent, not a nature-illustration-heavy style.

### Color palette

| Name | Role | Hex |
|---|---|---|
| Teal | Primary / green action | `#0F6E56` |
| Teal light | Backgrounds | `#E1F5EE` |
| Coral | Buyer / commercial accent | `#D85A30` |
| Amber | Status / warning | `#854F0B` |
| Purple | Platform / admin accent | `#5B4B8A` |
| Ink | Text | `#1F1E1B` |
| Background | Page background | `#FBFAF7` |

Use teal as the rider-app primary accent (green route highlights, reward moments), purple as the platform dashboard's identifying accent, and coral as the buyer portal's identifying accent — this lets a viewer instantly tell which surface a screenshot belongs to, while all three share the same neutral base.

### Typography hierarchy

| Level | Size | Weight | Use |
|---|---|---|---|
| Display | 28-32px | Bold (700) | Screen headlines, reward reveal numbers |
| H1 | 22-24px | Bold (700) | Page/section titles |
| H2 | 17-19px | Bold (700) | Card titles, sub-section headers |
| Body | 14-15px | Regular (400) | Standard copy |
| Caption | 12-13px | Medium (500) | Labels, metadata, table headers |
| Micro | 10-11px | Bold (700), uppercase | Tags, badges, status pills |

Single typeface family across all three surfaces (a clean geometric sans, e.g. Inter or similar) — no need for separate type systems per app; consistency here is what makes the shared component library actually reusable.

### Spacing system

8px base unit. Use 4/8/12/16/24/32/48/64px increments throughout. Card internal padding: 16-20px mobile, 20-24px web. Section spacing: 24px mobile, 40-56px web between major sections.

### Border radius

Consistent rounding scale: **6px** (inputs, small tags), **10px** (cards, buttons), **16px** (modals, bottom sheets), **50%** (avatars, badges, tab icons).

### Buttons

| Type | Use | Style |
|---|---|---|
| Primary | Main action per screen (one per screen max) | Solid fill, teal (rider) / purple (platform) / coral (buyer), white text, 10px radius |
| Secondary | Alternate action | Outlined, same accent color, transparent fill |
| Tertiary / Link | Low-emphasis navigation | Text only, underline on hover/press |
| Destructive | Logout, cancel purchase, etc. | Coral or red outline/text |

### Cards, inputs, tables, charts, badges, status indicators

- **Cards** — white/light surface on the app's off-white background, 1px hairline border, subtle shadow only on interactive/elevated cards (not flat info cards)
- **Inputs** — 44px min height (touch-friendly on mobile), 6px radius, clear focus state (accent-colored border), inline validation messages below field
- **Tables** — zebra striping for readability on dense platform/buyer data, sticky header row on scroll, sortable columns marked with a subtle arrow icon
- **Charts** — line charts for trends over time, bar charts for comparisons across categories, donut charts only for part-to-whole breakdowns (vehicle type mix); always label axes, always show units (kg, ₹, tonnes)
- **Badges** — tier badges (Bronze/Silver/Gold/Platinum) use distinct colors + icon shape, not just color, for accessibility; verification badges use a consistent shield/checkmark icon across the whole product
- **Status indicators** — small colored dot + label pattern (green = success/verified, amber = pending, coral = error/failed) used consistently across all three surfaces

### Icons, modals, toasts

- **Icons** — one consistent icon set (line-style, 1.5-2px stroke) across all surfaces; leaf/route/wallet/shield motifs recur for CO₂, routing, rewards, and verification respectively
- **Modals** — centered on web, bottom-sheet on mobile; used for confirmations (route selection, purchase confirmation) — always with a clear dismiss/cancel option except for the reward celebration moment
- **Toasts/notifications** — top-of-screen on web, top-of-screen on mobile (below status bar); auto-dismiss after 3-4 seconds for confirmations, persistent for errors requiring action

### Navigation patterns

- **Mobile navigation** — bottom tab bar, 4 items max, icon + label, active state filled/colored
- **Desktop navigation** — persistent left sidebar (platform + buyer portals), collapsible on smaller desktop widths, top header bar for global actions (date range, account menu)
- **Responsive behavior** — see Section 8

---

## 07 Component Library

Design these as Figma components with variants (not one-off frames) so they translate directly into reusable React components later.

### Global (shared across all three surfaces)

- Button (primary/secondary/tertiary/destructive × 3 accent themes)
- Input field (text/number/OTP/dropdown)
- Card (basic, stat, elevated)
- Badge/tag (status, tier, verification)
- Table (sortable, zebra-striped)
- Line chart, bar chart, donut chart components
- Modal (centered + bottom-sheet variants)
- Toast/notification
- Loading skeleton (card, list, chart variants)
- Empty state (illustration + message + optional CTA)
- Date range picker
- Avatar

### Rider App components

- Bottom tab bar
- Route comparison card
- Live CO₂ meter widget
- Reward celebration overlay
- Wallet transaction list item
- Route history list item
- Vehicle type selector
- Green tier badge (large + small variants)
- Delivery assignment slide-up card

### Platform Dashboard components

- Left sidebar navigation
- KPI stat card
- City/fleet filter dropdown
- Leaderboard row
- Invoice row/card
- Report template selector card
- Baseline-vs-actual comparison chart

### Buyer Portal components

- Left sidebar navigation (buyer variant)
- Credit batch card
- Verification badge banner
- Audit trail expandable record row
- Pricing tier card
- Quantity stepper with live price
- Certificate document preview
- Impact equivalence icon set

---

## 08 Responsive Design

| Breakpoint | Rider App | Platform Dashboard | Buyer Portal |
|---|---|---|---|
| **Mobile** (<480px) | Primary target — full mobile-first design, bottom tabs, single-column | Sidebar collapses to a hamburger/drawer; KPI cards stack vertically; tables scroll horizontally | Same pattern as platform dashboard — sidebar to drawer, stacked cards |
| **Tablet** (480-1024px) | Same layouts as mobile, slightly wider margins; not a primary target but must not break | Sidebar becomes icon-only (collapsed) with flyout labels; 2-column KPI grid | Same collapsed sidebar pattern; batch cards move to 2-column grid |
| **Laptop** (1024-1440px) | N/A (app store distribution, not responsive web) | Full sidebar + content layout; 4-column KPI grid; charts at comfortable full width | Full sidebar; 2-3 column batch grid; purchase flow in a centered max-width column |
| **Desktop** (>1440px) | N/A | Content area max-width capped (~1200px) and centered — avoid ultra-wide stretched tables/charts | Same max-width cap; extra space used for margin, not stretched content |

> Rider App is mobile-first by definition — design every screen at a 375-390px width frame first in Figma (iPhone/standard Android width), then verify it holds up on slightly larger phones. Do not design rider screens tablet-first or desktop-first at any point.

---

## 09 Demo-Ready States

Every screen on the critical demo path (Section 5) needs a specific, realistic sample-data state designed in Figma — not a Lorem Ipsum placeholder. Use the Guru dataset from the pitch report throughout for narrative consistency.

| Screen | Exact demo state to design |
|---|---|
| Rider Dashboard | Rider name "Guru Prasad", today: 14 deliveries, 0.6kg CO₂ saved so far, ₹92 earned, Gold tier badge |
| Route Comparison | 3 routes near Hampankatta, Mangaluru: Route A 4.2km/1.2kg CO₂/high congestion, Route B 4.8km/0.9kg, Route C (greenest, highlighted) 5.6km/0.6kg/GRS 29 |
| CO₂ Saving Reveal | "0.60 kg CO₂ saved" large animated counter, equivalence line "= brewing 30 cups of tea" or similar relatable comparison |
| Green Reward | "₹5.10 Green Bonus Earned", "Paid instantly to your wallet" confirmation |
| Wallet | Total balance ₹3,218 (Month 1 figure from the pitch report), weekly chart showing an upward trend |
| CO₂ History | 30-day trend line dropping from 3.81kg/day to 0.84kg/day, matching the pitch report's week-by-week table |
| Platform Dashboard Overview | 1,500 active riders (Mangaluru pilot figure), fleet total 888 tonnes CO₂ saved monthly, avg GRS 74 |
| CO₂ Emissions page | Baseline vs actual area chart showing the 78% reduction curve over 30 days |
| Rider Leaderboard | Guru Prasad ranked #3, Platinum and Gold tier riders above/around him for visual variety |
| Rewards/Billing | Current invoice: "1,500 riders × ₹45 = ₹67,500", status "Paid" |
| Buyer Dashboard | Demo buyer "Manipal Group" (or a renamed stand-in), 45 tonnes purchased to date |
| Credit Inventory | 2-3 batch cards: "Mangaluru · August 2026 · 12 tonnes · Verified", priced at ₹2,200/tonne |
| Verification/Audit Trail | "1,500 riders · 38,000 deliveries · 888 kg aggregated" with 3-4 expandable sample delivery records and a visible verification hash |
| Purchase Confirmation | "10 tonnes purchased · ₹22,000 · Order #LMC-2026-0091" |
| Certificate View | Formal certificate for "Manipal Group", "10 tonnes CO₂ offset", verification hash, QR code, dated within the demo month |

---

## 10 Final Figma Sitemap

### Rider App (mobile)

- Login (phone + OTP)
- Dashboard / Home
- Delivery Assignment (modal)
- Route Comparison
- Route Selection (confirm)
- Live Tracking
- Delivery Completion
- CO₂ Saving Reveal
- Green Reward Notification
- Wallet
  - Transaction Detail
- CO₂ History
- Route History
  - Delivery Detail
- Profile / Vehicle
- Green Score / Badge

### Platform / Admin Dashboard (web)

- Login
- Dashboard Overview
- Fleet / City Analytics
- CO₂ Emissions & Savings
- Rider Leaderboard
  - Rider Detail
- Delivery Analytics
- Rewards / Billing
- Reports / Export

### Corporate Buyer Portal (web)

- Login
- Buyer Dashboard
- Credit Inventory
- Credit Batch Details
- Verification / Audit Trail
- Pricing Tiers
- Quantity Selection
- Purchase Flow
- Purchase Confirmation
- Certificate View / Download
- Purchase History
  - Certificate View / Download
- Buyer Impact / CO₂ Summary
- Buyer Profile / Settings

---

**32 screens. Three surfaces. One shared design system. One critical demo path designed first.**
