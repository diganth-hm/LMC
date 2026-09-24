import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { prisma } from '../models/prisma';

export class ReportService {
  /**
   * Generate ESG / BRSR report (PDF format)
   */
  static async generateEsgReportPdf(template: string, fromDate: Date, toDate: Date): Promise<Buffer> {
    const deliveries = await prisma.delivery.findMany({
      where: {
        status: 'completed',
        completed_at: { gte: fromDate, lte: toDate },
      },
      include: {
        co2_calculation: true,
      },
    });

    const totalDeliveries = deliveries.length;
    const totalCo2Saved = Math.round(
      deliveries.reduce((sum, d) => sum + (d.co2_calculation?.co2_saved_kg || 0), 0) * 100
    ) / 100;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText('LASTMILE CARBON - ESG & BRSR COMPLIANCE REPORT', {
      x: 50,
      y: 750,
      size: 16,
      font: fontBold,
      color: rgb(0.1, 0.5, 0.2),
    });

    page.drawText(`Report Template: ${template.toUpperCase()}`, {
      x: 50,
      y: 720,
      size: 12,
      font: fontRegular,
    });

    page.drawText(
      `Period: ${fromDate.toISOString().split('T')[0]} to ${toDate.toISOString().split('T')[0]}`,
      { x: 50, y: 700, size: 10, font: fontRegular }
    );

    page.drawText('SUMMARY INDICATORS', {
      x: 50,
      y: 650,
      size: 14,
      font: fontBold,
    });

    page.drawText(`- Total Completed Deliveries: ${totalDeliveries}`, {
      x: 60,
      y: 620,
      size: 11,
      font: fontRegular,
    });

    page.drawText(`- Total CO2 Emissions Savings: ${totalCo2Saved} kg`, {
      x: 60,
      y: 600,
      size: 11,
      font: fontRegular,
    });

    page.drawText(`- Equivalent Carbon Avoidance: ${(totalCo2Saved / 1000).toFixed(3)} Metric Tonnes`, {
      x: 60,
      y: 580,
      size: 11,
      font: fontRegular,
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
}
