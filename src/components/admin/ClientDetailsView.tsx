'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminClient, AdminPortalProject, AdminInvoice, AdminMaintenanceLog, AdminCreditTransaction, AdminCoupon } from '@/types/admin';
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
  IndianRupee,
  TrendingUp,
  Coins,
  AlertCircle,
  Download,
  CheckCircle2,
  Ticket,
  User,
  Sparkles,
  GitBranch,
  Search,
} from 'lucide-react';
import { getClientByIdAction, updateClientAction, deleteClientAction } from '@/lib/clients/actions';
import { formatCurrency } from '@/lib/currency';
import { createProjectAction, updateProjectAction, deleteProjectAction } from '@/lib/projects/actions';
import { getInvoicesAction, createInvoiceAction, markInvoicePaidAction, deleteInvoiceAction, updateInvoiceAction } from '@/lib/invoices/actions';
import { getMaintenanceLogsAction } from '@/lib/maintenance-logs/actions';
import { getCreditTransactionsAction, addCreditTransactionAction } from '@/lib/credits/actions';
import { createCouponAction, updateCouponAction, deleteCouponAction } from '@/lib/coupons/actions';
import { exportToPDF, exportInvoicePDF } from '@/lib/utils/pdf-export';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function ClientDetailsView({ id }: ClientDetailsViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'invoices' | 'credits' | 'referrals'>('overview');
  const [data, setData] = useState<{ client: AdminClient; projects: AdminPortalProject[]; coupons: AdminCoupon[] } | null>(null);
  const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
  const [credits, setCredits] = useState<AdminCreditTransaction[]>([]);
  const [errorState, setErrorState] = useState<{ code: string; error: string; reason?: string } | null>(null);
  
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
  const [projectType, setProjectType] = useState<'web' | 'mobile'>('web');
  const [projectWebsite, setProjectWebsite] = useState('');
  const [projectAdminUrl, setProjectAdminUrl] = useState('');
  const [projectAndroidPackage, setProjectAndroidPackage] = useState('');
  const [projectIosBundleId, setProjectIosBundleId] = useState('');
  const [projectPlayStoreUrl, setProjectPlayStoreUrl] = useState('');
  const [projectAppStoreUrl, setProjectAppStoreUrl] = useState('');
  const [projectRepositoryUrl, setProjectRepositoryUrl] = useState('');

  const [projectStatus, setProjectStatus] = useState('Active');
  const [projectNotes, setProjectNotes] = useState('');

  const [projectUrlError, setProjectUrlError] = useState('');
  const [projectAdminUrlError, setProjectAdminUrlError] = useState('');
  const [projectAndroidPackageError, setProjectAndroidPackageError] = useState('');
  const [projectIosBundleIdError, setProjectIosBundleIdError] = useState('');
  const [projectPlayStoreUrlError, setProjectPlayStoreUrlError] = useState('');
  const [projectAppStoreUrlError, setProjectAppStoreUrlError] = useState('');
  const [projectRepositoryUrlError, setProjectRepositoryUrlError] = useState('');

  const [projectFormError, setProjectFormError] = useState('');
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<AdminPortalProject | null>(null);
  const [projectTypeFilter, setProjectTypeFilter] = useState('All');

  // Invoice Modals state
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [invoiceAmount, setInvoiceAmount] = useState<string>('');
  const [invoiceDueDate, setInvoiceDueDate] = useState<string>('');
  const [invoiceStatus, setInvoiceStatus] = useState<'Paid' | 'Pending' | 'Overdue'>('Pending');
  const [invoiceFormError, setInvoiceFormError] = useState('');
  const [isDeleteInvoiceOpen, setIsDeleteInvoiceOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<AdminInvoice | null>(null);
  const [applyCredits, setApplyCredits] = useState(false);
  const [creditDeduction, setCreditDeduction] = useState('');

  // Maintenance logs linkage states
  const [availableLogs, setAvailableLogs] = useState<AdminMaintenanceLog[]>([]);
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [isLogDropdownOpen, setIsLogDropdownOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<AdminInvoice | null>(null);
  const [isInvoiceDetailsOpen, setIsInvoiceDetailsOpen] = useState(false);
  const [selectedInvoiceForDetails, setSelectedInvoiceForDetails] = useState<AdminInvoice | null>(null);

  // Discount state
  const [discountType, setDiscountType] = useState<'amount' | 'percentage'>('amount');
  const [discountValue, setDiscountValue] = useState('');

  // Credit adjustments form state
  const [creditAction, setCreditAction] = useState<'add' | 'deduct'>('add');
  const [creditAmount, setCreditAmount] = useState<string>('');
  const [creditDesc, setCreditDesc] = useState<string>('');
  const [isSubmittingCredit, setIsSubmittingCredit] = useState(false);

  // Referral Modal States
  const [isReferralFormOpen, setIsReferralFormOpen] = useState(false);
  const [isEditingReferral, setIsEditingReferral] = useState(false);
  const [referralSubmitting, setReferralSubmitting] = useState(false);
  const [referralCodeInput, setReferralCodeInput] = useState('');
  const [referralReferrerName, setReferralReferrerName] = useState('');
  const [referralRewardType, setReferralRewardType] = useState('Service Credit');
  const [referralNotes, setReferralNotes] = useState('');
  const [referralMaxLimit, setReferralMaxLimit] = useState(5);
  const [referralEnabled, setReferralEnabled] = useState(true);
  const [referralExpiryType, setReferralExpiryType] = useState<'custom' | 'infinite'>('infinite');
  const [referralStartDate, setReferralStartDate] = useState('');
  const [referralExpiryDate, setReferralExpiryDate] = useState('');
  const [referralFormError, setReferralFormError] = useState('');
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [isDeleteReferralConfirmOpen, setIsDeleteReferralConfirmOpen] = useState(false);
  const [referralToDelete, setReferralToDelete] = useState<AdminCoupon | null>(null);
  const [isReferralCodesPopupOpen, setIsReferralCodesPopupOpen] = useState(false);

  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getDefaultExpiryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  };

  const handleOpenAddReferral = () => {
    if (!data?.client) return;
    setReferralCodeInput('');
    setReferralReferrerName(data.client.name);
    setReferralRewardType('Service Credit');
    setReferralNotes('');
    setReferralMaxLimit(5);
    setReferralEnabled(true);
    setReferralExpiryType('infinite');
    setReferralStartDate(getTodayDateString());
    setReferralExpiryDate(getDefaultExpiryDate());
    setReferralFormError('');
    setSelectedProjectIds([]);
    setIsProjectDropdownOpen(false);
    setProjectSearchQuery('');
    setIsEditingReferral(false);
    setIsReferralFormOpen(true);
  };

  const handleOpenEditReferral = (c: AdminCoupon) => {
    setReferralCodeInput(c.code);
    setReferralReferrerName(c.referrerName || '');
    setReferralRewardType(c.rewardType || 'Percentage Discount');
    setReferralNotes(c.notes || '');
    setReferralMaxLimit(c.maxLimit);
    setReferralEnabled(c.enabled);
    setReferralExpiryType((c.expiryType as 'custom' | 'infinite') || 'custom');
    setReferralStartDate(c.startDate);
    setReferralExpiryDate(c.expiryDate || getDefaultExpiryDate());
    setReferralFormError('');
    setSelectedProjectIds(c.projectIds || []);
    setIsProjectDropdownOpen(false);
    setProjectSearchQuery('');
    setIsEditingReferral(true);
    setIsReferralFormOpen(true);
  };

  const handleOpenDeleteReferralConfirm = (c: AdminCoupon) => {
    setReferralToDelete(c);
    setIsDeleteReferralConfirmOpen(true);
  };

  const handleDeleteReferral = async () => {
    if (!referralToDelete) return;
    setIsDeleteReferralConfirmOpen(false);
    const res = await deleteCouponAction(referralToDelete.code);
    if (!res.success) {
      toast.error(res.error || 'Failed to delete referral code.');
    } else {
      toast.success('Referral code deleted successfully.');
      loadData();
    }
  };

  const handleReferralCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setReferralCodeInput(val);
    setReferralFormError('');
  };

  const handleGenerateReferralCode = () => {
    const prefixes = ["HEXA", "REVOPZ", "BRAHMA", "KODE", "PARTNER", "CLIENT"];
    let newCode = "";
    let isUnique = false;
    let attempts = 0;
    
    // Quick local checks
    const existingCoupons = data?.coupons || [];
    
    while (!isUnique && attempts < 100) {
      const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const num = Math.floor(Math.random() * 999) + 1;
      const formattedNum = num < 10 ? `00${num}` : num < 100 ? `0${num}` : `${num}`;
      newCode = `${randomPrefix}${formattedNum}`;
      
      const exists = existingCoupons.some((c) => c.code === newCode);
      if (!exists) {
        isUnique = true;
      }
      attempts++;
    }
    setReferralCodeInput(newCode);
    setReferralFormError('');
  };

  const handleSubmitReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.client) return;
    setReferralFormError('');

    if (referralCodeInput.trim().length < 3) {
      setReferralFormError('Referral code must have a minimum of 3 characters.');
      return;
    }
    if (!referralReferrerName.trim()) {
      setReferralFormError('Referrer name is required.');
      return;
    }
    if (!referralRewardType) {
      setReferralFormError('Reward type is required.');
      return;
    }
    if (referralMaxLimit <= 0) {
      setReferralFormError('Maximum referrals must be greater than 0.');
      return;
    }
    if (!referralStartDate) {
      setReferralFormError('Start date is required.');
      return;
    }

    if (referralExpiryType === 'custom') {
      if (!referralExpiryDate) {
        setReferralFormError('Expiry date is required.');
        return;
      }
      
      const start = new Date(referralStartDate);
      const expiry = new Date(referralExpiryDate);
      start.setHours(0,0,0,0);
      expiry.setHours(0,0,0,0);
      
      if (expiry < start) {
        setReferralFormError('Expiry Date cannot be earlier than Start Date.');
        return;
      }
    }

    setReferralSubmitting(true);
    try {
      if (isEditingReferral) {
        const res = await updateCouponAction(referralCodeInput, {
          referrerName: referralReferrerName,
          rewardType: referralRewardType,
          notes: referralNotes,
          startDate: referralStartDate,
          maxLimit: referralMaxLimit,
          expiryType: referralExpiryType,
          expiryDate: referralExpiryType === 'custom' ? referralExpiryDate : null,
          enabled: referralEnabled,
          clientId: data.client.id,
          clientName: data.client.name,
          projectIds: selectedProjectIds,
        });
        if (!res.success) {
          setReferralFormError(res.error || 'Failed to update referral code.');
          toast.error(res.error || 'Failed to update referral code.');
        } else {
          toast.success('Referral code updated successfully.');
          setIsReferralFormOpen(false);
          loadData();
        }
      } else {
        const res = await createCouponAction({
          code: referralCodeInput,
          referrerName: referralReferrerName,
          rewardType: referralRewardType,
          notes: referralNotes,
          startDate: referralStartDate,
          maxLimit: referralMaxLimit,
          expiryType: referralExpiryType,
          expiryDate: referralExpiryType === 'custom' ? referralExpiryDate : null,
          enabled: referralEnabled,
          clientId: data.client.id,
          clientName: data.client.name,
          projectIds: selectedProjectIds,
        });
        if (!res.success) {
          setReferralFormError(res.error || 'Failed to create referral code.');
          toast.error(res.error || 'Failed to create referral code.');
        } else {
          toast.success('Referral code created successfully.');
          setIsReferralFormOpen(false);
          loadData();
        }
      }
    } catch (err) {
      console.error(err);
      setReferralFormError('An unexpected error occurred.');
    } finally {
      setReferralSubmitting(false);
    }
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorState(null);
    try {
      const result = await getClientByIdAction(id);
      if (result && result.success && result.data) {
        setData(result.data as { client: AdminClient; projects: AdminPortalProject[]; coupons: AdminCoupon[] });
      } else {
        setErrorState({
          code: result?.code || 'DB_ERROR',
          error: result?.error || 'Failed to load client details.',
          reason: (result as any)?.reason || 'An unexpected error occurred during database access.',
        });
      }
    } catch (err: any) {
      setErrorState({
        code: 'DB_ERROR',
        error: 'An unexpected connection or runtime error occurred.',
        reason: err.message || String(err),
      });
    } finally {
      setIsLoading(false);
    }
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
    if (selectedProjectId) {
      getMaintenanceLogsAction(selectedProjectId).then((logs) => {
        setAvailableLogs(logs);
      });
    } else {
      setAvailableLogs([]);
      if (!editingInvoice) {
        setSelectedLogIds([]);
      }
    }
  }, [selectedProjectId, editingInvoice]);

  useEffect(() => {
    if (activeTab === 'invoices') {
      loadInvoices();
    } else if (activeTab === 'credits') {
      loadCredits();
    }
    setSearchQuery('');
    setCurrentPage(1);
  }, [activeTab, loadInvoices, loadCredits]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsReferralCodesPopupOpen(false);
      }
    };
    if (isReferralCodesPopupOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isReferralCodesPopupOpen]);

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
    setProjectType('web');
    setProjectWebsite('');
    setProjectAdminUrl('');
    setProjectAndroidPackage('');
    setProjectIosBundleId('');
    setProjectPlayStoreUrl('');
    setProjectAppStoreUrl('');
    setProjectRepositoryUrl('');
    setProjectStatus('Active');
    setProjectNotes('');
    setProjectUrlError('');
    setProjectAdminUrlError('');
    setProjectAndroidPackageError('');
    setProjectIosBundleIdError('');
    setProjectPlayStoreUrlError('');
    setProjectAppStoreUrlError('');
    setProjectRepositoryUrlError('');
    setProjectFormError('');
    setIsEditingProject(false);
    setEditingProjectId(null);
    setIsProjectFormOpen(true);
  };

  const handleOpenEditProject = (proj: AdminPortalProject) => {
    setProjectName(proj.name);
    setProjectType((proj.projectType as 'web' | 'mobile') || 'web');
    setProjectWebsite(proj.websiteUrl || '');
    setProjectAdminUrl(proj.adminPanelUrl || '');
    setProjectAndroidPackage(proj.androidPackage || '');
    setProjectIosBundleId(proj.iosBundleId || '');
    setProjectPlayStoreUrl(proj.playStoreUrl || '');
    setProjectAppStoreUrl(proj.appStoreUrl || '');
    setProjectRepositoryUrl(proj.repositoryUrl || '');
    setProjectStatus(proj.status || 'Active');
    setProjectNotes(proj.notes || '');
    setProjectUrlError('');
    setProjectAdminUrlError('');
    setProjectAndroidPackageError('');
    setProjectIosBundleIdError('');
    setProjectPlayStoreUrlError('');
    setProjectAppStoreUrlError('');
    setProjectRepositoryUrlError('');
    setProjectFormError('');
    setIsEditingProject(true);
    setEditingProjectId(proj.id);
    setIsProjectFormOpen(true);
  };

  const handleProjectWebsiteChange = (val: string) => {
    setProjectWebsite(val);
    setProjectUrlError(val ? (validateUrl(val) || '') : '');
  };

  const handleProjectAdminUrlChange = (val: string) => {
    setProjectAdminUrl(val);
    setProjectAdminUrlError(val ? (validateUrl(val) || '') : '');
  };

  const handleProjectAndroidPackageChange = (val: string) => {
    setProjectAndroidPackage(val);
    setProjectAndroidPackageError(val ? (validatePackageId(val) || '') : '');
  };

  const handleProjectIosBundleIdChange = (val: string) => {
    setProjectIosBundleId(val);
    setProjectIosBundleIdError(val ? (validatePackageId(val) || '') : '');
  };

  const handleProjectPlayStoreUrlChange = (val: string) => {
    setProjectPlayStoreUrl(val);
    setProjectPlayStoreUrlError(val ? (validateUrl(val) || '') : '');
  };

  const handleProjectAppStoreUrlChange = (val: string) => {
    setProjectAppStoreUrl(val);
    setProjectAppStoreUrlError(val ? (validateUrl(val) || '') : '');
  };

  const handleProjectRepositoryUrlChange = (val: string) => {
    setProjectRepositoryUrl(val);
    setProjectRepositoryUrlError(val ? (validateRepositoryUrl(val) || '') : '');
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectFormError('');

    if (projectType === 'web') {
      if (projectWebsite) {
        const err = validateUrl(projectWebsite);
        if (err) { setProjectUrlError(err); return; }
      }
      if (projectAdminUrl) {
        const err = validateUrl(projectAdminUrl);
        if (err) { setProjectAdminUrlError(err); return; }
      }
    } else {
      if (projectAndroidPackage) {
        const err = validatePackageId(projectAndroidPackage);
        if (err) { setProjectAndroidPackageError(err); return; }
      }
      if (projectIosBundleId) {
        const err = validatePackageId(projectIosBundleId);
        if (err) { setProjectIosBundleIdError(err); return; }
      }
      if (projectPlayStoreUrl) {
        const err = validateUrl(projectPlayStoreUrl);
        if (err) { setProjectPlayStoreUrlError(err); return; }
      }
      if (projectAppStoreUrl) {
        const err = validateUrl(projectAppStoreUrl);
        if (err) { setProjectAppStoreUrlError(err); return; }
      }
    }

    if (projectRepositoryUrl) {
      const err = validateRepositoryUrl(projectRepositoryUrl);
      if (err) { setProjectRepositoryUrlError(err); return; }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: projectName,
        clientId: id,
        projectType,
        websiteUrl: projectType === 'web' ? projectWebsite : '',
        adminPanelUrl: projectType === 'web' ? projectAdminUrl : '',
        androidPackage: projectType === 'mobile' ? projectAndroidPackage : '',
        iosBundleId: projectType === 'mobile' ? projectIosBundleId : '',
        playStoreUrl: projectType === 'mobile' ? projectPlayStoreUrl : '',
        appStoreUrl: projectType === 'mobile' ? projectAppStoreUrl : '',
        repositoryUrl: projectRepositoryUrl,
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
    if (checked && data?.client) {
      const rawDeduct = parseFloat(deductStr) || 0;
      const maxDeduct = Math.min(amt, data.client.creditBalance);
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
    if (checked && data?.client) {
      const amt = parseFloat(invoiceAmount) || 0;
      const maxDeduct = Math.min(amt, data.client.creditBalance);
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
    if (applyCredits && data?.client) {
      const amt = parseFloat(val) || 0;
      const maxDeduct = Math.min(amt, data.client.creditBalance);
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
    if (data?.client) {
      const amt = parseFloat(invoiceAmount) || 0;
      const maxDeduct = Math.min(amt, data.client.creditBalance);
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
    setSelectedProjectId(inv.projectId || '');
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
    setSelectedProjectId('');
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
        setInvoiceFormError('Credit deduction amount must be a valid non-negative number');
        return;
      }
      
      const maxAllowed = data?.client ? Math.min(amt, data.client.creditBalance) : amt;
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
          projectId: selectedProjectId || null,
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
          clientId: id,
          projectId: selectedProjectId || null,
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
          loadData(); // Reload client overview (for credit balance card)
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

      await exportInvoicePDF({
        filename: `Invoice-${inv.invoiceNumber}.pdf`,
        invoiceNumber: inv.invoiceNumber,
        issuedDate: inv.issuedDate,
        dueDate: inv.dueDate,
        clientName: inv.clientName,
        projectName: inv.projectName,
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
        <span className="text-xs text-on-surface-variant/70">Loading Client...</span>
      </div>
    );
  }

  if (errorState || !data) {
    const errorTitle = errorState?.code === 'INVALID_ID' ? 'Invalid Client ID' : 'Client Not Found';
    const errorMessage = errorState?.error || 'The requested client does not exist.';
    return (
      <div className="text-center py-12">
        <h3 className="font-headline-md text-primary mb-2">{errorTitle}</h3>
        <p className="text-xs text-on-surface-variant mb-6">{errorMessage}</p>
        
        {/* Improved Diagnostic UI in Development Mode */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="mx-auto max-w-lg bg-surface-container-low border border-outline-variant/30 rounded-lg p-4 text-left font-mono text-[10px] space-y-1 mb-6 text-on-surface-variant">
            <p className="font-semibold text-primary">Development Diagnostic Info:</p>
            <p><span className="text-secondary">Requested ID:</span> {id}</p>
            <p><span className="text-secondary">Database Query:</span> client.findUnique</p>
            <p><span className="text-secondary">Returned Result:</span> null</p>
            <p><span className="text-secondary">Reason / Details:</span> {errorState?.reason || 'None (Client is missing from the database)'}</p>
          </div>
        )}

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

  const clientCoupons = data.coupons || [];
  const activeReferralCodesCount = clientCoupons.filter((c) => c.status === 'Active').length;
  const totalReferralCodesCount = clientCoupons.length;
  const totalReferralsReceived = clientCoupons.reduce((sum, c) => sum + c.currentEnquiries, 0);
  const referralCreditsEarned = credits
    .filter((tx) => tx.amount > 0 && tx.description && tx.description.toLowerCase().includes('referral'))
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Search filter lists
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (projectTypeFilter === 'All' || p.projectType === projectTypeFilter)
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
          value={formatCurrency(client.creditBalance)}
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
        <StatsCard
          title="Referral Codes"
          value={totalReferralCodesCount}
          subtext={totalReferralCodesCount > 0 ? "Active Service Credit Codes" : "No referral codes assigned"}
          icon={Ticket}
          onClick={() => setIsReferralCodesPopupOpen(true)}
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
        <button
          onClick={() => setActiveTab('referrals')}
          className={`pb-2.5 px-1 border-b-2 transition-all cursor-pointer ${
            activeTab === 'referrals' ? 'border-secondary text-primary font-semibold' : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          Referrals ({clientCoupons.length})
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
                    <p className="font-semibold text-secondary mt-0.5 font-mono">{formatCurrency(client.creditBalance)}</p>
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

              {/* Referral Summary */}
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-primary uppercase tracking-wider font-label-mono">
                    Referral Summary
                  </h3>
                  <button
                    onClick={() => setActiveTab('referrals')}
                    className="text-[10px] text-secondary hover:underline cursor-pointer font-medium"
                  >
                    View All Referrals →
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-on-surface-variant/70 block">Active Referral Codes</span>
                    <p className="font-semibold text-primary mt-0.5 font-mono">{activeReferralCodesCount}</p>
                  </div>
                  <div>
                    <span className="text-on-surface-variant/70 block">Total Referrals Received</span>
                    <p className="font-semibold text-primary mt-0.5 font-mono">{totalReferralsReceived}</p>
                  </div>
                  <div>
                    <span className="text-on-surface-variant/70 block">Credits Earned</span>
                    <p className="font-semibold text-secondary mt-0.5 font-mono">
                      {formatCurrency(referralCreditsEarned)}
                    </p>
                  </div>
                  <div>
                    <span className="text-on-surface-variant/70 block">Latest Referral Code</span>
                    <p className="font-semibold text-primary mt-0.5 font-mono truncate">
                      {clientCoupons.length > 0 ? clientCoupons[0].code : '-'}
                    </p>
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
            filterSlot={
              <select
                value={projectTypeFilter}
                onChange={(e) => { setProjectTypeFilter(e.target.value); setCurrentPage(1); }}
                className="bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface rounded-lg px-3 py-1.5 focus:outline-none focus:border-secondary transition-all"
              >
                <option value="All">All Types</option>
                <option value="web">Web Applications</option>
                <option value="mobile">Mobile Applications</option>
              </select>
            }
            actionSlot={
              <button
                onClick={handleOpenAddProject}
                className="flex items-center gap-1 bg-primary text-on-primary text-xs font-semibold px-3 py-1.5 rounded-lg hover:shadow-lg hover:shadow-primary/15 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            }
            headers={['Project Name', 'Website / App Link', 'Admin URL / Bundle ID', 'Status', 'Logs', 'Actions']}
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
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-primary">{p.name}</span>
                      <span className="text-[9px] font-semibold text-on-surface-variant/60">
                        {p.projectType === 'mobile' ? '📱 Mobile Application' : '🌐 Web Application'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {p.projectType === 'mobile' ? (
                      p.playStoreUrl ? (
                        <div className="flex items-center gap-1.5">
                          <a
                            href={p.playStoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-secondary hover:underline underline-offset-2"
                            title={p.playStoreUrl}
                          >
                            <Globe className="w-3 h-3" />
                            <span className="font-mono">Play Store</span>
                          </a>
                        </div>
                      ) : p.androidPackage ? (
                        <span className="font-mono text-xs text-on-surface-variant">{p.androidPackage}</span>
                      ) : (
                        <span className="text-xs text-on-surface-variant/40">-</span>
                      )
                    ) : p.websiteUrl ? (
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
                    {p.projectType === 'mobile' ? (
                      p.appStoreUrl ? (
                        <div className="flex items-center gap-1.5">
                          <a
                            href={p.appStoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-secondary underline-offset-2 hover:underline"
                            title={p.appStoreUrl}
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="font-mono">App Store</span>
                          </a>
                        </div>
                      ) : p.iosBundleId ? (
                        <span className="font-mono text-xs text-on-surface-variant">{p.iosBundleId}</span>
                      ) : (
                        <span className="text-xs text-on-surface-variant/40">-</span>
                      )
                    ) : p.adminPanelUrl ? (
                      <a
                        href={p.adminPanelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-secondary underline-offset-2 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="font-mono">{extractDomain(p.adminPanelUrl)}</span>
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
            headers={['Invoice #', 'Project', 'Amount', 'Credit Applied', 'Amount Due', 'Due Date', 'Status', 'Actions']}
          >
            {isLoadingTab ? (
              <tr>
                <td colSpan={8} className="text-center py-12">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-secondary" />
                    <span className="text-xs text-on-surface-variant/70">Loading billing history...</span>
                  </div>
                </td>
              </tr>
            ) : filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-xs text-on-surface-variant/50">
                  No invoices found.
                </td>
              </tr>
            ) : (
              filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((inv) => (
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
                  <td className="px-6 py-4">
                    <span className="text-xs text-on-surface">
                      {inv.projectName || <span className="text-on-surface-variant/40 italic">General Account</span>}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-semibold text-primary">{formatCurrency(inv.amount)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-on-surface-variant">{formatCurrency(inv.creditApplied || 0)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-semibold text-primary">
                      {formatCurrency(Math.max(0, (inv.amount * 1.18) - (inv.creditApplied || 0)))}
                    </span>
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
                      <button
                        onClick={() => handleOpenEditInvoice(inv)}
                        className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-secondary transition-all cursor-pointer"
                        title="Edit Invoice"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
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
                          {tx.amount >= 0 ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
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
                    Amount (₹)
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

        {/* REFERRALS TAB */}
        {activeTab === 'referrals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider font-label-mono">
                  Referral Codes
                </h3>
                <p className="text-[10px] text-on-surface-variant/60 mt-0.5">
                  Manage referral campaigns and track performance for this client.
                </p>
              </div>
              <button
                onClick={handleOpenAddReferral}
                className="flex items-center gap-1 bg-primary text-on-primary text-[10px] font-semibold px-2.5 py-1.5 rounded-lg hover:shadow-lg hover:shadow-primary/15 transition-all cursor-pointer animate-fade-in"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Referral Code</span>
              </button>
            </div>

            {clientCoupons.length === 0 ? (
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-12 text-center shadow-card space-y-4">
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mx-auto text-on-surface-variant/40">
                  <Ticket className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-on-surface">No referrals assigned</h4>
                  <p className="text-xs text-on-surface-variant/60 max-w-xs mx-auto leading-relaxed">
                    No referral codes have been assigned to this client yet.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddReferral}
                  className="mx-auto flex items-center gap-1 bg-surface-container-low border border-outline-variant/40 text-on-surface-variant hover:text-primary hover:border-primary text-xs px-4 py-2 rounded-lg active:scale-[0.98] transition-all cursor-pointer font-semibold shadow-sm hover:shadow"
                >
                  <Plus className="w-3.5 h-3.5 text-secondary" />
                  <span>+ Create Referral Code</span>
                </button>
              </div>
            ) : (
              <DataTable
                title="Client Referral History"
                subtitle={`List of all referral codes registered under client profile ${client.name}`}
                searchValue={searchQuery}
                onSearchChange={(val) => {
                  setSearchQuery(val);
                  setCurrentPage(1);
                }}
                searchPlaceholder="Search referral codes..."
                currentPage={currentPage}
                totalPages={Math.ceil(
                  clientCoupons.filter(c => c.code.toLowerCase().includes(searchQuery.toLowerCase())).length / itemsPerPage
                )}
                onPageChange={(page) => setCurrentPage(page)}
                headers={[
                  'Referral Code',
                  'Reward Type',
                  'Status',
                  'Max Referrals',
                  'Referrals Used',
                  'Remaining Referrals',
                  'Start Date',
                  'Expiry Date',
                  'Actions'
                ]}
              >
                {clientCoupons
                  .filter(c => c.code.toLowerCase().includes(searchQuery.toLowerCase()))
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((c) => (
                    <tr key={c.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-primary font-mono text-xs">
                        {c.code}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-on-surface">
                        {c.rewardType || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                            c.status === 'Active'
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              : c.status === 'Scheduled'
                              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                              : c.status === 'Expired'
                              ? 'bg-error-container/20 text-on-error-container'
                              : c.status === 'Exhausted'
                              ? 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400'
                              : 'bg-surface-container text-on-surface-variant/70'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface font-mono">
                        {c.maxLimit}
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface font-mono">
                        {c.currentEnquiries}
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface font-mono">
                        {c.remainingEnquiries}
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant/70 font-mono">
                        {c.startDate}
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant/70 font-mono">
                        {c.expiryType === 'infinite' ? 'Never' : (c.expiryDate || 'Never')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => router.push(`/admin/coupons/${c.code}`)}
                            className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                            title="View Referral Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditReferral(c)}
                            className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                            title="Edit Referral"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteReferralConfirm(c)}
                            className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-error transition-all cursor-pointer"
                            title="Delete Referral"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </DataTable>
            )}
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
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Project Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => { setProjectName(e.target.value); setProjectFormError(''); }}
                  placeholder="e.g. Revopz Mobile App"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
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

                      {/* Repository Link */}
                      <div>
                        <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                          Repository Link
                        </label>
                        <div className="relative">
                          <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                          <input
                            type="url"
                            value={projectRepositoryUrl}
                            onChange={(e) => handleProjectRepositoryUrlChange(e.target.value)}
                            placeholder="https://github.com/username/project"
                            className={`w-full bg-surface-container-low border rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${
                              projectRepositoryUrlError
                                ? 'border-error focus:border-error focus:ring-error/10'
                                : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'
                            }`}
                          />
                        </div>
                        {projectRepositoryUrlError && (
                          <p className="text-[10px] text-error mt-1">{projectRepositoryUrlError}</p>
                        )}
                      </div>

                      {/* Admin Panel URL */}
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
                        <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                          Android Package Name
                        </label>
                        <input
                          type="text"
                          value={projectAndroidPackage}
                          onChange={(e) => handleProjectAndroidPackageChange(e.target.value)}
                          placeholder="com.hexakode.app"
                          className={`w-full bg-surface-container-low border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${
                            projectAndroidPackageError
                              ? 'border-error focus:border-error focus:ring-error/10'
                              : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'
                          }`}
                        />
                        {projectAndroidPackageError && (
                          <p className="text-[10px] text-error mt-1">{projectAndroidPackageError}</p>
                        )}
                      </div>

                      {/* iOS Bundle Identifier */}
                      <div>
                        <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                          iOS Bundle Identifier
                        </label>
                        <input
                          type="text"
                          value={projectIosBundleId}
                          onChange={(e) => handleProjectIosBundleIdChange(e.target.value)}
                          placeholder="com.hexakode.app"
                          className={`w-full bg-surface-container-low border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${
                            projectIosBundleIdError
                              ? 'border-error focus:border-error focus:ring-error/10'
                              : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'
                          }`}
                        />
                        {projectIosBundleIdError && (
                          <p className="text-[10px] text-error mt-1">{projectIosBundleIdError}</p>
                        )}
                      </div>

                      {/* Play Store URL */}
                      <div>
                        <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                          Play Store URL
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                          <input
                            type="url"
                            value={projectPlayStoreUrl}
                            onChange={(e) => handleProjectPlayStoreUrlChange(e.target.value)}
                            placeholder="https://play.google.com/store/apps/details?id=..."
                            className={`w-full bg-surface-container-low border rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${
                              projectPlayStoreUrlError
                                ? 'border-error focus:border-error focus:ring-error/10'
                                : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'
                            }`}
                          />
                        </div>
                        {projectPlayStoreUrlError && (
                          <p className="text-[10px] text-error mt-1">{projectPlayStoreUrlError}</p>
                        )}
                      </div>

                      {/* App Store URL */}
                      <div>
                        <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                          App Store URL
                        </label>
                        <div className="relative">
                          <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                          <input
                            type="url"
                            value={projectAppStoreUrl}
                            onChange={(e) => handleProjectAppStoreUrlChange(e.target.value)}
                            placeholder="https://apps.apple.com/app/..."
                            className={`w-full bg-surface-container-low border rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${
                              projectAppStoreUrlError
                                ? 'border-error focus:border-error focus:ring-error/10'
                                : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'
                            }`}
                          />
                        </div>
                        {projectAppStoreUrlError && (
                          <p className="text-[10px] text-error mt-1">{projectAppStoreUrlError}</p>
                        )}
                      </div>

                      {/* Repository Link */}
                      <div>
                        <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                          Repository Link
                        </label>
                        <div className="relative">
                          <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                          <input
                            type="url"
                            value={projectRepositoryUrl}
                            onChange={(e) => handleProjectRepositoryUrlChange(e.target.value)}
                            placeholder="https://github.com/username/project"
                            className={`w-full bg-surface-container-low border rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${
                              projectRepositoryUrlError
                                ? 'border-error focus:border-error focus:ring-error/10'
                                : 'border-outline-variant/40 focus:border-secondary focus:ring-secondary/10'
                            }`}
                          />
                        </div>
                        {projectRepositoryUrlError && (
                          <p className="text-[10px] text-error mt-1">{projectRepositoryUrlError}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                  disabled={
                    isSubmitting ||
                    !!projectUrlError ||
                    !!projectAdminUrlError ||
                    !!projectAndroidPackageError ||
                    !!projectIosBundleIdError ||
                    !!projectPlayStoreUrlError ||
                    !!projectAppStoreUrlError ||
                    !!projectRepositoryUrlError
                  }
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
                  {editingInvoice ? `Edit Invoice #${editingInvoice.invoiceNumber}` : 'Create Invoice'}
                </h3>
              </div>
              <button
                onClick={handleCloseInvoiceModal}
                className="rounded p-1 text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitInvoice} noValidate className="space-y-3">
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

              {/* Linked Maintenance Logs (Optional) */}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Linked Maintenance Logs (Optional)
                </label>
                
                {!selectedProjectId ? (
                  <input
                    type="text"
                    disabled
                    value="Select a project first"
                    className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-lg px-3 py-2 text-xs text-on-surface-variant/80 cursor-not-allowed"
                  />
                ) : availableLogs.length === 0 ? (
                  <input
                    type="text"
                    disabled
                    value="No maintenance logs available"
                    className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-lg px-3 py-2 text-xs text-on-surface-variant/80 cursor-not-allowed"
                  />
                ) : (
                  <div className="relative">
                    {/* Selected Chips */}
                    {selectedLogIds.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2 p-1.5 bg-surface-container-low border border-outline-variant/20 rounded-lg max-h-24 overflow-y-auto">
                        {selectedLogIds.map((logId) => {
                          const log = availableLogs.find((l) => l.id === logId);
                          if (!log) return null;
                          return (
                            <span
                              key={logId}
                              className="inline-flex items-center gap-1 bg-secondary/10 hover:bg-secondary/15 text-secondary font-medium px-2 py-0.5 rounded text-[10px] transition-colors"
                            >
                              <span className="truncate max-w-[150px]">{log.title}</span>
                              <button
                                type="button"
                                onClick={() => setSelectedLogIds(selectedLogIds.filter((id) => id !== logId))}
                                className="hover:text-primary cursor-pointer text-[10px]"
                              >
                                ✕
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Dropdown Toggle / Search Input */}
                    <div className="relative z-10">
                      <input
                        type="text"
                        placeholder="Search & select maintenance logs..."
                        value={logSearchQuery}
                        onChange={(e) => {
                          setLogSearchQuery(e.target.value);
                          setIsLogDropdownOpen(true);
                        }}
                        onFocus={() => setIsLogDropdownOpen(true)}
                        className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 pr-8 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                      />
                      <button
                        type="button"
                        onClick={() => setIsLogDropdownOpen(!isLogDropdownOpen)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface cursor-pointer text-xs"
                      >
                        {isLogDropdownOpen ? '▲' : '▼'}
                      </button>
                    </div>

                    {/* transparent backdrop click shield */}
                    {isLogDropdownOpen && (
                      <div
                        className="fixed inset-0 z-0 bg-transparent"
                        onClick={() => setIsLogDropdownOpen(false)}
                      />
                    )}

                    {/* Dropdown Options */}
                    {isLogDropdownOpen && (
                      <div className="absolute z-20 left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-surface-container-lowest border border-outline-variant/30 rounded-lg shadow-premium p-1 space-y-0.5">
                        {(() => {
                          const query = logSearchQuery.toLowerCase();
                          const filteredLogs = availableLogs.filter((log) => (
                            log.title.toLowerCase().includes(query) ||
                            log.id.toLowerCase().includes(query) ||
                            (log.description || '').toLowerCase().includes(query)
                          ));
                          if (filteredLogs.length === 0) {
                            return (
                              <div className="p-2 text-[10px] text-on-surface-variant/50 text-center italic">
                                No matching maintenance logs
                              </div>
                            );
                          }
                          return filteredLogs.map((log) => {
                            const isSelected = selectedLogIds.includes(log.id);
                            return (
                              <button
                                type="button"
                                key={log.id}
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedLogIds(selectedLogIds.filter((id) => id !== log.id));
                                  } else {
                                    setSelectedLogIds([...selectedLogIds, log.id]);
                                  }
                                  setLogSearchQuery('');
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left text-[11px] rounded transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-secondary/10 text-secondary font-semibold'
                                    : 'text-on-surface hover:bg-surface-container-low'
                                }`}
                              >
                                <div className="truncate pr-2">
                                  <p className="font-semibold truncate">{log.title}</p>
                                  {log.description && (
                                    <p className="text-[9px] text-on-surface-variant/60 truncate mt-0.5">
                                      {log.description}
                                    </p>
                                  )}
                                </div>
                                {isSelected && <span className="text-secondary text-xs">✓</span>}
                              </button>
                            );
                          });
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Invoice Amount (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/40" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={invoiceAmount}
                    onChange={(e) => handleInvoiceAmountChange(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                  />
                </div>
              </div>


              {/* ── Discount ────────────────────────────────────────────── */}
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

              {/* Prepaid Credits deduction toggle */}
              {data && data.client.creditBalance > 0 && !editingInvoice && (
                <div className="bg-surface-container border border-outline-variant/20 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">
                      Credit Balance Adjustment
                    </span>
                    <span className="text-[10px] font-semibold text-secondary font-mono">
                      Available: {formatCurrency(data.client.creditBalance)}
                    </span>
                  </div>
                  
                  <label className="flex items-center gap-2 cursor-pointer py-1">
                    <input
                      type="checkbox"
                      checked={applyCredits}
                      onChange={(e) => handleApplyCreditsToggle(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-outline-variant accent-secondary cursor-pointer"
                    />
                    <span className="text-[11px] text-on-surface">Apply prepaid credits to this invoice</span>
                  </label>

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
                          value={creditDeduction}
                          onChange={(e) => handleCreditDeductionChange(e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-9 pr-3 py-1.5 text-[11px] focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Dynamic calculations audit panel */}
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
                    <div className={`flex justify-between items-center border-t border-outline-variant/20 pt-1.5 font-semibold transition-all duration-200 ${
                      isFullyCovered 
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
                  onClick={handleCloseInvoiceModal}
                  className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !invoiceAmount || isNaN(parseFloat(invoiceAmount)) || parseFloat(invoiceAmount) <= 0 || !invoiceDueDate}
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

      {/* ── Referral Create/Edit Modal ─────────────────────────────────────────── */}
      {isReferralFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <h3 className="font-headline-sm text-sm font-semibold text-primary">
                {isEditingReferral ? 'Edit Referral Settings' : 'Create New Referral Code'}
              </h3>
              <button
                onClick={() => setIsReferralFormOpen(false)}
                className="rounded p-1 text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReferral} className="space-y-4">
              {referralFormError && (
                <div className="text-xs text-error bg-error-container/10 p-2.5 rounded-lg border border-error/25">
                  {referralFormError}
                </div>
              )}

              {/* Section: Basic Information */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-label-mono uppercase tracking-wider text-secondary font-semibold">
                  Basic Information
                </h4>
                
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Referral Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      disabled={isEditingReferral}
                      value={referralCodeInput}
                      onChange={handleReferralCodeChange}
                      placeholder="e.g. HEXA100"
                      className="flex-1 bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    {!isEditingReferral && (
                      <button
                        type="button"
                        onClick={handleGenerateReferralCode}
                        className="flex items-center gap-1 bg-surface-container border border-outline-variant/40 text-on-surface-variant hover:text-primary hover:border-primary text-xs px-3 py-2 rounded-lg active:scale-95 transition-all cursor-pointer"
                        title="Generate unique code"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-secondary" />
                        <span>Generate</span>
                      </button>
                    )}
                  </div>
                  {!isEditingReferral && (
                    <span className="text-[9px] text-on-surface-variant/60 mt-1 block">
                      Minimum 3 characters. Code is automatically converted to uppercase.
                    </span>
                  )}
                </div>

                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Referrer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={referralReferrerName}
                    onChange={(e) => {
                      setReferralReferrerName(e.target.value);
                      setReferralFormError('');
                    }}
                    placeholder="e.g. John Doe"
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  />
                </div>

                {/* Preselected static Client Profile view */}
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Client Profile
                  </label>
                  <input
                    type="text"
                    disabled
                    value={client.name}
                    className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-lg px-3 py-2 text-xs text-on-surface-variant/80 cursor-not-allowed font-semibold"
                  />
                </div>

                {/* Section: Linked Projects (Optional) */}
                <div className="relative">
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Linked Projects (Optional)
                  </label>
                  <div className="relative">
                    {isProjectDropdownOpen && (
                      <div 
                        className="fixed inset-0 z-40 bg-transparent" 
                        onClick={() => setIsProjectDropdownOpen(false)}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                      className="w-full text-left bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 flex items-center justify-between min-h-[38px] relative z-50 text-on-surface"
                    >
                      {selectedProjectIds.length > 0 ? (
                        <div className="flex flex-wrap gap-1 pr-4 max-w-[90%]">
                          {selectedProjectIds.map((id) => {
                            const p = (data?.projects || []).find((proj) => proj.id === id);
                            return (
                              <span
                                key={id}
                                className="inline-flex items-center gap-1 bg-secondary/10 text-secondary text-[10px] font-medium px-2 py-0.5 rounded-full"
                              >
                                {p ? p.name : id}
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedProjectIds(selectedProjectIds.filter((pid) => pid !== id));
                                  }}
                                  className="hover:text-error cursor-pointer font-bold text-xs"
                                >
                                  ×
                                </span>
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-on-surface-variant/50">Select project(s)...</span>
                      )}
                      <span className="text-[10px] text-on-surface-variant/50">▼</span>
                    </button>

                    {isProjectDropdownOpen && (
                      <div className="absolute left-0 right-0 z-50 mt-1 bg-surface-container-lowest border border-outline-variant/40 rounded-lg shadow-premium p-2 space-y-2 max-h-60 overflow-y-auto">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant/50" />
                          <input
                            type="text"
                            placeholder="Search project..."
                            value={projectSearchQuery}
                            onChange={(e) => setProjectSearchQuery(e.target.value)}
                            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-md pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-secondary"
                          />
                        </div>

                        <div className="space-y-0.5 max-h-40 overflow-y-auto">
                          {(data?.projects || []).length === 0 ? (
                            <div className="p-3 text-center text-xs text-on-surface-variant/60">
                              No projects available for this client.
                            </div>
                          ) : (() => {
                            const filtered = (data?.projects || []).filter((p) =>
                              p.name.toLowerCase().includes(projectSearchQuery.toLowerCase())
                            );
                            if (filtered.length === 0) {
                              return (
                                <div className="p-3 text-center text-xs text-on-surface-variant/60">
                                  No matching projects.
                                </div>
                              );
                            }
                            return filtered.map((project) => {
                              const isSelected = selectedProjectIds.includes(project.id);
                              return (
                                <button
                                  key={project.id}
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) {
                                      setSelectedProjectIds(selectedProjectIds.filter((pid) => pid !== project.id));
                                    } else {
                                      setSelectedProjectIds([...selectedProjectIds, project.id]);
                                    }
                                    setProjectSearchQuery('');
                                  }}
                                  className={`w-full text-left px-2.5 py-2 rounded-md hover:bg-surface-container-low transition-colors flex items-center justify-between cursor-pointer ${
                                    isSelected ? 'bg-secondary-container/10 font-semibold' : ''
                                  }`}
                                >
                                  <span className="text-xs text-on-surface">{project.name}</span>
                                  {isSelected && <span className="text-xs text-secondary font-bold">✓</span>}
                                </button>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Reward Type
                  </label>
                  <select
                    value={referralRewardType}
                    onChange={(e) => {
                      setReferralRewardType(e.target.value);
                      setReferralFormError('');
                    }}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                  >
                    <option value="Service Credit">Service Credit</option>
                    <option value="Percentage Discount">Percentage Discount</option>
                    <option value="Fixed Discount">Fixed Discount</option>
                    <option value="Free Maintenance">Free Maintenance</option>
                    <option value="Custom Reward">Custom Reward</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={referralNotes}
                    onChange={(e) => setReferralNotes(e.target.value)}
                    placeholder="Add referral campaign comments or notes..."
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 resize-none"
                  />
                </div>
              </div>

              {/* Section: Usage Controls */}
              <div className="space-y-3 pt-3 border-t border-outline-variant/10">
                <h4 className="text-[10px] font-label-mono uppercase tracking-wider text-secondary font-semibold">
                  Usage Controls
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                      Max Referrals
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={referralMaxLimit}
                      onChange={(e) => {
                        setReferralMaxLimit(parseInt(e.target.value) || 0);
                        setReferralFormError('');
                      }}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                    />
                  </div>

                  <div>
                    <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                      Status Option
                    </label>
                    <select
                      value={referralEnabled ? 'true' : 'false'}
                      onChange={(e) => setReferralEnabled(e.target.value === 'true')}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                    >
                      <option value="true">Active</option>
                      <option value="false">Disabled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section: Expiry & Scheduling Settings */}
              <div className="space-y-3 pt-3 border-t border-outline-variant/10">
                <h4 className="text-[10px] font-label-mono uppercase tracking-wider text-secondary font-semibold">
                  Expiry & Scheduling Settings
                </h4>
                
                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Expiry Type
                  </label>
                  <select
                    value={referralExpiryType}
                    onChange={(e) => {
                      setReferralExpiryType(e.target.value as 'custom' | 'infinite');
                      setReferralFormError('');
                    }}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                  >
                    <option value="infinite">Never Expires</option>
                    <option value="custom">Custom Date</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={referralStartDate}
                    onChange={(e) => {
                      setReferralStartDate(e.target.value);
                      setReferralFormError('');
                    }}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                  />
                </div>

                {referralExpiryType === 'custom' && (
                  <div>
                    <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      required
                      value={referralExpiryDate}
                      onChange={(e) => {
                        setReferralExpiryDate(e.target.value);
                        setReferralFormError('');
                      }}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20 mt-6">
                <button
                  type="button"
                  disabled={referralSubmitting}
                  onClick={() => setIsReferralFormOpen(false)}
                  className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={referralSubmitting}
                  className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {referralSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isEditingReferral ? 'Save Changes' : 'Create Referral'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Referral Delete Modal ─────────────────────────────────────────── */}
      {isDeleteReferralConfirmOpen && referralToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium text-center">
            <h3 className="font-headline-sm text-sm font-semibold text-primary mb-2">
              Delete Referral Code
            </h3>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              Are you sure you want to permanently delete referral code <span className="font-semibold text-primary">{referralToDelete.code}</span>? Existing enquiry records will remain unchanged.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteReferralConfirmOpen(false)}
                className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteReferral}
                className="px-4 py-2 bg-error text-on-error text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-error/15 transition-all cursor-pointer"
              >
                Delete Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Referral Codes Read-Only Popup Modal ───────────────────────────────── */}
      {isReferralCodesPopupOpen && (
        <div
          onClick={() => setIsReferralCodesPopupOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-popup-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-premium flex flex-col max-h-[80vh] animate-popup-scale-up"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-outline-variant/20 px-6 py-4">
              <div>
                <h3 className="font-headline-sm text-sm font-semibold text-primary">
                  Referral Codes
                </h3>
                <p className="text-[10px] text-on-surface-variant/60 mt-0.5">
                  Associated with {client.name}
                </p>
              </div>
              <button
                onClick={() => setIsReferralCodesPopupOpen(false)}
                className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Container (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 min-h-[200px]">
              {clientCoupons.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant/40">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-on-surface-variant/70">
                    No referral codes are associated with this client.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-outline-variant/20 rounded-lg">
                  <table className="w-full border-collapse text-left text-xs text-on-surface">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant/20 text-on-surface-variant/80 font-semibold font-label-mono text-[9px] uppercase tracking-wider">
                        <th className="px-5 py-3">Referral Code</th>
                        <th className="px-5 py-3">Reward Type</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Max Referrals</th>
                        <th className="px-5 py-3">Used</th>
                        <th className="px-5 py-3">Remaining</th>
                        <th className="px-5 py-3">Expiry Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {clientCoupons.map((c) => {
                        const isMaxUnlimited = c.maxLimit >= 9999 || c.maxLimit <= 0;
                        const isNeverExpires = c.expiryType === 'infinite' || !c.expiryDate;
                        
                        return (
                          <tr key={c.id} className="hover:bg-surface-container-low/20 transition-colors">
                            <td className="px-5 py-3.5 font-semibold text-primary font-mono">
                              {c.code}
                            </td>
                            <td className="px-5 py-3.5 font-medium text-on-surface">
                              {c.rewardType || '-'}
                            </td>
                            <td className="px-5 py-3.5">
                              <span
                                className={`text-[8px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                                  c.status === 'Active'
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : c.status === 'Scheduled'
                                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                    : c.status === 'Expired'
                                    ? 'bg-error-container/10 text-on-error-container'
                                    : c.status === 'Exhausted'
                                    ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                                    : 'bg-surface-container text-on-surface-variant/70'
                                }`}
                              >
                                {c.status}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 font-mono">
                              {isMaxUnlimited ? 'Unlimited' : c.maxLimit}
                            </td>
                            <td className="px-5 py-3.5 font-mono">
                              {c.currentEnquiries}
                            </td>
                            <td className="px-5 py-3.5 font-mono">
                              {isMaxUnlimited ? 'Unlimited' : c.remainingEnquiries}
                            </td>
                            <td className="px-5 py-3.5 font-mono text-on-surface-variant/80">
                              {isNeverExpires ? 'Never' : c.expiryDate}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-outline-variant/20 px-6 py-4 bg-surface-container-low/30">
              <button
                type="button"
                onClick={() => setIsReferralCodesPopupOpen(false)}
                className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container hover:text-primary transition-all cursor-pointer text-on-surface"
              >
                Close
              </button>
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
                <h3 className="font-headline-sm text-sm font-semibold text-primary">
                  Invoice Details
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsInvoiceDetailsOpen(false);
                  setSelectedInvoiceForDetails(null);
                }}
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
                      selectedInvoiceForDetails.status === 'Paid'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : selectedInvoiceForDetails.status === 'Pending'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {selectedInvoiceForDetails.status}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">Linked Project</span>
                <p className="text-on-surface mt-0.5">{selectedInvoiceForDetails.projectName || 'General / No Project'}</p>
              </div>

              <div className="bg-surface-container-low border border-outline-variant/20 rounded-lg p-3 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Invoice Amount:</span>
                  <span>{formatCurrency(selectedInvoiceForDetails.amount)}</span>
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
                  <span>Credits Applied:</span>
                  <span>-{formatCurrency(selectedInvoiceForDetails.creditApplied)}</span>
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
                      <Link
                        key={log.id}
                        href={selectedInvoiceForDetails.projectId ? `/admin/clients/${selectedInvoiceForDetails.clientId}/projects/${selectedInvoiceForDetails.projectId}?logId=${log.id}` : `/admin/clients/${selectedInvoiceForDetails.clientId}`}
                        onClick={() => {
                          setIsInvoiceDetailsOpen(false);
                          setSelectedInvoiceForDetails(null);
                        }}
                        className="block px-2.5 py-1.5 bg-surface-container-lowest hover:bg-secondary/5 rounded border border-outline-variant/10 text-primary hover:text-secondary font-medium transition-all truncate"
                      >
                        {log.title}
                      </Link>
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
                onClick={() => {
                  setIsInvoiceDetailsOpen(false);
                  setSelectedInvoiceForDetails(null);
                }}
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
