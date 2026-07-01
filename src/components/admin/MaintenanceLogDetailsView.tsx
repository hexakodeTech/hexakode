'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminMaintenanceLog, AdminPortalProject } from '@/types/admin';
import {
  ChevronLeft,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  Edit2,
  Trash2,
  X,
  Wrench,
  FileText,
  IndianRupee,
} from 'lucide-react';
import {
  getMaintenanceLogByIdAction,
  updateMaintenanceLogAction,
  deleteMaintenanceLogAction,
} from '@/lib/maintenance-logs/actions';
import { getProjectsAction } from '@/lib/projects/actions';
import { formatCurrency } from '@/lib/currency';
import { toast } from 'sonner';

interface Props {
  id: string;
}

export default function MaintenanceLogDetailsView({ id }: Props) {
  const router = useRouter();
  const [log, setLog] = useState<AdminMaintenanceLog | null>(null);
  const [projects, setProjects] = useState<AdminPortalProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Edit modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [logDate, setLogDate] = useState('');
  const [formError, setFormError] = useState('');

  // Delete modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [logData, projectsData] = await Promise.all([
      getMaintenanceLogByIdAction(id),
      getProjectsAction(),
    ]);
    if (logData) setLog(logData as AdminMaintenanceLog);
    setProjects(projectsData);
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    Promise.resolve().then(() => {
      loadData();
    });
  }, [loadData]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Copied to clipboard.');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenEdit = () => {
    if (!log) return;
    setProjectId(log.projectId || '');
    setTitle(log.title);
    setDescription(log.description || '');
    setLogDate(log.logDate);
    setFormError('');
    setIsEditOpen(true);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await updateMaintenanceLogAction(id, { projectId, title, description, logDate });
      if (!res.success) {
        setFormError(res.error || 'Failed to update log.');
        toast.error(res.error || 'Failed to update log.');
      } else {
        toast.success('Log updated.');
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
    const res = await deleteMaintenanceLogAction(id);
    if (!res.success) {
      toast.error(res.error || 'Failed to delete log.');
    } else {
      toast.success('Log deleted.');
      router.push('/admin/maintenance-logs');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        <span className="text-xs text-on-surface-variant/70">Loading log details...</span>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="text-center py-12">
        <h3 className="font-headline-md text-primary mb-2">Log Not Found</h3>
        <p className="text-xs text-on-surface-variant mb-6">The requested maintenance log does not exist.</p>
        <Link href="/admin/maintenance-logs" className="text-xs bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
          Back to Logs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Link href="/admin/maintenance-logs" className="p-2 rounded border border-outline-variant/30 hover:bg-surface-container-low transition-colors text-on-surface">
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="font-headline-sm text-sm font-semibold text-primary">{log.title}</h1>
          {log.projectName && (
            <p className="text-xs text-on-surface-variant/60 mt-0.5">Project: <span className="font-medium">{log.projectName}</span></p>
          )}
        </div>
        <div className="flex items-center gap-2">
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
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Log Entry</span>
            <p className="text-xs font-semibold text-primary mt-1">{log.title}</p>
            <p className="text-[9px] text-on-surface-variant/60 font-mono mt-0.5">ID: {log.id.slice(0, 8)}...</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary mt-0.5">
            <Globe className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Project Website</span>
            {log.projectWebsiteUrl ? (
              <a href={log.projectWebsiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-secondary hover:underline mt-1 block truncate" title={log.projectWebsiteUrl}>
                {new URL(log.projectWebsiteUrl).hostname.replace(/^www\./, '')}
              </a>
            ) : (
              <p className="text-xs text-on-surface-variant/40 mt-1">Not available</p>
            )}
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant mt-0.5">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Log Date</span>
            <p className="text-sm font-bold text-primary mt-1 font-mono">{log.logDate}</p>
            <span className="text-[9px] text-on-surface-variant/60 block mt-0.5">Created: {log.createdDate}</span>
          </div>
        </div>
      </div>

      {/* ── Project Website URL (if available) ───────────────────────────── */}
      {log.projectWebsiteUrl && (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card">
          <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60 block mb-3">
            Project Website URL
          </span>
          <div className="flex items-center gap-3 bg-surface-container-low/60 border border-outline-variant/20 rounded-lg px-4 py-3">
            <Globe className="w-4 h-4 text-secondary flex-shrink-0" />
            <a href={log.projectWebsiteUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-xs font-mono text-secondary hover:underline truncate" title={log.projectWebsiteUrl}>
              {log.projectWebsiteUrl}
            </a>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button onClick={() => handleCopy(log.projectWebsiteUrl!, 'website')} className="flex items-center gap-1 px-2 py-1 rounded border border-outline-variant/30 text-[10px] text-on-surface-variant hover:bg-surface-container hover:text-secondary transition-all cursor-pointer">
                {copiedKey === 'website' ? <Check className="w-3 h-3 text-secondary" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'website' ? 'Copied!' : 'Copy'}</span>
              </button>
              <a href={log.projectWebsiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 rounded border border-outline-variant/30 text-[10px] text-on-surface-variant hover:bg-surface-container hover:text-secondary transition-all">
                <ExternalLink className="w-3 h-3" /><span>Open</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Description ──────────────────────────────────────────────────── */}
      {log.description && (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card">
          <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60 block mb-2">Description</span>
          <p className="text-xs text-on-surface leading-relaxed whitespace-pre-wrap">{log.description}</p>
        </div>
      )}

      {/* ── Invoice Information ───────────────────────────────────────────── */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-secondary" />
          <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Invoice Information</span>
        </div>
        {(!log.invoices || log.invoices.length === 0) ? (
          <p className="text-xs text-on-surface-variant/50 italic">No invoice linked to this maintenance log.</p>
        ) : (
          <div className="space-y-3">
            {log.invoices.map((inv) => (
              <div key={inv.id} className="bg-surface-container-low border border-outline-variant/20 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-xs font-mono font-bold text-primary">{inv.invoiceNumber}</span>
                  </div>
                  <span className={`text-[8px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                    inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500'
                    : inv.status === 'Pending' ? 'bg-amber-500/10 text-amber-500'
                    : 'bg-rose-500/10 text-rose-500'
                  }`}>{inv.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[10px] text-on-surface-variant font-mono">
                  <div>
                    <span className="text-[9px] uppercase tracking-wide block text-on-surface-variant/50">Amount</span>
                    <span className="font-semibold text-primary">{formatCurrency(inv.amount)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wide block text-on-surface-variant/50">Due Date</span>
                    <span>{inv.dueDate}</span>
                  </div>
                </div>
                {log.projectId && (
                  <div className="flex justify-end pt-1 border-t border-outline-variant/10">
                    <Link
                      href={`/admin/clients/${inv.clientId}/projects/${log.projectId}`}
                      className="text-[10px] text-primary hover:text-secondary font-semibold hover:underline flex items-center gap-1 transition-colors"
                    >
                      View Invoice Details →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Edit Modal ───────────────────────────────────────────────────── */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <h3 className="font-headline-sm text-sm font-semibold text-primary">Edit Log Entry</h3>
              <button onClick={() => setIsEditOpen(false)} className="rounded p-1 text-on-surface-variant hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmitEdit} className="space-y-3">
              {formError && <div className="text-xs text-error bg-error-container/10 p-2.5 rounded-lg border border-error/25">{formError}</div>}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Title <span className="text-error">*</span></label>
                <input type="text" required value={title} onChange={(e) => { setTitle(e.target.value); setFormError(''); }} className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Project</label>
                  <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface">
                    <option value="">— No Project —</option>
                    {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Log Date <span className="text-error">*</span></label>
                  <input type="date" required value={logDate} onChange={(e) => setLogDate(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface" />
                </div>
              </div>
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Description</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 resize-none" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
                <button type="button" disabled={isSubmitting} onClick={() => setIsEditOpen(false)} className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5">
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
            <h3 className="font-headline-sm text-sm font-semibold text-primary mb-2">Delete Log Entry</h3>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">Are you sure you want to permanently delete this log entry?</p>
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
