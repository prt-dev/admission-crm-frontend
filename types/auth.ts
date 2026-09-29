export type UserRole =
  | "Administrator"
  | "Sales Representative"
  | "Employee"
  | "Student";

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterUser {
  fullName: string;
  email: string;
  phone?: string;
  department?: string;
  password: string;
  role?: UserRole | string;
  agreeTerms?: boolean;
}

export interface AuthUser {
  id: string;
  username?: string;
  fullName?: string;
  email?: string;
  role: UserRole | string;
  avatarUrl?: string;
  phone?: string;
  lastLogin?: string;
}

export interface DemoAccount {
  user: AuthUser;
  password: string;
  badge?: string;
  color?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
  register: (data: RegisterUser) => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<AuthUser>) => void;
  switchRole: (role: string) => void;
  checkAuth: () => boolean;
}
