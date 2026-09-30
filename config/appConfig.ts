export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "NLETA CRM",
  defaultTitle: process.env.NEXT_PUBLIC_APP_DEFAULT_TITLE || "Admission CRM - NLETA",
  description:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
    "National Lift Escalator Testing Agency - Admission CRM & Student Lifecycle Management Platform",
  portalTitle: process.env.NEXT_PUBLIC_APP_PORTAL_TITLE || "Admission Portal",
  logo: process.env.NEXT_PUBLIC_APP_LOGO || "/images/logo/nleta-logo.png",
  favicon: process.env.NEXT_PUBLIC_APP_FAVICON || "/images/logo/nleta-logo.png",

  // Backend API Configuration
  backendBaseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8000",
  backendApiUrl:
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:8000/api",
  apiTimeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 15000,
} as const;
