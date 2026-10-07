import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { driveApi } from '../../api/client';
import { PlacementDrive } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Globe,
  IndianRupee,
  MapPin,
  Send,
  XCircle,
  AlertCircle,
} from 'lucide-react';

export const DriveDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [drive, setDrive] = useState<PlacementDrive | null>(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if (id) loadDrive(Number(id));
  }, [id]);

  const loadDrive = async (driveId: number) => {
    try {
      setLoading(true);
      const res = await driveApi.getById(driveId);
      setDrive(res);
    } catch (err) {
      console.error('Failed to load drive details', err);
      toast.error('Failed to load drive details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drive) return;

    if (!drive.isEligible) {
      toast.error('You are not eligible for this drive', drive.eligibilityReasons);
      return;
    }

    try {
      setIsApplying(true);
      await driveApi.apply(drive.id, remarks);
      toast.success(`Application submitted successfully for ${drive.companyName}!`);
      loadDrive(drive.id); // Reload to reflect applied status
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to submit application';
      const details = err.response?.data?.details;
      toast.error(msg, details);
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading placement drive details..." />;
  }

  if (!drive) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 mb-4">Placement drive not found.</p>
        <Link to="/student/drives" className="text-brand-600 font-semibold hover:underline">
          Return to Placement Drives
        </Link>
      </div>
    );
  }

  const isEligible = Boolean(drive.isEligible);
  const hasApplied = Boolean(drive.hasApplied);
  const isOpen = drive.status === 'OPEN';
  const ec = drive.eligibilityCriteria;
  const canApply = isOpen && isEligible && !hasApplied;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          to="/student/drives"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Drives
        </Link>
      </div>

      {/* Main Drive Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            {drive.companyLogo ? (
              <img
                src={drive.companyLogo}
                alt={drive.companyName}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Building2 className="w-8 h-8" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-800">{drive.jobRole}</h1>
                <StatusBadge status={drive.status} />
              </div>
              <p className="text-sm font-semibold text-brand-600 mt-0.5">{drive.companyName}</p>
              {drive.companyIndustry && (
                <p className="text-xs text-slate-500 mt-0.5">Industry: {drive.companyIndustry}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Offered Compensation
            </span>
            <div className="text-2xl font-black text-slate-900 flex items-center mt-0.5">
              <IndianRupee className="w-5 h-5 text-brand-600" />
              <span>{drive.ctc} LPA</span>
            </div>
            <span className="text-xs text-slate-500">Gross CTC Package</span>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs text-slate-600">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-1">Job Location</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-600" /> {drive.location || 'Multiple Locations'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-1">Drive Date</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-brand-600" /> {drive.driveDate}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-1">Application Deadline</span>
            <span className="font-semibold text-rose-600 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {drive.applicationDeadline}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-1">Total Applicants</span>
            <span className="font-semibold text-slate-800">{drive.totalApplicants} Registered</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Job & Company Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-3">Job & Role Description</h2>
            <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
              {drive.description || 'No detailed job description provided.'}
            </p>
          </div>

          {/* Company Background */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-800">About {drive.companyName}</h2>
              {drive.companyWebsite && (
                <a
                  href={drive.companyWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1 font-semibold"
                >
                  <Globe className="w-3.5 h-3.5" /> Visit Website <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {drive.companyIndustry && <span className="font-semibold block mb-1">Domain: {drive.companyIndustry}</span>}
              Corporate location: {drive.companyLocation || 'Pan India'}
            </p>
          </div>
        </div>

        {/* Right Column: Eligibility Result & Application Form */}
        <div className="space-y-6">
          {/* Eligibility Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-4">Your Eligibility Status</h2>

            <div
              className={`p-4 rounded-xl border flex items-start gap-3 mb-4 ${
                isEligible
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {isEligible ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold text-sm">
                  {isEligible ? 'You Satisfy All Criteria' : 'Not Eligible for this Drive'}
                </p>
                <p className="text-xs opacity-90 mt-0.5">
                  {isEligible
                    ? 'You meet all minimum academic cutoffs, department criteria, and required skills.'
                    : 'Your profile does not meet the criteria specified by the company.'}
                </p>
              </div>
            </div>

            {/* Ineligible Reasons */}
            {!isEligible && drive.eligibilityReasons && drive.eligibilityReasons.length > 0 && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Cutoff Mismatch Details
                </div>
                <ul className="text-xs text-amber-900 space-y-1 font-medium">
                  {drive.eligibilityReasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Criteria Breakdown */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Min CGPA:</span>
                <span className="font-semibold text-slate-800">{ec?.minimumCgpa ?? 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Max Backlogs:</span>
                <span className="font-semibold text-slate-800">{ec?.maximumBacklogs ?? 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Allowed Depts:</span>
                <span className="font-semibold text-slate-800">{ec?.allowedDepartments || 'All'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Allowed Year(s):</span>
                <span className="font-semibold text-slate-800">{ec?.allowedYears ? `${ec.allowedYears} Year` : 'All'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Required Skills:</span>
                <span className="font-semibold text-slate-800">{ec?.requiredSkills || 'Any'}</span>
              </div>
            </div>
          </div>

          {/* Application Submission Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-3">Application Submission</h2>

            {hasApplied ? (
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5 text-sky-800">
                    <CheckCircle2 className="w-4 h-4 text-sky-600" /> Application Active
                  </span>
                  <StatusBadge status={drive.applicationStatus || 'APPLIED'} size="sm" />
                </div>
                <p className="text-slate-600">
                  You have already submitted an application for this drive. Track the progress in the My Applications page.
                </p>
                <Link
                  to="/student/applications"
                  className="inline-block mt-2 font-bold text-sky-700 hover:underline"
                >
                  View My Applications →
                </Link>
              </div>
            ) : !isOpen ? (
              <div className="p-4 bg-slate-100 rounded-xl text-slate-600 text-xs text-center font-medium">
                This placement drive is currently {drive.status.toLowerCase()} and is not accepting applications.
              </div>
            ) : !isEligible ? (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs text-center font-medium">
                Application is disabled because your student profile does not satisfy the criteria.
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Notes / Remarks (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="e.g. Completed specialized certification in Cloud microservices..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isApplying || !canApply}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/20 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isApplying ? 'Submitting Application...' : 'Submit Application Now'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
