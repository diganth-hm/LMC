export type UserRole = 'platform_admin' | 'corporate_buyer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  status: number | 'network';
  message: string;
  code: string;
}

// Platform / Admin Types
export interface FleetOverview {
  activeRiders: number;
  totalCO2SavedKg: number;
  totalCO2SavedTonnes: number;
  totalGreenBonusesPaidRupees: number;
  avgGRSScore: number;
  riderTrend: number;
  co2Trend: number;
  bonusTrend: number;
  grsTrend: number;
}

export interface CityStat {
  id: string;
  name: string;
  activeRiders: number;
  co2SavedKg: number;
  avgGRS: number;
  greenAdoptionPct: number;
}

export interface EmissionStat {
  date: string;
  baselineKg: number;
  actualKg: number;
  savedKg: number;
}

export interface RiderLeaderboardItem {
  id: string;
  rank: number;
  name: string;
  avatarUrl: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  co2SavedKg: number;
  greenAdoptionPct: number;
  totalDeliveries: number;
  city: string;
}

export interface DeliveryAnalyticItem {
  date: string;
  totalDeliveries: number;
  greenDeliveries: number;
  defaultDeliveries: number;
  avgTimeGreenMin: number;
  avgTimeDefaultMin: number;
}

export interface InvoiceItem {
  id: string;
  period: string;
  riderCount: number;
  ratePerRider: number;
  amountRupees: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  issueDate: string;
  dueDate: string;
  bonusPayoutTotalRupees: number;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'BRSR' | 'ESG' | 'Custom';
  format: 'PDF' | 'CSV';
}

// Corporate Buyer Types
export interface CreditBatch {
  id: string;
  title: string;
  region: string;
  sourcePeriod: string;
  availableTonnes: number;
  totalTonnes: number;
  pricePerTonneRupees: number;
  verificationStatus: 'Verified' | 'Pending';
  verificationStandard: string;
  contributingRidersCount: number;
  totalDeliveriesCount: number;
  issueDate: string;
  verificationHash: string;
  description: string;
}

export interface SampleDeliveryRecord {
  id: string;
  deliveryRef: string;
  anonymizedRiderId: string;
  routeType: 'Green' | 'Default';
  co2SavedKg: number;
  timestamp: string;
  city: string;
}

export interface AuditTrail {
  batchId: string;
  verificationStandard: string;
  verificationHash: string;
  isoBadge: string;
  contributingRidersCount: number;
  totalDeliveriesCount: number;
  totalCo2SavedKg: number;
  sampleRecords: SampleDeliveryRecord[];
}

export interface PricingTier {
  id: string;
  name: string;
  minTonnes: number;
  maxTonnes: number | null;
  pricePerTonneRupees: number;
  discountPct: number;
  isPopular?: boolean;
}

export interface Order {
  id: string;
  batchId: string;
  batchTitle: string;
  quantityTonnes: number;
  unitPriceRupees: number;
  subtotalRupees: number;
  buyerName: string;
  paymentMethod: string;
  status: 'Completed' | 'Processing' | 'Failed';
  timestamp: string;
  certificateId: string;
  verificationHash: string;
}

export interface Certificate {
  id: string;
  orderId: string;
  buyerName: string;
  tonnesOffset: number;
  verificationHash: string;
  issueDate: string;
  qrCodeUrl: string;
  batchTitle: string;
  region: string;
}

export interface BuyerImpact {
  totalTonnesPurchased: number;
  equivalentTreesPlanted: number;
  equivalentCarsOffRoad: number;
  activeCertificatesCount: number;
  purchaseHistoryTrend: { date: string; tonnes: number }[];
}

export interface BuyerProfile {
  companyName: string;
  billingEmail: string;
  gstin: string;
  address: string;
  teamMembers: { name: string; email: string; role: string }[];
  notifications: { emailAlerts: boolean; weeklyDigest: boolean; newBatchAlerts: boolean };
}
