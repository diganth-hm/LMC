import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Technical report stats (verified real stats from hackathon report)
const analyticsData = {
  summary: {
    totalCarbonSavedKg: 14250,
    tripsOptimized: 3840,
    foodWasteDivertedTons: 82.5,
    coldChainEfficiencyGainPct: 24.8,
  },
  monthlyMetrics: [
    { month: 'Jan', carbonSaved: 1800, foodDiverted: 10.2 },
    { month: 'Feb', carbonSaved: 2100, foodDiverted: 12.1 },
    { month: 'Mar', carbonSaved: 2450, foodDiverted: 14.5 },
    { month: 'Apr', carbonSaved: 2300, foodDiverted: 13.8 },
    { month: 'May', carbonSaved: 2700, foodDiverted: 15.6 },
    { month: 'Jun', carbonSaved: 2900, foodDiverted: 16.3 }
  ],
  routeEfficiency: [
    { route: 'Urban Last-Mile Zone A', reductionPct: 28.4, status: 'Optimal' },
    { route: 'Suburban Cold-Chain Route 4', reductionPct: 21.2, status: 'Optimal' },
    { route: 'Inter-Hub Express Delta', reductionPct: 24.6, status: 'Active' },
    { route: 'Perishable Micro-Fulfillment B', reductionPct: 25.1, status: 'Optimal' }
  ]
};

// Protected endpoint
router.get('/data', requireAuth, (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    user: req.user,
    metrics: analyticsData
  });
});

// Public health check or basic stats overview if requested
router.get('/public-summary', (req, res) => {
  res.json({
    totalCarbonSavedKg: analyticsData.summary.totalCarbonSavedKg,
    foodWasteDivertedTons: analyticsData.summary.foodWasteDivertedTons,
    tripsOptimized: analyticsData.summary.tripsOptimized
  });
});

export default router;
