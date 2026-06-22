import React, { useState } from "react";
import FormField from "./FormField";
import ResumeUpload from "./ResumeUpload";
import { GeneralApplication } from "@/types/careers";

interface GeneralApplicationFormProps {
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export default function GeneralApplicationForm({ onSubmitSuccess, onCancel }: GeneralApplicationFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    github: "",
    areaOfInterest: "",
    experience: "",
    about: "",
    agree: false,
  });

  const [resume, setResume] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    // Clear error inline when user types
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleResumeChange = (file: File | null) => {
    setResume(file);
    if (errors.resume) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.resume;
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    
    if (!formData.areaOfInterest) newErrors.areaOfInterest = "Please select an area of interest";
    
    if (!formData.experience) newErrors.experience = "Please select your years of experience";
    
    if (!resume) newErrors.resume = "Resume is required";
    
    if (formData.about.trim().length < 50) {
      newErrors.about = "Please tell us a bit more about yourself (minimum 50 characters)";
    }
    
    if (!formData.agree) {
      newErrors.agree = "You must agree to allow HexaKode to keep your profile on file";
    }

    // URL validations
    if (formData.linkedin.trim() && !/^https?:\/\/(www\.)?linkedin\.com\/.*/.test(formData.linkedin.trim())) {
      newErrors.linkedin = "Please enter a valid LinkedIn URL";
    }
    
    if (formData.github.trim() && !/^https?:\/\/(www\.)?github\.com\/.*/.test(formData.github.trim())) {
      newErrors.github = "Please enter a valid GitHub URL";
    }
    
    if (formData.portfolio.trim() && !/^https?:\/\/.*/.test(formData.portfolio.trim())) {
      newErrors.portfolio = "Please enter a valid URL (starting with http:// or https://)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const submissionData: GeneralApplication = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      location: formData.location || undefined,
      linkedin: formData.linkedin || undefined,
      portfolio: formData.portfolio || undefined,
      github: formData.github || undefined,
      areaOfInterest: formData.areaOfInterest,
      experience: formData.experience,
      resume: resume || undefined,
      about: formData.about,
    };

    console.log("General Application Submitted Data:", submissionData);
    onSubmitSuccess();
  };

  const areas = [
    "Engineering",
    "Mobile Development",
    "Web Development",
    "UI/UX Design",
    "Product Management",
    "AI & Machine Learning",
    "DevOps & Cloud",
    "Marketing",
    "Business Development",
    "Other",
  ];

  const experienceRanges = [
    "Fresher",
    "0–1 Years",
    "1–3 Years",
    "3–5 Years",
    "5–8 Years",
    "8+ Years",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Grid: Name, Email, Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Full Name" id="fullName" error={errors.fullName} required>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm transition-all duration-200"
          />
        </FormField>

        <FormField label="Email Address" id="email" error={errors.email} required>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@company.com"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm transition-all duration-200"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Phone Number" id="phone" error={errors.phone} required>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm transition-all duration-200"
          />
        </FormField>

        <FormField label="Location" id="location" error={errors.location}>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, State, Country"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm transition-all duration-200"
          />
        </FormField>
      </div>

      {/* Area of Interest, Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Area of Interest" id="areaOfInterest" error={errors.areaOfInterest} required>
          <div className="relative">
            <select
              id="areaOfInterest"
              name="areaOfInterest"
              value={formData.areaOfInterest}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="" disabled className="text-slate-500">Select interest</option>
              {areas.map((area) => (
                <option key={area} value={area} className="bg-slate-950 text-white">{area}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </FormField>

        <FormField label="Years of Experience" id="experience" error={errors.experience} required>
          <div className="relative">
            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="" disabled className="text-slate-500">Select range</option>
              {experienceRanges.map((range) => (
                <option key={range} value={range} className="bg-slate-950 text-white">{range}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </FormField>
      </div>

      {/* Grid: LinkedIn, Portfolio, GitHub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField label="LinkedIn Profile" id="linkedin" error={errors.linkedin}>
          <input
            type="text"
            id="linkedin"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm transition-all duration-200"
          />
        </FormField>

        <FormField label="Portfolio Website" id="portfolio" error={errors.portfolio}>
          <input
            type="text"
            id="portfolio"
            name="portfolio"
            value={formData.portfolio}
            onChange={handleChange}
            placeholder="https://yourportfolio.com"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm transition-all duration-200"
          />
        </FormField>

        <FormField label="GitHub Profile" id="github" error={errors.github}>
          <input
            type="text"
            id="github"
            name="github"
            value={formData.github}
            onChange={handleChange}
            placeholder="https://github.com/..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm transition-all duration-200"
          />
        </FormField>
      </div>

      {/* Resume Upload */}
      <ResumeUpload file={resume} onChange={handleResumeChange} error={errors.resume} />

      {/* About You */}
      <FormField label="Tell us about yourself" id="about" error={errors.about} required>
        <textarea
          id="about"
          name="about"
          value={formData.about}
          onChange={handleChange}
          rows={4}
          placeholder="Tell us about your experience, skills, achievements, and what excites you about technology."
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm transition-all duration-200 resize-none font-body leading-relaxed text-left"
        />
        <div className="flex justify-between text-[11px] text-slate-400 select-none mt-1">
          <span>Minimum 50 characters required</span>
          <span className={formData.about.trim().length >= 50 ? "text-secondary-container font-semibold" : ""}>
            {formData.about.trim().length} chars
          </span>
        </div>
      </FormField>

      {/* Consent Checkbox */}
      <div className="flex flex-col gap-1 w-full text-left">
        <label className="flex items-start gap-3 text-sm text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            id="agree"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            className="mt-1 h-4.5 w-4.5 rounded border-white/10 bg-white/[0.03] text-secondary focus:ring-secondary focus:ring-offset-slate-950 transition-colors duration-200"
          />
          <span className="leading-relaxed">
            I agree that HexaKode may retain my profile for future opportunities. <span className="text-[#5dcafd] font-bold">*</span>
          </span>
        </label>
        {errors.agree && <span className="text-xs text-[#5dcafd] mt-1 font-medium">{errors.agree}</span>}
      </div>

      {/* Form Action Buttons */}
      <div className="border-t border-white/10 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-end gap-3 select-none">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-6 py-3 rounded-full text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/25 text-sm font-semibold transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 bg-secondary text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-on-secondary-fixed-variant transition-all duration-300 shadow-md hover:shadow-secondary/25 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          Submit Application
        </button>
      </div>
    </form>
  );
}
