import {
  FleetOverview,
  CityStat,
  EmissionStat,
  RiderLeaderboardItem,
  DeliveryAnalyticItem,
  InvoiceItem,
  ReportTemplate,
  CreditBatch,
  AuditTrail,
  PricingTier,
  Order,
  Certificate,
  BuyerImpact,
  BuyerProfile,
  SampleDeliveryRecord,
} from '../../types';

export const mockFleetOverview: FleetOverview = {
  activeRiders: 1500,
  totalCO2SavedKg: 888000,
  totalCO2SavedTonnes: 888,
  totalGreenBonusesPaidRupees: 245000,
  avgGRSScore: 74,
  riderTrend: 12.5,
  co2Trend: 18.2,
  bonusTrend: 14.0,
  grsTrend: 4.5,
};

export const mockCityStats: CityStat[] = [
  { id: 'city-1', name: 'Mangaluru', activeRiders: 650, co2SavedKg: 385000, avgGRS: 78, greenAdoptionPct: 84 },
  { id: 'city-2', name: 'Bengaluru', activeRiders: 500, co2SavedKg: 310000, avgGRS: 72, greenAdoptionPct: 76 },
  { id: 'city-3', name: 'Mysuru', activeRiders: 200, co2SavedKg: 125000, avgGRS: 71, greenAdoptionPct: 72 },
  { id: 'city-4', name: 'Hubballi', activeRiders: 150, co2SavedKg: 68000, avgGRS: 69, greenAdoptionPct: 68 },
];

export const mockEmissionsStats: EmissionStat[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const baseline = Number((3.81 - (i * 0.05) + Math.sin(i) * 0.1).toFixed(2));
  const actual = Number((0.84 + (30 - i) * 0.08 + Math.cos(i) * 0.08).toFixed(2));
  const saved = Number((Math.max(0.1, baseline - actual)).toFixed(2));
  return {
    date: `Day ${day}`,
    baselineKg: Math.max(3.0, baseline * 100),
    actualKg: Math.max(0.8, actual * 100),
    savedKg: Math.max(0.5, saved * 100),
  };
});

