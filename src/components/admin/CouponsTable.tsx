'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminCoupon } from '@/types/admin';
import DataTable from './DataTable';
import { Eye, Edit2, Trash2, Plus, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  getCouponsAction,
  createCouponAction,
  updateCouponAction,
  deleteCouponAction
} from '@/lib/coupons/actions';

export default function CouponsTable() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<AdminCoupon | null>(null);

  // Form Fields
  const [code, setCode] = useState('');
  const [activeDays, setActiveDays] = useState(30);
  const [maxLimit, setMaxLimit] = useState(5);
  const [formError, setFormError] = useState('');

  // Fetch coupons on mount
  useEffect(() => {
    loadCoupons();
  }, []);

  async function loadCoupons() {
    setIsLoading(true);
    const data = await getCouponsAction();
    setCoupons(data);
    setIsLoading(false);
  }

  const handleOpenAdd = () => {
    setCode('');
    setActiveDays(30);
    setMaxLimit(5);
    setFormError('');
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (coupon: AdminCoupon) => {
    setCode(coupon.code);
    setActiveDays(coupon.activeDays);
    setMaxLimit(coupon.maxLimit);
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
      toast.error(res.error || 'Failed to delete coupon.');
      setCoupons(prevCoupons);
    } else {
      toast.success('Coupon deleted successfully.');
      loadCoupons();
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only A-Z and 0-9, auto-uppercase
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setCode(val);
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validations
    if (code.trim().length < 3) {
      setFormError('Coupon code must have a minimum of 3 characters.');
      return;
    }
    if (activeDays <= 0) {
      setFormError('Active days must be greater than 0.');
      return;
    }
    if (maxLimit <= 0) {
      setFormError('Maximum enquiry limit must be greater than 0.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        const res = await updateCouponAction(code, { activeDays, maxLimit });
        if (!res.success) {
          setFormError(res.error || 'Failed to update coupon.');
          toast.error(res.error || 'Failed to update coupon.');
        } else {
          toast.success('Coupon updated successfully.');
          setIsFormOpen(false);
          loadCoupons();
        }
      } else {
        const res = await createCouponAction({ code, activeDays, maxLimit });
        if (!res.success) {
          setFormError(res.error || 'Failed to create coupon.');
          toast.error(res.error || 'Failed to create coupon.');
        } else {
          toast.success('Coupon created successfully.');
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

  // Filter Logic
  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch = c.code.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const displayedCoupons = filteredCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <DataTable
        title="Coupon Codes"
        subtitle="Manage promotional discount coupon codes and usage metrics"
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search coupon code..."
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
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
            <option value="LIMIT REACHED">Limit Reached</option>
          </select>
        }
        actionSlot={
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1 bg-primary text-on-primary text-xs font-semibold px-3 py-1.5 rounded-lg hover:shadow-lg hover:shadow-primary/15 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Coupon</span>
          </button>
        }
        headers={[
          'Coupon Code',
          'Active Days',
          'Max Limit',
          'Current Enquiries',
          'Remaining Enquiries',
          'Status',
          'Created Date',
          'Expiry Date',
          'Actions'
        ]}
      >
        {isLoading ? (
          <tr>
            <td colSpan={9} className="text-center py-12">
              <div className="flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                <span className="text-xs text-on-surface-variant/70">Loading coupons...</span>
              </div>
            </td>
          </tr>
        ) : displayedCoupons.length === 0 ? (
          <tr>
            <td colSpan={9} className="text-center py-8 text-xs text-on-surface-variant/50">
              No coupons found.
            </td>
          </tr>
        ) : (
          displayedCoupons.map((c) => (
            <tr key={c.id} className="hover:bg-surface-container-low/30 transition-colors">
              <td className="px-6 py-4 font-semibold text-primary font-mono text-xs">
                {c.code}
              </td>
              <td className="px-6 py-4 text-xs text-on-surface">
                {c.activeDays} days
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
                    c.status === 'ACTIVE'
                      ? 'bg-secondary-container/20 text-on-secondary-container'
                      : c.status === 'LIMIT REACHED'
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
              <td className="px-6 py-4 text-xs text-on-surface-variant/70 font-mono">
                {c.expiryDate}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => router.push(`/admin/coupons/${c.code}`)}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                    title="View Coupon Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                    title="Edit Coupon"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteConfirm(c)}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-error transition-all cursor-pointer"
                    title="Delete Coupon"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </DataTable>

      {/* Add / Edit Coupon Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <h3 className="font-headline-sm text-sm font-semibold text-primary">
                {isEditing ? 'Edit Coupon Settings' : 'Create New Coupon'}
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

              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  required
                  disabled={isEditing}
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="e.g. ABC"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                {!isEditing && (
                  <span className="text-[9px] text-on-surface-variant/60 mt-1 block">
                    Minimum 3 characters. Coupon codes are automatically converted to uppercase.
                  </span>
                )}
              </div>

              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Active Days
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={activeDays}
                  onChange={(e) => {
                    setActiveDays(parseInt(e.target.value) || 0);
                    setFormError('');
                  }}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>

              <div>
                <label className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Maximum Enquiry Limit
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
                  <span>{isEditing ? 'Save Changes' : 'Create Coupon'}</span>
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
              Delete Coupon
            </h3>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              Are you sure you want to delete this coupon? Existing enquiry records will remain unchanged.
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
                Delete Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
