import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProjectsTable from '@/components/admin/ProjectsTable';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | HexaKode Console',
  description: 'Manage client projects, website URLs, and admin URLs in the HexaKode admin portal.',
};

export default function AdminProjectsPage() {
  return (
    <AdminLayout>
      <ProjectsTable />
    </AdminLayout>
  );
}
