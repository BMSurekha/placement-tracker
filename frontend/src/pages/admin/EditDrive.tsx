import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { companyApi, driveApi } from '../../api/client';
import { Company, PlacementDrive, DriveStatus } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, Save, CalendarCheck2, ShieldCheck } from 'lucide-react';

export const EditDrive: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [companyId, setCompanyId] = useState<number | ''>('');
  const [jobRole, setJobRole] = useState('');
  const [description, setDescription] = useState('');
  const [ctc, setCtc] = useState<number | ''>(6.0);
  const [location, setLocation] = useState('');
  const [driveDate, setDriveDate] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [status, setStatus] = useState<DriveStatus>('OPEN');

  // Eligibility fields
  const [minimumCgpa, setMinimumCgpa] = useState<number | ''>('');
  const [maximumBacklogs, setMaximumBacklogs] = useState<number | ''>('');
  const [allowedDepartments, setAllowedDepartments] = useState('');
  const [allowedYears, setAllowedYears] = useState('');
  const [minimumTenthPercentage, setMinimumTenthPercentage] = useState<number | ''>('');
  const [minimumIntermediatePercentage, setMinimumIntermediatePercentage] = useState<number | ''>('');
  const [requiredSkills, setRequiredSkills] = useState('');

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) loadData(Number(id));
  }, [id]);

  const loadData = async (driveId: number) => {
    try {
      setLoading(true);
      const [comps, drive] = await Promise.all([
        companyApi.getAll(),
        driveApi.getById(driveId),
      ]);
      setCompanies(comps);

      // Populate form
      setCompanyId(drive.companyId);
      setJobRole(drive.jobRole);
      setDescription(drive.description || '');
      setCtc(drive.ctc);
      setLocation(drive.location || '');
      setDriveDate(drive.driveDate);
      setApplicationDeadline(drive.applicationDeadline);
      setStatus(drive.status);

      if (drive.eligibilityCriteria) {
        const ec = drive.eligibilityCriteria;
        setMinimumCgpa(ec.minimumCgpa ?? '');
        setMaximumBacklogs(ec.maximumBacklogs ?? '');
        setAllowedDepartments(ec.allowedDepartments || '');
        setAllowedYears(ec.allowedYears || '');
        setMinimumTenthPercentage(ec.minimumTenthPercentage ?? '');
        setMinimumIntermediatePercentage(ec.minimumIntermediatePercentage ?? '');
        setRequiredSkills(ec.requiredSkills || '');
      }
    } catch (err) {
      toast.error('Failed to load drive details for editing');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!companyId || !jobRole.trim() || ctc === '' || !driveDate || !applicationDeadline) {
      toast.warning('Please fill in all mandatory drive fields');
      return;
    }

    if (new Date(applicationDeadline) > new Date(driveDate)) {
      toast.error('Application deadline must not be after the drive date');
      return;
    }

    const payload = {
      companyId: Number(companyId),
      jobRole: jobRole.trim(),
      description: description.trim(),
      ctc: Number(ctc),
      location: location.trim(),
      driveDate,
      applicationDeadline,
      status,
      eligibilityCriteria: {
        minimumCgpa: minimumCgpa !== '' ? Number(minimumCgpa) : null,
        maximumBacklogs: maximumBacklogs !== '' ? Number(maximumBacklogs) : 0,
        allowedDepartments: allowedDepartments.trim().toUpperCase(),
        allowedYears: allowedYears.trim(),
        minimumTenthPercentage: minimumTenthPercentage !== '' ? Number(minimumTenthPercentage) : null,
        minimumIntermediatePercentage: minimumIntermediatePercentage !== '' ? Number(minimumIntermediatePercentage) : null,
        requiredSkills: requiredSkills.trim(),
      },
    };

    try {
      setSaving(true);
      await driveApi.update(Number(id), payload);
      toast.success('Placement drive updated successfully!');
      navigate('/admin/drives');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update drive';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading drive data..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          to="/admin/drives"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Drives
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Edit Placement Drive</h1>
        <p className="text-xs text-slate-500 mt-1">Update schedule, package, or criteria cutoffs.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
            <CalendarCheck2 className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-bold text-slate-800">1. Placement Drive & Role Details</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={companyId}
                  onChange={(e) => setCompanyId(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Designation / Role <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Annual Package (CTC in LPA) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  required
                  value={ctc}
                  onChange={(e) => setCtc(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Location <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as DriveStatus)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Drive Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={driveDate}
                  onChange={(e) => setDriveDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Application Deadline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={applicationDeadline}
                  onChange={(e) => setApplicationDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Eligibility Criteria Specification */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-800">2. Eligibility Criteria & Cutoffs</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Minimum CGPA Cutoff
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={minimumCgpa}
                  onChange={(e) => setMinimumCgpa(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Maximum Backlogs Allowed
                </label>
                <input
                  type="number"
                  min="0"
                  value={maximumBacklogs}
                  onChange={(e) => setMaximumBacklogs(e.target.value === '' ? '' : parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Allowed Departments
                </label>
                <input
                  type="text"
                  value={allowedDepartments}
                  onChange={(e) => setAllowedDepartments(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Eligible Academic Years
                </label>
                <input
                  type="text"
                  value={allowedYears}
                  onChange={(e) => setAllowedYears(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Minimum 10th Percentage Cutoff (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={minimumTenthPercentage}
                  onChange={(e) => setMinimumTenthPercentage(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Minimum 12th / Diploma Percentage Cutoff (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={minimumIntermediatePercentage}
                  onChange={(e) => setMinimumIntermediatePercentage(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Required Technical Skills (Comma-separated)
              </label>
              <input
                type="text"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            to="/admin/drives"
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 shadow-md shadow-brand-600/20 disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Updating Drive...' : 'Update Placement Drive'}
          </button>
        </div>
      </form>
    </div>
  );
};
