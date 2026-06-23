import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import CouponsTable from "@/components/admin/CouponsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coupon Codes | HexaKode Console",
  description: "Administrative console panel for managing promotional campaign discount codes and usage tracking.",
};

export default function AdminCouponsPage() {
  return (
    <AdminLayout>
      <CouponsTable />
    </AdminLayout>
  );
}
