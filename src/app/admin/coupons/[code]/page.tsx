import React, { use } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import CouponDetailsView from "@/components/admin/CouponDetailsView";

export default function CouponDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);
  return (
    <AdminLayout>
      <CouponDetailsView code={resolvedParams.code} />
    </AdminLayout>
  );
}
