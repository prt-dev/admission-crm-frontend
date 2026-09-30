"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb, Button, DataTable, ColumnDef, StatCard, ConfirmModal } from "@/components/ui";
import { Lead, LeadStatus } from "@/types/lead";
import { leadService } from "@/services/leadService";

export default function LeadsPage() {
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState(leadService.getLeadStats());
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Detail drawer / Modal state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Delete modal state
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const loadData = () => {
    setLeads(leadService.getLeads());
    setStats(leadService.getLeadStats());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = leadService.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  // Filtered Leads
  const filteredData = useMemo(() => {
    return leads.filter((item) => {
      if (selectedStatus !== "all" && item.status !== selectedStatus) return false;
      return true;
    });
  }, [leads, selectedStatus]);

  // Handlers
  const handleOpenAddPage = () => {
    router.push("/leads/new");
  };

  const handleOpenEditPage = (lead: Lead) => {
    router.push(`/leads/${lead.id}/edit`);
  };

  const handleViewDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDrawerOpen(true);
  };

  const handleDeleteRequest = (lead: Lead) => {
    setDeletingLead(lead);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingLead) {
      leadService.deleteLead(deletingLead.id);
      setIsDeleteModalOpen(false);
      setDeletingLead(null);
      if (selectedLead?.id === deletingLead.id) {
        setIsDrawerOpen(false);
        setSelectedLead(null);
      }
    }
  };

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    leadService.updateLeadStatus(leadId, newStatus);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = ["Lead Code", "Name", "Email", "Phone", "Status", "Source", "Message", "Created Date"];
    const rows = leads.map((l) => [
      l.leadCode,
      `"${l.name}"`,
      l.email,
      l.phone,
      l.status,
      `"${l.source || ""}"`,
      `"${l.message.replace(/"/g, '""')}"`,
      new Date(l.createdAt).toLocaleDateString(),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Leads_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeStyle = (status: LeadStatus) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "Contacted":
        return "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "Follow-up":
        return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "Qualified":
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
      case "Converted":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "Closed":
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  // Table Columns
  const columns: ColumnDef<Lead>[] = [
    {
      key: "leadCode",
      header: "Lead ID",
      width: "120px",
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
          {row.leadCode}
        </span>
      ),
    },
    {
      key: "name",
      header: "Lead Name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white font-bold text-xs shadow-xs">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="font-semibold text-gray-900 dark:text-white block text-xs">
              {row.name}
            </span>
            <span className="text-[11px] text-gray-400">
              {row.source || "Website"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact Details",
      render: (row) => (
        <div className="space-y-0.5">
          <a
            href={`tel:${row.phone}`}
            className="text-xs font-medium text-gray-800 dark:text-gray-200 hover:text-brand-600 block"
            onClick={(e) => e.stopPropagation()}
          >
            📞 {row.phone}
          </a>
          <a
            href={`mailto:${row.email}`}
            className="text-[11px] text-gray-500 dark:text-gray-400 hover:underline block truncate max-w-[180px]"
            onClick={(e) => e.stopPropagation()}
          >
            ✉️ {row.email}
          </a>
        </div>
      ),
    },
    {
      key: "message",
      header: "Message / Inquiry",
      render: (row) => (
        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 max-w-xs" title={row.message}>
          {row.message}
        </p>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      width: "130px",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadgeStyle(
            row.status
          )}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
          {row.status}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created On",
      sortable: true,
      width: "120px",
      render: (row) => (
        <span className="text-[11px] text-gray-500 dark:text-gray-400">
          {new Date(row.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      width: "140px",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            title="View Details"
            onClick={() => handleViewDetail(row)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            title="Edit Lead"
            onClick={() => handleOpenEditPage(row)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            title="Delete Lead"
            onClick={() => handleDeleteRequest(row)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/" },
              { label: "Leads & Inquiries", active: true },
            ]}
          />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">
            Leads & Inquiries Management
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Capture, track, and convert applicant inquiries into enrolled students.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </Button>

          <Button variant="primary" size="sm" onClick={handleOpenAddPage}>
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Lead
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
          description="All registered inquiries"
          variant="default"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <StatCard
          title="New Inquiries"
          value={stats.newLeads}
          description="Pending initial follow-up"
          variant="brand"
          badge={{ label: "Action needed", variant: "brand" }}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Active Discussions"
          value={stats.contactedLeads}
          description="Contacted & follow-ups"
          variant="warning"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          }
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          description={`${stats.convertedLeads} enrolled admissions`}
          variant="success"
          badge={{ label: `${stats.convertedLeads} converted`, variant: "success" }}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Filter Status:
          </span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All Statuses ({leads.length})</option>
            <option value="New">New ({leads.filter((l) => l.status === "New").length})</option>
            <option value="Contacted">Contacted ({leads.filter((l) => l.status === "Contacted").length})</option>
            <option value="Follow-up">Follow-up ({leads.filter((l) => l.status === "Follow-up").length})</option>
            <option value="Qualified">Qualified ({leads.filter((l) => l.status === "Qualified").length})</option>
            <option value="Converted">Converted ({leads.filter((l) => l.status === "Converted").length})</option>
            <option value="Closed">Closed ({leads.filter((l) => l.status === "Closed").length})</option>
          </select>
        </div>

        {selectedStatus !== "all" && (
          <button
            onClick={() => setSelectedStatus("all")}
            className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
          >
            Reset filter
          </button>
        )}
      </div>

      {/* Leads Table */}
      <DataTable
        title="All Leads & Inquiries"
        subtitle={`Showing ${filteredData.length} registered inquiries in CRM pipeline`}
        columns={columns}
        data={filteredData}
        keyExtractor={(row) => row.id}
        searchable
        searchPlaceholder="Search leads by name, email, phone, message..."
        onRowClick={(row) => handleViewDetail(row)}
        emptyMessage="No lead records found."
        pagination={{
          pageSize: 5,
          pageSizeOptions: [5, 10, 20, 50],
          showEdges: true,
          showInfo: true,
          showTotal: true,
          size: "md",
        }}
      />

      {/* Slide-over Detail Drawer */}
      {isDrawerOpen && selectedLead && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col">
              {/* Drawer Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                    {selectedLead.leadCode}
                  </span>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                    {selectedLead.name}
                  </h2>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {/* Contact Card */}
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Contact Information
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <a href={`tel:${selectedLead.phone}`} className="font-semibold text-brand-600 hover:underline">
                        {selectedLead.phone}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Email:</span>
                      <a href={`mailto:${selectedLead.email}`} className="font-semibold text-brand-600 hover:underline">
                        {selectedLead.email}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Source:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedLead.source || "Website Inquiry"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Created Date:</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {new Date(selectedLead.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inquiry Message */}
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Inquiry Message / Requirement
                  </h4>
                  <p className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedLead.message}
                  </p>
                </div>

                {/* Status Update Quick Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Update Pipeline Status
                  </label>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-medium text-gray-900 dark:text-white focus:border-brand-500 focus:outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between gap-3 bg-gray-50/50 dark:bg-gray-900/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    handleOpenEditPage(selectedLead);
                  }}
                >
                  Edit Lead
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    router.push(`/admissions/new?name=${encodeURIComponent(selectedLead.name)}&email=${encodeURIComponent(selectedLead.email)}&phone=${encodeURIComponent(selectedLead.phone)}`);
                  }}
                >
                  Convert to Admission
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Lead Record?"
        message={`Are you sure you want to delete the lead for "${deletingLead?.name}" (${deletingLead?.leadCode})? This action cannot be undone.`}
        confirmLabel="Yes, Delete Lead"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
