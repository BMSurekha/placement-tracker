import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { DriveListing } from './pages/student/DriveListing';
import { DriveDetails } from './pages/student/DriveDetails';
import { MyApplications } from './pages/student/MyApplications';
import { StudentProfile } from './pages/student/StudentProfile';

// Officer / Admin Pages
import { OfficerDashboard } from './pages/admin/OfficerDashboard';
import { CompanyManagement } from './pages/admin/CompanyManagement';
import { DriveManagement } from './pages/admin/DriveManagement';
import { CreateDrive } from './pages/admin/CreateDrive';
import { EditDrive } from './pages/admin/EditDrive';
import { DriveApplicants } from './pages/admin/DriveApplicants';
import { StudentsDirectory } from './pages/admin/StudentsDirectory';

import { useLocation } from 'react-router-dom';
import { getResumeUrl } from './utils/fileUtils';

const RootRedirect: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === 'ROLE_OFFICER') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

const ApiFileRedirect: React.FC = () => {
  const location = useLocation();
  const targetUrl = getResumeUrl(location.pathname + location.search);

  React.useEffect(() => {
    if (targetUrl) {
      window.location.replace(targetUrl);
    }
  }, [targetUrl]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-700 p-6 text-center">
      <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mb-3" />
      <h2 className="text-sm font-bold text-slate-800">Opening document from server...</h2>
      <p className="text-xs text-slate-500 mt-0.5 mb-3">Redirecting directly to the backend document endpoint</p>
      {targetUrl && (
        <a
          href={targetUrl}
          className="text-xs font-semibold text-brand-600 hover:underline px-3 py-1.5 bg-white border border-brand-200 rounded-lg shadow-2xs"
        >
          Click here if not redirected automatically
        </a>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Backend Document Forwarders (Never treat as frontend dashboards) */}
            <Route path="/api/files/*" element={<ApiFileRedirect />} />
            <Route path="/files/resumes/*" element={<ApiFileRedirect />} />

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Root Dispatcher */}
            <Route path="/" element={<RootRedirect />} />

            {/* Student Protected Section */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_STUDENT']} />}>
              <Route path="/student" element={<Layout />}>
                <Route index element={<Navigate to="/student/dashboard" replace />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="drives" element={<DriveListing />} />
                <Route path="drives/:id" element={<DriveDetails />} />
                <Route path="applications" element={<MyApplications />} />
                <Route path="profile" element={<StudentProfile />} />
              </Route>
            </Route>

            {/* Officer Protected Section */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_OFFICER']} />}>
              <Route path="/admin" element={<Layout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<OfficerDashboard />} />
                <Route path="companies" element={<CompanyManagement />} />
                <Route path="drives" element={<DriveManagement />} />
                <Route path="drives/create" element={<CreateDrive />} />
                <Route path="drives/:id/edit" element={<EditDrive />} />
                <Route path="drives/:driveId/applicants" element={<DriveApplicants />} />
                <Route path="applicants" element={<DriveApplicants />} />
                <Route path="students" element={<StudentsDirectory />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
