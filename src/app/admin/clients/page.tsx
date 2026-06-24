import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ClientsTable from '@/components/admin/ClientsTable';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clients | HexaKode Console',
  description: 'Manage client accounts, website URLs, and project associations in the HexaKode admin portal.',
};

export default function AdminClientsPage() {
  return (
    <AdminLayout>
      <ClientsTable />
    </AdminLayout>
  );
}
