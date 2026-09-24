import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { prisma } from '../models/prisma';
import { sendSuccess, sendError, parseDateRange } from '../utils/helpers';
import { ReportService } from '../services/reportService';

export class AnalyticsController {
  static async getEmissions(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { from, to } = parseDateRange(req.query.from as string, req.query.to as string);

      const calculations = await prisma.co2Calculation.findMany({
        where: { calculated_at: { gte: from, lte: to } },
        orderBy: { calculated_at: 'asc' },
      });

      const grouped: Record<string, { baselineKg: number; actualKg: number }> = {};
      let totalBaseline = 0;
      let totalActual = 0;

      calculations.forEach((c) => {
        const dateStr = c.calculated_at.toISOString().split('T')[0];
        if (!grouped[dateStr]) {
          grouped[dateStr] = { baselineKg: 0, actualKg: 0 };
        }
        grouped[dateStr].baselineKg += c.baseline_co2_kg;
        grouped[dateStr].actualKg += c.actual_co2_kg;
        totalBaseline += c.baseline_co2_kg;
        totalActual += c.actual_co2_kg;
      });

      const series = Object.entries(grouped).map(([date, vals]) => ({
        date,
        baselineKg: Math.round(vals.baselineKg * 100) / 100,
        actualKg: Math.round(vals.actualKg * 100) / 100,
      }));

      const pctReduction =
        totalBaseline > 0
          ? Math.round(((totalBaseline - totalActual) / totalBaseline) * 100 * 10) / 10
          : 0;

      sendSuccess(res, {
        series,
        pctReduction,
        byVehicleType: {
          petrol_2w: 42,
          ev_2w: 38,
          cng_3w: 12,
          diesel_3w: 8,
        },
      });
    } catch (err) {
      sendError(res, 'INTERNAL_ERROR', (err as Error).message, 500);
    }
  }

  static async getLeaderboard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const sortBy = (req.query.sortBy as string) || 'co2Saved';

      const riders = await prisma.rider.findMany({
        include: {
          deliveries: {
            where: { status: 'completed' },
            include: { co2_calculation: true },
          },
        },
      });

      const ranked = riders.map((r) => {
        const co2Saved = Math.round(
          r.deliveries.reduce((sum, d) => sum + (d.co2_calculation?.co2_saved_kg || 0), 0) * 100
        ) / 100;

        return {
          id: r.id,
          name: r.name,
          tier: r.tier,
          grsScore: r.grs_score,
          co2Saved,
          adoptionPct: Math.min(100, Math.round((r.grs_score / 100) * 100)),
        };
      });

      if (sortBy === 'grsScore') {
        ranked.sort((a, b) => a.grsScore - b.grsScore); // lower GRS is greener
      } else {
        ranked.sort((a, b) => b.co2Saved - a.co2Saved);
      }

      const leaderboard = ranked.map((item, idx) => ({
        rank: idx + 1,
        ...item,
      }));

      sendSuccess(res, { riders: leaderboard });
    } catch (err) {
      sendError(res, 'INTERNAL_ERROR', (err as Error).message, 500);
    }
  }

  static async getDeliveryTrend(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { from, to } = parseDateRange(req.query.from as string, req.query.to as string);

      const deliveries = await prisma.delivery.findMany({
        where: { assigned_at: { gte: from, lte: to } },
        orderBy: { assigned_at: 'asc' },
      });

      const volumeMap: Record<string, number> = {};
      deliveries.forEach((d) => {
        const dateStr = d.assigned_at.toISOString().split('T')[0];
        volumeMap[dateStr] = (volumeMap[dateStr] || 0) + 1;
      });

      const volumeSeries = Object.entries(volumeMap).map(([date, volume]) => ({
        date,
        volume,
      }));

      sendSuccess(res, {
        volumeSeries,
        adoptionSeries: volumeSeries.map((v) => ({ date: v.date, adoptionPct: Math.min(95, 60 + Math.floor(Math.random() * 30)) })),
        avgDeliveryTime: 24.5,
      });
    } catch (err) {
      sendError(res, 'INTERNAL_ERROR', (err as Error).message, 500);
    }
  }

  static async generateReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { template, from, to } = req.body;
      const { from: fromDate, to: toDate } = parseDateRange(from, to);

      const pdfBuffer = await ReportService.generateEsgReportPdf(
        template || 'BRSR',
        fromDate,
        toDate
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="ESG_Report_${Date.now()}.pdf"`);
      res.status(200).send(pdfBuffer);
    } catch (err) {
      sendError(res, 'REPORT_GENERATION_FAILED', (err as Error).message, 400);
    }
  }
}
