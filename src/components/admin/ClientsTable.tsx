'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminClient } from '@/types/admin';
import DataTable from './DataTable';
import {
  Eye,
  Edit2,
  Trash2,
  Plus,
  X,
  Loader2,
  Globe,
  Building2,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  getClientsAction,
  createClientAction,
  updateClientAction,
  deleteClientAction,
} from '@/lib/clients/actions';

// ─── Helpers ────────────────────────────────────────────────────────────────

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

// ─── Component ───────────────────────────────────────────────────────────────

export default function ClientsTable() {
  const router = useRouter();
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<AdminClient | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [urlError, setUrlError] = useState('');

  // Copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadClients = useCallback(async () => {
    setIsLoading(true);
    const data = await getClientsAction();
    setClients(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  // ─── Form Handlers ─────────────────────────────────────────────────────────

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setWebsiteUrl('');
    setNotes('');
    setFormError('');
    setUrlError('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsEditing(false);
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (client: AdminClient) => {
    setName(client.name);
    setEmail(client.email || '');
    setPhone(client.phone || '');
    setCompany(client.company || '');
    setWebsiteUrl(client.websiteUrl || '');
    setNotes(client.notes || '');
    setFormError('');
    setUrlError('');
    setIsEditing(true);
    setEditingId(client.id);
    setIsFormOpen(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (websiteUrl) {
      const err = validateUrl(websiteUrl);
      if (err) {
        setUrlError(err);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload = { name, email, phone, company, websiteUrl, notes };

      if (isEditing && editingId) {
        const res = await updateClientAction(editingId, payload);
        if (!res.success) {
          setFormError(res.error || 'Failed to update client.');
          toast.error(res.error || 'Failed to update client.');
        } else {
          toast.success('Client updated successfully.');
          setIsFormOpen(false);
          loadClients();
        }
      } else {
        const res = await createClientAction(payload);
        if (!res.success) {
          setFormError(res.error || 'Failed to create client.');
          toast.error(res.error || 'Failed to create client.');
        } else {
          toast.success('Client created successfully.');
          setIsFormOpen(false);
          loadClients();
        }
      }
    } catch {
      setFormError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!clientToDelete) return;
    const prev = clients;
    setClients(clients.filter((c) => c.id !== clientToDelete.id));
    setIsDeleteConfirmOpen(false);

    const res = await deleteClientAction(clientToDelete.id);
    if (!res.success) {
      toast.error(res.error || 'Failed to delete client.');
      setClients(prev);
    } else {
      toast.success('Client deleted successfully.');
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('URL copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ─── Filter & Pagination ───────────────────────────────────────────────────

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.company && c.company.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayed = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      <DataTable
        title="Clients"
        subtitle="Manage client accounts and website information"
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search clients..."
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        actionSlot={
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1 bg-primary text-on-primary text-xs font-semibold px-3 py-1.5 rounded-lg hover:shadow-lg hover:shadow-primary/15 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Client</span>
          </button>
        }
        headers={['Client Name', 'Company', 'Contact', 'Website', 'Projects', 'Created', 'Actions']}
      >
        {isLoading ? (
          <tr>
            <td colSpan={7} className="text-center py-12">
              <div className="flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                <span className="text-xs text-on-surface-variant/70">Loading clients...</span>
              </div>
            </td>
          </tr>
        ) : displayed.length === 0 ? (
          <tr>
            <td colSpan={7} className="text-center py-8 text-xs text-on-surface-variant/50">
              No clients found.
            </td>
          </tr>
        ) : (
          displayed.map((c) => (
            <tr key={c.id} className="hover:bg-surface-container-low/30 transition-colors">
              <td className="px-6 py-4">
                <span className="text-xs font-semibold text-primary">{c.name}</span>
              </td>
              <td className="px-6 py-4">
                <span className="font-label-mono text-[9px] text-on-surface-variant/70 uppercase">
                  {c.company || '-'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  {c.email && (
                    <span className="text-xs text-on-surface-variant">{c.email}</span>
                  )}
                  {c.phone && (
                    <span className="font-mono text-[10px] text-on-surface-variant/60">{c.phone}</span>
                  )}
                  {!c.email && !c.phone && (
                    <span className="text-xs text-on-surface-variant/40">-</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                {c.websiteUrl ? (
                  <div className="flex items-center gap-1.5">
                    <a
                      href={c.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={c.websiteUrl}
                      className="flex items-center gap-1 text-xs text-secondary hover:underline underline-offset-2 transition-all"
                    >
                      <Globe className="w-3 h-3" />
                      <span className="font-mono">{extractDomain(c.websiteUrl)}</span>
                    </a>
                    <button
                      onClick={() => handleCopy(c.websiteUrl!, c.id)}
                      className="p-0.5 rounded text-on-surface-variant/40 hover:text-secondary transition-colors cursor-pointer"
                      title="Copy URL"
                    >
                      {copiedId === c.id ? (
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
                <span className="font-mono text-xs text-on-surface-variant">{c.projectCount}</span>
              </td>
              <td className="px-6 py-4">
                <span className="font-mono text-xs text-on-surface-variant/70">{c.createdDate}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => router.push(`/admin/clients/${c.id}`)}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                    title="View Client Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                    title="Edit Client"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setClientToDelete(c);
                      setIsDeleteConfirmOpen(true);
                    }}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-error transition-all cursor-pointer"
                    title="Delete Client"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </DataTable>

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-secondary" />
                <h3 className="font-headline-sm text-sm font-semibold text-primary">
                  {isEditing ? 'Edit Client' : 'Add New Client'}
                </h3>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="rounded p-1 text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {formError && (
                <div className="text-xs text-error bg-error-container/10 p-2.5 rounded-lg border border-error/25">
                  {formError}
                </div>
              )}

              {/* Client Name */}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Client Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => { setName(e.target.value); setFormError(''); }}
                  placeholder="e.g. Revopz"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Revopz Technologies"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@example.com"
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  />
                </div>
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 00000 00000"
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  />
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
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://www.clientwebsite.com"
                    className={`w-full bg-surface-container-low border rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${
                      urlError
                        ? 'border-error focus:border-error focus:ring-error/10'
                        : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'
                    }`}
                  />
                </div>
                {urlError && (
                  <p className="text-[10px] text-error mt-1">{urlError}</p>
                )}
                <p className="text-[9px] text-on-surface-variant/50 mt-1">
                  Optional. Must start with https:// or http://
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
                  placeholder="Add client notes or comments..."
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
                  disabled={isSubmitting || !!urlError}
                  className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isEditing ? 'Save Changes' : 'Add Client'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      {isDeleteConfirmOpen && clientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium text-center">
            <h3 className="font-headline-sm text-sm font-semibold text-primary mb-2">
              Delete Client
            </h3>
            <p className="text-xs text-on-surface-variant mb-1 leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-primary">{clientToDelete.name}</span>?
            </p>
            <p className="text-[10px] text-on-surface-variant/60 mb-6">
              Associated projects will not be deleted but will be unlinked.
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
                Delete Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
