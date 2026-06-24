import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import MaintenanceLogsTable from '@/components/admin/MaintenanceLogsTable';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maintenance Logs | HexaKode Console',
  description: 'Track and manage maintenance activities and updates for client projects.',
};

export default function AdminMaintenanceLogsPage() {
  return (
    <AdminLayout>
      <MaintenanceLogsTable />
    </AdminLayout>
  );
}
