import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import TestimonialTable from "@/components/admin/TestimonialTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials Management | HexaKode Console",
  description: "Moderation and creation portal for client references and public feedback widgets.",
};

export default function AdminTestimonialsPage() {
  return (
    <AdminLayout>
      <TestimonialTable />
    </AdminLayout>
  );
}
