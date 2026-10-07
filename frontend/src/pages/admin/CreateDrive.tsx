import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { companyApi, driveApi } from '../../api/client';
import { Company } from '../../types';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, Save, CalendarCheck2, ShieldCheck, Building2 } from 'lucide-react';

export const CreateDrive: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [companyId, setCompanyId] = useState<number | ''>('');
  const [jobRole, setJobRole] = useState('');
  const [description, setDescription] = useState('');
  const [ctc, setCtc] = useState<number | ''>(6.0);
  const [location, setLocation] = useState('Bangalore / Hybrid');
  const [driveDate, setDriveDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 20);
    return d.toISOString().split('T')[0];
  });
  const [applicationDeadline, setApplicationDeadline] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString().split('T')[0];
  });
  const [status, setStatus] = useState('OPEN');

  // Eligibility fields
  const [minimumCgpa, setMinimumCgpa] = useState<number | ''>(7.0);
  const [maximumBacklogs, setMaximumBacklogs] = useState<number | ''>(0);
  const [allowedDepartments, setAllowedDepartments] = useState('CSE,IT,ECE');
  const [allowedYears, setAllowedYears] = useState('4');
  const [minimumTenthPercentage, setMinimumTenthPercentage] = useState<number | ''>(60.0);
  const [minimumIntermediatePercentage, setMinimumIntermediatePercentage] = useState<number | ''>(60.0);
  const [requiredSkills, setRequiredSkills] = useState('Java, SQL');

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const res = await companyApi.getAll();
      setCompanies(res);
      if (res.length > 0) {
        setCompanyId(res[0].id);
      }
    } catch (err) {
      toast.error('Failed to load companies for dropdown');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      await driveApi.create(payload);
      toast.success('Placement drive and eligibility criteria created successfully!');
      navigate('/admin/drives');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create drive';
      const details = err.response?.data?.details;
      toast.error(msg, details);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          to="/admin/drives"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Drives
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Create Placement Drive</h1>
        <p className="text-xs text-slate-500 mt-1">
          Publish a new recruitment drive and set definitive eligibility cutoffs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Drive & Job Specifications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
            <CalendarCheck2 className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-bold text-slate-800">1. Placement Drive & Role Details</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Recruiting Company <span className="text-rose-500">*</span>
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
                  placeholder="e.g. Associate Software Engineer"
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
                  placeholder="e.g. 7.5"
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
                  placeholder="e.g. Bangalore / Pune"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="OPEN">OPEN (Accepting Applications)</option>
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="CLOSED">CLOSED</option>
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
                <p className="text-[11px] text-slate-400 mt-1">
                  Must be on or before the drive date.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job & Interview Process Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details about job responsibilities, interview rounds, probation period..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Eligibility Criteria Specification */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-base font-bold text-slate-800">2. Eligibility Criteria & Cutoffs</h2>
              <p className="text-[11px] text-slate-500">
                These rules are authoritatively checked on both frontend and backend before application.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Minimum CGPA Cutoff (0.0 - 10.0)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={minimumCgpa}
                  onChange={(e) => setMinimumCgpa(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="e.g. 7.5"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Maximum Active Standing Backlogs Allowed
                </label>
                <input
                  type="number"
                  min="0"
                  value={maximumBacklogs}
                  onChange={(e) => setMaximumBacklogs(e.target.value === '' ? '' : parseInt(e.target.value))}
                  placeholder="0 (Strict no backlogs)"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Allowed Departments (Comma-separated)
                </label>
                <input
                  type="text"
                  value={allowedDepartments}
                  onChange={(e) => setAllowedDepartments(e.target.value)}
                  placeholder="e.g. CSE, IT, ECE"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 uppercase"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Enter department acronyms separated by commas (e.g. CSE, IT).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Eligible Academic Years
                </label>
                <input
                  type="text"
                  value={allowedYears}
                  onChange={(e) => setAllowedYears(e.target.value)}
                  placeholder="e.g. 4 or 3, 4"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  e.g. "4" for final year graduating students, or "3, 4" for internships.
                </p>
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
                  placeholder="e.g. 60.0"
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
                  placeholder="e.g. 60.0"
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
                placeholder="e.g. Java, SQL, Python"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Leave blank if no specific skill tag cutoff is required.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
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
            {saving ? 'Creating Placement Drive...' : 'Publish Placement Drive'}
          </button>
        </div>
      </form>
    </div>
  );
};
