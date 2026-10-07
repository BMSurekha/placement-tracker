import React from 'react';
import { Modal } from './Modal';
import { PlacementDrive } from '../types';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface EligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  drive: PlacementDrive | null;
  onApply?: () => void;
}

export const EligibilityModal: React.FC<EligibilityModalProps> = ({
  isOpen,
  onClose,
  drive,
  onApply,
}) => {
  if (!drive) return null;

  const isEligible = Boolean(drive.isEligible);
  const ec = drive.eligibilityCriteria;
  const reasons = drive.eligibilityReasons || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Eligibility Verification"
      subtitle={`${drive.companyName} - ${drive.jobRole}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        {/* Banner */}
        <div
          className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            isEligible
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {isEligible ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="font-bold text-base">
              {isEligible ? 'You are Eligible for this Drive' : 'You are Not Eligible for this Drive'}
            </h4>
            <p className="text-xs mt-0.5 opacity-90">
              {isEligible
                ? 'Your profile satisfies all academic and skill requirements set by the placement department.'
                : 'Your profile does not satisfy one or more requirements set for this placement drive.'}
            </p>
          </div>
        </div>

        {/* Unmet reasons */}
        {!isEligible && reasons.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs uppercase tracking-wider mb-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Unmet Criteria Reasons</span>
            </div>
            <ul className="space-y-1.5 text-xs text-amber-900 font-medium">
              {reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold mt-0.5">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Complete Drive Criteria List */}
        <div>
          <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
            Drive Eligibility Requirements
          </h5>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 divide-y divide-slate-200/60 text-xs">
            <div className="py-2 flex justify-between">
              <span className="text-slate-500">Minimum CGPA:</span>
              <span className="font-semibold text-slate-800">{ec?.minimumCgpa ?? 'No minimum'}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-500">Maximum Backlogs Allowed:</span>
              <span className="font-semibold text-slate-800">{ec?.maximumBacklogs ?? 'Any'}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-500">Eligible Departments:</span>
              <span className="font-semibold text-slate-800">{ec?.allowedDepartments || 'All Departments'}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-500">Eligible Year(s):</span>
              <span className="font-semibold text-slate-800">{ec?.allowedYears ? `${ec.allowedYears} Year` : 'All Years'}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-500">Min 10th Percentage:</span>
              <span className="font-semibold text-slate-800">{ec?.minimumTenthPercentage ? `${ec.minimumTenthPercentage}%` : 'No cutoff'}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-500">Min 12th/Diploma Percentage:</span>
              <span className="font-semibold text-slate-800">{ec?.minimumIntermediatePercentage ? `${ec.minimumIntermediatePercentage}%` : 'No cutoff'}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-500">Required Skills:</span>
              <span className="font-semibold text-slate-800">{ec?.requiredSkills || 'None specified'}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          {isEligible && !drive.hasApplied && onApply && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onApply();
              }}
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/20"
            >
              Apply for this Drive
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
