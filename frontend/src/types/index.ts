export type Role = 'ROLE_STUDENT' | 'ROLE_OFFICER';

export type DriveStatus = 'UPCOMING' | 'OPEN' | 'CLOSED' | 'COMPLETED';

export type ApplicationStatus = 'APPLIED' | 'SHORTLISTED' | 'SELECTED' | 'REJECTED' | 'WITHDRAWN';

export interface User {
  id: number;
  email: string;
  role: Role;
  studentId?: string | null;
  fullName?: string | null;
}

export interface StudentProfile {
  id: number;
  userId: number;
  email: string;
  studentId: string;
  fullName: string;
  phone?: string;
  department: string;
  year: number;
  cgpa: number;
  backlogs: number;
  tenthPercentage?: number;
  intermediatePercentage?: number;
  skills: string;
  resumeUrl?: string;
}

export interface Company {
  id: number;
  name: string;
  logo?: string;
  industry?: string;
  description?: string;
  website?: string;
  location?: string;
  createdAt?: string;
  activeDrivesCount?: number;
}

export interface EligibilityCriteria {
  minimumCgpa?: number;
  maximumBacklogs?: number;
  allowedDepartments?: string;
  allowedYears?: string;
  minimumTenthPercentage?: number;
  intermediatePercentage?: number;
  minimumIntermediatePercentage?: number;
  requiredSkills?: string;
}

export interface CriterionDetail {
  name: string;
  required: string;
  actual: string;
  passed: boolean;
}

export interface EligibilityCheckResult {
  eligible: boolean;
  reasons: string[];
  criteriaDetails?: CriterionDetail[];
}

export interface PlacementDrive {
  id: number;
  companyId: number;
  companyName: string;
  companyLogo?: string;
  companyIndustry?: string;
  companyLocation?: string;
  companyWebsite?: string;
  website?: string;
  jobRole: string;
  description?: string;
  ctc: number;
  location?: string;
  driveDate: string;
  applicationDeadline: string;
  status: DriveStatus;
  createdAt: string;
  eligibilityCriteria?: EligibilityCriteria;
  totalApplicants?: number;
  isEligible?: boolean;
  eligibilityReasons?: string[];
  hasApplied?: boolean;
  applicationStatus?: ApplicationStatus;
  applicationId?: number;
}

export interface Application {
  id: number;
  studentId: number;
  rollNumber: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  studentDepartment: string;
  studentYear: number;
  studentCgpa: number;
  studentBacklogs: number;
  studentSkills: string;
  resumeUrl?: string;

  driveId: number;
  companyId: number;
  companyName: string;
  companyLogo?: string;
  jobRole: string;
  ctc: number;
  location?: string;

  appliedAt: string;
  status: ApplicationStatus;
  remarks?: string;
}

export interface StudentDashboardData {
  studentName: string;
  studentRollNo: string;
  department: string;
  cgpa: number;
  availableDrivesCount: number;
  eligibleDrivesCount: number;
  totalApplicationsCount: number;
  shortlistedCount: number;
  selectedCount: number;
  recentApplications: Application[];
  recommendedDrives: PlacementDrive[];
}

export interface OfficerDashboardData {
  totalStudentsCount: number;
  totalCompaniesCount: number;
  activeDrivesCount: number;
  totalApplicationsCount: number;
  shortlistedCount: number;
  selectedCount: number;
  recentApplications: Application[];
  activeDrives: PlacementDrive[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  details?: string[];
}
