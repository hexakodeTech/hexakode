import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Toaster } from "sonner";
import { Metadata } from "next";
import PortfolioCMSPage from "@/modules/portfolio/page";

export const metadata: Metadata = {
  title: "Portfolio CMS | HexaKode Console",
  description:
    "Create and manage portfolio projects, case studies, and client work showcases for the HexaKode website.",
};

export default function AdminPortfolioCMSRoute() {
  return (
    <AdminLayout>
      <PortfolioCMSPage />
      <Toaster position="bottom-right" theme="light" expand={false} richColors />
    </AdminLayout>
  );
}
