'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPortalProject, AdminClient } from '@/types/admin';
import DataTable from './DataTable';
import {
  Eye,
  Edit2,
  Trash2,
  Plus,
  X,
  Loader2,
  Globe,
  ExternalLink,
  FolderKanban,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getProjectsAction,
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
} from '@/lib/projects/actions';
import { getClientsAction } from '@/lib/clients/actions';

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

const PROJECT_STATUSES = ['Active', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProjectsTable() {
  const router = useRouter();
  const [projects, setProjects] = useState<AdminPortalProject[]>([]);
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<AdminPortalProject | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [adminUrl, setAdminUrl] = useState('');
  const [status, setStatus] = useState('Active');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [websiteUrlError, setWebsiteUrlError] = useState('');
  const [adminUrlError, setAdminUrlError] = useState('');

  // Copy state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [projectsData, clientsData] = await Promise.all([
      getProjectsAction(),
      getClientsAction(),
    ]);
    setProjects(projectsData);
    setClients(clientsData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Form Handlers ──────────────────────────────────────────────────────────

  const resetForm = () => {
    setName('');
    setClientId('');
    setWebsiteUrl('');
    setAdminUrl('');
    setStatus('Active');
    setNotes('');
    setFormError('');
    setWebsiteUrlError('');
    setAdminUrlError('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsEditing(false);
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (project: AdminPortalProject) => {
    setName(project.name);
    setClientId(project.clientId || '');
    setWebsiteUrl(project.websiteUrl || '');
    setAdminUrl(project.adminUrl || '');
    setStatus(project.status || 'Active');
    setNotes(project.notes || '');
    setFormError('');
    setWebsiteUrlError('');
    setAdminUrlError('');
    setIsEditing(true);
    setEditingId(project.id);
    setIsFormOpen(true);
  };

  const handleWebsiteUrlChange = (val: string) => {
    setWebsiteUrl(val);
    setWebsiteUrlError(val ? (validateUrl(val) || '') : '');
  };

  const handleAdminUrlChange = (val: string) => {
    setAdminUrl(val);
    setAdminUrlError(val ? (validateUrl(val) || '') : '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (websiteUrl) {
      const err = validateUrl(websiteUrl);
      if (err) { setWebsiteUrlError(err); return; }
    }
    if (adminUrl) {
      const err = validateUrl(adminUrl);
      if (err) { setAdminUrlError(err); return; }
    }

    setIsSubmitting(true);
    try {
      const payload = { name, clientId, websiteUrl, adminUrl, status, notes };

      if (isEditing && editingId) {
        const res = await updateProjectAction(editingId, payload);
        if (!res.success) {
          setFormError(res.error || 'Failed to update project.');
          toast.error(res.error || 'Failed to update project.');
        } else {
          toast.success('Project updated successfully.');
          setIsFormOpen(false);
          loadData();
        }
      } else {
        const res = await createProjectAction(payload);
        if (!res.success) {
          setFormError(res.error || 'Failed to create project.');
          toast.error(res.error || 'Failed to create project.');
        } else {
          toast.success('Project created successfully.');
          setIsFormOpen(false);
          loadData();
        }
      }
    } catch {
      setFormError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    const prev = projects;
    setProjects(projects.filter((p) => p.id !== projectToDelete.id));
    setIsDeleteConfirmOpen(false);

    const res = await deleteProjectAction(projectToDelete.id);
    if (!res.success) {
      toast.error(res.error || 'Failed to delete project.');
      setProjects(prev);
    } else {
      toast.success('Project deleted successfully.');
    }
  };

  const handleCopy = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    toast.success('URL copied to clipboard.');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // ─── Filter & Pagination ────────────────────────────────────────────────────

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      (p.clientName && p.clientName.toLowerCase().includes(q));
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayed = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      <DataTable
        title="Projects"
        subtitle="Manage client projects and website URLs"
        searchValue={search}
        onSearchChange={(val) => { setSearch(val); setCurrentPage(1); }}
        searchPlaceholder="Search projects or clients..."
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        filterSlot={
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface rounded-lg px-3 py-1.5 focus:outline-none focus:border-secondary transition-all"
          >
            <option value="All">All Statuses</option>
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        }
        actionSlot={
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1 bg-primary text-on-primary text-xs font-semibold px-3 py-1.5 rounded-lg hover:shadow-lg hover:shadow-primary/15 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        }
        headers={['Project Name', 'Client', 'Website', 'Admin URL', 'Status', 'Logs', 'Created', 'Actions']}
      >
        {isLoading ? (
          <tr>
            <td colSpan={8} className="text-center py-12">
              <div className="flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                <span className="text-xs text-on-surface-variant/70">Loading projects...</span>
              </div>
            </td>
          </tr>
        ) : displayed.length === 0 ? (
          <tr>
            <td colSpan={8} className="text-center py-8 text-xs text-on-surface-variant/50">
              No projects found.
            </td>
          </tr>
        ) : (
          displayed.map((p) => (
            <tr key={p.id} className="hover:bg-surface-container-low/30 transition-colors">
              <td className="px-6 py-4">
                <span className="text-xs font-semibold text-primary">{p.name}</span>
              </td>
              <td className="px-6 py-4">
                <span className="font-label-mono text-[9px] text-on-surface-variant/70 uppercase">
                  {p.clientName || '-'}
                </span>
              </td>
              <td className="px-6 py-4">
                {p.websiteUrl ? (
                  <div className="flex items-center gap-1.5">
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
                    <button
                      onClick={() => handleCopy(p.websiteUrl!, `w-${p.id}`)}
                      className="p-0.5 rounded text-on-surface-variant/40 hover:text-secondary transition-colors cursor-pointer"
                      title="Copy Website URL"
                    >
                      {copiedKey === `w-${p.id}` ? (
                        <Check className="w-3 h-3 text-secondary" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-on-surface-variant/40">-</span>
                )}
              </td>
              <td className="px-6 py-4">
                {p.adminUrl ? (
                  <div className="flex items-center gap-1.5">
                    <a
                      href={p.adminUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={p.adminUrl}
                      className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-secondary hover:underline underline-offset-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="font-mono">{extractDomain(p.adminUrl)}</span>
                    </a>
                    <button
                      onClick={() => handleCopy(p.adminUrl!, `a-${p.id}`)}
                      className="p-0.5 rounded text-on-surface-variant/40 hover:text-secondary transition-colors cursor-pointer"
                      title="Copy Admin URL"
                    >
                      {copiedKey === `a-${p.id}` ? (
                        <Check className="w-3 h-3 text-secondary" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
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
                      : p.status === 'On Hold'
                      ? 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400'
                      : p.status === 'Cancelled'
                      ? 'bg-error-container/20 text-on-error-container'
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
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => router.push(`/admin/projects/${p.id}`)}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                    title="View Project"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                    title="Edit Project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setProjectToDelete(p); setIsDeleteConfirmOpen(true); }}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-error transition-all cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </DataTable>

      {/* ── Add / Edit Modal ──────────────────────────────────────────────── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-secondary" />
                <h3 className="font-headline-sm text-sm font-semibold text-primary">
                  {isEditing ? 'Edit Project' : 'Add New Project'}
                </h3>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="rounded p-1 text-on-surface-variant hover:bg-surface-container cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {formError && (
                <div className="text-xs text-error bg-error-container/10 p-2.5 rounded-lg border border-error/25">
                  {formError}
                </div>
              )}

              {/* Project Name */}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Project Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => { setName(e.target.value); setFormError(''); }}
                  placeholder="e.g. Revopz Website"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>

              {/* Client & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Client
                  </label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                  >
                    <option value="">— No Client —</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                  >
                    {PROJECT_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Website URL */}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Website URL
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => handleWebsiteUrlChange(e.target.value)}
                    placeholder="https://www.revopz.in"
                    className={`w-full bg-surface-container-low border rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${
                      websiteUrlError
                        ? 'border-error focus:border-error focus:ring-error/10'
                        : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'
                    }`}
                  />
                </div>
                {websiteUrlError && <p className="text-[10px] text-error mt-1">{websiteUrlError}</p>}
              </div>

              {/* Admin URL */}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Admin URL
                </label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                  <input
                    type="url"
                    value={adminUrl}
                    onChange={(e) => handleAdminUrlChange(e.target.value)}
                    placeholder="https://admin.revopz.in"
                    className={`w-full bg-surface-container-low border rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${
                      adminUrlError
                        ? 'border-error focus:border-error focus:ring-error/10'
                        : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'
                    }`}
                  />
                </div>
                {adminUrlError && <p className="text-[10px] text-error mt-1">{adminUrlError}</p>}
                <p className="text-[9px] text-on-surface-variant/50 mt-1">
                  Both URL fields are optional. Must start with https:// or http://
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add project notes..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !!websiteUrlError || !!adminUrlError}
                  className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isEditing ? 'Save Changes' : 'Add Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ──────────────────────────────────────── */}
      {isDeleteConfirmOpen && projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium text-center">
            <h3 className="font-headline-sm text-sm font-semibold text-primary mb-2">
              Delete Project
            </h3>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-primary">{projectToDelete.name}</span>?
              Associated maintenance logs will also be deleted.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-error text-on-error text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-error/15 transition-all cursor-pointer"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
