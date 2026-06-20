import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import SettingsForm from "@/components/admin/SettingsForm";
import { Toaster } from "sonner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Settings | HexaKode Console",
  description: "Global variables, brand parameters, and social integration keys configurator.",
};

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-headline-md text-xl font-bold tracking-tight text-primary">
            System Settings
          </h1>
          <p className="text-xs text-on-surface-variant/70 mt-1">
            Maintain public corporate details and professional developers keys.
          </p>
        </div>

        <SettingsForm />
      </div>
      <Toaster position="bottom-right" theme="light" expand={false} richColors />
    </AdminLayout>
  );
}
