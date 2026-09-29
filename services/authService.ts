import {
  AuthUser,
  LoginCredentials,
  RegisterUser,
  UserRole,
} from "@/types/auth";
import { defaultAuthUser, demoAccounts } from "@/data/authData";

const STORAGE_KEY_USER = "nleta_auth_user";
const STORAGE_KEY_REGISTERED_USERS = "nleta_registered_users";
const AUTH_EVENT = "nleta_auth_state_changed";

type AuthObserver = (user: AuthUser | null) => void;
const subscribers: Set<AuthObserver> = new Set();

function notifySubscribers(user: AuthUser | null) {
  subscribers.forEach((cb) => {
    try {
      cb(user);
    } catch (e) {
      console.error("Error in auth subscriber:", e);
    }
  });

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(AUTH_EVENT, { detail: { user } })
    );
  }
}

export const authLocalClientService = {
  /**
   * Get the current active user from localStorage
   */
  STORAGE_KEY_USER: STORAGE_KEY_USER,
  STORAGE_KEY_REGISTERED_USERS: STORAGE_KEY_REGISTERED_USERS,
  AUTH_EVENT: AUTH_EVENT,
  getUser: function (): AuthUser | null {
    if (typeof window === "undefined") {
      return defaultAuthUser;
    }

    try {
      const rawUser = localStorage.getItem(STORAGE_KEY_USER);

      if (!rawUser) {
        // Bootstrap default user if not set yet for seamless testing
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(defaultAuthUser));
        return defaultAuthUser;
      }

      const parsed = JSON.parse(rawUser);
      // Handle legacy session object if existing
      const user = (parsed && typeof parsed === "object" && "user" in parsed && parsed.user)
        ? parsed.user
        : parsed;

      return user as AuthUser;
    } catch (e) {
      console.error("Failed to read auth user:", e);
      return null;
    }
  },

  /**
   * Get the current active user from localStorage
   */
  getCurrentUser: function (): AuthUser | null {
    return this.getUser();
  },

  /**
   * Check whether the user is authenticated
   */
  isAuthenticated: function (): boolean {
    return Boolean(this.getUser());
  },

  /**
   * Authenticate user with username and password
   */
  login: async function (
    credentials: LoginCredentials
  ): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
    const username = (credentials.username || "").trim().toLowerCase();
    const password = credentials.password;

    if (!username || !password) {
      return { success: false, error: "Username and password are required." };
    }

    // 1. Check in demo accounts
    const matchedDemo = demoAccounts.find(
      (a) => a?.user?.username?.toLowerCase() === username
    );

    let user: AuthUser;

    if (matchedDemo) {
      // Artificial small delay to simulate network call
      await new Promise((resolve) => setTimeout(resolve, 350));
      if (matchedDemo.password !== password && password !== "demo" && password.length < 4) {
        return { success: false, error: "Invalid password. Use 'SecurePassword123' or 4+ characters." };
      }
      user = {
        ...matchedDemo.user,
        lastLogin: new Date().toISOString(),
      };
    } else {
      // 2. Check registered users in storage
      let registeredUsers: Array<{ user: AuthUser; password: string }> = [];
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(STORAGE_KEY_REGISTERED_USERS);
          if (raw) registeredUsers = JSON.parse(raw);
        } catch {
          registeredUsers = [];
        }
      }

      const matchedRegistered = registeredUsers.find(
        (u) => u.user?.username?.toLowerCase() === username
      );

      if (matchedRegistered) {
        if (matchedRegistered.password !== password) {
          return { success: false, error: "Invalid password." };
        }
        user = {
          ...matchedRegistered.user,
          lastLogin: new Date().toISOString(),
        };
      } else {
        return { success: false, error: "Invalid username." };
      }
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    }

    notifySubscribers(user);
    return { success: true, user };
  },

  /**
   * Register a new user
   */
  register: async function (
    input: RegisterUser
  ): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const email = input.email.trim().toLowerCase();
    if (!input.fullName.trim() || !email || !input.password) {
      return { success: false, error: "Please provide all required fields." };
    }

    const newUser: AuthUser = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      username: input.email.split("@")[0] || input.email,
      fullName: input.fullName.trim(),
      email: input.email.trim(),
      role: input.role || "Administrator",
      phone: input.phone || "",
      lastLogin: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      let registeredUsers: Array<{ user: AuthUser; password: string }> = [];
      try {
        const raw = localStorage.getItem(STORAGE_KEY_REGISTERED_USERS);
        if (raw) registeredUsers = JSON.parse(raw);
      } catch {
        registeredUsers = [];
      }

      registeredUsers.push({ user: newUser, password: input.password });
      localStorage.setItem(STORAGE_KEY_REGISTERED_USERS, JSON.stringify(registeredUsers));
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    }

    notifySubscribers(newUser);
    return { success: true, user: newUser };
  },

  /**
   * Logout and clear active user
   */
  logout: async function (): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
    notifySubscribers(null);
  },

  /**
   * Update active user attributes
   */
  updateCurrentUser: function (updates: Partial<AuthUser>): AuthUser | null {
    const currentUser = this.getUser();
    if (!currentUser) return null;

    const updatedUser: AuthUser = {
      ...currentUser,
      ...updates,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
    }

    notifySubscribers(updatedUser);
    return updatedUser;
  },

  /**
   * Quick role switcher for testing multi-role views
   */
  switchRole: function (newRole: UserRole | string): AuthUser | null {
    return this.updateCurrentUser({ role: newRole });
  },

  /**
   * Subscribe to auth user changes
   */
  subscribe: function (callback: AuthObserver): () => void {
    subscribers.add(callback);
    return () => {
      subscribers.delete(callback);
    };
  },
};
