'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminMaintenanceLog, AdminPortalProject } from '@/types/admin';
import DataTable from './DataTable';
import {
  Eye,
  Edit2,
  Trash2,
  Plus,
  X,
  Loader2,
  Globe,
  Wrench,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getMaintenanceLogsAction,
  createMaintenanceLogAction,
  updateMaintenanceLogAction,
  deleteMaintenanceLogAction,
} from '@/lib/maintenance-logs/actions';
import { getProjectsAction } from '@/lib/projects/actions';

function extractDomain(url: string | null | undefined): string {
  if (!url) return '-';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export default function MaintenanceLogsTable() {
  const router = useRouter();
  const [logs, setLogs] = useState<AdminMaintenanceLog[]>([]);
  const [projects, setProjects] = useState<AdminPortalProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<AdminMaintenanceLog | null>(null);

  // Form fields
  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [logDate, setLogDate] = useState('');
  const [formError, setFormError] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [logsData, projectsData] = await Promise.all([
      getMaintenanceLogsAction(),
      getProjectsAction(),
    ]);
    setLogs(logsData);
    setProjects(projectsData);
    setIsLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ─── Form Handlers ──────────────────────────────────────────────────────────

  const todayString = () => new Date().toISOString().split('T')[0];

  const resetForm = () => {
    setProjectId('');
    setTitle('');
    setDescription('');
    setLogDate(todayString());
    setFormError('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsEditing(false);
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (log: AdminMaintenanceLog) => {
    setProjectId(log.projectId || '');
    setTitle(log.title);
    setDescription(log.description || '');
    setLogDate(log.logDate);
    setFormError('');
    setIsEditing(true);
    setEditingId(log.id);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    try {
      const payload = { projectId, title, description, logDate };

      if (isEditing && editingId) {
        const res = await updateMaintenanceLogAction(editingId, payload);
        if (!res.success) {
          setFormError(res.error || 'Failed to update log.');
          toast.error(res.error || 'Failed to update log.');
        } else {
          toast.success('Maintenance log updated.');
          setIsFormOpen(false);
          loadData();
        }
      } else {
        const res = await createMaintenanceLogAction(payload);
        if (!res.success) {
          setFormError(res.error || 'Failed to create log.');
          toast.error(res.error || 'Failed to create log.');
        } else {
          toast.success('Maintenance log created.');
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
    if (!logToDelete) return;
    const prev = logs;
    setLogs(logs.filter((l) => l.id !== logToDelete.id));
    setIsDeleteConfirmOpen(false);

    const res = await deleteMaintenanceLogAction(logToDelete.id);
    if (!res.success) {
      toast.error(res.error || 'Failed to delete log.');
      setLogs(prev);
    } else {
      toast.success('Maintenance log deleted.');
    }
  };

  // ─── Filter & Pagination ────────────────────────────────────────────────────

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    const matchesSearch =
      l.title.toLowerCase().includes(q) ||
      (l.projectName && l.projectName.toLowerCase().includes(q));
    const matchesProject = projectFilter === 'All' || l.projectId === projectFilter;
    return matchesSearch && matchesProject;
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
        title="Maintenance Logs"
        subtitle="Track maintenance and update activities for client projects"
        searchValue={search}
        onSearchChange={(val) => { setSearch(val); setCurrentPage(1); }}
        searchPlaceholder="Search logs or projects..."
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        filterSlot={
          <select
            value={projectFilter}
            onChange={(e) => { setProjectFilter(e.target.value); setCurrentPage(1); }}
            className="bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface rounded-lg px-3 py-1.5 focus:outline-none focus:border-secondary transition-all"
          >
            <option value="All">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        }
        actionSlot={
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1 bg-primary text-on-primary text-xs font-semibold px-3 py-1.5 rounded-lg hover:shadow-lg hover:shadow-primary/15 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Log</span>
          </button>
        }
        headers={['Title', 'Project', 'Website', 'Log Date', 'Created', 'Actions']}
      >
        {isLoading ? (
          <tr>
            <td colSpan={6} className="text-center py-12">
              <div className="flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                <span className="text-xs text-on-surface-variant/70">Loading maintenance logs...</span>
              </div>
            </td>
          </tr>
        ) : displayed.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center py-8 text-xs text-on-surface-variant/50">
              No maintenance logs found.
            </td>
          </tr>
        ) : (
          displayed.map((l) => (
            <tr key={l.id} className="hover:bg-surface-container-low/30 transition-colors">
              <td className="px-6 py-4">
                <span className="text-xs font-semibold text-primary">{l.title}</span>
                {l.description && (
                  <p className="text-[10px] text-on-surface-variant/60 mt-0.5 truncate max-w-[200px]">
                    {l.description}
                  </p>
                )}
              </td>
              <td className="px-6 py-4">
                <span className="font-label-mono text-[9px] text-on-surface-variant/70 uppercase">
                  {l.projectName || '-'}
                </span>
              </td>
              <td className="px-6 py-4">
                {l.projectWebsiteUrl ? (
                  <a
                    href={l.projectWebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={l.projectWebsiteUrl}
                    className="flex items-center gap-1 text-xs text-secondary hover:underline underline-offset-2"
                  >
                    <Globe className="w-3 h-3" />
                    <span className="font-mono">{extractDomain(l.projectWebsiteUrl)}</span>
                  </a>
                ) : (
                  <span className="text-xs text-on-surface-variant/40">-</span>
                )}
              </td>
              <td className="px-6 py-4">
                <span className="font-mono text-xs text-on-surface-variant">{l.logDate}</span>
              </td>
              <td className="px-6 py-4">
                <span className="font-mono text-xs text-on-surface-variant/70">{l.createdDate}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => router.push(`/admin/maintenance-logs/${l.id}`)}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                    title="View Log"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(l)}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                    title="Edit Log"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setLogToDelete(l); setIsDeleteConfirmOpen(true); }}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-error transition-all cursor-pointer"
                    title="Delete Log"
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
                <Wrench className="w-4 h-4 text-secondary" />
                <h3 className="font-headline-sm text-sm font-semibold text-primary">
                  {isEditing ? 'Edit Log Entry' : 'Add Maintenance Log'}
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

              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Title <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setFormError(''); }}
                  placeholder="e.g. Plugin updates and security patches"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Project
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                  >
                    <option value="">— No Project —</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Log Date <span className="text-error">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the maintenance work performed..."
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
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isEditing ? 'Save Changes' : 'Add Log'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ──────────────────────────────────────── */}
      {isDeleteConfirmOpen && logToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium text-center">
            <h3 className="font-headline-sm text-sm font-semibold text-primary mb-2">Delete Log Entry</h3>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-primary">&quot;{logToDelete.title}&quot;</span>?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setIsDeleteConfirmOpen(false)} className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-error text-on-error text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-error/15 transition-all cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
