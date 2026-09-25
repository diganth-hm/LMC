// ──────────────────────────────────────────────
// Business constants — Section 7 of architecture
// ──────────────────────────────────────────────

/** Emission factors: kg CO₂ per unit of fuel consumed */
export const EMISSION_FACTORS: Record<string, number> = {
  petrol_2w: 2.31,   // kg CO₂ per litre
  diesel_3w: 2.68,   // kg CO₂ per litre
  cng_3w: 1.97,      // kg CO₂ per kg CNG
};

/** Base fuel efficiency (km/L or km/kWh) at optimal conditions, by vehicle type */
export const BASE_FUEL_EFFICIENCY: Record<string, number> = {
  petrol_2w: 45,   // km per litre
  diesel_3w: 18,   // km per litre
  cng_3w: 25,      // km per kg CNG
};

/** Reward rate: INR per kg CO₂ saved */
export const REWARD_RATE_INR_PER_KG = 8.5;

/** Minimum CO₂ saving threshold (kg) to qualify for a reward — avoids sub-paisa payouts */
export const MIN_CO2_THRESHOLD_KG = 0.05;

/** Green Route Score (GRS) weights for normalized components */
export const GRS_WEIGHTS = {
  distance: 0.3,
  congestion: 0.4,
  co2: 0.3,
};

/** Rider tier thresholds based on rolling 30-day green route adoption % */
export const TIER_THRESHOLDS = {
  platinum: 85,
  gold: 65,
  silver: 40,
  bronze: 0,
} as const;

/** Carbon credit pricing tiers (INR per tonne) based on purchase quantity */
export const PRICING_TIERS = [
  { minTonnes: 0,    maxTonnes: 10,    pricePerTonne: 1500 },
  { minTonnes: 10,   maxTonnes: 50,    pricePerTonne: 1350 },
  { minTonnes: 50,   maxTonnes: 200,   pricePerTonne: 1200 },
  { minTonnes: 200,  maxTonnes: Infinity, pricePerTonne: 1000 },
];

/** SaaS rate per rider per month (INR) — for billing */
export const DEFAULT_SAAS_RATE_PER_RIDER = 150;

/** Number of candidate routes to generate per delivery */
export const ROUTE_CANDIDATES_COUNT = 3;

/** Tree equivalent: 1 tree absorbs ~22 kg CO₂ per year */
export const KG_CO2_PER_TREE_PER_YEAR = 22;
