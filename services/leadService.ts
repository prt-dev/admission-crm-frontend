import { Lead, LeadFormData, LeadStatus } from "@/types/lead";
import { initialLeads } from "@/data/leadData";

const STORAGE_KEY = "crm_leads_v1";
export const CRM_LEAD_CHANGED_EVENT = "crm_lead_changed";

const isBrowser = typeof window !== "undefined";

function triggerLeadEvent() {
  if (isBrowser) {
    window.dispatchEvent(
      new CustomEvent(CRM_LEAD_CHANGED_EVENT, { detail: { type: "leads" } })
    );
  }
}

export const leadService = {
  getLeads: function (): Lead[] {
    if (!isBrowser) return initialLeads;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialLeads));
        return initialLeads;
      }
      return JSON.parse(stored);
    } catch {
      return initialLeads;
    }
  },

  getLeadById: function (id: string): Lead | undefined {
    const leads = this.getLeads();
    return leads.find((l) => l.id === id || l.leadCode === id);
  },

  generateLeadCode: function (): string {
    const leads = this.getLeads();
    const count = leads.length + 1;
    const year = new Date().getFullYear();
    return `LED-${year}-${String(count).padStart(3, "0")}`;
  },

  createLead: function (leadData: LeadFormData): Lead {
    const leads = this.getLeads();
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      leadCode: this.generateLeadCode(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newLead, ...leads];
    if (isBrowser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      triggerLeadEvent();
    }
    return newLead;
  },

  updateLead: function (id: string, updates: Partial<Lead>): Lead | null {
    const leads = this.getLeads();
    const index = leads.findIndex((l) => l.id === id || l.leadCode === id);
    if (index === -1) return null;

    const updatedLead: Lead = {
      ...leads[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    leads[index] = updatedLead;
    if (isBrowser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
      triggerLeadEvent();
    }
    return updatedLead;
  },

  updateLeadStatus: function (id: string, status: LeadStatus): Lead | null {
    return this.updateLead(id, { status });
  },

  deleteLead: function (id: string): boolean {
    const leads = this.getLeads();
    const filtered = leads.filter((l) => l.id !== id && l.leadCode !== id);
    if (filtered.length === leads.length) return false;

    if (isBrowser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      triggerLeadEvent();
    }
    return true;
  },

  getLeadStats: function () {
    const leads = this.getLeads();
    const totalLeads = leads.length;
    const newLeads = leads.filter((l) => l.status === "New").length;
    const contactedLeads = leads.filter((l) => l.status === "Contacted" || l.status === "Follow-up").length;
    const qualifiedLeads = leads.filter((l) => l.status === "Qualified").length;
    const convertedLeads = leads.filter((l) => l.status === "Converted").length;

    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

    return {
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      convertedLeads,
      conversionRate,
    };
  },

  subscribe: function (callback: () => void): () => void {
    if (!isBrowser) return () => {};
    const handler = () => callback();
    window.addEventListener(CRM_LEAD_CHANGED_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(CRM_LEAD_CHANGED_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  },
};
