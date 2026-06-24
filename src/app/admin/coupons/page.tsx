import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import CouponsTable from "@/components/admin/CouponsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referral Program | HexaKode Console",
  description: "Manage referral codes, usage metrics, and referral performance.",
};

export default function AdminCouponsPage() {
  return (
    <AdminLayout>
      <CouponsTable />
    </AdminLayout>
  );
}
