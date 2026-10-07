import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../../api/client';
import { StudentDashboardData } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  Briefcase,
  CheckCircle2,
  FileCheck,
  Award,
  ArrowRight,
  Calendar,
  MapPin,
  IndianRupee,
  Building2,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await studentApi.getDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load student dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  if (!data) {
    return <div>Failed to load dashboard data.</div>;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Greeting Banner */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-brand-700/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-brand-100 mb-2">
            Academic Year 2026-27 Recruitment
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {data.studentName}!
          </h1>
          <p className="text-sm text-brand-100 mt-1">
            Roll No: <span className="font-semibold text-white">{data.studentRollNo}</span> • Dept: <span className="font-semibold text-white">{data.department}</span> • CGPA: <span className="font-semibold text-white">{data.cgpa}</span>
          </p>
        </div>
        <div>
          <Link
            to="/student/drives"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-700 rounded-xl text-sm font-bold shadow-md hover:bg-brand-50 transition-all hover:scale-[1.02]"
          >
            Explore Drives <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Available Drives</p>
            <p className="text-xl font-bold text-slate-800">{data.availableDrivesCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Eligible Drives</p>
            <p className="text-xl font-bold text-emerald-700">{data.eligibleDrivesCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Applications</p>
            <p className="text-xl font-bold text-slate-800">{data.totalApplicationsCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Shortlisted</p>
            <p className="text-xl font-bold text-amber-600">{data.shortlistedCount}</p>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white rounded-xl p-4 border border-emerald-200 shadow-sm flex items-center gap-3.5 bg-gradient-to-br from-emerald-50/40 to-white">
          <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-emerald-700 font-medium">Selected Offers</p>
            <p className="text-2xl font-black text-emerald-800">{data.selectedCount}</p>
          </div>
        </div>
      </div>

      {/* Recommended Drives Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Recommended for You</h2>
            <p className="text-xs text-slate-500">Placement drives you are eligible for right now</p>
          </div>
          <Link
            to="/student/drives"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            View all drives <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {data.recommendedDrives.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center border border-slate-200 text-slate-500 text-sm">
            No pending recommended drives. You have either applied to all eligible drives or no new open drives match your profile.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.recommendedDrives.map((drive) => (
              <div
                key={drive.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {drive.companyLogo ? (
                        <img
                          src={drive.companyLogo}
                          alt={drive.companyName}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                          <Building2 className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm leading-tight">{drive.jobRole}</h3>
                        <p className="text-xs text-slate-500">{drive.companyName}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ Eligible
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 my-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <IndianRupee className="w-3.5 h-3.5 text-brand-600" />
                      <span>₹{drive.ctc} LPA</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{drive.location || 'Multiple'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Deadline: {drive.applicationDeadline}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <Link
                    to={`/student/drives/${drive.id}`}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors shadow-sm shadow-brand-500/20"
                  >
                    View Details & Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Applications Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Recent Applications</h2>
            <p className="text-xs text-slate-500">Live track your selection and interview progress</p>
          </div>
          <Link
            to="/student/applications"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            All applications <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {data.recentApplications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              You haven't applied to any placement drives yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">
                  <tr>
                    <th className="px-6 py-3.5">Company & Role</th>
                    <th className="px-6 py-3.5">Package</th>
                    <th className="px-6 py-3.5">Applied Date</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {data.recentApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {app.companyLogo ? (
                            <img
                              src={app.companyLogo}
                              alt={app.companyName}
                              className="w-8 h-8 rounded-lg object-cover border border-slate-100"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                              <Building2 className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{app.companyName}</p>
                            <p className="text-xs text-slate-500">{app.jobRole}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        ₹{app.ctc} LPA
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">
                        {app.remarks || 'Under Review'}
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
