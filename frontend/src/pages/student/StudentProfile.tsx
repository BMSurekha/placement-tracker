import React, { useEffect, useState } from 'react';
import { studentApi } from '../../api/client';
import { StudentProfile as IStudentProfile } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  UserCheck,
  Save,
  GraduationCap,
  Award,
  BookOpen,
  FileText,
  Phone,
  Mail,
  ExternalLink,
  UploadCloud,
  CheckCircle2,
  FileUp,
  FileType,
  Trash2,
  AlertCircle,
} from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const [profile, setProfile] = useState<IStudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [deletingResume, setDeletingResume] = useState(false);

  const toast = useToast();
  const { setUser } = useAuth();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await studentApi.getProfile();
      setProfile(res);
    } catch (err) {
      console.error('Failed to load profile', err);
      toast.error('Failed to load student profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!profile) return;
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]:
        name === 'year' || name === 'backlogs'
          ? parseInt(value) || 0
          : name === 'cgpa' || name === 'tenthPercentage' || name === 'intermediatePercentage'
          ? parseFloat(value) || 0
          : value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      
      if (!validTypes.includes(file.type) && !['pdf', 'jpg', 'jpeg', 'png'].includes(fileExt || '')) {
        toast.error('Only PDF, JPG, and PNG files are allowed.');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size cannot exceed 10MB.');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUploadResume = async () => {
    if (!selectedFile) {
      toast.error('Please select a PDF or JPG/PNG resume file first.');
      return;
    }

    try {
      setUploadingResume(true);
      const fileUrl = await studentApi.uploadResume(selectedFile);
      setProfile((prev) => (prev ? { ...prev, resumeUrl: fileUrl } : null));
      setSelectedFile(null);
      toast.success('Resume file uploaded successfully! Officers can now view your file directly.');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to upload resume file';
      toast.error(msg);
    } finally {
      setUploadingResume(false);
    }
  };

  const handleRemoveResume = async () => {
    if (!window.confirm('Are you sure you want to remove your uploaded resume?')) {
      return;
    }

    try {
      setDeletingResume(true);
      await studentApi.deleteResume();
      setProfile((prev) => (prev ? { ...prev, resumeUrl: '' } : null));
      setSelectedFile(null);
      toast.success('Resume removed successfully!');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to remove resume';
      toast.error(msg);
    } finally {
      setDeletingResume(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setSaving(true);
      const updated = await studentApi.updateProfile(profile);
      setProfile(updated);
      setUser((prev) => (prev ? { ...prev, fullName: updated.fullName, studentId: updated.studentId } : null));
      toast.success('Profile updated successfully! New criteria will take effect immediately.');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  if (!profile) {
    return <div>Failed to load profile.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Student Academic Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Maintain your verified college placement profile. These academic statistics directly determine your eligibility for recruitment drives.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
            <UserCheck className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-bold text-slate-800">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student ID / Roll Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                name="studentId"
                value={profile.studentId}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 uppercase font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College Email (Read Only)
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full px-3 py-2 text-xs border border-slate-200 bg-slate-100 text-slate-500 rounded-lg cursor-not-allowed"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone || ''}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Academic Records Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
            <GraduationCap className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-bold text-slate-800">Academic & Cutoff Metrics</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                name="department"
                value={profile.department}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="CSE">Computer Science (CSE)</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="ECE">Electronics & Communication (ECE)</option>
                <option value="MECH">Mechanical Engineering (MECH)</option>
                <option value="CIVIL">Civil Engineering (CIVIL)</option>
                <option value="EEE">Electrical & Electronics (EEE)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Year <span className="text-rose-500">*</span>
              </label>
              <select
                name="year"
                value={profile.year}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cumulative CGPA (0 - 10) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                name="cgpa"
                value={profile.cgpa}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Active Standing Backlogs
              </label>
              <input
                type="number"
                min="0"
                name="backlogs"
                value={profile.backlogs}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                10th Percentage (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                name="tenthPercentage"
                value={profile.tenthPercentage || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                12th / Diploma (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                name="intermediatePercentage"
                value={profile.intermediatePercentage || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Skills & Resume Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
            <BookOpen className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-bold text-slate-800">Technical Skills & Resume URL</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Technical Skills (Comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={profile.skills}
                onChange={handleChange}
                placeholder="e.g. Java, Python, Spring Boot, React, MySQL, Docker"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                The eligibility engine checks these tags against required company skills.
              </p>
            </div>

            {/* Resume Upload Section */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Resume Document (PDF or JPG/PNG Image)
              </label>

              {/* Current Resume Banner */}
              {profile.resumeUrl ? (
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      {profile.resumeUrl.toLowerCase().endsWith('.pdf') ? 'PDF' : 'IMG'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Resume Uploaded & Active
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono truncate max-w-xs sm:max-w-md">
                        {profile.resumeUrl}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors border border-emerald-300"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> View / Preview File
                    </a>
                    <button
                      type="button"
                      onClick={handleRemoveResume}
                      disabled={deletingResume}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200 disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      {deletingResume ? 'Removing...' : 'Remove Resume'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-800">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>No resume uploaded yet. Please choose a file below and click <strong>Upload Selected File</strong>.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toast.error('Resume Not Uploaded: Please select your PDF/JPG resume and click "Upload Selected File".')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors border border-amber-300 self-start sm:self-auto cursor-pointer"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700" /> Not Uploaded
                  </button>
                </div>
              )}

              {/* Upload New File Area */}
              <div className="border-2 border-dashed border-slate-200 hover:border-brand-400 rounded-xl p-4 transition-colors bg-slate-50/50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <label className="cursor-pointer text-xs font-bold text-brand-600 hover:underline">
                        <span>Click to select file</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Supports PDF, JPG, PNG (Max 10 MB)
                      </p>
                    </div>
                  </div>

                  {selectedFile ? (
                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-slate-800 truncate max-w-[180px]">
                          {selectedFile.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleUploadResume}
                        disabled={uploadingResume}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                      >
                        <FileUp className="w-3.5 h-3.5" />
                        {uploadingResume ? 'Uploading...' : 'Upload Selected File'}
                      </button>
                    </div>
                  ) : null}
                </div>

                {selectedFile && (
                  <p className="sm:hidden text-xs font-semibold text-slate-700 mt-2 truncate">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-all shadow-md shadow-brand-600/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
