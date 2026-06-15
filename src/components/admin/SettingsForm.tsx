"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  Loader2
} from "lucide-react";

// Custom Social Media brand SVG Icons matching Lucide proportions
const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function SettingsForm() {
  // Local state initialized with mock values
  const [companyName, setCompanyName] = useState("HexaKode Engineering");
  const [companyEmail, setCompanyEmail] = useState("contact@hexakode.com");
  const [phone, setPhone] = useState("+1 (555) 019-2834");
  const [address, setAddress] = useState("100 Tech Corridor, Suite 400, Austin, TX 78701");
  const [website, setWebsite] = useState("https://hexakode.com");
  const [linkedin, setLinkedin] = useState("https://linkedin.com/company/hexakode");
  const [instagram, setInstagram] = useState("https://instagram.com/hexakode");
  const [facebook, setFacebook] = useState("https://facebook.com/hexakode");
  const [github, setGithub] = useState("https://github.com/hexakode-org");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate database delay
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Settings updated successfully", {
        description: "Enterprise parameters and social links are synchronized.",
      });
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: General Profile Info */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-card hover:border-outline-variant/50 transition-all duration-300 space-y-4">
          <div className="border-b border-outline-variant/20 pb-3 mb-2 flex items-center gap-2 text-primary">
            <Building2 className="w-4 h-4 text-secondary" />
            <h3 className="font-headline-sm text-sm font-semibold">General Profile</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                Company Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="E.g. HexaKode"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                Corporate Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                <input
                  type="email"
                  required
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="contact@hexakode.com"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                Physical Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-on-surface-variant/50" />
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter corporate office address..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                Website URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                <input
                  type="url"
                  required
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Social Media Integrations */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-card hover:border-outline-variant/50 transition-all duration-300 space-y-4">
          <div className="border-b border-outline-variant/20 pb-3 mb-2 flex items-center gap-2 text-primary">
            <Globe className="w-4 h-4 text-secondary" />
            <h3 className="font-headline-sm text-sm font-semibold">Social Links</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                LinkedIn URL
              </label>
              <div className="relative">
                <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                Instagram URL
              </label>
              <div className="relative">
                <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                Facebook URL
              </label>
              <div className="relative">
                <Facebook className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                GitHub Organization
              </label>
              <div className="relative">
                <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Submit Panel */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 bg-primary text-on-primary font-semibold text-xs px-5 py-2.5 rounded-lg hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-80"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save System Settings</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
