"use client";

import React, { useState } from "react";
import { FormField } from "@/components/form/FormField";
import { SelectField } from "@/components/form/SelectField";
import { CheckboxField } from "@/components/form/CheckboxField";

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  source: string;
  project: string;
  budget: string;
  notes: string;
  newsletter: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export const LeadForm: React.FC = () => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    email: "",
    phone: "",
    source: "",
    project: "",
    budget: "",
    notes: "",
    newsletter: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.source) {
      newErrors.source = "Please select a source";
    }

    if (!formData.project) {
      newErrors.project = "Please select a project";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitted(true);
    console.log("Form submitted:", formData);
    // TODO: Send to API
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Add New Lead</h2>

      {/* Name Field */}
      <FormField
        label="Full Name"
        name="name"
        type="text"
        required
        placeholder="John Doe"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        success={submitted && !errors.name && formData.name !== ""}
      />

      {/* Email Field */}
      <FormField
        label="Email Address"
        name="email"
        type="email"
        required
        placeholder="john@example.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        success={submitted && !errors.email && formData.email !== ""}
        hint="We'll never share your email"
      />

      {/* Phone Field */}
      <FormField
        label="Phone Number"
        name="phone"
        type="tel"
        required
        placeholder="+1 (555) 000-0000"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        success={submitted && !errors.phone && formData.phone !== ""}
      />

      {/* Source Select */}
      <SelectField
        label="Lead Source"
        name="source"
        required
        value={formData.source}
        onChange={handleChange}
        error={errors.source}
        placeholder="Select a source"
        options={[
          { value: "website", label: "Website" },
          { value: "referral", label: "Referral" },
          { value: "social", label: "Social Media" },
          { value: "call", label: "Phone Call" },
          { value: "email", label: "Email Campaign" },
        ]}
      />

      {/* Project Select */}
      <SelectField
        label="Interested Project"
        name="project"
        required
        value={formData.project}
        onChange={handleChange}
        error={errors.project}
        placeholder="Select a project"
        options={[
          { value: "aqua-vista", label: "Aqua Vista" },
          { value: "skyline", label: "Skyline Tower" },
          { value: "green-park", label: "Green Park Residences" },
        ]}
      />

      {/* Budget Field */}
      <FormField
        label="Budget (Optional)"
        name="budget"
        type="number"
        placeholder="500000"
        value={formData.budget}
        onChange={handleChange}
        hint="Leave blank if undecided"
      />

      {/* Notes Field */}
      <FormField
        label="Notes"
        name="notes"
        type="textarea"
        placeholder="Any additional notes about this lead..."
        value={formData.notes}
        onChange={handleChange}
        rows={4}
        maxLength={500}
      />

      {/* Checkbox */}
      <CheckboxField
        label="Subscribe to newsletter"
        name="newsletter"
        checked={formData.newsletter}
        onChange={handleChange}
        hint="We'll send you updates about new projects"
      />

      {/* Form Actions */}
      <div className="form-actions mt-8 flex gap-3 justify-end pt-6 border-t border-gray-200">
        <button
          type="button"
          className="px-6 py-2 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-100 transition-colors"
        >
          Create Lead
        </button>
      </div>
    </form>
  );
};
