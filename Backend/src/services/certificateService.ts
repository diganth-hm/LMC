import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { prisma } from '../models/prisma';

export class CertificateService {
  /**
   * Generate PDF certificate for a purchase and save Certificate model
   */
  static async generateCertificateForPurchase(purchaseId: string) {
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        buyer: true,
        credit_batch: {
          include: {
            city: true,
            verification_record: true,
          },
        },
      },
    });

    if (!purchase) {
      throw new Error('PURCHASE_NOT_FOUND');
    }

    const verificationHash =
      purchase.credit_batch.verification_record?.verification_hash || '0xUNKNOWN';

    // Generate QR code data URL
    const qrDataUrl = await QRCode.toDataURL(
      `https://lastmilecarbon.org/verify/${verificationHash}`
    );

    // Render PDF with pdf-lib
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Background accent border
    page.drawRectangle({
      x: 20,
      y: 20,
      width: 560,
      height: 360,
      borderColor: rgb(0.1, 0.6, 0.3),
      borderWidth: 3,
    });

    // Title Header
    page.drawText('LASTMILE CARBON', {
      x: 200,
      y: 340,
      size: 20,
      font: fontBold,
      color: rgb(0.1, 0.6, 0.3),
    });

    page.drawText('VERIFIED CARBON OFFSET CERTIFICATE', {
      x: 140,
      y: 315,
      size: 14,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
    });

    page.drawText(`This certifies that`, {
      x: 240,
      y: 275,
      size: 11,
      font: fontRegular,
    });

    page.drawText(purchase.buyer.company_name, {
      x: 150,
      y: 250,
      size: 16,
      font: fontBold,
      color: rgb(0.05, 0.4, 0.2),
    });

    page.drawText(
      `has retired ${purchase.tonnes_purchased} Metric Tonnes of Verified CO2 Emissions`,
      {
        x: 130,
        y: 220,
        size: 12,
        font: fontRegular,
      }
    );

    page.drawText(`Source Location: ${purchase.credit_batch.city.name}, India`, {
      x: 150,
      y: 195,
      size: 11,
      font: fontRegular,
    });

    page.drawText(`Audit Hash: ${verificationHash.substring(0, 32)}...`, {
      x: 150,
      y: 175,
      size: 9,
      font: fontRegular,
      color: rgb(0.4, 0.4, 0.4),
    });

    const issuedDateStr = new Date().toISOString().split('T')[0];
    page.drawText(`Issued On: ${issuedDateStr}`, {
      x: 150,
      y: 155,
      size: 10,
      font: fontRegular,
    });

    // Embed QR code image
    const qrImagePng = await pdfDoc.embedPng(qrDataUrl);
    page.drawImage(qrImagePng, {
      x: 460,
      y: 40,
      width: 90,
      height: 90,
    });

    page.drawText('Scan to verify audit', {
      x: 460,
      y: 25,
      size: 8,
      font: fontRegular,
      color: rgb(0.5, 0.5, 0.5),
    });

    const pdfBytes = await pdfDoc.save();

    // Create Certificate record in DB
    const certificate = await prisma.certificate.upsert({
      where: { purchase_id: purchaseId },
      create: {
        purchase_id: purchaseId,
        pdf_url: `/api/certificates/download/${purchaseId}`,
        verification_hash: verificationHash,
      },
      update: {
        verification_hash: verificationHash,
      },
    });

    return {
      certificateId: certificate.id,
      pdfUrl: `/api/certificates/${certificate.id}/download`,
      pdfBuffer: Buffer.from(pdfBytes),
    };
  }

  /**
   * Get certificate metadata
   */
  static async getCertificateMetadata(certificateId: string) {
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        purchase: {
          include: {
            buyer: true,
            credit_batch: { include: { city: true } },
          },
        },
      },
    });

    if (!certificate) {
      throw new Error('CERTIFICATE_NOT_FOUND');
    }

    return {
      certificateId: certificate.id,
      companyName: certificate.purchase.buyer.company_name,
      tonnes: certificate.purchase.tonnes_purchased,
      city: certificate.purchase.credit_batch.city.name,
      verificationHash: certificate.verification_hash,
      issuedAt: certificate.issued_at,
      pdfUrl: `/api/certificates/${certificate.id}/download`,
    };
  }

  /**
   * Get raw PDF binary buffer for download endpoint
   */
  static async getCertificatePdfBuffer(certificateId: string): Promise<Buffer> {
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
    });

    if (!certificate) {
      throw new Error('CERTIFICATE_NOT_FOUND');
    }

    const { pdfBuffer } = await this.generateCertificateForPurchase(certificate.purchase_id);
    return pdfBuffer;
  }
}
