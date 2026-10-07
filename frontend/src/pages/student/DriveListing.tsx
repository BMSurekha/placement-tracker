import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { driveApi } from '../../api/client';
import { PlacementDrive } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { EligibilityModal } from '../../components/EligibilityModal';
import { useToast } from '../../context/ToastContext';
import {
  Search,
  Filter,
  Building2,
  MapPin,
  IndianRupee,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

export const DriveListing: React.FC = () => {
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [eligibilityFilter, setEligibilityFilter] = useState('ALL');

  // Eligibility modal state
  const [selectedDriveForModal, setSelectedDriveForModal] = useState<PlacementDrive | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Applying state
  const [applyingDriveId, setApplyingDriveId] = useState<number | null>(null);

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

  const handleApply = async (drive: PlacementDrive) => {
    if (!drive.isEligible) {
      toast.error('You are not eligible for this drive', drive.eligibilityReasons);
      return;
    }

    try {
      setApplyingDriveId(drive.id);
      await driveApi.apply(drive.id, 'Applied directly via student portal');
      toast.success(`Application submitted successfully for ${drive.companyName}!`);
      loadDrives(); // Refresh to update drive status
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to submit application';
      const details = err.response?.data?.details;
      toast.error(msg, details);
    } finally {
      setApplyingDriveId(null);
    }
  };

  const openEligibilityModal = (drive: PlacementDrive) => {
    setSelectedDriveForModal(drive);
    setIsModalOpen(true);
  };

  const filteredDrives = drives.filter((drive) => {
    const matchesSearch =
      drive.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (drive.location && drive.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || drive.status === statusFilter;

    const matchesEligibility =
      eligibilityFilter === 'ALL' ||
      (eligibilityFilter === 'ELIGIBLE' && drive.isEligible === true) ||
      (eligibilityFilter === 'NOT_ELIGIBLE' && drive.isEligible === false) ||
      (eligibilityFilter === 'APPLIED' && drive.hasApplied === true);

    return matchesSearch && matchesStatus && matchesEligibility;
  });

  if (loading) {
    return <LoadingSpinner message="Loading placement drives..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Available Placement Drives</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse campus recruitment drives, verify your criteria eligibility, and submit applications.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search company, job role, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" /> Filter by:
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:ring-1 focus:ring-brand-500"
          >
            <option value="ALL">All Drive Statuses</option>
            <option value="OPEN">Open Only</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            value={eligibilityFilter}
            onChange={(e) => setEligibilityFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:ring-1 focus:ring-brand-500"
          >
            <option value="ALL">All Eligibility</option>
            <option value="ELIGIBLE">Eligible Only</option>
            <option value="NOT_ELIGIBLE">Ineligible Only</option>
            <option value="APPLIED">Already Applied</option>
          </select>
        </div>
      </div>

      {/* Grid of Placement Drives */}
      {filteredDrives.length === 0 ? (
        <EmptyState
          title="No Placement Drives Found"
          description="There are currently no placement drives matching your search criteria or filters."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDrives.map((drive) => {
            const isEligible = Boolean(drive.isEligible);
            const hasApplied = Boolean(drive.hasApplied);
            const isOpen = drive.status === 'OPEN';
            const canApply = isOpen && isEligible && !hasApplied;

            return (
              <div
                key={drive.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5">
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {drive.companyLogo ? (
                        <img
                          src={drive.companyLogo}
                          alt={drive.companyName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-xs"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                          <Building2 className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">{drive.companyName}</h3>
                        <p className="text-xs text-brand-600 font-semibold">{drive.jobRole}</p>
                      </div>
                    </div>
                    <StatusBadge status={drive.status} size="sm" />
                  </div>

                  {/* CTC and Info Box */}
                  <div className="my-3.5 bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Package / CTC:</span>
                      <span className="font-bold text-slate-900 text-sm flex items-center">
                        <IndianRupee className="w-3.5 h-3.5 text-brand-600" />
                        {drive.ctc} LPA
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Location:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[150px]">
                        {drive.location || 'Pan India'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Drive Date:</span>
                      <span className="font-medium text-slate-800">{drive.driveDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Deadline:</span>
                      <span className="font-medium text-rose-600">{drive.applicationDeadline}</span>
                    </div>
                  </div>

                  {/* Eligibility Status Banner */}
                  <div className="pt-1">
                    {hasApplied ? (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-sky-600" /> Applied
                        </span>
                        <StatusBadge status={drive.applicationStatus || 'APPLIED'} size="sm" />
                      </div>
                    ) : isEligible ? (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                        <span className="flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> You are eligible
                        </span>
                        <button
                          type="button"
                          onClick={() => openEligibilityModal(drive)}
                          className="text-[11px] font-semibold text-emerald-700 hover:underline"
                        >
                          View Criteria
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                        <span className="flex items-center gap-1.5 font-bold">
                          <XCircle className="w-4 h-4 text-rose-600" /> Not Eligible
                        </span>
                        <button
                          type="button"
                          onClick={() => openEligibilityModal(drive)}
                          className="text-[11px] font-semibold text-rose-700 hover:underline"
                        >
                          View Reasons
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-5 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/student/drives/${drive.id}`}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    View Details
                  </Link>

                  <div>
                    {hasApplied ? (
                      <span className="text-xs text-slate-400 font-medium">Already Applied</span>
                    ) : (
                      <button
                        type="button"
                        disabled={!canApply || applyingDriveId === drive.id}
                        onClick={() => handleApply(drive)}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-xs ${
                          canApply
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {applyingDriveId === drive.id ? 'Applying...' : 'Apply Now'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Eligibility Breakdown Modal */}
      <EligibilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        drive={selectedDriveForModal}
        onApply={() => selectedDriveForModal && handleApply(selectedDriveForModal)}
      />
    </div>
  );
};
