'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminPortalProject, AdminMaintenanceLog, AdminInvoice } from '@/types/admin';
import DataTable from './DataTable';
import {
  ChevronLeft,
  ChevronDown,
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
  FileText,
  Calendar,
  DollarSign,
  IndianRupee,
  Download,
  CheckCircle2,
  GitBranch,
} from 'lucide-react';
import { getProjectByIdAction, updateProjectAction, deleteProjectAction } from '@/lib/projects/actions';
import { createMaintenanceLogAction, updateMaintenanceLogAction, deleteMaintenanceLogAction } from '@/lib/maintenance-logs/actions';
import { getInvoicesAction, createInvoiceAction, markInvoicePaidAction, deleteInvoiceAction, updateInvoiceAction } from '@/lib/invoices/actions';
import { exportToPDF, exportInvoicePDF } from '@/lib/utils/pdf-export';
import { formatCurrency } from '@/lib/currency';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectDetailsViewProps {
  clientId: string;
  projectId: string;
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

function validateRepositoryUrl(val: string): string | null {
  if (!val) return null;
  try {
    const u = new URL(val);
    if (u.protocol !== 'https:') {
      return 'Repository URL must start with https://';
    }
    return null;
  } catch {
    return 'Please enter a valid HTTPS URL (e.g. https://github.com/username/project)';
  }
}

function validatePackageId(val: string): string | null {
  if (!val) return null;
  const packageIdRegex = /^[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)+$/;
  return packageIdRegex.test(val) ? null : 'Invalid format. Use com.company.app';
}

export default function ProjectDetailsView({ clientId, projectId }: ProjectDetailsViewProps) {
  const router = useRouter();
  const [data, setData] = useState<{ project: AdminPortalProject; logs: AdminMaintenanceLog[] } | null>(null);
  const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Search states
  const [logSearch, setLogSearch] = useState('');
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [logPage, setLogPage] = useState(1);
  const [invoicePage, setInvoicePage] = useState(1);
  const itemsPerPage = 5;

  // Edit project modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [projectType, setProjectType] = useState<'web' | 'mobile'>('web');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [adminPanelUrl, setAdminPanelUrl] = useState('');
  const [androidPackage, setAndroidPackage] = useState('');
  const [iosBundleId, setIosBundleId] = useState('');
  const [playStoreUrl, setPlayStoreUrl] = useState('');
  const [appStoreUrl, setAppStoreUrl] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');

  const [status, setStatus] = useState('Active');
  const [notes, setNotes] = useState('');

  const [formError, setFormError] = useState('');
  const [websiteUrlError, setWebsiteUrlError] = useState('');
  const [adminPanelUrlError, setAdminPanelUrlError] = useState('');
  const [androidPackageError, setAndroidPackageError] = useState('');
  const [iosBundleIdError, setIosBundleIdError] = useState('');
  const [playStoreUrlError, setPlayStoreUrlError] = useState('');
  const [appStoreUrlError, setAppStoreUrlError] = useState('');
  const [repositoryUrlError, setRepositoryUrlError] = useState('');

  // Delete project modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Maintenance Log Modals state
  const [isLogFormOpen, setIsLogFormOpen] = useState(false);
  const [isEditingLog, setIsEditingLog] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [logTitle, setLogTitle] = useState('');
  const [logDescription, setLogDescription] = useState('');
  const [logDate, setLogDate] = useState('');
  const [logFormError, setLogFormError] = useState('');
  const [isDeleteLogOpen, setIsDeleteLogOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<AdminMaintenanceLog | null>(null);

  // Invoice Modal state
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceDueDate, setInvoiceDueDate] = useState('');
  const [invoiceStatus, setInvoiceStatus] = useState<'Paid' | 'Pending' | 'Overdue'>('Pending');
  const [invoiceFormError, setInvoiceFormError] = useState('');
  const [isDeleteInvoiceOpen, setIsDeleteInvoiceOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<AdminInvoice | null>(null);
  const [applyCredits, setApplyCredits] = useState(false);
  const [creditDeduction, setCreditDeduction] = useState('');

  // Maintenance logs linkage states
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [isLogDropdownOpen, setIsLogDropdownOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<AdminInvoice | null>(null);
  const [isInvoiceDetailsOpen, setIsInvoiceDetailsOpen] = useState(false);
  const [selectedInvoiceForDetails, setSelectedInvoiceForDetails] = useState<AdminInvoice | null>(null);

  // Discount state
  const [discountType, setDiscountType] = useState<'amount' | 'percentage'>('amount');
  const [discountValue, setDiscountValue] = useState('');

  // View Log Modal state
  const [isViewLogOpen, setIsViewLogOpen] = useState(false);
  const [viewLog, setViewLog] = useState<AdminMaintenanceLog | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const result = await getProjectByIdAction(projectId);
    if (result) {
      setData(result as { project: AdminPortalProject; logs: AdminMaintenanceLog[] });
    }
    setIsLoading(false);
  }, [projectId]);

  const loadInvoices = useCallback(async () => {
    setIsLoadingInvoices(true);
    const result = await getInvoicesAction(clientId, projectId);
    setInvoices(result);
    setIsLoadingInvoices(false);
  }, [clientId, projectId]);

  useEffect(() => {
    loadData();
    loadInvoices();
  }, [loadData, loadInvoices]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Copied to clipboard.');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // ─── Edit / Delete Project Handlers ────────────────────────────────────────
  const handleOpenEdit = () => {
    if (!data) return;
    const { project } = data;
    setName(project.name);
    setProjectType((project.projectType as 'web' | 'mobile') || 'web');
    setWebsiteUrl(project.websiteUrl || '');
    setAdminPanelUrl(project.adminPanelUrl || '');
    setAndroidPackage(project.androidPackage || '');
    setIosBundleId(project.iosBundleId || '');
    setPlayStoreUrl(project.playStoreUrl || '');
    setAppStoreUrl(project.appStoreUrl || '');
    setRepositoryUrl(project.repositoryUrl || '');
    setStatus(project.status);
    setNotes(project.notes || '');
    setFormError('');
    setWebsiteUrlError('');
    setAdminPanelUrlError('');
    setAndroidPackageError('');
    setIosBundleIdError('');
    setPlayStoreUrlError('');
    setAppStoreUrlError('');
    setRepositoryUrlError('');
    setIsEditOpen(true);
  };

  const handleWebsiteUrlChange = (val: string) => {
    setWebsiteUrl(val);
    setWebsiteUrlError(val ? (validateUrl(val) || '') : '');
  };

  const handleAdminPanelUrlChange = (val: string) => {
    setAdminPanelUrl(val);
    setAdminPanelUrlError(val ? (validateUrl(val) || '') : '');
  };

  const handleAndroidPackageChange = (val: string) => {
    setAndroidPackage(val);
    setAndroidPackageError(val ? (validatePackageId(val) || '') : '');
  };

  const handleIosBundleIdChange = (val: string) => {
    setIosBundleId(val);
    setIosBundleIdError(val ? (validatePackageId(val) || '') : '');
  };

  const handlePlayStoreUrlChange = (val: string) => {
    setPlayStoreUrl(val);
    setPlayStoreUrlError(val ? (validateUrl(val) || '') : '');
  };

  const handleAppStoreUrlChange = (val: string) => {
    setAppStoreUrl(val);
    setAppStoreUrlError(val ? (validateUrl(val) || '') : '');
  };

  const handleRepositoryUrlChange = (val: string) => {
    setRepositoryUrl(val);
    setRepositoryUrlError(val ? (validateRepositoryUrl(val) || '') : '');
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (projectType === 'web') {
      if (websiteUrl) {
        const err = validateUrl(websiteUrl);
        if (err) { setWebsiteUrlError(err); return; }
      }
      if (adminPanelUrl) {
        const err = validateUrl(adminPanelUrl);
        if (err) { setAdminPanelUrlError(err); return; }
      }
    } else {
      if (androidPackage) {
        const err = validatePackageId(androidPackage);
        if (err) { setAndroidPackageError(err); return; }
      }
      if (iosBundleId) {
        const err = validatePackageId(iosBundleId);
        if (err) { setIosBundleIdError(err); return; }
      }
      if (playStoreUrl) {
        const err = validateUrl(playStoreUrl);
        if (err) { setPlayStoreUrlError(err); return; }
      }
      if (appStoreUrl) {
        const err = validateUrl(appStoreUrl);
        if (err) { setAppStoreUrlError(err); return; }
      }
    }

    if (repositoryUrl) {
      const err = validateRepositoryUrl(repositoryUrl);
      if (err) { setRepositoryUrlError(err); return; }
    }

    setIsSubmitting(true);
    try {
      const res = await updateProjectAction(projectId, {
        name,
        clientId,
        projectType,
        websiteUrl: projectType === 'web' ? websiteUrl : '',
        adminPanelUrl: projectType === 'web' ? adminPanelUrl : '',
        androidPackage: projectType === 'mobile' ? androidPackage : '',
        iosBundleId: projectType === 'mobile' ? iosBundleId : '',
        playStoreUrl: projectType === 'mobile' ? playStoreUrl : '',
        appStoreUrl: projectType === 'mobile' ? appStoreUrl : '',
        repositoryUrl,
        status,
        notes,
      });
      if (!res.success) {
        setFormError(res.error || 'Failed to update project.');
        toast.error(res.error || 'Failed to update project.');
      } else {
        toast.success('Project updated successfully.');
        setIsEditOpen(false);
        loadData();
      }
    } catch {
      setFormError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    const res = await deleteProjectAction(projectId);
    if (!res.success) {
      toast.error(res.error || 'Failed to delete project.');
    } else {
      toast.success('Project deleted successfully.');
      router.push(`/admin/clients/${clientId}`);
    }
  };

  // ─── Maintenance Log Handlers ──────────────────────────────────────────────
  const handleOpenAddLog = () => {
    setLogTitle('');
    setLogDescription('');
    setLogDate(new Date().toISOString().split('T')[0]);
    setLogFormError('');
    setIsEditingLog(false);
    setEditingLogId(null);
    setIsLogFormOpen(true);
  };

  const handleOpenEditLog = (log: AdminMaintenanceLog) => {
    setLogTitle(log.title);
    setLogDescription(log.description || '');
    setLogDate(log.logDate);
    setLogFormError('');
    setIsEditingLog(true);
    setEditingLogId(log.id);
    setIsLogFormOpen(true);
  };

  const handleSubmitLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setLogFormError('');
    setIsSubmitting(true);

    try {
      const payload = {
        projectId,
        title: logTitle,
        description: logDescription,
        logDate,
      };

      if (isEditingLog && editingLogId) {
        const res = await updateMaintenanceLogAction(editingLogId, payload);
        if (!res.success) {
          setLogFormError(res.error || 'Failed to update log.');
          toast.error(res.error || 'Failed to update log.');
        } else {
          toast.success('Maintenance log updated.');
          setIsLogFormOpen(false);
          loadData();
        }
      } else {
        const res = await createMaintenanceLogAction(payload);
        if (!res.success) {
          setLogFormError(res.error || 'Failed to save log.');
          toast.error(res.error || 'Failed to save log.');
        } else {
          toast.success('Maintenance log created.');
          setIsLogFormOpen(false);
          loadData();
        }
      }
    } catch {
      setLogFormError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLog = async () => {
    if (!logToDelete) return;
    setIsDeleteLogOpen(false);
    const res = await deleteMaintenanceLogAction(logToDelete.id);
    if (!res.success) {
      toast.error(res.error || 'Failed to delete maintenance log.');
    } else {
      toast.success('Log entry deleted.');
      loadData();
    }
  };

  // ─── Invoice Handlers ──────────────────────────────────────────────────────
  const handleOpenAddInvoice = () => {
    setInvoiceAmount('');
    setInvoiceDueDate('');
    setInvoiceStatus('Pending');
    setApplyCredits(false);
    setCreditDeduction('');
    setInvoiceFormError('');
    setIsInvoiceFormOpen(true);
  };

  const updateInvoiceStatusAutomatically = (amtStr: string, deductStr: string, checked: boolean) => {
    const amt = parseFloat(amtStr) || 0;
    if (amt <= 0) {
      setInvoiceStatus('Pending');
      return;
    }
    let deduct = 0;
    if (checked && data?.project) {
      const rawDeduct = parseFloat(deductStr) || 0;
      const maxDeduct = Math.min(amt, data.project.clientCreditBalance || 0);
      deduct = Math.min(rawDeduct, maxDeduct);
    }
    const due = Math.max(0, amt - deduct);
    if (due === 0) {
      setInvoiceStatus('Paid');
    } else {
      setInvoiceStatus('Pending');
    }
  };

  const handleApplyCreditsToggle = (checked: boolean) => {
    setApplyCredits(checked);
    let deductionStr = '';
    if (checked && data?.project) {
      const amt = parseFloat(invoiceAmount) || 0;
      const maxDeduct = Math.min(amt, data.project.clientCreditBalance || 0);
      deductionStr = maxDeduct.toString();
      setCreditDeduction(deductionStr);
    } else {
      setCreditDeduction('');
    }
    updateInvoiceStatusAutomatically(invoiceAmount, deductionStr, checked);
  };

  const handleInvoiceAmountChange = (val: string) => {
    setInvoiceAmount(val);
    setInvoiceFormError('');
    let currentDeductionStr = creditDeduction;
    if (applyCredits && data?.project) {
      const amt = parseFloat(val) || 0;
      const maxDeduct = Math.min(amt, data.project.clientCreditBalance || 0);
      const currentVal = parseFloat(creditDeduction) || 0;
      if (currentVal > maxDeduct || !creditDeduction) {
        currentDeductionStr = maxDeduct.toString();
        setCreditDeduction(currentDeductionStr);
      }
    }
    updateInvoiceStatusAutomatically(val, currentDeductionStr, applyCredits);
  };

  const handleCreditDeductionChange = (val: string) => {
    setCreditDeduction(val);
    let finalVal = val;
    if (data?.project) {
      const amt = parseFloat(invoiceAmount) || 0;
      const maxDeduct = Math.min(amt, data.project.clientCreditBalance || 0);
      const inputVal = parseFloat(val) || 0;
      if (inputVal > maxDeduct) {
        finalVal = maxDeduct.toString();
        setCreditDeduction(finalVal);
      }
    }
    updateInvoiceStatusAutomatically(invoiceAmount, finalVal, applyCredits);
  };

  const handleOpenEditInvoice = (inv: AdminInvoice) => {
    setEditingInvoice(inv);
    setInvoiceAmount(inv.amount.toString());
    setInvoiceDueDate(inv.dueDate);
    setInvoiceStatus(inv.status);
    setCreditDeduction((inv.creditApplied || 0).toString());
    setApplyCredits((inv.creditApplied || 0) > 0);
    setSelectedLogIds(inv.maintenanceLogs?.map((l) => l.id) || []);
    setDiscountType(inv.discountType ?? 'amount');
    setDiscountValue((inv.discountValue ?? 0) > 0 ? (inv.discountValue ?? 0).toString() : '');
    setInvoiceFormError('');
    setIsInvoiceFormOpen(true);
  };

  const handleCloseInvoiceModal = () => {
    setIsInvoiceFormOpen(false);
    setEditingInvoice(null);
    setInvoiceAmount('');
    setInvoiceDueDate('');
    setInvoiceStatus('Pending');
    setCreditDeduction('');
    setApplyCredits(false);
    setSelectedLogIds([]);
    setDiscountType('amount');
    setDiscountValue('');
    setInvoiceFormError('');
  };

  const handleSubmitInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvoiceFormError('');

    const amt = parseFloat(invoiceAmount);
    if (isNaN(amt) || amt <= 0) {
      setInvoiceFormError('Invoice amount must be greater than 0');
      return;
    }

    const amountParts = invoiceAmount.split('.');
    if (amountParts.length > 1 && amountParts[1].length > 2) {
      setInvoiceFormError('Invoice amount cannot have more than 2 decimal places');
      return;
    }

    // Discount validation
    const discountVal = parseFloat(discountValue) || 0;
    if (discountVal < 0) {
      setInvoiceFormError('Discount cannot be negative.');
      return;
    }
    if (discountType === 'percentage' && discountVal > 100) {
      setInvoiceFormError('Discount percentage cannot exceed 100%.');
      return;
    }
    if (discountType === 'amount' && discountVal > amt) {
      setInvoiceFormError('Discount amount cannot exceed the invoice amount.');
      return;
    }

    let deduction = 0;
    if (applyCredits) {
      const rawDeduction = parseFloat(creditDeduction) || 0;
      if (isNaN(rawDeduction) || rawDeduction < 0) {
        setInvoiceFormError('Credit deduction amount must be a valid non-negative number.');
        return;
      }

      const maxAllowed = data?.project ? Math.min(amt, data.project.clientCreditBalance || 0) : amt;
      deduction = Math.min(rawDeduction, maxAllowed);

      const deductionParts = deduction.toString().split('.');
      if (deductionParts.length > 1 && deductionParts[1].length > 2) {
        setInvoiceFormError('Credit deduction amount cannot have more than 2 decimal places');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (editingInvoice) {
        const res = await updateInvoiceAction(editingInvoice.id, {
          projectId,
          amount: amt,
          discountType,
          discountValue: discountVal,
          dueDate: invoiceDueDate,
          status: invoiceStatus,
          creditApplied: deduction,
          maintenanceLogIds: selectedLogIds,
        });

        if (!res.success) {
          setInvoiceFormError(res.error || 'Failed to update invoice.');
          toast.error(res.error || 'Failed to update invoice.');
        } else {
          toast.success('Invoice updated successfully.');
          setIsInvoiceFormOpen(false);
          setEditingInvoice(null);
          loadInvoices();
          loadData();
        }
      } else {
        const res = await createInvoiceAction({
          clientId,
          projectId,
          amount: amt,
          discountType,
          discountValue: discountVal,
          dueDate: invoiceDueDate,
          status: invoiceStatus,
          creditApplied: deduction,
          maintenanceLogIds: selectedLogIds,
        });

        if (!res.success) {
          setInvoiceFormError(res.error || 'Failed to create invoice.');
          toast.error(res.error || 'Failed to create invoice.');
        } else {
          toast.success('Invoice created successfully.');
          setIsInvoiceFormOpen(false);
          loadInvoices();
          loadData(); // Refresh project details (reloads clientCreditBalance)
        }
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
      toast.error(res.error || 'Failed to mark invoice as paid.');
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

      await exportInvoicePDF({
        filename: `Invoice-${inv.invoiceNumber}.pdf`,
        invoiceNumber: inv.invoiceNumber,
        issuedDate: inv.issuedDate,
        dueDate: inv.dueDate,
        clientName: inv.clientName,
        projectName: data?.project.name || 'N/A',
        status: inv.status,
        subtotal: inv.amount,
        discountType: inv.discountType,
        discountValue: inv.discountValue,
        discountAmount: inv.discountAmount,
        creditApplied: inv.creditApplied,
        finalAmountDue: inv.finalAmountDue,
        startingCreditBalance: inv.startingCreditBalance,
        creditTransactionId: inv.creditTransactionId,
        maintenanceLogs: inv.maintenanceLogs,
      });

      toast.success('Invoice downloaded successfully.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF.');
    }
  };


  // ─── Rendering ─────────────────────────────────────────────────────────────
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
        <Link href={`/admin/clients/${clientId}`} className="text-xs bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
          Back to Client Details
        </Link>
      </div>
    );
  }

  const { project, logs } = data;

  const filteredLogs = logs.filter((l) =>
    l.title.toLowerCase().includes(logSearch.toLowerCase()) ||
    (l.description && l.description.toLowerCase().includes(logSearch.toLowerCase()))
  );

  const filteredInvoices = invoices.filter((i) =>
    i.invoiceNumber.toLowerCase().includes(invoiceSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* ── Breadcrumb Header ────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Link href={`/admin/clients/${clientId}`} className="p-2 rounded border border-outline-variant/30 hover:bg-surface-container-low transition-colors text-on-surface">
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-headline-sm text-sm font-semibold text-primary">{project.name}</h1>
            <span className={`text-[8px] font-semibold uppercase px-1.5 py-0.5 rounded ${project.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500'
                : project.status === 'Completed' ? 'bg-blue-500/10 text-blue-500'
                  : 'bg-surface-container text-on-surface-variant/70'
              }`}>{project.status}</span>
          </div>
          <p className="text-xs text-on-surface-variant/60 mt-0.5">
            Client Profile: <span className="font-medium text-primary">{project.clientName}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleOpenEdit} className="flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer text-on-surface">
            <Edit2 className="w-3.5 h-3.5" /><span>Edit Project</span>
          </button>
          <button onClick={() => setIsDeleteOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-error/10 text-error text-xs font-semibold rounded-lg hover:bg-error/20 transition-colors border border-error/20 cursor-pointer">
            <Trash2 className="w-3.5 h-3.5" /><span>Delete Project</span>
          </button>
        </div>
      </div>

      {/* ── Info Summary Grid ────────────────────────────────────────────── */}
      <div className={`grid grid-cols-1 md:grid-cols-${project.projectType === 'mobile' ? (project.androidPackage && project.iosBundleId ? 4 : 3) : 3} gap-6`}>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary mt-0.5">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Project Name</span>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs font-semibold text-primary">{project.name}</p>
              <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant/70 uppercase">
                {project.projectType === 'mobile' ? '📱 Mobile' : '🌐 Web'}
              </span>
            </div>
            <p className="text-[9px] text-on-surface-variant/60 mt-0.5 font-mono">Since {project.createdDate}</p>
          </div>
        </div>

        {project.projectType === 'mobile' ? (
          <>
            {project.androidPackage && (
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary mt-0.5">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Android Package</span>
                  <p className="text-xs font-mono text-secondary mt-1 block truncate" title={project.androidPackage}>
                    {project.androidPackage}
                  </p>
                </div>
              </div>
            )}

            {project.iosBundleId && (
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary mt-0.5">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">iOS Bundle ID</span>
                  <p className="text-xs font-mono text-secondary mt-1 block truncate" title={project.iosBundleId}>
                    {project.iosBundleId}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary mt-0.5">
              <Globe className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Website domain</span>
              {project.websiteUrl ? (
                <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-secondary hover:underline mt-1 block truncate" title={project.websiteUrl}>
                  {extractDomain(project.websiteUrl)}
                </a>
              ) : (
                <p className="text-xs text-on-surface-variant/40 mt-1">Not set</p>
              )}
            </div>
          </div>
        )}

        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant mt-0.5">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Maintenance Log Count</span>
            <p className="text-2xl font-bold text-primary mt-1 font-mono">{project.logCount}</p>
            <span className="text-[9px] text-on-surface-variant/60 block mt-0.5">Total logs recorded</span>
          </div>
        </div>
      </div>

      {/* ── Project Details Link Cards ────────────────────────────── */}
      {project.projectType === 'mobile' ? (
        (project.playStoreUrl || project.appStoreUrl) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.playStoreUrl && (
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card space-y-3">
                <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60 block">Play Store URL</span>
                <div className="flex items-center gap-3 bg-surface-container-low/60 border border-outline-variant/20 rounded-lg px-3 py-2 text-xs">
                  <Globe className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span className="font-mono text-secondary truncate flex-1">{project.playStoreUrl}</span>
                  <button onClick={() => handleCopy(project.playStoreUrl!, 'playStore')} className="p-1 rounded text-on-surface-variant/60 hover:text-secondary cursor-pointer">
                    {copiedKey === 'playStore' ? <Check className="w-3.5 h-3.5 text-secondary" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}
            {project.appStoreUrl && (
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card space-y-3">
                <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60 block">App Store URL</span>
                <div className="flex items-center gap-3 bg-surface-container-low/60 border border-outline-variant/20 rounded-lg px-3 py-2 text-xs">
                  <ExternalLink className="w-4 h-4 text-on-surface-variant flex-shrink-0" />
                  <span className="font-mono text-on-surface truncate flex-1">{project.appStoreUrl}</span>
                  <button onClick={() => handleCopy(project.appStoreUrl!, 'appStore')} className="p-1 rounded text-on-surface-variant/60 hover:text-secondary cursor-pointer">
                    {copiedKey === 'appStore' ? <Check className="w-3.5 h-3.5 text-secondary" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        (project.websiteUrl || project.adminPanelUrl) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.websiteUrl && (
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card space-y-3">
                <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60 block">Website URL</span>
                <div className="flex items-center gap-3 bg-surface-container-low/60 border border-outline-variant/20 rounded-lg px-3 py-2 text-xs">
                  <Globe className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span className="font-mono text-secondary truncate flex-1">{project.websiteUrl}</span>
                  <button onClick={() => handleCopy(project.websiteUrl!, 'website')} className="p-1 rounded text-on-surface-variant/60 hover:text-secondary cursor-pointer">
                    {copiedKey === 'website' ? <Check className="w-3.5 h-3.5 text-secondary" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}
            {project.adminPanelUrl && (
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card space-y-3">
                <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60 block">Admin Panel URL</span>
                <div className="flex items-center gap-3 bg-surface-container-low/60 border border-outline-variant/20 rounded-lg px-3 py-2 text-xs">
                  <ExternalLink className="w-4 h-4 text-on-surface-variant flex-shrink-0" />
                  <span className="font-mono text-on-surface truncate flex-1">{project.adminPanelUrl}</span>
                  <button onClick={() => handleCopy(project.adminPanelUrl!, 'admin')} className="p-1 rounded text-on-surface-variant/60 hover:text-secondary cursor-pointer">
                    {copiedKey === 'admin' ? <Check className="w-3.5 h-3.5 text-secondary" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      )}

      {/* ── Repository Link Card ────────────────────────────────────────── */}
      {project.repositoryUrl && (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card space-y-3">
          <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60 block">Repository</span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-low/60 border border-outline-variant/20 rounded-lg p-3 text-xs">
            <div className="flex items-center gap-3 min-w-0">
              <GitBranch className="w-4 h-4 text-secondary flex-shrink-0" />
              <span className="font-mono text-secondary truncate">{project.repositoryUrl}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleCopy(project.repositoryUrl!, 'repository')}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant/40 hover:bg-surface-container-low rounded-lg transition-all font-semibold cursor-pointer text-on-surface"
              >
                {copiedKey === 'repository' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-secondary" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-on-primary hover:shadow-lg hover:shadow-primary/10 rounded-lg transition-all font-semibold cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Repository</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Notes ────────────────────────────────────────────────────────── */}
      {project.notes && (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card space-y-2">
          <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60 block">Project Description / Notes</span>
          <p className="text-xs text-on-surface leading-relaxed whitespace-pre-wrap">{project.notes}</p>
        </div>
      )}

      {/* ── Maintenance Logs Table ────────────────────────────────────────── */}
      <DataTable
        title="Maintenance Logs Ledger"
        subtitle={`Audit updates pushed for ${project.name}`}
        searchValue={logSearch}
        onSearchChange={(val) => { setLogSearch(val); setLogPage(1); }}
        searchPlaceholder="Search updates..."
        currentPage={logPage}
        totalPages={Math.ceil(filteredLogs.length / itemsPerPage)}
        onPageChange={(page) => setLogPage(page)}
        actionSlot={
          <button onClick={handleOpenAddLog} className="flex items-center gap-1 bg-primary text-on-primary text-xs font-semibold px-3 py-1.5 rounded-lg hover:shadow-lg active:scale-[0.98] cursor-pointer">
            <Plus className="w-3.5 h-3.5" /><span>Record Log</span>
          </button>
        }
        headers={['Update Log', 'Log Date', 'Created', 'Actions']}
      >
        {filteredLogs.length === 0 ? (
          <tr>
            <td colSpan={4} className="text-center py-8 text-xs text-on-surface-variant/50">No logs matching query.</td>
          </tr>
        ) : (
          filteredLogs.slice((logPage - 1) * itemsPerPage, logPage * itemsPerPage).map((l) => (
            <tr key={l.id} className="hover:bg-surface-container-low/30 transition-colors">
              <td className="px-6 py-4">
                <span className="text-xs font-semibold text-primary block">{l.title}</span>
                {l.description && <p className="text-[10px] text-on-surface-variant/60 mt-0.5 truncate max-w-sm">{l.description}</p>}
              </td>
              <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">{l.logDate}</td>
              <td className="px-6 py-4 font-mono text-xs text-on-surface-variant/60">{l.createdDate}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => { setViewLog(l); setIsViewLogOpen(true); }} className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleOpenEditLog(l)} className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => { setLogToDelete(l); setIsDeleteLogOpen(true); }} className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-error transition-all cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </DataTable>

      {/* ── Project-Specific Invoices ────────────────────────────────────── */}
      <DataTable
        title="Project Invoices"
        subtitle={`Billing invoices linked to ${project.name}`}
        searchValue={invoiceSearch}
        onSearchChange={(val) => { setInvoiceSearch(val); setInvoicePage(1); }}
        searchPlaceholder="Search invoices..."
        currentPage={invoicePage}
        totalPages={Math.ceil(filteredInvoices.length / itemsPerPage)}
        onPageChange={(page) => setInvoicePage(page)}
        actionSlot={
          <button onClick={handleOpenAddInvoice} className="flex items-center gap-1 bg-primary text-on-primary text-xs font-semibold px-3 py-1.5 rounded-lg hover:shadow-lg active:scale-[0.98] cursor-pointer">
            <Plus className="w-3.5 h-3.5" /><span>Link Invoice</span>
          </button>
        }
        headers={['Invoice #', 'Amount', 'Credit Applied', 'Amount Due', 'Due Date', 'Status', 'Actions']}
      >
        {isLoadingInvoices ? (
          <tr>
            <td colSpan={7} className="text-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-secondary mx-auto" />
            </td>
          </tr>
        ) : filteredInvoices.length === 0 ? (
          <tr>
            <td colSpan={7} className="text-center py-8 text-xs text-on-surface-variant/50">No invoices linked specifically to this project.</td>
          </tr>
        ) : (
          filteredInvoices.slice((invoicePage - 1) * itemsPerPage, invoicePage * itemsPerPage).map((inv) => (
            <tr key={inv.id} className="hover:bg-surface-container-low/30 transition-colors">
              <td className="px-6 py-4">
                <button
                  onClick={() => {
                    setSelectedInvoiceForDetails(inv);
                    setIsInvoiceDetailsOpen(true);
                  }}
                  className="text-xs font-mono font-semibold text-primary hover:underline text-left cursor-pointer"
                >
                  {inv.invoiceNumber}
                </button>
              </td>
              <td className="px-6 py-4 font-mono text-xs font-semibold text-primary">{formatCurrency(inv.amount)}</td>
              <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">{formatCurrency(inv.creditApplied || 0)}</td>
              <td className="px-6 py-4 font-mono text-xs font-semibold text-primary">
                {formatCurrency(Math.max(0, (inv.amount * 1.18) - (inv.creditApplied || 0)))}
              </td>
              <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">{inv.dueDate}</td>
              <td className="px-6 py-4">
                <span className={`text-[8px] font-semibold px-2 py-0.5 rounded-full uppercase ${inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : inv.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'}`}>{inv.status}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => handleDownloadInvoicePDF(inv)} className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-secondary cursor-pointer" title="Download Invoice PDF"><Download className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleOpenEditInvoice(inv)} className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-secondary cursor-pointer" title="Edit Invoice"><Edit2 className="w-3.5 h-3.5" /></button>
                  {inv.status !== 'Paid' && <button onClick={() => handleMarkInvoicePaid(inv.id)} className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-emerald-500 cursor-pointer" title="Mark Invoice Paid"><Check className="w-3.5 h-3.5" /></button>}
                  <button onClick={() => { setInvoiceToDelete(inv); setIsDeleteInvoiceOpen(true); }} className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-error cursor-pointer" title="Delete Invoice"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </td>
            </tr>
          ))
        )}
      </DataTable>

      {/* ── Edit Project Modal ────────────────────────────────────────────── */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <h3 className="font-headline-sm text-sm font-semibold text-primary">Edit Project Details</h3>
              <button onClick={() => setIsEditOpen(false)} className="rounded p-1 text-on-surface-variant hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmitEdit} className="space-y-3">
              {formError && <div className="text-xs text-error bg-error-container/10 p-2.5 rounded-lg border border-error/25">{formError}</div>}

              {/* Project Type */}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Project Type <span className="text-error">*</span>
                </label>
                <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setProjectType('web')}
                    className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      projectType === 'web'
                        ? 'bg-surface-container-lowest text-primary shadow-sm'
                        : 'text-on-surface-variant/70 hover:text-primary'
                    }`}
                  >
                    🌐 Web App
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectType('mobile')}
                    className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      projectType === 'mobile'
                        ? 'bg-surface-container-lowest text-primary shadow-sm'
                        : 'text-on-surface-variant/70 hover:text-primary'
                    }`}
                  >
                    📱 Mobile App
                  </button>
                </div>
              </div>

              {/* Project Name */}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Project Name *</label>
                <input type="text" required value={name} onChange={(e) => { setName(e.target.value); setFormError(''); }} className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10" />
              </div>
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface">
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* Conditional Fields with Framer Motion */}
              <div className="relative overflow-hidden">
                <AnimatePresence initial={false} mode="wait">
                  {projectType === 'web' ? (
                    <motion.div
                      key="web-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3 overflow-hidden"
                    >
                      {/* Website URL */}
                      <div>
                        <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Website URL</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                          <input type="url" value={websiteUrl} onChange={(e) => handleWebsiteUrlChange(e.target.value)} placeholder="https://www.website.com" className={`w-full bg-surface-container-low border rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${websiteUrlError ? 'border-error focus:border-error focus:ring-error/10' : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'}`} />
                        </div>
                        {websiteUrlError && <p className="text-[10px] text-error mt-1">{websiteUrlError}</p>}
                      </div>

                      {/* Repository Link */}
                      <div>
                        <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Repository Link</label>
                        <div className="relative">
                          <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                          <input type="url" value={repositoryUrl} onChange={(e) => handleRepositoryUrlChange(e.target.value)} placeholder="https://github.com/username/project" className={`w-full bg-surface-container-low border rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${repositoryUrlError ? 'border-error focus:border-error focus:ring-error/10' : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'}`} />
                        </div>
                        {repositoryUrlError && <p className="text-[10px] text-error mt-1">{repositoryUrlError}</p>}
                      </div>

                      {/* Admin Panel URL */}
                      <div>
                        <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Admin Panel URL</label>
                        <div className="relative">
                          <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                          <input type="url" value={adminPanelUrl} onChange={(e) => handleAdminPanelUrlChange(e.target.value)} placeholder="https://www.website.com/admin" className={`w-full bg-surface-container-low border rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${adminPanelUrlError ? 'border-error focus:border-error focus:ring-error/10' : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'}`} />
                        </div>
                        {adminPanelUrlError && <p className="text-[10px] text-error mt-1">{adminPanelUrlError}</p>}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="mobile-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3 overflow-hidden"
                    >
                      {/* Android Package Name */}
                      <div>
                        <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Android Package Name</label>
                        <input type="text" value={androidPackage} onChange={(e) => handleAndroidPackageChange(e.target.value)} placeholder="com.hexakode.app" className={`w-full bg-surface-container-low border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${androidPackageError ? 'border-error focus:border-error focus:ring-error/10' : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'}`} />
                        {androidPackageError && <p className="text-[10px] text-error mt-1">{androidPackageError}</p>}
                      </div>

                      {/* iOS Bundle Identifier */}
                      <div>
                        <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">iOS Bundle Identifier</label>
                        <input type="text" value={iosBundleId} onChange={(e) => handleIosBundleIdChange(e.target.value)} placeholder="com.hexakode.app" className={`w-full bg-surface-container-low border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${iosBundleIdError ? 'border-error focus:border-error focus:ring-error/10' : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'}`} />
                        {iosBundleIdError && <p className="text-[10px] text-error mt-1">{iosBundleIdError}</p>}
                      </div>

                      {/* Play Store URL */}
                      <div>
                        <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Play Store URL</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                          <input type="url" value={playStoreUrl} onChange={(e) => handlePlayStoreUrlChange(e.target.value)} placeholder="https://play.google.com/store/apps/details?id=..." className={`w-full bg-surface-container-low border rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${playStoreUrlError ? 'border-error focus:border-error focus:ring-error/10' : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'}`} />
                        </div>
                        {playStoreUrlError && <p className="text-[10px] text-error mt-1">{playStoreUrlError}</p>}
                      </div>

                      {/* App Store URL */}
                      <div>
                        <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">App Store URL</label>
                        <div className="relative">
                          <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                          <input type="url" value={appStoreUrl} onChange={(e) => handleAppStoreUrlChange(e.target.value)} placeholder="https://apps.apple.com/app/..." className={`w-full bg-surface-container-low border rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${appStoreUrlError ? 'border-error focus:border-error focus:ring-error/10' : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'}`} />
                        </div>
                        {appStoreUrlError && <p className="text-[10px] text-error mt-1">{appStoreUrlError}</p>}
                      </div>

                      {/* Repository Link */}
                      <div>
                        <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Repository Link</label>
                        <div className="relative">
                          <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                          <input type="url" value={repositoryUrl} onChange={(e) => handleRepositoryUrlChange(e.target.value)} placeholder="https://github.com/username/project" className={`w-full bg-surface-container-low border rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${repositoryUrlError ? 'border-error focus:border-error focus:ring-error/10' : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'}`} />
                        </div>
                        {repositoryUrlError && <p className="text-[10px] text-error mt-1">{repositoryUrlError}</p>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Notes</label>
                <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 resize-none font-sans" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
                <button type="button" disabled={isSubmitting} onClick={() => setIsEditOpen(false)} className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low cursor-pointer text-on-surface">Cancel</button>
                <button type="submit" disabled={isSubmitting || !!websiteUrlError || !!adminPanelUrlError || !!androidPackageError || !!iosBundleIdError || !!playStoreUrlError || !!appStoreUrlError || !!repositoryUrlError} className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg flex items-center gap-1 cursor-pointer">
                  {isSubmitting && <Loader2 className="w-3 h-3 animate-spin" />}
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Project Confirmation Modal ────────────────────────────── */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium text-center">
            <h3 className="font-headline-sm text-sm font-semibold text-primary mb-2">Delete Project</h3>
            <p className="text-xs text-on-surface-variant mb-2 leading-relaxed">
              Permanently delete project <span className="font-semibold text-primary">{project.name}</span>?
            </p>
            <p className="text-[10px] text-error font-medium mb-6">
              All linked maintenance logs and project invoices will be permanently deleted. This is irreversible.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low cursor-pointer text-on-surface">Cancel</button>
              <button onClick={handleDeleteProject} className="px-4 py-2 bg-error text-on-error text-xs font-semibold rounded-lg hover:shadow-lg cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Record/Edit Maintenance Log Modal ────────────────────────────── */}
      {isLogFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-secondary" />
                <h3 className="font-headline-sm text-sm font-semibold text-primary">{isEditingLog ? 'Edit Maintenance Log' : 'Record Maintenance Log'}</h3>
              </div>
              <button onClick={() => setIsLogFormOpen(false)} className="rounded p-1 text-on-surface-variant hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmitLog} className="space-y-3 text-xs">
              {logFormError && <div className="text-xs text-error bg-error-container/10 p-2.5 rounded-lg border border-error/25">{logFormError}</div>}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Title *</label>
                <input type="text" required value={logTitle} onChange={(e) => { setLogTitle(e.target.value); setLogFormError(''); }} placeholder="e.g. Security updates applied" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary" />
              </div>
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Log Date *</label>
                <input type="date" required value={logDate} onChange={(e) => setLogDate(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary text-on-surface" />
              </div>
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Description (Optional)</label>
                <textarea rows={4} value={logDescription} onChange={(e) => setLogDescription(e.target.value)} placeholder="Provide detailed changes or logs..." className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary resize-none" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
                <button type="button" disabled={isSubmitting} onClick={() => setIsLogFormOpen(false)} className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low cursor-pointer text-on-surface">Cancel</button>
                <button type="submit" disabled={isSubmitting || !logTitle || !logDate} className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg flex items-center gap-1 cursor-pointer">
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isEditingLog ? 'Save Log' : 'Record Log'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Log Delete Modal ─────────────────────────────────────────────── */}
      {isDeleteLogOpen && logToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium text-center">
            <h3 className="font-headline-sm text-sm font-semibold text-primary mb-2">Delete Log</h3>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              Delete maintenance log <span className="font-semibold text-primary">{logToDelete.title}</span>? This cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setIsDeleteLogOpen(false)} className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low cursor-pointer text-on-surface">Cancel</button>
              <button onClick={handleDeleteLog} className="px-4 py-2 bg-error text-on-error text-xs font-semibold rounded-lg hover:shadow-lg cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Log Modal ───────────────────────────────────────────────── */}
      {isViewLogOpen && viewLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium max-h-[80vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-2">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-secondary" />
                <h3 className="font-headline-sm text-sm font-semibold text-primary">Log Details</h3>
              </div>
              <button onClick={() => setIsViewLogOpen(false)} className="rounded p-1 text-on-surface-variant hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Log Title</span>
                <p className="text-xs font-semibold text-primary mt-0.5">{viewLog.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Log Date</span>
                  <p className="font-mono text-on-surface mt-0.5">{viewLog.logDate}</p>
                </div>
                <div>
                  <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Recorded At</span>
                  <p className="font-mono text-on-surface mt-0.5">{viewLog.createdDate}</p>
                </div>
              </div>
              <div>
                <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60 block mb-1">Details & description</span>
                <div className="bg-surface-container-low border border-outline-variant/20 rounded-lg p-3 whitespace-pre-wrap leading-relaxed text-on-surface font-sans">
                  {viewLog.description || <span className="italic text-on-surface-variant/50">No details provided.</span>}
                </div>
              </div>
              <div>
                <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60 block mb-1">Invoice Information</span>
                {(!viewLog.invoices || viewLog.invoices.length === 0) ? (
                  <p className="text-on-surface-variant/50 italic text-[11px]">No invoice linked</p>
                ) : (
                  <div className="bg-surface-container-low border border-outline-variant/20 rounded-lg p-3.5 space-y-2 text-xs">
                    {viewLog.invoices.map((inv) => (
                      <div key={inv.id} className="flex flex-col gap-1 border-b border-outline-variant/10 last:border-b-0 pb-1.5 last:pb-0">
                        <div className="flex justify-between font-semibold text-primary">
                          <span>Invoice #{inv.invoiceNumber}</span>
                          <span className={`text-[8px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                            inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : inv.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-on-surface-variant font-mono text-[10px]">
                          <span>Amount: {formatCurrency(inv.amount)}</span>
                          <span>Due Date: {inv.dueDate}</span>
                        </div>
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => {
                              setIsViewLogOpen(false);
                              setSelectedInvoiceForDetails(inv as any);
                              setIsInvoiceDetailsOpen(true);
                            }}
                            className="text-[10px] text-primary hover:text-secondary font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            View Invoice →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end pt-3 border-t border-outline-variant/20">
              <button onClick={() => setIsViewLogOpen(false)} className="px-4 py-1.5 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Link Project Invoice Modal ────────────────────────────────────── */}
      {isInvoiceFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-secondary" />
                <h3 className="font-headline-sm text-sm font-semibold text-primary">Link Project Invoice</h3>
              </div>
              <button onClick={() => setIsInvoiceFormOpen(false)} className="rounded p-1 text-on-surface-variant hover:bg-surface-container cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmitInvoice} noValidate className="space-y-3 text-xs">
              {invoiceFormError && <div className="text-xs text-error bg-error-container/10 p-2.5 rounded-lg border border-error/25">{invoiceFormError}</div>}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Linked Project</label>
                <input type="text" disabled value={project.name} className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-lg px-3 py-2 text-xs text-on-surface-variant/80 cursor-not-allowed" />
              </div>

              {/* ── Linked Maintenance Logs ── */}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Linked Maintenance Logs <span className="normal-case text-on-surface-variant/40">(Optional)</span>
                </label>
                {/* Selected chips */}
                {selectedLogIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {selectedLogIds.map((lid) => {
                      const lg = logs.find((l) => l.id === lid);
                      return lg ? (
                        <span key={lid} className="flex items-center gap-1 text-[10px] bg-secondary/10 text-secondary font-semibold px-2 py-0.5 rounded-full border border-secondary/20">
                          <span className="truncate max-w-[140px]">{lg.title}</span>
                          <button type="button" onClick={() => setSelectedLogIds((prev) => prev.filter((id) => id !== lid))} className="text-secondary/60 hover:text-secondary cursor-pointer">
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={logSearchQuery}
                      onChange={(e) => { setLogSearchQuery(e.target.value); setIsLogDropdownOpen(true); }}
                      onFocus={() => setIsLogDropdownOpen(true)}
                      placeholder={logs.length === 0 ? 'No maintenance logs available' : 'Search maintenance logs...'}
                      disabled={logs.length === 0}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary text-on-surface disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40 pointer-events-none" />
                  </div>
                  {isLogDropdownOpen && logs.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-surface-container-lowest border border-outline-variant/30 rounded-lg shadow-lg max-h-36 overflow-y-auto">
                      {logs
                        .filter((l) =>
                          l.title.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
                          (l.description || '').toLowerCase().includes(logSearchQuery.toLowerCase())
                        )
                        .map((l) => {
                          const isSelected = selectedLogIds.includes(l.id);
                          return (
                            <button
                              key={l.id}
                              type="button"
                              onClick={() => {
                                setSelectedLogIds((prev) =>
                                  isSelected ? prev.filter((id) => id !== l.id) : [...prev, l.id]
                                );
                                setLogSearchQuery('');
                              }}
                              className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-surface-container transition-colors cursor-pointer ${isSelected ? 'text-secondary font-semibold bg-secondary/5' : 'text-on-surface'}`}
                            >
                              <span className="truncate">{l.title}</span>
                              {isSelected && <Check className="w-3 h-3 flex-shrink-0 text-secondary" />}
                            </button>
                          );
                        })}
                      {logs.filter((l) =>
                        l.title.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
                        (l.description || '').toLowerCase().includes(logSearchQuery.toLowerCase())
                      ).length === 0 && (
                        <p className="text-center py-3 text-[10px] text-on-surface-variant/50">No logs match your search.</p>
                      )}
                    </div>
                  )}
                </div>
                {isLogDropdownOpen && (
                  <button
                    type="button"
                    className="fixed inset-0 z-[9]"
                    onClick={() => setIsLogDropdownOpen(false)}
                    aria-label="Close dropdown"
                  />
                )}
              </div>

              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Invoice Amount (₹) *</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                  <input type="number" step="0.01" min="0" required value={invoiceAmount} onChange={(e) => handleInvoiceAmountChange(e.target.value)} placeholder="0.00" className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-secondary text-on-surface" />
                </div>
              </div>

              {/* ── Discount ───────────────────────────────────────────── */}
              <div className="bg-surface-container border border-outline-variant/20 rounded-xl p-3.5 space-y-3">
                <span className="text-xs font-semibold text-primary block">Discount</span>
                {/* Segmented control */}
                <div className="flex rounded-lg overflow-hidden border border-outline-variant/30 text-[10px] font-semibold">
                  <button
                    type="button"
                    onClick={() => { setDiscountType('amount'); setDiscountValue(''); }}
                    className={`flex-1 py-1.5 transition-colors cursor-pointer ${
                      discountType === 'amount'
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    ₹ Fixed Amount
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDiscountType('percentage'); setDiscountValue(''); }}
                    className={`flex-1 py-1.5 transition-colors cursor-pointer ${
                      discountType === 'percentage'
                        ? 'bg-secondary text-on-secondary'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    % Percentage
                  </button>
                </div>
                {/* Value input */}
                <div>
                  <label className="block font-label-mono text-[8px] uppercase tracking-wider text-on-surface-variant mb-1">
                    {discountType === 'amount' ? 'Discount Amount (₹)' : 'Discount Percentage (%)'}
                  </label>
                  <div className="relative">
                    {discountType === 'amount' ? (
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                    ) : (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant/40 font-mono">%</span>
                    )}
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max={discountType === 'percentage' ? 100 : undefined}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      placeholder={discountType === 'amount' ? '0.00' : '0'}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-9 pr-3 py-1.5 text-[11px] focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Credit Balance Adjustment */}
              {data?.project.clientCreditBalance !== undefined && data.project.clientCreditBalance > 0 && (
                <div className="border border-outline-variant/30 rounded-lg p-3 bg-surface-container-low/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant">
                      Credit Balance Adjustment
                    </span>
                    <span className="text-[10px] font-semibold text-secondary font-mono">
                      Available: {formatCurrency(data.project.clientCreditBalance)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="applyCreditsProject"
                      checked={applyCredits}
                      onChange={(e) => handleApplyCreditsToggle(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-outline-variant text-secondary focus:ring-secondary/20 transition-all cursor-pointer"
                    />
                    <label
                      htmlFor="applyCreditsProject"
                      className="text-[10px] text-on-surface-variant cursor-pointer select-none"
                    >
                      Apply available credit balance to this invoice
                    </label>
                  </div>

                  {applyCredits && (
                    <div className="space-y-1">
                      <label className="block font-label-mono text-[8px] uppercase tracking-wider text-on-surface-variant">
                        Credit Deduction Amount (₹)
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max={Math.min(parseFloat(invoiceAmount) || 0, data.project.clientCreditBalance)}
                          value={creditDeduction}
                          onChange={(e) => handleCreditDeductionChange(e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Live Summary Panel */}
              {(() => {
                const amt = parseFloat(invoiceAmount) || 0;
                const discountVal = parseFloat(discountValue) || 0;
                const discountAmt = discountType === 'percentage'
                  ? Math.round(amt * Math.min(discountVal, 100) / 100 * 100) / 100
                  : Math.min(discountVal, amt);
                const amtAfterDiscount = Math.max(0, amt - discountAmt);
                const deduct = applyCredits ? (parseFloat(creditDeduction) || 0) : 0;
                const due = Math.max(0, amtAfterDiscount - deduct);
                const isFullyCovered = amt > 0 && due === 0;
                const hasDiscount = discountAmt > 0;

                return (
                  <div className="bg-surface-container-low border border-outline-variant/20 rounded-lg p-3 space-y-1 text-xs">
                    <div className="flex justify-between items-center text-on-surface-variant">
                      <span>Invoice Amount:</span>
                      <span className="font-mono">{formatCurrency(amt)}</span>
                    </div>
                    {hasDiscount && (
                      <div className="flex justify-between items-center text-amber-500">
                        <span>
                          Discount{discountType === 'percentage' && discountVal > 0 ? ` (${discountVal}%)` : ''}:
                        </span>
                        <span className="font-mono">-{formatCurrency(discountAmt)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-on-surface-variant">
                      <span>Credits Applied:</span>
                      <span className="font-mono">-{formatCurrency(deduct)}</span>
                    </div>
                    <div className={`flex justify-between items-center border-t border-outline-variant/20 pt-1.5 font-semibold transition-all duration-200 ${isFullyCovered
                        ? 'text-emerald-500 bg-emerald-500/5 px-2 py-1 -mx-2 rounded-md border-t-0 mt-1'
                        : 'text-primary'
                      }`}>
                      <span>Amount Due:</span>
                      <span className="font-mono">
                        {formatCurrency(due)}
                      </span>
                    </div>
                    {isFullyCovered && (
                      <div className="text-[10px] text-emerald-500 font-semibold flex items-center justify-end gap-1 pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Fully covered by credit balance</span>
                      </div>
                    )}
                  </div>
                );
              })()}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Due Date *</label>
                <input type="date" required value={invoiceDueDate} onChange={(e) => setInvoiceDueDate(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary text-on-surface" />
              </div>
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">Status</label>
                <select value={invoiceStatus} onChange={(e) => setInvoiceStatus(e.target.value as 'Paid' | 'Pending' | 'Overdue')} className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary text-on-surface">
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
                <button type="button" disabled={isSubmitting} onClick={() => setIsInvoiceFormOpen(false)} className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low cursor-pointer text-on-surface">Cancel</button>
                <button type="submit" disabled={isSubmitting || !invoiceAmount || isNaN(parseFloat(invoiceAmount)) || parseFloat(invoiceAmount) <= 0 || !invoiceDueDate} className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg flex items-center gap-1 cursor-pointer">
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Link Invoice</span>
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
              Delete invoice <span className="font-semibold text-primary">{invoiceToDelete.invoiceNumber}</span>? This cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setIsDeleteInvoiceOpen(false)} className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low cursor-pointer text-on-surface">Cancel</button>
              <button onClick={handleDeleteInvoice} className="px-4 py-2 bg-error text-on-error text-xs font-semibold rounded-lg hover:shadow-lg cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Invoice Details Modal ────────────────────────────────────────── */}
      {isInvoiceDetailsOpen && selectedInvoiceForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium max-h-[90vh] overflow-y-auto space-y-4 font-sans text-on-surface">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-secondary" />
                <h3 className="font-headline-sm text-sm font-semibold text-primary">Invoice Details</h3>
              </div>
              <button
                onClick={() => { setIsInvoiceDetailsOpen(false); setSelectedInvoiceForDetails(null); }}
                className="rounded p-1 text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Invoice Number</span>
                  <p className="font-mono text-on-surface mt-0.5 font-bold">{selectedInvoiceForDetails.invoiceNumber}</p>
                </div>
                <div>
                  <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Status</span>
                  <p className="mt-0.5">
                    <span className={`text-[8px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                      selectedInvoiceForDetails.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500'
                      : selectedInvoiceForDetails.status === 'Pending' ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {selectedInvoiceForDetails.status}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Linked Project</span>
                <p className="text-on-surface mt-0.5">{project.name}</p>
              </div>

              <div className="bg-surface-container-low border border-outline-variant/20 rounded-lg p-3 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Invoice Amount:</span><span>{formatCurrency(selectedInvoiceForDetails.amount)}</span>
                </div>
                {selectedInvoiceForDetails.discountAmount > 0 && (
                  <div className="flex justify-between text-amber-500">
                    <span>
                      Discount{selectedInvoiceForDetails.discountType === 'percentage'
                        ? ` (${selectedInvoiceForDetails.discountValue}%)`
                        : ''}:
                    </span>
                    <span>-{formatCurrency(selectedInvoiceForDetails.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-on-surface-variant">
                  <span>Credits Applied:</span><span>-{formatCurrency(selectedInvoiceForDetails.creditApplied)}</span>
                </div>
                <div className="flex justify-between text-primary font-bold border-t border-outline-variant/20 pt-1.5 text-xs">
                  <span>Amount Due:</span>
                  <span>{formatCurrency(selectedInvoiceForDetails.finalAmountDue)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Issued Date</span>
                  <p className="font-mono text-on-surface mt-0.5">{selectedInvoiceForDetails.issuedDate}</p>
                </div>
                <div>
                  <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Due Date</span>
                  <p className="font-mono text-on-surface mt-0.5">{selectedInvoiceForDetails.dueDate}</p>
                </div>
              </div>

              {/* Linked Maintenance Logs */}
              <div>
                <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60 block mb-1">Linked Maintenance Logs</span>
                {(!selectedInvoiceForDetails.maintenanceLogs || selectedInvoiceForDetails.maintenanceLogs.length === 0) ? (
                  <p className="text-on-surface-variant/50 italic text-[11px]">No maintenance logs linked to this invoice.</p>
                ) : (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto p-1 bg-surface-container-low border border-outline-variant/20 rounded-lg">
                    {selectedInvoiceForDetails.maintenanceLogs.map((log) => (
                      <button
                        key={log.id}
                        onClick={() => {
                          setIsInvoiceDetailsOpen(false);
                          setSelectedInvoiceForDetails(null);
                          const found = logs.find((l) => l.id === log.id);
                          if (found) { setViewLog(found); setIsViewLogOpen(true); }
                        }}
                        className="w-full text-left block px-2.5 py-1.5 bg-surface-container-lowest hover:bg-secondary/5 rounded border border-outline-variant/10 text-primary hover:text-secondary font-medium transition-all truncate text-xs cursor-pointer"
                      >
                        {log.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/20">
              <button
                onClick={() => {
                  setIsInvoiceDetailsOpen(false);
                  handleOpenEditInvoice(selectedInvoiceForDetails);
                }}
                className="px-4 py-1.5 bg-secondary text-on-secondary text-xs font-semibold rounded-lg hover:shadow-lg transition-all cursor-pointer"
              >
                Edit Invoice
              </button>
              <button
                onClick={() => { setIsInvoiceDetailsOpen(false); setSelectedInvoiceForDetails(null); }}
                className="px-4 py-1.5 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
