import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import EnquiryTable from "@/components/admin/EnquiryTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Enquiries | HexaKode Console",
  description: "Administrative inbox tracker for processing corporate partnership requests and RFPs.",
};

export default function AdminEnquiriesPage() {
  return (
    <AdminLayout>
      <EnquiryTable />
    </AdminLayout>
  );
}
