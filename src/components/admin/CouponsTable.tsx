'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminCoupon } from '@/types/admin';
import DataTable from './DataTable';
import StatsCard from './StatsCard';
import { Eye, Edit2, Trash2, Plus, X, Loader2, Ticket, ShieldCheck, Users, IndianRupee, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import {
  getCouponsAction,
  createCouponAction,
  updateCouponAction,
  deleteCouponAction,
  getReferralStatsAction
} from '@/lib/coupons/actions';

export default function CouponsTable() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Stats State
  const [stats, setStats] = useState({
    totalCodes: 0,
    activeCodes: 0,
    totalReferrals: 0,
    totalRevenue: 0
  });

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<AdminCoupon | null>(null);

  // Form Fields
  const [code, setCode] = useState('');
  const [referrerName, setReferrerName] = useState('');
  const [rewardType, setRewardType] = useState('Percentage Discount');
  const [notes, setNotes] = useState('');
  const [maxLimit, setMaxLimit] = useState(5);
  const [enabled, setEnabled] = useState(true);
  const [expiryType, setExpiryType] = useState<'custom' | 'infinite'>('custom');
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [formError, setFormError] = useState('');

  // Fetch coupons on mount
  useEffect(() => {
    loadCoupons();
  }, []);

  async function loadCoupons() {
    setIsLoading(true);
    const [couponsData, statsData] = await Promise.all([
      getCouponsAction(),
      getReferralStatsAction()
    ]);
    setCoupons(couponsData);
    setStats(statsData);
    setIsLoading(false);
  }

  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getDefaultExpiryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  };

  const handleOpenAdd = () => {
    setCode('');
    setReferrerName('');
    setRewardType('Percentage Discount');
    setNotes('');
    setMaxLimit(5);
    setEnabled(true);
    setExpiryType('custom');
    setStartDate(getTodayDateString());
    setExpiryDate(getDefaultExpiryDate());
    setFormError('');
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (coupon: AdminCoupon) => {
    setCode(coupon.code);
    setReferrerName(coupon.referrerName || '');
    setRewardType(coupon.rewardType || 'Percentage Discount');
    setNotes(coupon.notes || '');
    setMaxLimit(coupon.maxLimit);
    setEnabled(coupon.enabled);
    setExpiryType((coupon.expiryType as 'custom' | 'infinite') || 'custom');
    setStartDate(coupon.startDate);
    
    if (coupon.expiryDate) {
      setExpiryDate(coupon.expiryDate);
    } else {
      setExpiryDate(getDefaultExpiryDate());
    }
    
    setFormError('');
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleOpenDeleteConfirm = (coupon: AdminCoupon) => {
    setCouponToDelete(coupon);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!couponToDelete) return;

    const prevCoupons = coupons;
    setCoupons(coupons.filter((c) => c.code !== couponToDelete.code));
    setIsDeleteConfirmOpen(false);

    const res = await deleteCouponAction(couponToDelete.code);
    if (!res.success) {
      toast.error(res.error || 'Failed to delete referral code.');
      setCoupons(prevCoupons);
    } else {
      toast.success('Referral code deleted successfully.');
      loadCoupons();
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setCode(val);
    setFormError('');
  };

  const handleGenerateCode = () => {
    const prefixes = ["HEXA", "REVOPZ", "BRAHMA", "KODE", "PARTNER", "CLIENT"];
    let newCode = "";
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 100) {
      const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const num = Math.floor(Math.random() * 999) + 1;
      const formattedNum = num < 10 ? `00${num}` : num < 100 ? `0${num}` : `${num}`;
      newCode = `${randomPrefix}${formattedNum}`;
      
      const exists = coupons.some((c) => c.code === newCode);
      if (!exists) {
        isUnique = true;
      }
      attempts++;
    }
    setCode(newCode);
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (code.trim().length < 3) {
      setFormError('Referral code must have a minimum of 3 characters.');
      return;
    }
    if (!referrerName.trim()) {
      setFormError('Referrer name is required.');
      return;
    }
    if (!rewardType) {
      setFormError('Reward type is required.');
      return;
    }
    if (maxLimit <= 0) {
      setFormError('Maximum referrals must be greater than 0.');
      return;
    }
    if (!startDate) {
      setFormError('Start date is required.');
      return;
    }

    if (expiryType === 'custom') {
      if (!expiryDate) {
        setFormError('Expiry date is required.');
        return;
      }
      
      // Prevent Expiry Date from being earlier than Start Date
      const start = new Date(startDate);
      const expiry = new Date(expiryDate);
      start.setHours(0,0,0,0);
      expiry.setHours(0,0,0,0);
      
      if (expiry < start) {
        setFormError('Expiry Date cannot be earlier than Start Date.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        const res = await updateCouponAction(code, {
          referrerName,
          rewardType,
          notes,
          startDate,
          maxLimit,
          expiryType,
          expiryDate: expiryType === 'custom' ? expiryDate : null,
          enabled
        });
        if (!res.success) {
          setFormError(res.error || 'Failed to update referral code.');
          toast.error(res.error || 'Failed to update referral code.');
        } else {
          toast.success('Referral code updated successfully.');
          setIsFormOpen(false);
          loadCoupons();
        }
      } else {
        const res = await createCouponAction({
          code,
          referrerName,
          rewardType,
          notes,
          startDate,
          maxLimit,
          expiryType,
          expiryDate: expiryType === 'custom' ? expiryDate : null,
          enabled
        });
        if (!res.success) {
          setFormError(res.error || 'Failed to create referral code.');
          toast.error(res.error || 'Failed to create referral code.');
        } else {
          toast.success('Referral code created successfully.');
          setIsFormOpen(false);
          loadCoupons();
        }
      }
    } catch (err) {
      console.error(err);
      setFormError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch = 
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      (c.referrerName && c.referrerName.toLowerCase().includes(search.toLowerCase())) ||
      (c.rewardType && c.rewardType.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const displayedCoupons = filteredCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper to format start date
  const formatStartDateUI = (dateString: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const parts = dateString.split('-');
    const start = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return <span className="text-secondary font-semibold">Starts Today</span>;
    } else if (diffDays > 0) {
      return <span className="text-blue-500 font-semibold">Starts in {diffDays} {diffDays === 1 ? 'day' : 'days'}</span>;
    } else {
      return <span className="text-on-surface-variant/75">{dateString}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard
          title="Total Referral Codes"
          value={isLoading ? '...' : stats.totalCodes}
          subtext="Total codes registered"
          icon={Ticket}
        />
        <StatsCard
          title="Active Referral Codes"
          value={isLoading ? '...' : stats.activeCodes}
          subtext="Active & enabled codes"
          icon={ShieldCheck}
        />
        <StatsCard
          title="Total Referrals Generated"
          value={isLoading ? '...' : stats.totalReferrals}
          subtext="Total referred leads"
          icon={Users}
        />
        <StatsCard
          title="Revenue Generated"
          value={isLoading ? '...' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(stats.totalRevenue)}
          subtext="Estimated referred project value"
          icon={IndianRupee}
        />
      </div>

      <DataTable
        title="Referral Program"
        subtitle="Manage referral codes, usage metrics, and referral performance."
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search referral code or referrer..."
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        filterSlot={
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface rounded-lg px-3 py-1.5 focus:outline-none focus:border-secondary transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Expired">Expired</option>
            <option value="Exhausted">Exhausted</option>
            <option value="Disabled">Disabled</option>
          </select>
        }
        actionSlot={
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1 bg-primary text-on-primary text-xs font-semibold px-3 py-1.5 rounded-lg hover:shadow-lg hover:shadow-primary/15 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Referral Code</span>
          </button>
        }
        headers={[
          'Referral Code',
          'Referrer Name',
          'Start Date',
          'Expiry Date',
          'Max Referrals',
          'Referrals Used',
          'Remaining Referrals',
          'Status',
          'Created Date',
          'Actions'
        ]}
      >
        {isLoading ? (
          <tr>
            <td colSpan={10} className="text-center py-12">
              <div className="flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                <span className="text-xs text-on-surface-variant/70">Loading referral codes...</span>
              </div>
            </td>
          </tr>
        ) : displayedCoupons.length === 0 ? (
          <tr>
            <td colSpan={10} className="text-center py-8 text-xs text-on-surface-variant/50">
              No referral codes found.
            </td>
          </tr>
        ) : (
          displayedCoupons.map((c) => (
            <tr key={c.id} className="hover:bg-surface-container-low/30 transition-colors">
              <td className="px-6 py-4 font-semibold text-primary font-mono text-xs">
                {c.code}
              </td>
              <td className="px-6 py-4 text-xs font-medium text-on-surface">
                {c.referrerName || '-'}
              </td>
              <td className="px-6 py-4 text-xs font-semibold font-mono">
                {formatStartDateUI(c.startDate)}
              </td>
              <td className="px-6 py-4 text-xs text-on-surface-variant/70 font-mono">
                {c.expiryType === 'infinite' ? 'Never' : (c.expiryDate || 'Never')}
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
              <td className="px-6 py-4 text-xs text-on-surface-variant/70 font-mono">
                {c.createdDate}
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
                    onClick={() => handleOpenEdit(c)}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                    title="Edit Referral"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteConfirm(c)}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-error transition-all cursor-pointer"
                    title="Delete Referral"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </DataTable>

      {/* Add / Edit Referral Code Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <h3 className="font-headline-sm text-sm font-semibold text-primary">
                {isEditing ? 'Edit Referral Settings' : 'Create New Referral Code'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="rounded p-1 text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="text-xs text-error bg-error-container/10 p-2.5 rounded-lg border border-error/25">
                  {formError}
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
                      disabled={isEditing}
                      value={code}
                      onChange={handleCodeChange}
                      placeholder="e.g. HEXA100"
                      className="flex-1 bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={handleGenerateCode}
                        className="flex items-center gap-1 bg-surface-container border border-outline-variant/40 text-on-surface-variant hover:text-primary hover:border-primary text-xs px-3 py-2 rounded-lg active:scale-95 transition-all cursor-pointer"
                        title="Generate unique code"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-secondary" />
                        <span>Generate</span>
                      </button>
                    )}
                  </div>
                  {!isEditing && (
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
                    value={referrerName}
                    onChange={(e) => {
                      setReferrerName(e.target.value);
                      setFormError('');
                    }}
                    placeholder="e.g. John Doe"
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  />
                </div>

                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Reward Type
                  </label>
                  <select
                    value={rewardType}
                    onChange={(e) => {
                      setRewardType(e.target.value);
                      setFormError('');
                    }}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                  >
                    <option value="Percentage Discount">Percentage Discount</option>
                    <option value="Fixed Discount">Fixed Discount</option>
                    <option value="Service Credit">Service Credit</option>
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
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add referral campaign comments or notes..."
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
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
                      value={maxLimit}
                      onChange={(e) => {
                        setMaxLimit(parseInt(e.target.value) || 0);
                        setFormError('');
                      }}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                    />
                  </div>

                  <div>
                    <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                      Status Option
                    </label>
                    <select
                      value={enabled ? 'true' : 'false'}
                      onChange={(e) => setEnabled(e.target.value === 'true')}
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
                    value={expiryType}
                    onChange={(e) => {
                      setExpiryType(e.target.value as 'custom' | 'infinite');
                      setFormError('');
                    }}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                  >
                    <option value="custom">Custom Date</option>
                    <option value="infinite">Never Expires</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setFormError('');
                    }}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                  />
                </div>

                {expiryType === 'custom' && (
                  <div>
                    <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      required
                      value={expiryDate}
                      onChange={(e) => {
                        setExpiryDate(e.target.value);
                        setFormError('');
                      }}
                      className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 text-on-surface"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20 mt-6">
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
                  <span>{isEditing ? 'Save Changes' : 'Create Referral'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && couponToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium text-center">
            <h3 className="font-headline-sm text-sm font-semibold text-primary mb-2">
              Delete Referral Code
            </h3>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              Are you sure you want to delete this referral code? Existing enquiry records will remain unchanged.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-error text-on-error text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-error/15 transition-all cursor-pointer"
              >
                Delete Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
