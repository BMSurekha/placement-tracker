import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationApi, driveApi } from '../../api/client';
import { Application, ApplicationStatus, PlacementDrive } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Search,
  Filter,
  ArrowLeft,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Edit,
  Eye,
  FileText,
  AlertCircle,
} from 'lucide-react';

export const DriveApplicants: React.FC = () => {
  const { driveId } = useParams<{ driveId?: string }>();
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [drive, setDrive] = useState<PlacementDrive | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');
  const [minCgpaFilter, setMinCgpaFilter] = useState<number | ''>('');

  // Status update modal state
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('SHORTLISTED');
  const [remarks, setRemarks] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Resume preview modal state
  const [previewResume, setPreviewResume] = useState<{ url: string; studentName: string } | null>(null);

  const toast = useToast();

  useEffect(() => {
    loadData();
  }, [driveId]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (driveId) {
        const [driveData, apps] = await Promise.all([
          driveApi.getById(Number(driveId)),
          driveApi.getApplicants(Number(driveId)),
        ]);
        setDrive(driveData);
        setApplicants(apps);
      } else {
        const apps = await applicationApi.getAll();
        setApplicants(apps);
      }
    } catch (err) {
      console.error('Failed to load applicant records', err);
      toast.error('Failed to load applicant roster');
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (app: Application) => {
    setSelectedApp(app);
    setNewStatus(
      app.status === 'APPLIED'
        ? 'SHORTLISTED'
        : app.status === 'SHORTLISTED'
        ? 'SELECTED'
        : app.status
    );
    setRemarks(app.remarks || '');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      setIsUpdating(true);
      await applicationApi.updateStatus(selectedApp.id, newStatus, remarks);
      toast.success(`Candidate status updated to ${newStatus}!`);
      setSelectedApp(null);
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update candidate status');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredApplicants = applicants.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter === 'ALL' || app.studentDepartment === departmentFilter;
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesYear = yearFilter === 'ALL' || app.studentYear === Number(yearFilter);
    const matchesCgpa = minCgpaFilter === '' || app.studentCgpa >= Number(minCgpaFilter);

    return matchesSearch && matchesDept && matchesStatus && matchesYear && matchesCgpa;
  });

  if (loading) {
    return <LoadingSpinner message="Loading candidates roster..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        {driveId && (
          <Link
            to="/admin/drives"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Drives
          </Link>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {drive ? `${drive.companyName} — Applicants` : 'All Placement Applicants'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {drive
                ? `Role: ${drive.jobRole} • Package: ₹${drive.ctc} LPA • Total Candidates: ${applicants.length}`
                : `Comprehensive candidate roster across all active and concluded recruitment drives.`}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by student name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Showing {filteredApplicants.length} of {applicants.length} candidates</span>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg p-1.5 bg-white text-slate-700"
            >
              <option value="ALL">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg p-1.5 bg-white text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPLIED">Applied Only</option>
              <option value="SHORTLISTED">Shortlisted Only</option>
              <option value="SELECTED">Selected Only</option>
              <option value="REJECTED">Rejected Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Academic Year</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg p-1.5 bg-white text-slate-700"
            >
              <option value="ALL">All Years</option>
              <option value="4">4th Year</option>
              <option value="3">3rd Year</option>
              <option value="2">2nd Year</option>
              <option value="1">1st Year</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Min CGPA Cutoff</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="e.g. 7.5"
              value={minCgpaFilter}
              onChange={(e) => setMinCgpaFilter(e.target.value === '' ? '' : parseFloat(e.target.value))}
              className="w-full text-xs border border-slate-200 rounded-lg p-1.5 bg-white text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      {filteredApplicants.length === 0 ? (
        <EmptyState
          title="No Matching Applicants Found"
          description="No students currently match your selected filters or search terms."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">
                <tr>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Roll No</th>
                  {!driveId && <th className="px-5 py-4">Company & Drive</th>}
                  <th className="px-5 py-4">Dept / Year</th>
                  <th className="px-5 py-4">CGPA / Backlogs</th>
                  <th className="px-5 py-4">Skills</th>
                  <th className="px-5 py-4">Resume</th>
                  <th className="px-5 py-4">Applied Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700 text-xs">
                {filteredApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{app.studentName}</p>
                        <p className="text-[11px] text-slate-400">{app.studentEmail}</p>
                        {app.studentPhone && (
                          <p className="text-[11px] text-slate-400">Ph: {app.studentPhone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-slate-800">
                      {app.rollNumber}
                    </td>
                    {!driveId && (
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900 text-xs">{app.companyName}</p>
                        <p className="text-slate-500 text-[11px]">{app.jobRole}</p>
                      </td>
                    )}
                    <td className="px-5 py-4 text-slate-600">
                      <span className="font-semibold text-slate-800">{app.studentDepartment}</span>
                      <span className="text-slate-400 block text-[11px]">Year {app.studentYear}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-900 text-sm">{app.studentCgpa}</span>
                      <span className="block text-[11px] text-slate-400">
                        {app.studentBacklogs === 0 ? '0 Backlogs' : `${app.studentBacklogs} Backlogs`}
                      </span>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <p className="truncate text-slate-600" title={app.studentSkills}>
                        {app.studentSkills || 'None'}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      {app.resumeUrl ? (
                        <button
                          type="button"
                          onClick={() => setPreviewResume({ url: app.resumeUrl!, studentName: app.studentName })}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg border border-brand-200 transition-colors shadow-2xs"
                          title="View uploaded resume"
                        >
                          <Eye className="w-3.5 h-3.5 text-brand-600" />
                          <span>{app.resumeUrl.toLowerCase().endsWith('.pdf') ? 'View PDF' : 'View Image'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toast.error(`Resume Not Uploaded: ${app.studentName} has not uploaded a resume yet.`)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                          title="Candidate has not uploaded a resume"
                        >
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                          <span>Not Uploaded</span>
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => openStatusModal(app)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-200"
                      >
                        <Edit className="w-3.5 h-3.5" /> Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title="Update Candidate Status"
        subtitle={selectedApp ? `${selectedApp.studentName} (${selectedApp.rollNumber})` : ''}
        maxWidth="max-w-md"
      >
        {selectedApp && (
          <form onSubmit={handleUpdateStatus} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Recruitment Stage Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="APPLIED">APPLIED (Initial screening)</option>
                <option value="SHORTLISTED">SHORTLISTED (Assessment/Interview)</option>
                <option value="SELECTED">SELECTED (Offer Extended)</option>
                <option value="REJECTED">REJECTED (Not Selected)</option>
                <option value="WITHDRAWN">WITHDRAWN</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Evaluation Remarks / Interview Instructions
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Cleared online coding test with 95%. Technical interview scheduled for Friday 10 AM."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                The student will see this remark updated on their personal dashboard immediately.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm shadow-brand-600/20 disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Update Status'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Resume Viewer Modal */}
      <Modal
        isOpen={!!previewResume}
        onClose={() => setPreviewResume(null)}
        title={previewResume ? `Candidate Resume: ${previewResume.studentName}` : 'Resume Preview'}
        subtitle="Uploaded document preview"
        maxWidth="max-w-4xl"
      >
        {previewResume && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-600 font-mono truncate max-w-sm sm:max-w-md">
                {previewResume.url}
              </span>
              <a
                href={previewResume.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 font-bold text-brand-700 bg-white border border-brand-300 rounded-lg hover:bg-brand-50 shadow-xs transition-colors self-start sm:self-auto"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open in Full Browser Tab
              </a>
            </div>

            <div className="w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center min-h-[480px]">
              {previewResume.url.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={previewResume.url}
                  className="w-full h-[65vh] border-0"
                  title="Candidate Resume PDF"
                />
              ) : (
                <div className="p-4 flex items-center justify-center">
                  <img
                    src={previewResume.url}
                    alt="Candidate Resume"
                    className="max-h-[65vh] max-w-full object-contain rounded-lg shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
