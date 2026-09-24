import React from 'react';
import { useBuyerProfile } from '../../hooks/useBuyerQueries';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Building2, Mail, MapPin, Users, Bell } from 'lucide-react';

export const BuyerSettings: React.FC = () => {
  const { data: profile, isLoading, error, refetch } = useBuyerProfile();

  if (isLoading) return <LoadingSkeleton variant="card" count={3} />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your organization's account</p>
      </div>

      {/* Company profile */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2"><Building2 className="w-4 h-4 text-gray-400" /> Company Profile</h2>
          <Button variant="outline" themeAccent="coral" size="sm">Edit</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div><p className="text-xs text-gray-400 mb-0.5">Company Name</p><p className="font-medium">{profile.companyName}</p></div>
          <div><p className="text-xs text-gray-400 mb-0.5">GSTIN</p><p className="font-mono text-gray-600">{profile.gstin}</p></div>
          <div className="sm:col-span-2"><p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> Address</p><p>{profile.address}</p></div>
        </div>
      </Card>

      {/* Billing */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> Billing Information</h2>
          <Button variant="outline" themeAccent="coral" size="sm">Edit</Button>
        </div>
        <div className="text-sm">
          <p className="text-xs text-gray-400 mb-0.5">Billing Email</p>
          <p className="font-medium">{profile.billingEmail}</p>
        </div>
      </Card>

      {/* Team members */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /> Team Members</h2>
          <Button variant="outline" themeAccent="coral" size="sm">Add Member</Button>
        </div>
        <div className="space-y-3">
          {profile.teamMembers.map((m) => (
            <div key={m.email} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{m.name}</p>
                <p className="text-xs text-gray-400">{m.email}</p>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{m.role}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-4"><Bell className="w-4 h-4 text-gray-400" /> Notification Preferences</h2>
        <div className="space-y-3">
          {[
            { label: 'Email alerts for purchases', key: 'emailAlerts' as const },
            { label: 'Weekly impact digest', key: 'weeklyDigest' as const },
            { label: 'New batch availability alerts', key: 'newBatchAlerts' as const },
          ].map(({ label, key }) => (
            <label key={key} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700">{label}</span>
              <div className={`relative w-10 h-6 rounded-full transition-colors ${profile.notifications[key] ? 'bg-[#D85A30]' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${profile.notifications[key] ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
              </div>
            </label>
          ))}
        </div>
      </Card>

      {/* Logout */}
      <div className="pt-4">
        <Button variant="destructive" size="sm">Logout</Button>
      </div>
    </div>
  );
};
