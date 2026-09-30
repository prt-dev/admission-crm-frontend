import { AuthUser, DemoAccount } from "@/types/auth";

export const defaultAuthUser: AuthUser = {
  id: "USR-101",
  username: "alex.mercer@nletacrm.com",
  fullName: "Alex Mercer",
  email: "alex.mercer@nletacrm.com",
  role: "Super Admin",
  phone: "+91 98112 00001",
  lastLogin: "2026-09-26T09:45:00.000Z",
};

export const demoAccounts: DemoAccount[] = [
  {
    user: {
      id: "USR-101",
      username: "admin@nletacrm.com",
      fullName: "Alex Mercer",
      email: "admin@nletacrm.com",
      role: "Administrator",
      phone: "+91 98112 00001",
    },
    password: "SecurePassword123",
    badge: "Admin",
    color: "brand",
  },
  {
    user: {
      id: "USR-102",
      username: "student@nletacrm.com",
      fullName: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      role: "Student",
      phone: "+91 98765 43210",
    },
    password: "SecurePassword123",
    badge: "Student",
    color: "purple",
  },
];
