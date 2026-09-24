import React, { useState } from 'react';
import { useReportTemplates, useGenerateReport } from '../../hooks/usePlatformQueries';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { FileText, Download, CheckCircle } from 'lucide-react';

export const Reports: React.FC = () => {
  const { data: templates, isLoading, error, refetch } = useReportTemplates();
  const generateMutation = useGenerateReport();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [format, setFormat] = useState<'PDF' | 'CSV'>('PDF');

  if (isLoading) return <LoadingSkeleton variant="card" count={3} />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const handleGenerate = () => {
    if (!selectedTemplate) return;
    generateMutation.mutate({ templateId: selectedTemplate, format });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Reports / Export</h1>
        <p className="text-sm text-gray-500 mt-0.5">Generate BRSR/ESG-ready compliance reports</p>
      </div>

      {/* Template selector */}
      <div>
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Select Report Template</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(templates || []).map((t) => (
            <Card
              key={t.id}
              variant={selectedTemplate === t.id ? 'elevated' : 'basic'}
              onClick={() => setSelectedTemplate(t.id)}
              className={`cursor-pointer transition-all ${selectedTemplate === t.id ? 'ring-2 ring-[#5B4B8A] border-[#5B4B8A]' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${selectedTemplate === t.id ? 'bg-[#5B4B8A] text-white' : 'bg-[#F3F0F9] text-[#5B4B8A]'}`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{t.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{t.description}</p>
                  <Badge variant="status" status="purple" className="mt-2">{t.type}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Format + generate */}
      <div className="bg-white rounded-md border border-gray-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Export format:</span>
          <div className="flex rounded-md border border-gray-200 overflow-hidden">
            {(['PDF', 'CSV'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${format === f ? 'bg-[#5B4B8A] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <Button
          variant="primary"
          themeAccent="purple"
          size="lg"
          disabled={!selectedTemplate}
          isLoading={generateMutation.isPending}
          onClick={handleGenerate}
        >
          <Download className="w-4 h-4 mr-2" />
          Generate & Download
        </Button>
      </div>

      {/* Success state */}
      {generateMutation.isSuccess && (
        <Card variant="basic" className="bg-[#E1F5EE] border-emerald-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-sm font-medium text-emerald-800">Report generated successfully!</p>
              <p className="text-xs text-emerald-600">Report ID: {generateMutation.data?.reportId}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
