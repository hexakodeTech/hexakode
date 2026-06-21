import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import DemoTable from "@/components/admin/DemoTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo Requests | HexaKode Console",
  description: "Administrative tracker for scheduling platform walkthroughs and sales demos.",
};

export default function AdminDemosPage() {
  return (
    <AdminLayout>
      <DemoTable />
    </AdminLayout>
  );
}
