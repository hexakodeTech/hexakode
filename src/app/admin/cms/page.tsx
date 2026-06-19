import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Toaster } from "sonner";
import { Metadata } from "next";
import { Database, ExternalLink, Settings, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CMS Integration | HexaKode Console",
  description: "Configure and manage the Sanity CMS engine integrations.",
};

export default function AdminCMSPage() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "hexakode-project";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-06-16";
  const env = process.env.NODE_ENV || "development";

  const managedTypes = [
    { name: "Home Page", desc: "Hero title/subtitle, description copy, call-to-actions, and tech stacks." },
    { name: "Services", desc: "Service descriptions, icons, feature checklists, and statuses." },
    { name: "Portfolio", desc: "Project parameters, slugs, challenges, solutions, and gallery media." },
    { name: "Testimonials", desc: "Client quotes, rating scores, positions, company associations, and headshots." },
    { name: "Navigation", desc: "Main header navigation items, labels, ordering, and window target behaviors." },
    { name: "Footer Content", desc: "Links, copyright copy, section layouts, and social media networks." },
    { name: "SEO Metadata", desc: "Meta tags, search descriptions, page keywords, and OpenGraph assets." },
    { name: "About Page", desc: "Public profile descriptors, team sections, and corporate backgrounds." },
    { name: "Contact Content", desc: "Physical headquarters location, active telephone lines, and support emails." }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-headline-md text-xl font-bold tracking-tight text-primary">
            CMS Management Hub
          </h1>
          <p className="text-xs text-on-surface-variant/70 mt-1">
            Overview of the headless Sanity CMS engine configuration and content inventory.
          </p>
        </div>

        {/* Integration Status Card */}
        <div className="p-6 bg-surface-container-lowest border border-outline-variant/30 rounded-xl hover:shadow-premium transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
                <Database className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="font-headline-sm text-base font-semibold text-primary">
                  Sanity CMS Integration Ready
                </h2>
                <p className="text-xs text-on-surface-variant/70 mt-1 leading-relaxed max-w-xl">
                  HexaKode content architecture is decoupled from custom admin components. Frontend
                  pages will consume Sanity data dynamically in future phases. No content is edited
                  locally on this dashboard.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-success-container/20 text-success border border-success/30 px-3 py-1.5 rounded-full text-xs font-semibold self-start sm:self-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600">Active / Local Studio Ready</span>
            </div>
          </div>
        </div>

        {/* Managed Content Types Inventory */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-outline-variant/20 mb-5">
            <Database className="w-4 h-4 text-secondary" />
            <h3 className="font-headline-sm text-xs font-semibold text-primary">
              Content Types Managed by Sanity
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {managedTypes.map((type) => (
              <div
                key={type.name}
                className="p-4 bg-surface-container-low/40 border border-outline-variant/20 rounded-lg flex flex-col justify-between hover:border-secondary/25 hover:shadow-premium transition-all duration-300"
              >
                <div>
                  <div className="flex items-start justify-between gap-2.5">
                    <h4 className="font-headline-sm text-xs font-semibold text-primary">{type.name}</h4>
                    <span className="text-[8px] whitespace-nowrap bg-secondary-container/20 text-on-secondary-container px-2 py-0.5 rounded-full font-semibold border border-secondary-container/40">
                      Managed via Sanity Studio
                    </span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant/70 mt-2 font-body-sm leading-relaxed">
                    {type.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CMS Configuration Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-surface-container-lowest border border-outline-variant/30 rounded-xl">
            <div className="flex items-center gap-2.5 pb-4 border-b border-outline-variant/20 mb-4">
              <Settings className="w-4 h-4 text-secondary" />
              <h3 className="font-headline-sm text-xs font-semibold text-primary">
                Environment Configuration
              </h3>
            </div>
            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant/65">Project ID</span>
                <code className="bg-surface-container px-2.5 py-1 rounded text-primary font-mono select-all font-semibold">
                  {projectId}
                </code>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant/65">Dataset</span>
                <code className="bg-surface-container px-2.5 py-1 rounded text-primary font-mono select-all font-semibold">
                  {dataset}
                </code>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant/65">API Version</span>
                <code className="bg-surface-container px-2.5 py-1 rounded text-primary font-mono select-all font-semibold">
                  {apiVersion}
                </code>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant/65">App Environment</span>
                <span className="capitalize font-semibold text-secondary">{env}</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-surface-container-lowest border border-outline-variant/30 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 pb-4 border-b border-outline-variant/20 mb-4">
                <ShieldCheck className="w-4 h-4 text-secondary" />
                <h3 className="font-headline-sm text-xs font-semibold text-primary">
                  Studio Access Control
                </h3>
              </div>
              <p className="text-xs text-on-surface-variant/70 leading-relaxed font-body-sm">
                Sanity Studio is locally embedded under the route <code className="bg-surface-container px-1 py-0.5 rounded font-mono text-primary font-semibold">/studio</code>. All CMS schemas are production-ready. Administrative changes made to these models are persisted inside Sanity.
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/studio"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-white hover:bg-secondary/90 transition-all rounded-lg text-xs font-semibold shadow-premium cursor-pointer hover:shadow-premium-hover hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Open Studio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" theme="light" expand={false} richColors />
    </AdminLayout>
  );
}
