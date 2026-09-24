import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCertificate } from '../../hooks/useBuyerQueries';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Download, Share2, Leaf, ShieldCheck } from 'lucide-react';

export const CertificateView: React.FC = () => {
  const { certId } = useParams<{ certId: string }>();
  const navigate = useNavigate();
  const { data: cert, isLoading, error, refetch } = useCertificate(certId || '');

  if (isLoading) return <LoadingSkeleton variant="card" count={1} />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!cert) return null;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="max-w-2xl mx-auto">
        {/* Certificate document */}
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg overflow-hidden">
          {/* Header band */}
          <div className="bg-gradient-to-r from-[#0F6E56] to-[#1a9474] px-8 py-6 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Leaf className="w-6 h-6" />
              <span className="text-lg font-bold tracking-wider uppercase">LastMile Carbon</span>
            </div>
            <p className="text-sm text-white/80">Carbon Credit Offset Certificate</p>
          </div>

          {/* Body */}
          <div className="px-8 py-8 space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">This certifies that</p>
              <h2 className="text-2xl font-bold text-gray-900">{cert.buyerName}</h2>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">has offset a total of</p>
              <p className="text-5xl font-bold text-[#0F6E56]">{cert.tonnesOffset}</p>
              <p className="text-lg font-semibold text-gray-600 mt-1">Tonnes of CO₂ Equivalent</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">from verified last-mile delivery route optimizations in</p>
              <p className="text-base font-semibold text-gray-800">{cert.region}</p>
              <p className="text-sm text-gray-500">via batch: {cert.batchTitle}</p>
            </div>

            {/* Verification details */}
            <div className="border border-gray-200 rounded-md p-4 bg-gray-50 space-y-3">
              <div className="flex items-center gap-2 justify-center">
                <ShieldCheck className="w-5 h-5 text-[#0F6E56]" />
                <span className="text-sm font-medium text-gray-700">ISO 14064-2 Third-Party Verified</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-0.5">Certificate ID</p>
                  <p className="text-xs font-mono text-gray-700">{cert.id}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-0.5">Issue Date</p>
                  <p className="text-xs text-gray-700">{cert.issueDate}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-0.5">Verification Hash</p>
                <p className="text-xs font-mono text-gray-600 break-all">{cert.verificationHash}</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center">
              <img
                src={cert.qrCodeUrl}
                alt="Verification QR Code"
                className="w-28 h-28 mx-auto border border-gray-200 rounded-md p-1"
              />
              <p className="text-[10px] text-gray-400 mt-1">Scan to verify on-chain</p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-8 py-4 text-center">
            <p className="text-[10px] text-gray-400">
              LastMile Carbon · Verified Carbon Credits from Last-Mile Delivery Optimization
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button variant="primary" themeAccent="coral" size="lg">
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </Button>
          <Button variant="outline" themeAccent="coral">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
      </div>
    </div>
  );
};
