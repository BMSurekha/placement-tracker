import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, applicationApi } from '../../api/client';
import { OfficerDashboardData, ApplicationStatus } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Building2,
  CalendarCheck2,
  FileText,
  Award,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';

export const OfficerDashboard: React.FC = () => {
  const [data, setData] = useState<OfficerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load admin dashboard', err);
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatusChange = async (appId: number, newStatus: ApplicationStatus) => {
    try {
      await applicationApi.updateStatus(appId, newStatus, `Status updated to ${newStatus} from dashboard`);
      toast.success(`Application updated to ${newStatus}`);
      loadDashboard();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading placement officer metrics..." />;
  }

  if (!data) {
    return <div>Failed to load metrics.</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-300 mb-2">
            Placement Cell Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Recruitment Command Center
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Real-time analytics, company partnerships, active drives, and student recruitment funnels.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link
            to="/admin/drives/create"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-brand-500 transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Create Drive
          </Link>
          <Link
            to="/admin/companies"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 text-white border border-slate-700 rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors"
          >
            <Building2 className="w-4 h-4" /> Add Company
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Students</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-800">{data.totalStudentsCount}</p>
          <span className="text-[11px] text-slate-400">Registered profiles</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Companies</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-800">{data.totalCompaniesCount}</p>
          <span className="text-[11px] text-slate-400">Recruiter network</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Drives</span>
            <CalendarCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700">{data.activeDrivesCount}</p>
          <span className="text-[11px] text-slate-400">Open for application</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Applications</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-800">{data.totalApplicationsCount}</p>
          <span className="text-[11px] text-slate-400">Total submitted</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Shortlisted</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-600">{data.shortlistedCount}</p>
          <span className="text-[11px] text-slate-400">Interview stage</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-emerald-300 shadow-xs bg-emerald-50/30">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Selected Offers</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-800">{data.selectedCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Offers released</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Drives Table (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Active Placement Drives</h2>
              <p className="text-xs text-slate-500">Recruitment drives currently accepting student applications</p>
            </div>
            <Link
              to="/admin/drives"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Manage all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {data.activeDrives.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No active placement drives currently open.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-left">
                    <tr>
                      <th className="px-5 py-3">Company & Role</th>
                      <th className="px-5 py-3">Package</th>
                      <th className="px-5 py-3">Drive Date</th>
                      <th className="px-5 py-3">Applicants</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {data.activeDrives.map((drive) => (
                      <tr key={drive.id} className="hover:bg-slate-50/70">
                        <td className="px-5 py-3.5">
                          <p className="font-bold text-slate-900">{drive.companyName}</p>
                          <p className="text-[11px] text-brand-600">{drive.jobRole}</p>
                        </td>
                        <td className="px-5 py-3.5 font-bold text-slate-800">₹{drive.ctc} LPA</td>
                        <td className="px-5 py-3.5 text-slate-600">{drive.driveDate}</td>
                        <td className="px-5 py-3.5 font-semibold text-slate-800">
                          {drive.totalApplicants}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link
                            to={`/admin/drives/${drive.id}/applicants`}
                            className="px-2.5 py-1 text-[11px] font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-md transition-colors"
                          >
                            View Applicants
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick Funnel / Status Distribution */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">Application Pipeline</h2>
            <p className="text-xs text-slate-500">Recruitment funnel conversion</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-600">Total Applications</span>
                <span className="font-bold text-slate-900">{data.totalApplicationsCount}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-600">Shortlisted for Interviews</span>
                <span className="font-bold text-amber-600">{data.shortlistedCount}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{
                    width: `${
                      data.totalApplicationsCount > 0
                        ? (data.shortlistedCount / data.totalApplicationsCount) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-600">Final Offers Selected</span>
                <span className="font-bold text-emerald-700">{data.selectedCount}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all"
                  style={{
                    width: `${
                      data.totalApplicationsCount > 0
                        ? (data.selectedCount / data.totalApplicationsCount) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <Link
                to="/admin/applicants"
                className="w-full inline-flex justify-center items-center gap-1.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors"
              >
                Review All Applicants Pipeline <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Recent Applicant Submissions</h2>
            <p className="text-xs text-slate-500">Live roster of candidates who applied across drives</p>
          </div>
          <Link
            to="/admin/applicants"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            All applicants <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {data.recentApplications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No recent applications recorded.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-left">
                  <tr>
                    <th className="px-5 py-3.5">Student</th>
                    <th className="px-5 py-3.5">Roll No & Dept</th>
                    <th className="px-5 py-3.5">Drive & Company</th>
                    <th className="px-5 py-3.5">CGPA</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Quick Transition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {data.recentApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3.5 font-bold text-slate-900">{app.studentName}</td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {app.rollNumber} • <span className="font-semibold">{app.studentDepartment}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">{app.companyName}</p>
                        <p className="text-slate-500">{app.jobRole}</p>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-800">{app.studentCgpa}</td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={app.status} size="sm" />
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-1">
                        {app.status === 'APPLIED' && (
                          <button
                            onClick={() => handleQuickStatusChange(app.id, 'SHORTLISTED')}
                            className="px-2 py-1 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded hover:bg-amber-100"
                          >
                            Shortlist
                          </button>
                        )}
                        {app.status === 'SHORTLISTED' && (
                          <button
                            onClick={() => handleQuickStatusChange(app.id, 'SELECTED')}
                            className="px-2 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded hover:bg-emerald-100"
                          >
                            Select
                          </button>
                        )}
                        <Link
                          to={`/admin/drives/${app.driveId}/applicants`}
                          className="px-2 py-1 text-[10px] font-medium text-slate-600 bg-slate-100 rounded hover:bg-slate-200"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
