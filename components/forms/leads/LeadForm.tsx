"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lead, LeadStatus, LeadFormData } from "@/types/lead";
import { leadService } from "@/services/leadService";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import LeadBasicInfoSection from "./LeadBasicInfoSection";
import LeadMessageSection from "./LeadMessageSection";

interface LeadFormProps {
  leadToEdit?: Lead | null;
  onSuccess?: (lead: Lead) => void;
}

export default function LeadForm({ leadToEdit, onSuccess }: LeadFormProps) {
  const router = useRouter();
  const isEdit = Boolean(leadToEdit);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<LeadStatus>("New");
  const [source, setSource] = useState("Website Inquiry");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (leadToEdit) {
      setName(leadToEdit.name || "");
      setEmail(leadToEdit.email || "");
      setPhone(leadToEdit.phone || "");
      setMessage(leadToEdit.message || "");
      setStatus(leadToEdit.status || "New");
      setSource(leadToEdit.source || "Website Inquiry");
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setStatus("New");
      setSource("Website Inquiry");
    }
  }, [leadToEdit]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!message.trim()) {
      newErrors.message = "Inquiry message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsConfirmModalOpen(true);
  };

  const handleConfirmedSave = () => {
    setIsSubmitting(true);
    try {
      const formData: LeadFormData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        message: message.trim(),
        status,
        source,
      };

      if (isEdit && leadToEdit) {
        const updated = leadService.updateLead(leadToEdit.id, formData);
        if (updated) {
          if (onSuccess) onSuccess(updated);
          router.push("/leads");
        }
      } else {
        const created = leadService.createLead(formData);
        if (onSuccess) onSuccess(created);
        router.push("/leads");
      }
    } catch (err) {
      console.error("Failed to save lead:", err);
    } finally {
      setIsSubmitting(false);
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <LeadBasicInfoSection
          name={name}
          email={email}
          phone={phone}
          status={status}
          source={source}
          onNameChange={setName}
          onEmailChange={setEmail}
          onPhoneChange={setPhone}
          onStatusChange={setStatus}
          onSourceChange={setSource}
          errors={errors}
        />

        <LeadMessageSection
          message={message}
          onMessageChange={setMessage}
          errors={errors}
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-200/80 dark:border-gray-800">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/leads")}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full sm:w-auto shadow-md shadow-brand-500/20"
          >
            {isEdit ? "Update Lead" : "Create Lead"}
          </Button>
        </div>
      </form>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title={isEdit ? "Update Lead Record?" : "Save New Lead?"}
        message={
          isEdit
            ? `Are you sure you want to update the lead details for "${name}"?`
            : `Are you sure you want to register new lead for "${name}" (${phone})?`
        }
        confirmLabel={isEdit ? "Yes, Update Lead" : "Yes, Save Lead"}
        cancelLabel="Review Again"
        variant="primary"
        isLoading={isSubmitting}
        onConfirm={handleConfirmedSave}
        onClose={() => setIsConfirmModalOpen(false)}
      />
    </>
  );
}
