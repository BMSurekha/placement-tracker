import React, { useEffect, useState } from 'react';
import { studentApi } from '../../api/client';
import { Application } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import {
  Building2,
  Calendar,
  IndianRupee,
  MapPin,
  ExternalLink,
  Clock,
  Eye,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const toast = useToast();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await studentApi.getMyApplications();
      setApplications(res);
    } catch (err) {
      console.error('Failed to load applications', err);
      toast.error('Failed to load your applications');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your applications..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">My Placement Applications</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time progress across recruitment rounds, shortlist announcements, and selection offers.
          </p>
        </div>
        <Link
          to="/student/drives"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700 shadow-sm shadow-brand-600/20 transition-colors"
        >
          Explore More Drives
        </Link>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="No Applications Submitted"
          description="You haven't applied for any recruitment drives yet. Explore open drives to apply."
          actionText="Browse Open Drives"
          onAction={() => (window.location.href = '/student/drives')}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">
                <tr>
                  <th className="px-6 py-4">Company & Role</th>
                  <th className="px-6 py-4">Offered Package</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        {app.companyLogo ? (
                          <img
                            src={app.companyLogo}
                            alt={app.companyName}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-2xs"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                            <Building2 className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-tight">{app.companyName}</p>
                          <p className="text-xs text-brand-600 font-semibold">{app.jobRole}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <span className="flex items-center gap-0.5">
                        <IndianRupee className="w-3.5 h-3.5 text-brand-600" />
                        {app.ctc} LPA
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {app.location || 'Multiple'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Application Details Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title="Application Review"
        subtitle={selectedApp ? `${selectedApp.companyName} — ${selectedApp.jobRole}` : ''}
        maxWidth="max-w-md"
      >
        {selectedApp && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Application Status</span>
                <div className="mt-1">
                  <StatusBadge status={selectedApp.status} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Offered Package</span>
                <span className="text-base font-bold text-slate-900 mt-1 block">₹{selectedApp.ctc} LPA</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Application ID:</span>
                <span className="font-semibold text-slate-800">#{selectedApp.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Student Roll No:</span>
                <span className="font-semibold text-slate-800">{selectedApp.rollNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Submission Date:</span>
                <span className="font-semibold text-slate-800">
                  {new Date(selectedApp.appliedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-800">{selectedApp.location || 'Multiple'}</span>
              </div>
            </div>

            {/* Officer Remarks */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Recruitment Remarks / Notes
              </h4>
              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium leading-relaxed">
                {selectedApp.remarks || 'No specific remarks posted yet. Application is currently under evaluation by the placement cell.'}
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <Link
                to={`/student/drives/${selectedApp.driveId}`}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                View Drive Page <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
