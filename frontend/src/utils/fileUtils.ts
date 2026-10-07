/**
 * Utility functions for resolving and handling backend file URLs (resumes, documents, etc.)
 */

export const getBackendBaseUrl = (): string => {
  const envApiUrl = import.meta.env.VITE_API_BASE_URL;
  if (envApiUrl && typeof envApiUrl === 'string' && envApiUrl.trim()) {
    const trimmed = envApiUrl.trim().replace(/\/+$/, '');
    // If it ends with /api, strip /api to get the root server origin
    // E.g. "https://placement-tracker-production-c874.up.railway.app/api" -> "https://placement-tracker-production-c874.up.railway.app"
    return trimmed.endsWith('/api') ? trimmed.slice(0, -4) : trimmed;
  }
  // Default for local development
  return 'http://localhost:8080';
};

/**
 * Converts any relative or legacy resume URL into an absolute URL
 * pointing directly to the Spring Boot backend server.
 */
export const getResumeUrl = (url?: string | null): string => {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return '';
  }

  const trimmed = url.trim();
  const backendBase = getBackendBaseUrl();

  // If the URL contains /api/files/, resolve it against the configured backendBase.
  // This seamlessly handles relative paths like "/api/files/resumes/..." AND migrates
  // any legacy URLs that might have had "http://localhost:8080/api/files/..." stored in DB.
  if (trimmed.includes('/api/files/')) {
    const pathAfterApi = trimmed.substring(trimmed.indexOf('/api/files/'));
    return `${backendBase}${pathAfterApi}`;
  }

  // If it starts with /files/, prefix with backendBase/api
  if (trimmed.startsWith('/files/')) {
    return `${backendBase}/api${trimmed}`;
  }

  // If it's an external link (Google Drive, Cloud storage, etc.)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // If it's a relative path starting with /
  if (trimmed.startsWith('/')) {
    return `${backendBase}${trimmed}`;
  }

  // If it's a bare filename like "resume_123.pdf"
  return `${backendBase}/api/files/resumes/${trimmed}`;
};

/**
 * Safely opens a resume in a new browser tab directly targeting the backend.
 */
export const openResumeInNewTab = (url?: string | null): void => {
  const targetUrl = getResumeUrl(url);
  if (targetUrl) {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  }
};
