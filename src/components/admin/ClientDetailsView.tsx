'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminClient, AdminPortalProject, AdminInvoice, AdminCreditTransaction } from '@/types/admin';
import DataTable from './DataTable';
import StatsCard from './StatsCard';
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
  Calendar,
  FileText,
  DollarSign,
  TrendingUp,
  Coins,
  AlertCircle,
  Download,
} from 'lucide-react';
import { getClientByIdAction, updateClientAction, deleteClientAction } from '@/lib/clients/actions';
import { createProjectAction, updateProjectAction, deleteProjectAction } from '@/lib/projects/actions';
import { getInvoicesAction, createInvoiceAction, markInvoicePaidAction, deleteInvoiceAction } from '@/lib/invoices/actions';
import { getCreditTransactionsAction, addCreditTransactionAction } from '@/lib/credits/actions';
import { exportToPDF } from '@/lib/utils/pdf-export';
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
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'invoices' | 'credits'>('overview');
  const [data, setData] = useState<{ client: AdminClient; projects: AdminPortalProject[] } | null>(null);
  const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
  const [credits, setCredits] = useState<AdminCreditTransaction[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTab, setIsLoadingTab] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Copy state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Client Edit Modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [clientStatus, setClientStatus] = useState('Active');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [urlError, setUrlError] = useState('');

  // Client Delete Modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Project Modals state
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectWebsite, setProjectWebsite] = useState('');
  const [projectAdminUrl, setProjectAdminUrl] = useState('');
  const [projectStatus, setProjectStatus] = useState('Active');
  const [projectNotes, setProjectNotes] = useState('');
  const [projectUrlError, setProjectUrlError] = useState('');
  const [projectAdminUrlError, setProjectAdminUrlError] = useState('');
  const [projectFormError, setProjectFormError] = useState('');
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<AdminPortalProject | null>(null);

  // Invoice Modals state
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [invoiceAmount, setInvoiceAmount] = useState<string>('');
  const [invoiceDueDate, setInvoiceDueDate] = useState<string>('');
  const [invoiceStatus, setInvoiceStatus] = useState<'Paid' | 'Pending' | 'Overdue'>('Pending');
  const [invoiceFormError, setInvoiceFormError] = useState('');
  const [isDeleteInvoiceOpen, setIsDeleteInvoiceOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<AdminInvoice | null>(null);

  // Credit adjustments form state
  const [creditAction, setCreditAction] = useState<'add' | 'deduct'>('add');
  const [creditAmount, setCreditAmount] = useState<string>('');
  const [creditDesc, setCreditDesc] = useState<string>('');
  const [isSubmittingCredit, setIsSubmittingCredit] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const result = await getClientByIdAction(id);
    if (result) {
      setData(result as { client: AdminClient; projects: AdminPortalProject[] });
    }
    setIsLoading(false);
  }, [id]);

  const loadInvoices = useCallback(async () => {
    setIsLoadingTab(true);
    const result = await getInvoicesAction(id);
    setInvoices(result);
    setIsLoadingTab(false);
  }, [id]);

  const loadCredits = useCallback(async () => {
    setIsLoadingTab(true);
    const result = await getCreditTransactionsAction(id);
    setCredits(result);
    setIsLoadingTab(false);
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (activeTab === 'invoices') {
      loadInvoices();
    } else if (activeTab === 'credits') {
      loadCredits();
    }
    setSearchQuery('');
    setCurrentPage(1);
  }, [activeTab, loadInvoices, loadCredits]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Copied to clipboard.');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // ─── Client Profile Actions ────────────────────────────────────────────────
  const handleOpenEdit = () => {
    if (!data) return;
    const { client } = data;
    setName(client.name);
    setEmail(client.email || '');
    setPhone(client.phone || '');
    setCompany(client.company || '');
    setWebsiteUrl(client.websiteUrl || '');
    setClientStatus(client.status || 'Active');
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
      const res = await updateClientAction(id, {
        name,
        email,
        phone,
        company,
        websiteUrl,
        status: clientStatus,
        notes,
      });
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

  const handleDeleteClient = async () => {
    const res = await deleteClientAction(id);
    if (!res.success) {
      toast.error(res.error || 'Failed to delete client.');
    } else {
      toast.success('Client profile deleted.');
      router.push('/admin/clients');
    }
  };

  // ─── Project Tab Actions ───────────────────────────────────────────────────
  const handleOpenAddProject = () => {
    setProjectName('');
    setProjectWebsite('');
    setProjectAdminUrl('');
    setProjectStatus('Active');
    setProjectNotes('');
    setProjectUrlError('');
    setProjectAdminUrlError('');
    setProjectFormError('');
    setIsEditingProject(false);
    setEditingProjectId(null);
    setIsProjectFormOpen(true);
  };

  const handleOpenEditProject = (proj: AdminPortalProject) => {
    setProjectName(proj.name);
    setProjectWebsite(proj.websiteUrl || '');
    setProjectAdminUrl(proj.adminUrl || '');
    setProjectStatus(proj.status || 'Active');
    setProjectNotes(proj.notes || '');
    setProjectUrlError('');
    setProjectAdminUrlError('');
    setProjectFormError('');
    setIsEditingProject(true);
    setEditingProjectId(proj.id);
    setIsProjectFormOpen(true);
  };

  const handleProjectWebsiteChange = (val: string) => {
    setProjectWebsite(val);
    if (val) {
      const err = validateUrl(val);
      setProjectUrlError(err || '');
    } else {
      setProjectUrlError('');
    }
  };

  const handleProjectAdminUrlChange = (val: string) => {
    setProjectAdminUrl(val);
    if (val) {
      const err = validateUrl(val);
      setProjectAdminUrlError(err || '');
    } else {
      setProjectAdminUrlError('');
    }
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectFormError('');

    if (projectWebsite) {
      const err = validateUrl(projectWebsite);
      if (err) { setProjectUrlError(err); return; }
    }
    if (projectAdminUrl) {
      const err = validateUrl(projectAdminUrl);
      if (err) { setProjectAdminUrlError(err); return; }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: projectName,
        clientId: id,
        websiteUrl: projectWebsite,
        adminUrl: projectAdminUrl,
        status: projectStatus,
        notes: projectNotes,
      };

      if (isEditingProject && editingProjectId) {
        const res = await updateProjectAction(editingProjectId, payload);
        if (!res.success) {
          setProjectFormError(res.error || 'Failed to update project.');
          toast.error(res.error || 'Failed to update project.');
        } else {
          toast.success('Project updated successfully.');
          setIsProjectFormOpen(false);
          loadData();
        }
      } else {
        const res = await createProjectAction(payload);
        if (!res.success) {
          setProjectFormError(res.error || 'Failed to create project.');
          toast.error(res.error || 'Failed to create project.');
        } else {
          toast.success('Project created successfully.');
          setIsProjectFormOpen(false);
          loadData();
        }
      }
    } catch {
      setProjectFormError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    setIsDeleteProjectOpen(false);
    const res = await deleteProjectAction(projectToDelete.id);
    if (!res.success) {
      toast.error(res.error || 'Failed to delete project.');
    } else {
      toast.success('Project deleted successfully.');
      loadData();
    }
  };

  // ─── Invoice Tab Actions ───────────────────────────────────────────────────
  const handleOpenAddInvoice = () => {
    setSelectedProjectId('');
    setInvoiceAmount('');
    setInvoiceDueDate('');
    setInvoiceStatus('Pending');
    setInvoiceFormError('');
    setIsInvoiceFormOpen(true);
  };

  const handleSubmitInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvoiceFormError('');

    const amt = parseFloat(invoiceAmount);
    if (isNaN(amt) || amt <= 0) {
      setInvoiceFormError('Amount must be a valid positive number');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createInvoiceAction({
        clientId: id,
        projectId: selectedProjectId || null,
        amount: amt,
        dueDate: invoiceDueDate,
        status: invoiceStatus,
      });

      if (!res.success) {
        setInvoiceFormError(res.error || 'Failed to create invoice.');
        toast.error(res.error || 'Failed to create invoice.');
      } else {
        toast.success('Invoice created successfully.');
        setIsInvoiceFormOpen(false);
        loadInvoices();
      }
    } catch {
      setInvoiceFormError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkInvoicePaid = async (invId: string) => {
    const res = await markInvoicePaidAction(invId);
    if (!res.success) {
      toast.error(res.error || 'Failed to update invoice status.');
    } else {
      toast.success('Invoice marked as Paid.');
      loadInvoices();
    }
  };

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return;
    setIsDeleteInvoiceOpen(false);
    const res = await deleteInvoiceAction(invoiceToDelete.id);
    if (!res.success) {
      toast.error(res.error || 'Failed to delete invoice.');
    } else {
      toast.success('Invoice deleted.');
      loadInvoices();
    }
  };

  const handleDownloadInvoicePDF = async (inv: AdminInvoice) => {
    try {
      toast.info('Generating PDF...');
      const metadata = [
        { label: 'Invoice Number', value: inv.invoiceNumber },
        { label: 'Issue Date', value: inv.issuedDate },
        { label: 'Due Date', value: inv.dueDate },
        { label: 'Client Name', value: inv.clientName },
      ];
      if (inv.projectName) {
        metadata.push({ label: 'Linked Project', value: inv.projectName });
      }

      await exportToPDF({
        filename: `Invoice-${inv.invoiceNumber}.pdf`,
        title: `INVOICE: ${inv.invoiceNumber}`,
        subtitle: 'HexaKode Billing System',
        metadata,
        summaryTitle: 'Invoice Summary',
        summaryItems: [
          { label: 'Total Due', value: `$${inv.amount.toFixed(2)}` },
          { label: 'Status', value: inv.status.toUpperCase() },
        ],
        tableHeaders: ['Description', 'Qty', 'Unit Price', 'Total'],
        tableData: [
          [
            `Services / maintenance provided for project: ${inv.projectName || 'HexaKode Managed Web Application'}`,
            '1',
            `$${inv.amount.toFixed(2)}`,
            `$${inv.amount.toFixed(2)}`,
          ],
        ],
      });
      toast.success('Invoice downloaded successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF.');
    }
  };

  // ─── Credit Tab Actions ────────────────────────────────────────────────────
  const handleSubmitCredit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(creditAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Please enter a valid positive credit amount.');
      return;
    }

    setIsSubmittingCredit(true);
    // Deduct credit passes negative amount
    const actualAmount = creditAction === 'add' ? amt : -amt;
    const finalDesc = creditDesc || (creditAction === 'add' ? 'Credit added by administrator' : 'Credit deducted by administrator');

    try {
      const res = await addCreditTransactionAction(id, actualAmount, finalDesc);
      if (!res.success) {
        toast.error(res.error || 'Failed to adjust credit.');
      } else {
        toast.success(`Credits successfully ${creditAction === 'add' ? 'added' : 'deducted'}.`);
        setCreditAmount('');
        setCreditDesc('');
        loadCredits();
        loadData(); // Reload stats cards for updated credit balance
      }
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsSubmittingCredit(false);
    }
  };

  // ─── Loading / Error states ────────────────────────────────────────────────
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

  // Calculate summary stats
  const activeProjectsCount = projects.filter((p) => p.status === 'Active').length;
  const totalLogsCount = projects.reduce((acc, curr) => acc + (curr.logCount || 0), 0);
  const pendingInvoicesCount = invoices.filter((i) => i.status === 'Pending').length;

  // Search filter lists
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvoices = invoices.filter((inv) =>
    inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inv.projectName && inv.projectName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCredits = credits.filter((tx) =>
    tx.description && tx.description.toLowerCase().includes(searchQuery.toLowerCase())
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
          <div className="flex items-center gap-2">
            <h1 className="font-headline-sm text-sm font-semibold text-primary">{client.name}</h1>
            <span
              className={`text-[8px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                client.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-secondary-container/20 text-on-secondary-container'
              }`}
            >
              {client.status}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant/60 mt-0.5">
            Manage profile, linked projects, credit history, and client invoices
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

      {/* ── Stats Summary Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Projects"
          value={projects.length}
          subtext="Total linked portfolios"
          icon={FolderKanban}
        />
        <StatsCard
          title="Active Projects"
          value={activeProjectsCount}
          subtext="Ongoing application instances"
          icon={TrendingUp}
          trend={{ value: 'Active status', type: 'positive' }}
        />
        <StatsCard
          title="Credit Balance"
          value={`$${client.creditBalance.toFixed(2)}`}
          subtext="Available prepaid credits"
          icon={Coins}
        />
        <StatsCard
          title="Maintenance Logs"
          value={totalLogsCount}
          subtext="Total updates pushed"
          icon={Building2}
        />
        <StatsCard
          title="Pending Invoices"
          value={pendingInvoicesCount}
          subtext="Awaiting client payment"
          icon={FileText}
          trend={{
            value: pendingInvoicesCount > 0 ? 'Payment pending' : 'All clear',
            type: pendingInvoicesCount > 0 ? 'negative' : 'positive',
          }}
        />
      </div>

      {/* ── Navigation Tabs ───────────────────────────────────────────────── */}
      <div className="border-b border-outline-variant/30 flex gap-4 text-xs font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2.5 px-1 border-b-2 transition-all cursor-pointer ${
            activeTab === 'overview' ? 'border-secondary text-primary font-semibold' : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-2.5 px-1 border-b-2 transition-all cursor-pointer ${
            activeTab === 'projects' ? 'border-secondary text-primary font-semibold' : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-2.5 px-1 border-b-2 transition-all cursor-pointer ${
            activeTab === 'invoices' ? 'border-secondary text-primary font-semibold' : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          Invoices
        </button>
        <button
          onClick={() => setActiveTab('credits')}
          className={`pb-2.5 px-1 border-b-2 transition-all cursor-pointer ${
            activeTab === 'credits' ? 'border-secondary text-primary font-semibold' : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          Credits
        </button>
      </div>

      {/* ── Tab Content Rendering ─────────────────────────────────────────── */}
      <div className="space-y-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Details */}
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card space-y-4">
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider font-label-mono">
                  Client Profile
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-on-surface-variant/70 block">Company Name</span>
                    <p className="font-semibold text-primary mt-0.5">{client.company || '-'}</p>
                  </div>
                  <div>
                    <span className="text-on-surface-variant/70 block">Client Status</span>
                    <p className="font-semibold text-primary mt-0.5">{client.status}</p>
                  </div>
                  <div>
                    <span className="text-on-surface-variant/70 block">Client Since</span>
                    <p className="font-mono text-on-surface mt-0.5">{client.createdDate}</p>
                  </div>
                  <div>
                    <span className="text-on-surface-variant/70 block">Credit Balance</span>
                    <p className="font-semibold text-secondary mt-0.5 font-mono">${client.creditBalance.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card space-y-4">
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider font-label-mono">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-on-surface-variant/50" />
                    <div>
                      <span className="text-[10px] text-on-surface-variant/70 block">Email Address</span>
                      {client.email ? (
                        <a href={`mailto:${client.email}`} className="text-xs text-secondary hover:underline truncate block">
                          {client.email}
                        </a>
                      ) : (
                        <span className="text-on-surface-variant/40">Not provided</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-on-surface-variant/50" />
                    <div>
                      <span className="text-[10px] text-on-surface-variant/70 block">Phone Number</span>
                      {client.phone ? (
                        <span className="font-mono text-on-surface">{client.phone}</span>
                      ) : (
                        <span className="text-on-surface-variant/40">Not provided</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Notes */}
              {client.notes && (
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card space-y-2">
                  <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60 block">
                    Notes
                  </span>
                  <p className="text-xs text-on-surface leading-relaxed whitespace-pre-wrap">{client.notes}</p>
                </div>
              )}
            </div>

            {/* Right details sidebar */}
            <div className="space-y-6">
              {/* Website link card */}
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card space-y-3">
                <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60 block">
                  Website URL
                </span>
                {client.websiteUrl ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 bg-surface-container-low/50 border border-outline-variant/10 rounded-lg p-2.5">
                      <Globe className="w-4 h-4 text-secondary flex-shrink-0" />
                      <span className="text-xs font-mono truncate text-primary flex-1">{extractDomain(client.websiteUrl)}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(client.websiteUrl!, 'website')}
                        className="flex-1 flex items-center justify-center gap-1.5 border border-outline-variant/30 text-[10px] py-1.5 rounded-lg text-on-surface hover:bg-surface-container hover:text-secondary cursor-pointer transition-colors"
                      >
                        {copiedKey === 'website' ? <Check className="w-3.5 h-3.5 text-secondary" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'website' ? 'Copied' : 'Copy Link'}</span>
                      </button>
                      <a
                        href={client.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 border border-outline-variant/30 text-[10px] py-1.5 rounded-lg text-on-surface hover:bg-surface-container hover:text-secondary transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Site</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-on-surface-variant/50">No website registered for this client profile.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <DataTable
            title="Projects List"
            subtitle={`Manage linked portfolios for ${client.name}`}
            searchValue={searchQuery}
            onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
            searchPlaceholder="Search projects..."
            currentPage={currentPage}
            totalPages={Math.ceil(filteredProjects.length / itemsPerPage)}
            onPageChange={(page) => setCurrentPage(page)}
            actionSlot={
              <button
                onClick={handleOpenAddProject}
                className="flex items-center gap-1 bg-primary text-on-primary text-xs font-semibold px-3 py-1.5 rounded-lg hover:shadow-lg hover:shadow-primary/15 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            }
            headers={['Project Name', 'Website', 'Admin URL', 'Status', 'Logs', 'Actions']}
          >
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-xs text-on-surface-variant/50">
                  No projects linked to this client.
                </td>
              </tr>
            ) : (
              filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((p) => (
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
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => router.push(`/admin/clients/${id}/projects/${p.id}`)}
                        className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                        title="View Project Details & Maintenance Logs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEditProject(p)}
                        className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setProjectToDelete(p);
                          setIsDeleteProjectOpen(true);
                        }}
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
        )}

        {/* INVOICES TAB */}
        {activeTab === 'invoices' && (
          <DataTable
            title="Invoices Log"
            subtitle={`Invoices registered for ${client.name}`}
            searchValue={searchQuery}
            onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
            searchPlaceholder="Search invoices by number..."
            currentPage={currentPage}
            totalPages={Math.ceil(filteredInvoices.length / itemsPerPage)}
            onPageChange={(page) => setCurrentPage(page)}
            actionSlot={
              <button
                onClick={handleOpenAddInvoice}
                className="flex items-center gap-1 bg-primary text-on-primary text-xs font-semibold px-3 py-1.5 rounded-lg hover:shadow-lg hover:shadow-primary/15 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Invoice</span>
              </button>
            }
            headers={['Invoice #', 'Project', 'Amount', 'Due Date', 'Status', 'Actions']}
          >
            {isLoadingTab ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-secondary" />
                    <span className="text-xs text-on-surface-variant/70">Loading billing history...</span>
                  </div>
                </td>
              </tr>
            ) : filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-xs text-on-surface-variant/50">
                  No invoices found.
                </td>
              </tr>
            ) : (
              filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-semibold text-primary">{inv.invoiceNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-on-surface">
                      {inv.projectName || <span className="text-on-surface-variant/40 italic">General Account</span>}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-semibold text-primary">${inv.amount.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-on-surface-variant">{inv.dueDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[8px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : inv.status === 'Pending'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-rose-500/10 text-rose-500'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDownloadInvoicePDF(inv)}
                        className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-secondary transition-all cursor-pointer"
                        title="Download Invoice PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      {inv.status !== 'Paid' && (
                        <button
                          onClick={() => handleMarkInvoicePaid(inv.id)}
                          className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-emerald-500 transition-all cursor-pointer"
                          title="Mark Invoice Paid"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setInvoiceToDelete(inv);
                          setIsDeleteInvoiceOpen(true);
                        }}
                        className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-error transition-all cursor-pointer"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </DataTable>
        )}

        {/* CREDITS TAB */}
        {activeTab === 'credits' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Credit Transaction List */}
            <div className="lg:col-span-2">
              <DataTable
                title="Credit Transactions"
                subtitle={`Prepaid ledger entries for ${client.name}`}
                searchValue={searchQuery}
                onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
                searchPlaceholder="Search adjustments by notes..."
                currentPage={currentPage}
                totalPages={Math.ceil(filteredCredits.length / itemsPerPage)}
                onPageChange={(page) => setCurrentPage(page)}
                headers={['Date', 'Ledger Notes', 'Adjustment', 'Balance Impact']}
              >
                {isLoadingTab ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-secondary" />
                        <span className="text-xs text-on-surface-variant/70">Loading transactions...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredCredits.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-xs text-on-surface-variant/50">
                      No prepaid credits transactions found.
                    </td>
                  </tr>
                ) : (
                  filteredCredits.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((tx) => (
                    <tr key={tx.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-on-surface-variant">{tx.createdAt}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-on-surface">{tx.description || '-'}</span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        <span className={tx.amount >= 0 ? 'text-emerald-500 font-semibold' : 'text-rose-500 font-semibold'}>
                          {tx.amount >= 0 ? '+' : ''}${tx.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                          tx.amount >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {tx.amount >= 0 ? 'Deposit' : 'Usage / Debit'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </DataTable>
            </div>

            {/* Adjust Credits Sidecard */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card h-fit space-y-4">
              <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-3 mb-2">
                <Coins className="w-4 h-4 text-secondary" />
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider font-label-mono">
                  Adjust Credits
                </h3>
              </div>

              <form onSubmit={handleSubmitCredit} className="space-y-4 text-xs">
                {/* Mode Select */}
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Action Type
                  </label>
                  <select
                    value={creditAction}
                    onChange={(e) => setCreditAction(e.target.value as 'add' | 'deduct')}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                  >
                    <option value="add">Add Credit (Deposit)</option>
                    <option value="deduct">Deduct Credit (Debit)</option>
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  />
                </div>

                {/* Ledger description */}
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Ledger notes
                  </label>
                  <textarea
                    rows={3}
                    value={creditDesc}
                    onChange={(e) => setCreditDesc(e.target.value)}
                    placeholder="e.g. Monthly maintenance prepay"
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmittingCredit || !creditAmount}
                  className="w-full py-2 bg-secondary text-white font-semibold rounded-lg hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                >
                  {isSubmittingCredit ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Adjusting...
                    </>
                  ) : (
                    <span>Adjust Credit Ledger</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ── Client Profile Edit Modal ────────────────────────────────────── */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <h3 className="font-headline-sm text-sm font-semibold text-primary">Edit Client Profile</h3>
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
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Status</label>
                <select
                  value={clientStatus}
                  onChange={(e) => setClientStatus(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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

      {/* ── Client Delete Confirmation Modal ─────────────────────────────── */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium text-center">
            <h3 className="font-headline-sm text-sm font-semibold text-primary mb-2">Delete Client profile</h3>
            <p className="text-xs text-on-surface-variant mb-2 leading-relaxed">
              Are you sure you want to permanently delete <span className="font-semibold text-primary">{client.name}</span>?
            </p>
            <p className="text-[10px] text-error font-medium mb-6">
              This will permanently delete all projects, maintenance logs, invoices, and credit ledgers associated with this client. This action is irreversible.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface">Cancel</button>
              <button onClick={handleDeleteClient} className="px-4 py-2 bg-error text-on-error text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-error/15 transition-all cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Project Add/Edit Modal ───────────────────────────────────────── */}
      {isProjectFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-secondary" />
                <h3 className="font-headline-sm text-sm font-semibold text-primary">
                  {isEditingProject ? 'Edit Project' : 'Add New Project'}
                </h3>
              </div>
              <button
                onClick={() => setIsProjectFormOpen(false)}
                className="rounded p-1 text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitProject} className="space-y-3">
              {projectFormError && (
                <div className="text-xs text-error bg-error-container/10 p-2.5 rounded-lg border border-error/25">
                  {projectFormError}
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
                  value={projectName}
                  onChange={(e) => { setProjectName(e.target.value); setProjectFormError(''); }}
                  placeholder="e.g. Revopz Website"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
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
                    value={projectWebsite}
                    onChange={(e) => handleProjectWebsiteChange(e.target.value)}
                    placeholder="https://www.mywebsite.com"
                    className={`w-full bg-surface-container-low border rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${
                      projectUrlError
                        ? 'border-error focus:border-error focus:ring-error/10'
                        : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'
                    }`}
                  />
                </div>
                {projectUrlError && (
                  <p className="text-[10px] text-error mt-1">{projectUrlError}</p>
                )}
              </div>

              {/* Admin URL */}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Admin Panel URL
                </label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                  <input
                    type="url"
                    value={projectAdminUrl}
                    onChange={(e) => handleProjectAdminUrlChange(e.target.value)}
                    placeholder="https://www.mywebsite.com/admin"
                    className={`w-full bg-surface-container-low border rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${
                      projectAdminUrlError
                        ? 'border-error focus:border-error focus:ring-error/10'
                        : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'
                    }`}
                  />
                </div>
                {projectAdminUrlError && (
                  <p className="text-[10px] text-error mt-1">{projectAdminUrlError}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Status
                </label>
                <select
                  value={projectStatus}
                  onChange={(e) => setProjectStatus(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={projectNotes}
                  onChange={(e) => setProjectNotes(e.target.value)}
                  placeholder="Notes, stack info, etc..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsProjectFormOpen(false)}
                  className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !!projectUrlError || !!projectAdminUrlError}
                  className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isEditingProject ? 'Save Project' : 'Create Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Project Delete Modal ─────────────────────────────────────────── */}
      {isDeleteProjectOpen && projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium text-center">
            <h3 className="font-headline-sm text-sm font-semibold text-primary mb-2">Delete Project</h3>
            <p className="text-xs text-on-surface-variant mb-2 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-primary">{projectToDelete.name}</span>?
            </p>
            <p className="text-[10px] text-error font-medium mb-6">
              All maintenance logs and invoices linked specifically to this project will be permanently deleted.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setIsDeleteProjectOpen(false)} className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface">Cancel</button>
              <button onClick={handleDeleteProject} className="px-4 py-2 bg-error text-on-error text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-error/15 transition-all cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Invoice Create Modal ─────────────────────────────────────────── */}
      {isInvoiceFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-secondary" />
                <h3 className="font-headline-sm text-sm font-semibold text-primary">
                  Create Invoice
                </h3>
              </div>
              <button
                onClick={() => setIsInvoiceFormOpen(false)}
                className="rounded p-1 text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitInvoice} className="space-y-3">
              {invoiceFormError && (
                <div className="text-xs text-error bg-error-container/10 p-2.5 rounded-lg border border-error/25">
                  {invoiceFormError}
                </div>
              )}

              {/* Client Info (static) */}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Client Profile
                </label>
                <input
                  type="text"
                  disabled
                  value={client.name}
                  className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-lg px-3 py-2 text-xs text-on-surface-variant/80 cursor-not-allowed"
                />
              </div>

              {/* Associated Project select */}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Link to Project (Optional)
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                >
                  <option value="">-- General / No Project --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Invoice Amount ($) <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={invoiceAmount}
                    onChange={(e) => { setInvoiceAmount(e.target.value); setInvoiceFormError(''); }}
                    placeholder="0.00"
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  />
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Due Date <span className="text-error">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={invoiceDueDate}
                  onChange={(e) => setInvoiceDueDate(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                />
              </div>

              {/* Invoice Status */}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Initial Status
                </label>
                <select
                  value={invoiceStatus}
                  onChange={(e) => setInvoiceStatus(e.target.value as 'Paid' | 'Pending' | 'Overdue')}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsInvoiceFormOpen(false)}
                  className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !invoiceAmount || !invoiceDueDate}
                  className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Invoice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Invoice Delete Modal ─────────────────────────────────────────── */}
      {isDeleteInvoiceOpen && invoiceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium text-center">
            <h3 className="font-headline-sm text-sm font-semibold text-primary mb-2">Delete Invoice</h3>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              Are you sure you want to permanently delete invoice <span className="font-semibold text-primary">{invoiceToDelete.invoiceNumber}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setIsDeleteInvoiceOpen(false)} className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface">Cancel</button>
              <button onClick={handleDeleteInvoice} className="px-4 py-2 bg-error text-on-error text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-error/15 transition-all cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
