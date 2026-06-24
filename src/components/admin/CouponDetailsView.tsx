'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminCoupon, AdminEnquiry } from '@/types/admin';
import DataTable from './DataTable';
import {
  ChevronLeft,
  Ticket,
  Calendar,
  Layers,
  Inbox,
  Eye,
  Loader2,
  X,
  Mail,
  Landmark,
  Phone,
  CheckSquare,
  Archive,
  Trash2,
  Users
} from 'lucide-react';
import { getCouponDetailsAction } from '@/lib/coupons/actions';
import { updateEnquiryStatusAction, deleteEnquiryAction } from '@/lib/enquiries/actions';
import { toast } from 'sonner';

interface CouponDetailsViewProps {
  code: string;
}

export default function CouponDetailsView({ code }: CouponDetailsViewProps) {
  const [data, setData] = useState<{ coupon: AdminCoupon; enquiries: AdminEnquiry[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Enquiry Modal View State
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [activeEnquiry, setActiveEnquiry] = useState<AdminEnquiry | null>(null);

  useEffect(() => {
    loadDetails();
  }, [code]);

  async function loadDetails() {
    setIsLoading(true);
    const result = await getCouponDetailsAction(code);
    if (result) {
      setData(result);
    }
    setIsLoading(false);
  }

  // Handle actions for enquiries table in detail view
  const handleMarkReviewed = async (id: string) => {
    if (!data) return;
    const prevEnquiries = data.enquiries;
    setData({
      ...data,
      enquiries: data.enquiries.map((e) => (e.id === id ? { ...e, status: 'Reviewed' as const } : e))
    });

    const res = await updateEnquiryStatusAction(id, 'RESPONDED');
    if (!res.success) {
      toast.error(res.error || 'Failed to update status.');
      setData({ ...data, enquiries: prevEnquiries });
    } else {
      toast.success('Enquiry marked as reviewed.');
    }
  };

  const handleMarkArchived = async (id: string) => {
    if (!data) return;
    const prevEnquiries = data.enquiries;
    setData({
      ...data,
      enquiries: data.enquiries.map((e) => (e.id === id ? { ...e, status: 'Archived' as const } : e))
    });

    const res = await updateEnquiryStatusAction(id, 'ARCHIVED');
    if (!res.success) {
      toast.error(res.error || 'Failed to archive enquiry.');
      setData({ ...data, enquiries: prevEnquiries });
    } else {
      toast.success('Enquiry archived successfully.');
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!data) return;
    if (!confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) {
      return;
    }

    const prevEnquiries = data.enquiries;
    setData({
      ...data,
      enquiries: data.enquiries.filter((e) => e.id !== id)
    });

    const res = await deleteEnquiryAction(id);
    if (!res.success) {
      toast.error(res.error || 'Failed to delete enquiry.');
      setData({ ...data, enquiries: prevEnquiries });
    } else {
      toast.success('Enquiry deleted successfully.');
      loadDetails(); // reload to sync coupon count numbers if they decreased
    }
  };

  const handleOpenView = (enquiry: AdminEnquiry) => {
    setActiveEnquiry(enquiry);
    setIsViewOpen(true);
    if (enquiry.status === 'New') {
      handleMarkReviewed(enquiry.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        <span className="text-xs text-on-surface-variant/70">Loading referral details...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <h3 className="font-headline-md text-primary mb-2">Referral Code Not Found</h3>
        <p className="text-xs text-on-surface-variant mb-6">The requested referral code does not exist.</p>
        <Link
          href="/admin/coupons"
          className="text-xs bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Back to Referral List
        </Link>
      </div>
    );
  }

  const { coupon, enquiries } = data;

  // Filter enquiries matching search
  const filteredEnquiries = enquiries.filter((e) => {
    return (
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.company.toLowerCase().includes(search.toLowerCase()) ||
      e.projectType.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const displayedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8">
      {/* Header and Back Link */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/coupons"
          className="p-2 rounded border border-outline-variant/30 hover:bg-surface-container-low transition-colors text-on-surface"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-headline-sm text-sm font-semibold text-primary">
            Referral Code: <span className="font-mono">{coupon.code}</span>
          </h1>
          <p className="text-xs text-on-surface-variant/60 mt-0.5">
            Detailed tracking metrics and enquiries using this referral code
          </p>
        </div>
      </div>

      {/* Coupon Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary mt-0.5">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">
              Referrer & Reward
            </span>
            <p className="font-mono font-bold text-sm text-primary leading-tight mt-1">{coupon.code}</p>
            <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">Ref: {coupon.referrerName || '-'}</p>
            <p className="text-[9px] text-on-surface-variant/80 mt-0.5">Type: {coupon.rewardType || '-'}</p>
            <span
              className={`text-[8px] font-semibold px-2 py-0.5 rounded-full uppercase mt-2 inline-block ${
                coupon.status === 'Active'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : coupon.status === 'Expired'
                  ? 'bg-error-container/20 text-on-error-container'
                  : coupon.status === 'Exhausted'
                  ? 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400'
                  : 'bg-surface-container text-on-surface-variant/70'
              }`}
            >
              {coupon.status}
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary mt-0.5">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">
              Referral Limits
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-base font-bold text-primary">
                {coupon.currentEnquiries}
              </span>
              <span className="text-xs text-on-surface-variant">/</span>
              <span className="font-mono text-xs text-on-surface-variant">
                {coupon.maxLimit} Max
              </span>
            </div>
            <span className="text-[10px] text-on-surface-variant mt-1 block">
              Remaining: <span className="font-mono font-semibold">{coupon.remainingEnquiries}</span>
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant mt-0.5">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">
              Validity
            </span>
            <p className="text-xs font-semibold text-primary mt-1">
              Expires: <span className="font-mono">{coupon.expiryType === 'infinite' ? 'Never' : (coupon.expiryDate || 'Never')}</span>
            </p>
            <span className="text-[9px] text-on-surface-variant/60 block mt-1">
              Created: <span className="font-mono">{coupon.createdDate}</span>
            </span>
            {coupon.expiryType === 'custom' && coupon.activeDays && (
              <span className="text-[9px] text-on-surface-variant/75 block mt-0.5">
                Total Lifespan: <span className="font-mono font-medium">{coupon.activeDays} Days</span>
              </span>
            )}
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-card flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary mt-0.5">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">
              Conversion
            </span>
            <p className="text-lg font-bold text-primary mt-1 font-mono">
              {coupon.maxLimit > 0
                ? Math.round((coupon.currentEnquiries / coupon.maxLimit) * 100)
                : 0}
              %
            </p>
            <span className="text-[9px] text-on-surface-variant/60 block mt-0.5">
              Referral usage rate
            </span>
          </div>
        </div>
      </div>

      {/* Enquiries Using This Coupon Section */}
      <DataTable
        title="Enquiries Using This Referral Code"
        subtitle={`Live contact form enquiries submitted with referral code ${coupon.code}`}
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search enquiries..."
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        headers={['Name', 'Email', 'Phone', 'Company', 'Project Type', 'Date', 'Actions']}
      >
        {displayedEnquiries.length === 0 ? (
          <tr>
            <td colSpan={7} className="text-center py-8 text-xs text-on-surface-variant/50">
              No enquiries registered with this referral code.
            </td>
          </tr>
        ) : (
          displayedEnquiries.map((e) => (
            <tr key={e.id} className="hover:bg-surface-container-low/30 transition-colors">
              <td className="px-6 py-4">
                <span className="text-xs font-semibold text-primary block">{e.name}</span>
              </td>
              <td className="px-6 py-4 text-xs text-on-surface">
                {e.email}
              </td>
              <td className="px-6 py-4 text-xs font-mono text-on-surface-variant/80">
                {e.phone || '-'}
              </td>
              <td className="px-6 py-4">
                <span className="font-label-mono text-[9px] text-on-surface-variant/70 uppercase">
                  {e.company || '-'}
                </span>
              </td>
              <td className="px-6 py-4 text-xs text-on-surface">
                {e.projectType || '-'}
              </td>
              <td className="px-6 py-4 text-xs text-on-surface-variant/70 font-mono">
                {e.date}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenView(e)}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                    title="View Message details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteEnquiry(e.id)}
                    className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-error transition-all cursor-pointer"
                    title="Delete Enquiry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </DataTable>

      {/* Message Viewer Modal */}
      {isViewOpen && activeEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-premium">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
              <div>
                <h3 className="font-headline-sm text-sm font-semibold text-primary">
                  Inquiry Message Details
                </h3>
                <span className="font-label-mono text-[9px] text-on-surface-variant/60 uppercase">
                  {activeEnquiry.id}
                </span>
              </div>
              <button
                onClick={() => setIsViewOpen(false)}
                className="rounded p-1 text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-start gap-2 bg-surface-container-low/40 p-2.5 rounded-lg border border-outline-variant/10">
                  <Landmark className="w-4 h-4 text-on-surface-variant/70 mt-0.5" />
                  <div>
                    <span className="font-label-mono text-[8px] uppercase text-on-surface-variant/60">
                      Company
                    </span>
                    <p className="font-semibold text-primary">{activeEnquiry.company || '-'}</p>
                    <p className="text-[10px] text-on-surface-variant">{activeEnquiry.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-surface-container-low/40 p-2.5 rounded-lg border border-outline-variant/10">
                  <Mail className="w-4 h-4 text-on-surface-variant/70 mt-0.5" />
                  <div>
                    <span className="font-label-mono text-[8px] uppercase text-on-surface-variant/60">
                      Contact
                    </span>
                    <p className="font-semibold text-primary leading-tight break-all text-[11px]">
                      {activeEnquiry.email}
                    </p>
                    {activeEnquiry.phone && (
                      <p className="text-[10px] text-on-surface-variant mt-1 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-secondary" />
                        {activeEnquiry.phone}
                      </p>
                    )}
                    <span className="font-label-mono text-[8px] bg-secondary-container/30 text-on-secondary-container px-1 py-0.5 rounded uppercase mt-1.5 inline-block">
                      {activeEnquiry.projectType || '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="block font-label-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-1">
                  Message Content
                </span>
                <div className="bg-surface-container-low/60 border border-outline-variant/20 rounded-lg p-4 text-xs text-on-surface leading-relaxed whitespace-pre-wrap font-body-sm">
                  {activeEnquiry.message}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div>
                  <span className="block font-label-mono text-[9px] uppercase text-on-surface-variant/60 mb-0.5">
                    Date Received
                  </span>
                  <span className="font-mono text-on-surface-variant">{activeEnquiry.date}</span>
                </div>
                <div>
                  <span className="block font-label-mono text-[9px] uppercase text-on-surface-variant/60 mb-0.5">
                    Referral Code Used
                  </span>
                  <span className="font-mono font-semibold text-secondary">{activeEnquiry.referralCode || activeEnquiry.couponCode || '-'}</span>
                </div>
              </div>

              {activeEnquiry.referredBy && (
                <div className="pt-2 text-xs">
                  <span className="block font-label-mono text-[9px] uppercase text-on-surface-variant/60 mb-0.5">
                    Referred By
                  </span>
                  <span className="font-semibold text-primary font-mono">{activeEnquiry.referredBy}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20 mt-6">
                {activeEnquiry.status === 'New' && (
                  <button
                    onClick={() => {
                      handleMarkReviewed(activeEnquiry.id);
                      setIsViewOpen(false);
                    }}
                    className="px-4 py-2 border border-outline-variant/40 text-xs font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer text-on-surface"
                  >
                    Mark Reviewed
                  </button>
                )}
                {activeEnquiry.status !== 'Archived' && (
                  <button
                    onClick={() => {
                      handleMarkArchived(activeEnquiry.id);
                      setIsViewOpen(false);
                    }}
                    className="px-4 py-2 bg-error text-on-error text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-error/10 transition-all cursor-pointer"
                  >
                    Archive Message
                  </button>
                )}
                <button
                  onClick={() => {
                    handleDeleteEnquiry(activeEnquiry.id);
                    setIsViewOpen(false);
                  }}
                  className="px-4 py-2 bg-error text-on-error text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-error/10 transition-all cursor-pointer"
                >
                  Delete Message
                </button>
                <button
                  onClick={() => setIsViewOpen(false)}
                  className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
