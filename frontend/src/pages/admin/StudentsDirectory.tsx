import React, { useEffect, useState } from 'react';
import { studentApi } from '../../api/client';
import { StudentProfile } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { Modal } from '../../components/Modal';
import { useToast } from '../../context/ToastContext';
import { getResumeUrl } from '../../utils/fileUtils';
import { Search, Users, ExternalLink, GraduationCap, Phone, Mail, Eye, AlertCircle } from 'lucide-react';

export const StudentsDirectory: React.FC = () => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [previewResume, setPreviewResume] = useState<{ url: string; studentName: string } | null>(null);

  const toast = useToast();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await studentApi.getAllStudents();
      setStudents(res);
    } catch (err) {
      console.error('Failed to load students', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.skills && s.skills.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept = departmentFilter === 'ALL' || s.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  if (loading) {
    return <LoadingSpinner message="Loading student records..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Student Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered placement pool candidates, academic metrics, and verification records.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          Total Registered: <span className="text-brand-600 font-bold">{students.length}</span> students
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search student by name, roll no, or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:ring-1 focus:ring-brand-500"
          >
            <option value="ALL">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <EmptyState
          title="No Students Found"
          description="No student profiles match your search criteria or department filter."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Roll No</th>
                  <th className="px-6 py-4">Dept & Year</th>
                  <th className="px-6 py-4">CGPA</th>
                  <th className="px-6 py-4">Backlogs</th>
                  <th className="px-6 py-4">10th / 12th %</th>
                  <th className="px-6 py-4">Skills</th>
                  <th className="px-6 py-4">Resume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700 text-xs">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{s.fullName}</p>
                        <p className="text-[11px] text-slate-400">{s.email}</p>
                        {s.phone && <p className="text-[11px] text-slate-400">Ph: {s.phone}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">
                      {s.studentId}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="font-semibold text-slate-800">{s.department}</span>
                      <span className="text-slate-400 block text-[11px]">Year {s.year}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 text-sm">{s.cgpa}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          s.backlogs === 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {s.backlogs} Backlogs
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <span>{s.tenthPercentage ? `${s.tenthPercentage}%` : '-'} / </span>
                      <span>{s.intermediatePercentage ? `${s.intermediatePercentage}%` : '-'}</span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="truncate text-slate-600" title={s.skills}>
                        {s.skills || 'None'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {s.resumeUrl ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewResume({ url: getResumeUrl(s.resumeUrl!), studentName: s.fullName })}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg border border-brand-200 transition-colors shadow-2xs"
                            title="Preview student's uploaded resume"
                          >
                            <Eye className="w-3.5 h-3.5 text-brand-600" />
                            <span>{s.resumeUrl.toLowerCase().endsWith('.pdf') ? 'View PDF' : 'View Image'}</span>
                          </button>
                          <a
                            href={getResumeUrl(s.resumeUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-slate-400 hover:text-brand-600 rounded-md hover:bg-slate-100 transition-colors"
                            title="Open in new browser tab directly from server"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toast.error(`Resume Not Uploaded: ${s.fullName} has not uploaded a resume yet.`)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                          title="Student has not uploaded a resume"
                        >
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                          <span>Not Uploaded</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resume Viewer Modal */}
      <Modal
        isOpen={!!previewResume}
        onClose={() => setPreviewResume(null)}
        title={previewResume ? `Student Resume: ${previewResume.studentName}` : 'Resume Preview'}
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
                rel="noopener noreferrer"
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
                  title="Student Resume PDF"
                />
              ) : (
                <div className="p-4 flex items-center justify-center">
                  <img
                    src={previewResume.url}
                    alt="Student Resume"
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
