'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminPortalProject, AdminMaintenanceLog, AdminClient } from '@/types/admin';
import DataTable from './DataTable';
import {
  ChevronLeft,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  Eye,
  Edit2,
  Trash2,
  X,
  FolderKanban,
  Wrench,
  Plus,
} from 'lucide-react';
import { getProjectByIdAction, updateProjectAction, deleteProjectAction } from '@/lib/projects/actions';
import { getClientsAction } from '@/lib/clients/actions';
import { toast } from 'sonner';

interface ProjectDetailsViewProps {
  id: string;
}

function extractDomain(url: string | null | undefined): string {
  if (!url) return '-';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
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

const PROJECT_STATUSES = ['Active', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];

export default function ProjectDetailsView({ id }: ProjectDetailsViewProps) {
  const router = useRouter();
  const [data, setData] = useState<{ project: AdminPortalProject; logs: AdminMaintenanceLog[] } | null>(null);
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Edit modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [adminUrl, setAdminUrl] = useState('');
  const [status, setStatus] = useState('Active');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [websiteUrlError, setWebsiteUrlError] = useState('');
  const [adminUrlError, setAdminUrlError] = useState('');

  // Delete modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [result, clientsData] = await Promise.all([
      getProjectByIdAction(id),
      getClientsAction(),
    ]);
    if (result) setData(result as { project: AdminPortalProject; logs: AdminMaintenanceLog[] });
    setClients(clientsData);
    setIsLoading(false);
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Copied to clipboard.');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenEdit = () => {
    if (!data) return;
    const { project } = data;
    setName(project.name);
    setClientId(project.clientId || '');
    setWebsiteUrl(project.websiteUrl || '');
    setAdminUrl(project.adminUrl || '');
    setStatus(project.status);
    setNotes(project.notes || '');
    setFormError('');
    setWebsiteUrlError('');
    setAdminUrlError('');
    setIsEditOpen(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl) { const err = validateUrl(websiteUrl); if (err) { setWebsiteUrlError(err); return; } }
    if (adminUrl) { const err = validateUrl(adminUrl); if (err) { setAdminUrlError(err); return; } }

    setIsSubmitting(true);
    try {
      const res = await updateProjectAction(id, { name, clientId, websiteUrl, adminUrl, status, notes });
      if (!res.success) {
        setFormError(res.error || 'Failed to update project.');
        toast.error(res.error || 'Failed to update project.');
      } else {
        toast.success('Project updated.');
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
    const res = await deleteProjectAction(id);
    if (!res.success) {
      toast.error(res.error || 'Failed to delete project.');
    } else {
      toast.success('Project deleted.');
      router.push('/admin/projects');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        <span className="text-xs text-on-surface-variant/70">Loading project details...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <h3 className="font-headline-md text-primary mb-2">Project Not Found</h3>
        <p className="text-xs text-on-surface-variant mb-6">The requested project does not exist.</p>
        <Link href="/admin/projects" className="text-xs bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
          Back to Projects
        </Link>
      </div>
    );
  }

  const { project, logs } = data;
  const filteredLogs = logs.filter((l) => l.title.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const displayedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Link href="/admin/projects" className="p-2 rounded border border-outline-variant/30 hover:bg-surface-container-low transition-colors text-on-surface">
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="font-headline-sm text-sm font-semibold text-primary">{project.name}</h1>
          {project.clientName && (
            <p className="text-xs text-on-surface-variant/60 mt-0.5">
              Client: <span className="font-medium">{project.clientName}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-semibold px-2 py-1 rounded-full uppercase ${
            project.status === 'Active' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
            : project.status === 'Completed' ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
            : project.status === 'On Hold' ? 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400'
            : project.status === 'Cancelled' ? 'bg-error-container/20 text-on-error-container'
            : 'bg-surface-container text-on-surface-variant/70'
          }`}>{project.status}</span>
          <button onClick={handleOpenEdit} className="flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface">
            <Edit2 className="w-3.5 h-3.5" /><span>Edit</span>
          </button>
          <button onClick={() => setIsDeleteOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-error/10 text-error text-xs font-semibold rounded-lg hover:bg-error/20 transition-all cursor-pointer border border-error/20">
            <Trash2 className="w-3.5 h-3.5" /><span>Delete</span>
          </button>
        </div>
      </div>

      {/* ── Info Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary mt-0.5">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Project</span>
            <p className="text-xs font-semibold text-primary mt-1">{project.name}</p>
            <p className="text-[9px] text-on-surface-variant/60 mt-0.5 font-mono">Created {project.createdDate}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary mt-0.5">
            <Globe className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Website</span>
            {project.websiteUrl ? (
              <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-secondary hover:underline mt-1 block truncate" title={project.websiteUrl}>
                {extractDomain(project.websiteUrl)}
              </a>
            ) : (
              <p className="text-xs text-on-surface-variant/40 mt-1">Not set</p>
            )}
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant mt-0.5">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Maintenance Logs</span>
            <p className="text-2xl font-bold text-primary mt-1 font-mono">{project.logCount}</p>
            <span className="text-[9px] text-on-surface-variant/60 block mt-0.5">Total entries</span>
          </div>
        </div>
      </div>

      {/* ── URL Sections ─────────────────────────────────────────────────── */}
      {(project.websiteUrl || project.adminUrl) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.websiteUrl && (
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card">
              <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60 block mb-3">
                Website URL
              </span>
              <div className="flex items-center gap-3 bg-surface-container-low/60 border border-outline-variant/20 rounded-lg px-4 py-3">
                <Globe className="w-4 h-4 text-secondary flex-shrink-0" />
                <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-xs font-mono text-secondary hover:underline truncate" title={project.websiteUrl}>
                  {project.websiteUrl}
                </a>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => handleCopy(project.websiteUrl!, 'website')} className="flex items-center gap-1 px-2 py-1 rounded border border-outline-variant/30 text-[10px] text-on-surface-variant hover:bg-surface-container hover:text-secondary transition-all cursor-pointer">
                    {copiedKey === 'website' ? <Check className="w-3 h-3 text-secondary" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'website' ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 rounded border border-outline-variant/30 text-[10px] text-on-surface-variant hover:bg-surface-container hover:text-secondary transition-all">
                    <ExternalLink className="w-3 h-3" /><span>Open</span>
                  </a>
                </div>
              </div>
            </div>
          )}
          {project.adminUrl && (
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card">
              <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60 block mb-3">
                Admin URL
              </span>
              <div className="flex items-center gap-3 bg-surface-container-low/60 border border-outline-variant/20 rounded-lg px-4 py-3">
                <ExternalLink className="w-4 h-4 text-on-surface-variant flex-shrink-0" />
                <a href={project.adminUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-xs font-mono text-on-surface hover:text-secondary hover:underline truncate" title={project.adminUrl}>
                  {project.adminUrl}
                </a>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => handleCopy(project.adminUrl!, 'admin')} className="flex items-center gap-1 px-2 py-1 rounded border border-outline-variant/30 text-[10px] text-on-surface-variant hover:bg-surface-container hover:text-secondary transition-all cursor-pointer">
                    {copiedKey === 'admin' ? <Check className="w-3 h-3 text-secondary" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'admin' ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <a href={project.adminUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 rounded border border-outline-variant/30 text-[10px] text-on-surface-variant hover:bg-surface-container hover:text-secondary transition-all">
                    <ExternalLink className="w-3 h-3" /><span>Open</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Notes ────────────────────────────────────────────────────────── */}
      {project.notes && (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card">
          <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60 block mb-2">Notes</span>
          <p className="text-xs text-on-surface leading-relaxed whitespace-pre-wrap">{project.notes}</p>
        </div>
      )}

      {/* ── Maintenance Logs Table ────────────────────────────────────────── */}
      <DataTable
        title="Maintenance Logs"
        subtitle={`Maintenance history for ${project.name}`}
        searchValue={search}
        onSearchChange={(val) => { setSearch(val); setCurrentPage(1); }}
        searchPlaceholder="Search logs..."
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        actionSlot={
          <Link href="/admin/maintenance-logs" className="flex items-center gap-1.5 bg-primary text-on-primary text-xs font-semibold px-3 py-1.5 rounded-lg hover:shadow-lg hover:shadow-primary/15 active:scale-[0.98] transition-all cursor-pointer">
            <Plus className="w-3.5 h-3.5" /><span>New Log</span>
          </Link>
        }
        headers={['Title', 'Log Date', 'Created', 'Actions']}
      >
        {displayedLogs.length === 0 ? (
          <tr>
            <td colSpan={4} className="text-center py-8 text-xs text-on-surface-variant/50">
              No maintenance logs for this project.
            </td>
          </tr>
        ) : (
          displayedLogs.map((l) => (
            <tr key={l.id} className="hover:bg-surface-container-low/30 transition-colors">
              <td className="px-6 py-4">
                <span className="text-xs font-semibold text-primary">{l.title}</span>
                {l.description && (
                  <p className="text-[10px] text-on-surface-variant/60 mt-0.5 truncate max-w-xs">{l.description}</p>
                )}
              </td>
              <td className="px-6 py-4">
                <span className="font-mono text-xs text-on-surface-variant">{l.logDate}</span>
              </td>
              <td className="px-6 py-4">
                <span className="font-mono text-xs text-on-surface-variant/70">{l.createdDate}</span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => router.push(`/admin/maintenance-logs/${l.id}`)}
                  className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                  title="View Log"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))
        )}
      </DataTable>

      {/* ── Edit Modal ───────────────────────────────────────────────────── */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <h3 className="font-headline-sm text-sm font-semibold text-primary">Edit Project</h3>
              <button onClick={() => setIsEditOpen(false)} className="rounded p-1 text-on-surface-variant hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmitEdit} className="space-y-3">
              {formError && <div className="text-xs text-error bg-error-container/10 p-2.5 rounded-lg border border-error/25">{formError}</div>}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Project Name <span className="text-error">*</span></label>
                <input type="text" required value={name} onChange={(e) => { setName(e.target.value); setFormError(''); }} className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Client</label>
                  <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface">
                    <option value="">— No Client —</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface">
                    {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                  <input type="url" value={websiteUrl} onChange={(e) => { setWebsiteUrl(e.target.value); setWebsiteUrlError(e.target.value ? (validateUrl(e.target.value) || '') : ''); }} placeholder="https://www.revopz.in" className={`w-full bg-surface-container-low border rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${websiteUrlError ? 'border-error focus:border-error focus:ring-error/10' : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'}`} />
                </div>
                {websiteUrlError && <p className="text-[10px] text-error mt-1">{websiteUrlError}</p>}
              </div>
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Admin URL</label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                  <input type="url" value={adminUrl} onChange={(e) => { setAdminUrl(e.target.value); setAdminUrlError(e.target.value ? (validateUrl(e.target.value) || '') : ''); }} placeholder="https://admin.revopz.in" className={`w-full bg-surface-container-low border rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${adminUrlError ? 'border-error focus:border-error focus:ring-error/10' : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'}`} />
                </div>
                {adminUrlError && <p className="text-[10px] text-error mt-1">{adminUrlError}</p>}
              </div>
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Notes</label>
                <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 resize-none" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
                <button type="button" disabled={isSubmitting} onClick={() => setIsEditOpen(false)} className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSubmitting || !!websiteUrlError || !!adminUrlError} className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5">
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Modal ─────────────────────────────────────────────────── */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium text-center">
            <h3 className="font-headline-sm text-sm font-semibold text-primary mb-2">Delete Project</h3>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">Are you sure you want to permanently delete <span className="font-semibold text-primary">{project.name}</span>?</p>
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
