import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import PortfolioTable from "@/components/admin/PortfolioTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio Management | HexaKode Console",
  description: "Add, update, or remove enterprise work items from the public case studies catalog.",
};

export default function AdminPortfolioPage() {
  return (
    <AdminLayout>
      <PortfolioTable />
    </AdminLayout>
  );
}
