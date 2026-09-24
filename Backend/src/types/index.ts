import { Request } from 'express';

// ──────────────────────────────────────────────
// API Response Envelope — Section 5
// ──────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string } | null;
}

// ──────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────
export type UserRole = 'rider' | 'platform_admin' | 'corporate_buyer';

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// ──────────────────────────────────────────────
// Pagination
// ──────────────────────────────────────────────
export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ──────────────────────────────────────────────
// Route types
// ──────────────────────────────────────────────
export interface RouteCandidate {
  id: string;
  distanceKm: number;
  durationMin: number;
  co2Kg: number;
  fuelCostInr: number;
  grsScore: number;
  congestionScore: number;
  isGreenest: boolean;
}

// ──────────────────────────────────────────────
// CO₂ calculation
// ──────────────────────────────────────────────
export interface Co2CalculationResult {
  baselineCo2Kg: number;
  actualCo2Kg: number;
  co2SavedKg: number;
}

// ──────────────────────────────────────────────
// Reward
// ──────────────────────────────────────────────
export interface RewardResult {
  co2SavedKg: number;
  rewardAmountInr: number;
  newBalance: number;
}