export const mockRiderLeaderboard: RiderLeaderboardItem[] = [
  { id: 'r-101', rank: 1, name: 'Rajesh Kumar', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', tier: 'Platinum', co2SavedKg: 84.5, greenAdoptionPct: 98, totalDeliveries: 142, city: 'Mangaluru' },
  { id: 'r-102', rank: 2, name: 'Ananya Rao', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', tier: 'Platinum', co2SavedKg: 79.2, greenAdoptionPct: 95, totalDeliveries: 138, city: 'Bengaluru' },
  { id: 'r-103', rank: 3, name: 'Guru Prasad', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', tier: 'Gold', co2SavedKg: 74.0, greenAdoptionPct: 92, totalDeliveries: 126, city: 'Mangaluru' },
  { id: 'r-104', rank: 4, name: 'Vikram Singh', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', tier: 'Gold', co2SavedKg: 68.4, greenAdoptionPct: 88, totalDeliveries: 119, city: 'Mangaluru' },
  { id: 'r-105', rank: 5, name: 'Priya Shetty', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', tier: 'Silver', co2SavedKg: 62.1, greenAdoptionPct: 82, totalDeliveries: 104, city: 'Mysuru' },
  { id: 'r-106', rank: 6, name: 'Mohammed Ali', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', tier: 'Silver', co2SavedKg: 58.9, greenAdoptionPct: 79, totalDeliveries: 98, city: 'Bengaluru' },
  { id: 'r-107', rank: 7, name: 'Karthik Gowda', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80', tier: 'Bronze', co2SavedKg: 52.3, greenAdoptionPct: 75, totalDeliveries: 89, city: 'Hubballi' },
];

export const mockDeliveryAnalytics: DeliveryAnalyticItem[] = Array.from({ length: 7 }, (_, i) => ({
  date: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  totalDeliveries: [1200, 1350, 1420, 1380, 1550, 1800, 1650][i],
  greenDeliveries: [960, 1120, 1200, 1170, 1345, 1580, 1420][i],
  defaultDeliveries: [240, 230, 220, 210, 205, 220, 230][i],
  avgTimeGreenMin: 21.4,
  avgTimeDefaultMin: 22.8,
}));

export const mockInvoices: InvoiceItem[] = [
  { id: 'INV-2026-08', period: 'August 2026', riderCount: 1500, ratePerRider: 45, amountRupees: 67500, status: 'Paid', issueDate: '2026-08-31', dueDate: '2026-09-15', bonusPayoutTotalRupees: 245000 },
  { id: 'INV-2026-07', period: 'July 2026', riderCount: 1350, ratePerRider: 45, amountRupees: 60750, status: 'Paid', issueDate: '2026-07-31', dueDate: '2026-08-15', bonusPayoutTotalRupees: 210000 },
  { id: 'INV-2026-06', period: 'June 2026', riderCount: 1100, ratePerRider: 45, amountRupees: 49500, status: 'Paid', issueDate: '2026-06-30', dueDate: '2026-07-15', bonusPayoutTotalRupees: 175000 },
];

export const mockReportTemplates: ReportTemplate[] = [
  { id: 'rep-brsr', name: 'BRSR Core Compliance (Principle 6)', description: 'Formatted for Indian corporate Business Responsibility & Sustainability Reporting', type: 'BRSR', format: 'PDF' },
  { id: 'rep-esg', name: 'GRI/ESG Scope 3 Emissions Report', description: 'Standard international Scope 3 downstream transportation disclosure', type: 'ESG', format: 'PDF' },
  { id: 'rep-raw', name: 'Granular Delivery & CO2 Raw Dump', description: 'Full CSV line-item dump for internal auditor verification', type: 'Custom', format: 'CSV' },
];

// Buyer Mock Data
export const mockCreditBatches: CreditBatch[] = [
  {
    id: 'batch-mng-0826',
    title: 'Mangaluru Urban Logistics Green Credit Batch',
    region: 'Mangaluru, Karnataka',
    sourcePeriod: 'August 2026',
    availableTonnes: 12,
    totalTonnes: 25,
    pricePerTonneRupees: 2200,
    verificationStatus: 'Verified',
    verificationStandard: 'ISO 14064-2 Verified',
    contributingRidersCount: 1500,
    totalDeliveriesCount: 38000,
    issueDate: '2026-09-01',
    verificationHash: '0x8f9a2b7c4d1e3f5a6b7c8d9e0f1a2b3c4d5e6f7a',
    description: 'High-density hyper-local delivery route optimizations across Mangaluru urban zones saving direct Scope 3 tailpipe fuel.',
  },
  {
    id: 'batch-blr-0826',
    title: 'Bengaluru Tech Corridor EV & Green Route Credit',
    region: 'Bengaluru, Karnataka',
    sourcePeriod: 'August 2026',
    availableTonnes: 30,
    totalTonnes: 50,
    pricePerTonneRupees: 2150,
    verificationStatus: 'Verified',
    verificationStandard: 'ISO 14064-2 Verified',
    contributingRidersCount: 1200,
    totalDeliveriesCount: 42000,
    issueDate: '2026-09-02',
    verificationHash: '0x3c4d5e6f7a8f9a2b7c4d1e3f5a6b7c8d9e0f1a2b',
    description: 'Verified tailpipe emission avoidances in Outer Ring Road and Electronic City micro-logistics corridors.',
  },
  {
    id: 'batch-mys-0726',
    title: 'Mysuru Heritage Zone Low-Emission Delivery Pool',
    region: 'Mysuru, Karnataka',
    sourcePeriod: 'July 2026',
    availableTonnes: 8,
    totalTonnes: 15,
    pricePerTonneRupees: 2000,
    verificationStatus: 'Verified',
    verificationStandard: 'ISO 14064-2 Verified',
    contributingRidersCount: 400,
    totalDeliveriesCount: 14000,
    issueDate: '2026-08-05',
    verificationHash: '0x1a2b3c4d5e6f7a8f9a2b7c4d1e3f5a6b7c8d9e0f',
    description: 'Avoided congestion idle emissions in heritage commercial zones during peak hours.',
  },
];

export const mockSampleDeliveryRecords: SampleDeliveryRecord[] = [
  { id: 'rec-001', deliveryRef: 'DEL-99201', anonymizedRiderId: 'Rider #MNG-103', routeType: 'Green', co2SavedKg: 0.60, timestamp: '2026-08-24 14:22:10', city: 'Mangaluru' },
  { id: 'rec-002', deliveryRef: 'DEL-99202', anonymizedRiderId: 'Rider #MNG-104', routeType: 'Green', co2SavedKg: 0.48, timestamp: '2026-08-24 14:28:45', city: 'Mangaluru' },
  { id: 'rec-003', deliveryRef: 'DEL-99203', anonymizedRiderId: 'Rider #MNG-101', routeType: 'Green', co2SavedKg: 0.72, timestamp: '2026-08-24 14:35:12', city: 'Mangaluru' },
  { id: 'rec-004', deliveryRef: 'DEL-99204', anonymizedRiderId: 'Rider #MNG-105', routeType: 'Green', co2SavedKg: 0.55, timestamp: '2026-08-24 14:41:00', city: 'Mangaluru' },
  { id: 'rec-005', deliveryRef: 'DEL-99205', anonymizedRiderId: 'Rider #MNG-102', routeType: 'Green', co2SavedKg: 0.64, timestamp: '2026-08-24 14:50:30', city: 'Mangaluru' },
];

export const mockAuditTrail: AuditTrail = {
  batchId: 'batch-mng-0826',
  verificationStandard: 'ISO 14064-2 Greenhouse Gas Avoidance Protocol',
  verificationHash: '0x8f9a2b7c4d1e3f5a6b7c8d9e0f1a2b3c4d5e6f7a',
  isoBadge: 'ISO 14064-2 Third-Party Audited',
  contributingRidersCount: 1500,
  totalDeliveriesCount: 38000,
  totalCo2SavedKg: 888000,
  sampleRecords: mockSampleDeliveryRecords,
};

export const mockPricingTiers: PricingTier[] = [
  { id: 'tier-1', name: 'Standard Tier', minTonnes: 1, maxTonnes: 5, pricePerTonneRupees: 2200, discountPct: 0 },
  { id: 'tier-2', name: 'Bulk ESG Tier', minTonnes: 6, maxTonnes: 20, pricePerTonneRupees: 2050, discountPct: 6.8, isPopular: true },
  { id: 'tier-3', name: 'Enterprise Scope 3 Tier', minTonnes: 21, maxTonnes: null, pricePerTonneRupees: 1900, discountPct: 13.6 },
];

export const mockOrders: Order[] = [
  {
    id: 'LMC-2026-0091',
    batchId: 'batch-mng-0826',
    batchTitle: 'Mangaluru Urban Logistics Green Credit Batch',
    quantityTonnes: 10,
    unitPriceRupees: 2200,
    subtotalRupees: 22000,
    buyerName: 'Manipal Group ESG Solutions',
    paymentMethod: 'Corporate Wire / RTGS',
    status: 'Completed',
    timestamp: '2026-09-24 16:30:00',
    certificateId: 'CERT-LMC-2026-0091',
    verificationHash: '0x8f9a2b7c4d1e3f5a6b7c8d9e0f1a2b3c4d5e6f7a',
  },
  {
    id: 'LMC-2026-0044',
    batchId: 'batch-blr-0826',
    batchTitle: 'Bengaluru Tech Corridor EV Credit',
    quantityTonnes: 35,
    unitPriceRupees: 2150,
    subtotalRupees: 75250,
    buyerName: 'Manipal Group ESG Solutions',
    paymentMethod: 'Corporate Credit Card',
    status: 'Completed',
    timestamp: '2026-08-12 11:15:00',
    certificateId: 'CERT-LMC-2026-0044',
    verificationHash: '0x3c4d5e6f7a8f9a2b7c4d1e3f5a6b7c8d9e0f1a2b',
  },
];

export const mockCertificate: Certificate = {
  id: 'CERT-LMC-2026-0091',
  orderId: 'LMC-2026-0091',
  buyerName: 'Manipal Group ESG Solutions',
  tonnesOffset: 10,
  verificationHash: '0x8f9a2b7c4d1e3f5a6b7c8d9e0f1a2b3c4d5e6f7a',
  issueDate: '2026-09-24',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=0x8f9a2b7c4d1e3f5a6b7c8d9e0f1a2b3c4d5e6f7a',
  batchTitle: 'Mangaluru Urban Logistics Green Credit Batch',
  region: 'Mangaluru, Karnataka',
};

export const mockBuyerImpact: BuyerImpact = {
  totalTonnesPurchased: 45,
  equivalentTreesPlanted: 2250,
  equivalentCarsOffRoad: 10,
  activeCertificatesCount: 2,
  purchaseHistoryTrend: [
    { date: 'Jun 2026', tonnes: 0 },
    { date: 'Jul 2026', tonnes: 0 },
    { date: 'Aug 2026', tonnes: 35 },
    { date: 'Sep 2026', tonnes: 10 },
  ],
};

export const mockBuyerProfile: BuyerProfile = {
  companyName: 'Manipal Group ESG Solutions',
  billingEmail: 'esg-procurement@manipal.edu',
  gstin: '29AAACM1234F1Z9',
  address: 'Manipal Towers, University Road, Manipal, KA 576104',
  teamMembers: [
    { name: 'Dr. Suresh Pai', email: 'suresh.pai@manipal.edu', role: 'ESG Director' },
    { name: 'Neha Kulkarni', email: 'neha.k@manipal.edu', role: 'Procurement Lead' },
  ],
  notifications: {
    emailAlerts: true,
    weeklyDigest: true,
    newBatchAlerts: true,
  },
};
