import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { driveApi } from '../../api/client';
import { PlacementDrive, DriveStatus } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import {
  CalendarCheck2,
  Plus,
  Search,
  Filter,
  Users,
  Edit,
  Trash2,
  ExternalLink,
  PowerOff,
  Building2,
  IndianRupee,
} from 'lucide-react';

export const DriveManagement: React.FC = () => {
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Close / Delete dialog state
  const [driveToClose, setDriveToClose] = useState<PlacementDrive | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const toast = useToast();

  useEffect(() => {
    loadDrives();
  }, []);

  const loadDrives = async () => {
    try {
      setLoading(true);
      const res = await driveApi.getAll();
      setDrives(res);
    } catch (err) {
      console.error('Failed to load drives', err);
      toast.error('Failed to load placement drives');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (driveId: number, newStatus: DriveStatus) => {
    try {
      await driveApi.updateStatus(driveId, newStatus);
      toast.success(`Drive status updated to ${newStatus}`);
      loadDrives();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleCloseDrive = async () => {
    if (!driveToClose) return;
    try {
      setIsProcessing(true);
      await driveApi.updateStatus(driveToClose.id, 'CLOSED');
      toast.success(`Drive for ${driveToClose.companyName} closed successfully`);
      setDriveToClose(null);
      loadDrives();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to close drive');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredDrives = drives.filter((d) => {
    const matchesSearch =
      d.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.location && d.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <LoadingSpinner message="Loading placement drives..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Placement Drives</h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize recruitment schedules, set academic criteria, manage applicants, and configure drive lifecycles.
          </p>
        </div>
        <Link
          to="/admin/drives/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 shadow-sm shadow-brand-600/20 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Placement Drive
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search company, role, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:ring-1 focus:ring-brand-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open Only</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="CLOSED">Closed</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Drives Table */}
      {filteredDrives.length === 0 ? (
        <EmptyState
          title="No Placement Drives Found"
          description="No drives match your current search or filter. Create a new drive to start campus recruitment."
          actionText="Create New Drive"
          onAction={() => (window.location.href = '/admin/drives/create')}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">
                <tr>
                  <th className="px-6 py-4">Company & Role</th>
                  <th className="px-6 py-4">CTC Package</th>
                  <th className="px-6 py-4">Drive Date</th>
                  <th className="px-6 py-4">Deadline</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Applicants</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {filteredDrives.map((drive) => (
                  <tr key={drive.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        {drive.companyLogo ? (
                          <img
                            src={drive.companyLogo}
                            alt={drive.companyName}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-2xs"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                            <Building2 className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{drive.companyName}</p>
                          <p className="text-xs text-brand-600 font-semibold">{drive.jobRole}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <span className="flex items-center">
                        <IndianRupee className="w-3.5 h-3.5 text-brand-600" />
                        {drive.ctc} LPA
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">{drive.driveDate}</td>
                    <td className="px-6 py-4 text-xs font-medium text-rose-600">
                      {drive.applicationDeadline}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={drive.status}
                        onChange={(e) => handleStatusChange(drive.id, e.target.value as DriveStatus)}
                        className="text-xs font-semibold rounded-lg border border-slate-200 px-2 py-1 bg-white focus:ring-1 focus:ring-brand-500"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="UPCOMING">UPCOMING</option>
                        <option value="CLOSED">CLOSED</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/drives/${drive.id}/applicants`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors border border-purple-200"
                      >
                        <Users className="w-3.5 h-3.5" />
                        {drive.totalApplicants} Applicants
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          to={`/admin/drives/${drive.id}/applicants`}
                          title="View Applicants"
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          <Users className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/drives/${drive.id}/edit`}
                          title="Edit Drive"
                          className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {drive.status === 'OPEN' && (
                          <button
                            onClick={() => setDriveToClose(drive)}
                            title="Close Drive"
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <PowerOff className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation to Close Drive */}
      <ConfirmDialog
        isOpen={!!driveToClose}
        onClose={() => setDriveToClose(null)}
        onConfirm={handleCloseDrive}
        title="Close Placement Drive"
        message={`Are you sure you want to close '${driveToClose?.companyName} - ${driveToClose?.jobRole}'? Students will no longer be able to submit applications.`}
        confirmText="Close Drive"
        isDestructive={false}
        isLoading={isProcessing}
      />
    </div>
  );
};
