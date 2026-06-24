'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminClient, AdminPortalProject } from '@/types/admin';
import DataTable from './DataTable';
import {
  ChevronLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  Copy,
  Check,
  ExternalLink,
  FolderKanban,
  Loader2,
  Eye,
  Edit2,
  Trash2,
  X,
  Plus,
} from 'lucide-react';
import { getClientByIdAction, updateClientAction, deleteClientAction } from '@/lib/clients/actions';
import { toast } from 'sonner';

interface ClientDetailsViewProps {
  id: string;
}

function extractDomain(url: string | null | undefined): string {
  if (!url) return '-';
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function validateUrl(val: string): string | null {
  if (!val) return null;
  try {
    const u = new URL(val);
    if (!u.protocol.startsWith('http')) return 'URL must start with http:// or https://';
    return null;
  } catch {
    return 'Please enter a valid URL (e.g. https://example.com)';
  }
}

export default function ClientDetailsView({ id }: ClientDetailsViewProps) {
  const router = useRouter();
  const [data, setData] = useState<{ client: AdminClient; projects: AdminPortalProject[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Copy state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [urlError, setUrlError] = useState('');

  // Delete state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const result = await getClientByIdAction(id);
    if (result) setData(result as { client: AdminClient; projects: AdminPortalProject[] });
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Copied to clipboard.');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenEdit = () => {
    if (!data) return;
    const { client } = data;
    setName(client.name);
    setEmail(client.email || '');
    setPhone(client.phone || '');
    setCompany(client.company || '');
    setWebsiteUrl(client.websiteUrl || '');
    setNotes(client.notes || '');
    setFormError('');
    setUrlError('');
    setIsEditOpen(true);
  };

  const handleUrlChange = (val: string) => {
    setWebsiteUrl(val);
    if (val) {
      const err = validateUrl(val);
      setUrlError(err || '');
    } else {
      setUrlError('');
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) {
      const err = validateUrl(websiteUrl);
      if (err) { setUrlError(err); return; }
    }
    setIsSubmitting(true);
    try {
      const res = await updateClientAction(id, { name, email, phone, company, websiteUrl, notes });
      if (!res.success) {
        setFormError(res.error || 'Failed to update client.');
        toast.error(res.error || 'Failed to update client.');
      } else {
        toast.success('Client updated successfully.');
        setIsEditOpen(false);
        loadData();
      }
    } catch {
      setFormError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const res = await deleteClientAction(id);
    if (!res.success) {
      toast.error(res.error || 'Failed to delete client.');
    } else {
      toast.success('Client deleted.');
      router.push('/admin/clients');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        <span className="text-xs text-on-surface-variant/70">Loading client details...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <h3 className="font-headline-md text-primary mb-2">Client Not Found</h3>
        <p className="text-xs text-on-surface-variant mb-6">The requested client does not exist.</p>
        <Link
          href="/admin/clients"
          className="text-xs bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Back to Clients
        </Link>
      </div>
    );
  }

  const { client, projects } = data;

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const displayedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/clients"
          className="p-2 rounded border border-outline-variant/30 hover:bg-surface-container-low transition-colors text-on-surface"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="font-headline-sm text-sm font-semibold text-primary">{client.name}</h1>
          <p className="text-xs text-on-surface-variant/60 mt-0.5">
            Client profile &amp; project overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-error/10 text-error text-xs font-semibold rounded-lg hover:bg-error/20 transition-all cursor-pointer border border-error/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* ── Info Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary mt-0.5">
            <Mail className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">
              Contact
            </span>
            {client.email ? (
              <p className="text-xs font-semibold text-primary mt-1 break-all">{client.email}</p>
            ) : (
              <p className="text-xs text-on-surface-variant/40 mt-1">No email</p>
            )}
            {client.phone && (
              <p className="text-[10px] text-on-surface-variant mt-0.5 flex items-center gap-1 font-mono">
                <Phone className="w-3 h-3 text-secondary" />
                {client.phone}
              </p>
            )}
          </div>
        </div>

        {/* Company */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary mt-0.5">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">
              Company
            </span>
            <p className="text-xs font-semibold text-primary mt-1">
              {client.company || <span className="text-on-surface-variant/40 font-normal">Not specified</span>}
            </p>
            <p className="text-[9px] text-on-surface-variant/60 mt-0.5 font-mono">
              Since {client.createdDate}
            </p>
          </div>
        </div>

        {/* Projects count */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant mt-0.5">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">
              Projects
            </span>
            <p className="text-2xl font-bold text-primary mt-1 font-mono">{client.projectCount}</p>
            <span className="text-[9px] text-on-surface-variant/60 block mt-0.5">
              Total projects
            </span>
          </div>
        </div>
      </div>

      {/* ── Website URL Section ───────────────────────────────────────────── */}
      {client.websiteUrl && (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card">
          <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60 block mb-3">
            Website URL
          </span>
          <div className="flex items-center gap-3 bg-surface-container-low/60 border border-outline-variant/20 rounded-lg px-4 py-3">
            <Globe className="w-4 h-4 text-secondary flex-shrink-0" />
            <a
              href={client.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-xs font-mono text-secondary hover:underline underline-offset-2 truncate"
              title={client.websiteUrl}
            >
              {client.websiteUrl}
            </a>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleCopy(client.websiteUrl!, 'website')}
                className="flex items-center gap-1 px-2 py-1 rounded border border-outline-variant/30 text-[10px] text-on-surface-variant hover:bg-surface-container hover:text-secondary transition-all cursor-pointer"
                title="Copy URL"
              >
                {copiedKey === 'website' ? (
                  <Check className="w-3 h-3 text-secondary" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedKey === 'website' ? 'Copied!' : 'Copy'}</span>
              </button>
              <a
                href={client.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1 rounded border border-outline-variant/30 text-[10px] text-on-surface-variant hover:bg-surface-container hover:text-secondary transition-all"
                title="Open in new tab"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Notes ─────────────────────────────────────────────────────────── */}
      {client.notes && (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card">
          <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60 block mb-2">
            Notes
          </span>
          <p className="text-xs text-on-surface leading-relaxed whitespace-pre-wrap">{client.notes}</p>
        </div>
      )}

      {/* ── Projects Table ────────────────────────────────────────────────── */}
      <DataTable
        title="Client Projects"
        subtitle={`Projects associated with ${client.name}`}
        searchValue={search}
        onSearchChange={(val) => { setSearch(val); setCurrentPage(1); }}
        searchPlaceholder="Search projects..."
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        actionSlot={
          <Link
            href="/admin/projects"
            className="flex items-center gap-1.5 bg-primary text-on-primary text-xs font-semibold px-3 py-1.5 rounded-lg hover:shadow-lg hover:shadow-primary/15 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Link>
        }
        headers={['Project Name', 'Website', 'Admin URL', 'Status', 'Logs', 'Created', 'Actions']}
      >
        {displayedProjects.length === 0 ? (
          <tr>
            <td colSpan={7} className="text-center py-8 text-xs text-on-surface-variant/50">
              No projects found for this client.
            </td>
          </tr>
        ) : (
          displayedProjects.map((p) => (
            <tr key={p.id} className="hover:bg-surface-container-low/30 transition-colors">
              <td className="px-6 py-4">
                <span className="text-xs font-semibold text-primary">{p.name}</span>
              </td>
              <td className="px-6 py-4">
                {p.websiteUrl ? (
                  <a
                    href={p.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={p.websiteUrl}
                    className="flex items-center gap-1 text-xs text-secondary hover:underline underline-offset-2"
                  >
                    <Globe className="w-3 h-3" />
                    <span className="font-mono">{extractDomain(p.websiteUrl)}</span>
                  </a>
                ) : (
                  <span className="text-xs text-on-surface-variant/40">-</span>
                )}
              </td>
              <td className="px-6 py-4">
                {p.adminUrl ? (
                  <a
                    href={p.adminUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={p.adminUrl}
                    className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-secondary underline-offset-2 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span className="font-mono">{extractDomain(p.adminUrl)}</span>
                  </a>
                ) : (
                  <span className="text-xs text-on-surface-variant/40">-</span>
                )}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                    p.status === 'Active'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : p.status === 'Completed'
                      ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                      : 'bg-surface-container text-on-surface-variant/70'
                  }`}
                >
                  {p.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="font-mono text-xs text-on-surface-variant">{p.logCount}</span>
              </td>
              <td className="px-6 py-4">
                <span className="font-mono text-xs text-on-surface-variant/70">{p.createdDate}</span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => router.push(`/admin/projects/${p.id}`)}
                  className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                  title="View Project"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))
        )}
      </DataTable>

      {/* ── Edit Modal ────────────────────────────────────────────────────── */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <h3 className="font-headline-sm text-sm font-semibold text-primary">Edit Client</h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="rounded p-1 text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmitEdit} className="space-y-3">
              {formError && (
                <div className="text-xs text-error bg-error-container/10 p-2.5 rounded-lg border border-error/25">
                  {formError}
                </div>
              )}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Client Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => { setName(e.target.value); setFormError(''); }}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10" />
                </div>
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10" />
                </div>
              </div>
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://www.clientwebsite.com"
                    className={`w-full bg-surface-container-low border rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${
                      urlError ? 'border-error focus:border-error focus:ring-error/10' : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'
                    }`}
                  />
                </div>
                {urlError && <p className="text-[10px] text-error mt-1">{urlError}</p>}
              </div>
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Notes</label>
                <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 resize-none" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
                <button type="button" disabled={isSubmitting} onClick={() => setIsEditOpen(false)} className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSubmitting || !!urlError} className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5">
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ────────────────────────────────────── */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium text-center">
            <h3 className="font-headline-sm text-sm font-semibold text-primary mb-2">Delete Client</h3>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              Are you sure you want to permanently delete <span className="font-semibold text-primary">{client.name}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-error text-on-error text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-error/15 transition-all cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
