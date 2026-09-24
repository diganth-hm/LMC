import { Response } from 'express';
import { ApiResponse } from '../types';

/**
 * Send a successful API response
 */
export function sendSuccess<T>(res: Response, data: T, statusCode = 200): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
    error: null,
  };
  res.status(statusCode).json(response);
}

/**
 * Send an error API response
 */
export function sendError(res: Response, code: string, message: string, statusCode = 400): void {
  const response: ApiResponse = {
    success: false,
    data: null,
    error: { code, message },
  };
  res.status(statusCode).json(response);
}

/**
 * Convert kg to tonnes
 */
export function kgToTonnes(kg: number): number {
  return kg / 1000;
}

/**
 * Format currency in INR
 */
export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

/**
 * Calculate tree equivalent from CO₂ saved (kg)
 * 1 tree absorbs ~22 kg CO₂ per year
 */
export function treeEquivalent(co2Kg: number): number {
  return Math.round((co2Kg / 22) * 10) / 10;
}

/**
 * Parse pagination query parameters with defaults
 */
export function parsePagination(page?: string, limit?: string): { page: number; limit: number; skip: number } {
  const p = Math.max(1, parseInt(page || '1', 10) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit || '20', 10) || 20));
  return { page: p, limit: l, skip: (p - 1) * l };
}

/**
 * Get date range bounds from "from" and "to" query params
 */
export function parseDateRange(from?: string, to?: string): { from: Date; to: Date } {
  const now = new Date();
  const toDate = to ? new Date(to) : now;
  const fromDate = from ? new Date(from) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // default 30 days
  // Set toDate to end of day
  toDate.setHours(23, 59, 59, 999);
  return { from: fromDate, to: toDate };
}
