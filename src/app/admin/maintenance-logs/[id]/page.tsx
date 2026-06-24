import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import MaintenanceLogDetailsView from '@/components/admin/MaintenanceLogDetailsView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maintenance Log | HexaKode Console',
  description: 'View maintenance log entry details and associated project website information.',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminMaintenanceLogDetailsPage({ params }: Props) {
  const { id } = await params;
  return (
    <AdminLayout>
      <MaintenanceLogDetailsView id={id} />
    </AdminLayout>
  );
}
