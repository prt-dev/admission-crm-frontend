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
      role: "Super Admin",
      phone: "+91 98112 00001",
    },
    password: "SecurePassword123",
    badge: "Admin",
    color: "brand",
  },
];
